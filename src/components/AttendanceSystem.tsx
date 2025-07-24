import { useState, useEffect } from 'react'
import { Calendar, Users, CheckCircle, XCircle, Clock, Search, Filter, Download, Plus, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { useStore } from '../store/useStore'
import DateRangeFilter from './DateRangeFilter'

interface AttendanceRecord {
  id: number
  studentId: number
  studentName: string
  course: string
  classDate: string
  classTitle: string
  status: 'present' | 'absent' | 'late'
  notes?: string
  recordedBy: string
  recordedAt: string
}

interface ClassSession {
  id: number
  course: string
  title: string
  date: string
  duration: number
  instructor: string
  status: 'scheduled' | 'completed' | 'cancelled'
}

const AttendanceSystem = () => {
  const { students, courses } = useStore()
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [classSessions, setClassSessions] = useState<ClassSession[]>([
    {
      id: 1,
      course: 'Fotografia Digital Básica',
      title: 'Introdução à Fotografia Digital',
      date: '2024-01-15',
      duration: 120,
      instructor: 'Prof. João Silva',
      status: 'completed'
    },
    {
      id: 2,
      course: 'Fotografia Digital Básica',
      title: 'Composição e Enquadramento',
      date: '2024-01-22',
      duration: 120,
      instructor: 'Prof. João Silva',
      status: 'completed'
    }
  ])
  
  const [selectedCourse, setSelectedCourse] = useState<string>('all')
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddClass, setShowAddClass] = useState(false)
  const [showAttendanceModal, setShowAttendanceModal] = useState(false)
  const [selectedClass, setSelectedClass] = useState<ClassSession | null>(null)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom'>('month')
  
  const [newClass, setNewClass] = useState({
    course: '',
    title: '',
    date: '',
    duration: 120,
    instructor: ''
  })

  // Calculate attendance statistics
  const getStudentAttendanceStats = (studentId: number, course: string) => {
    const studentRecords = attendanceRecords.filter(r => 
      r.studentId === studentId && r.course === course
    )
    const totalClasses = classSessions.filter(c => 
      c.course === course && c.status === 'completed'
    ).length
    const presentCount = studentRecords.filter(r => r.status === 'present').length
    const lateCount = studentRecords.filter(r => r.status === 'late').length
    const absentCount = studentRecords.filter(r => r.status === 'absent').length
    
    const attendancePercentage = totalClasses > 0 ? 
      ((presentCount + lateCount * 0.5) / totalClasses) * 100 : 0
    
    return {
      totalClasses,
      presentCount,
      lateCount,
      absentCount,
      attendancePercentage: Math.round(attendancePercentage * 10) / 10
    }
  }

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCourse = selectedCourse === 'all' || student.course === selectedCourse
    return matchesSearch && matchesCourse
  })

  // Filter attendance records by date range
  const filteredAttendanceRecords = attendanceRecords.filter(record => {
    const recordDate = new Date(record.classDate)
    const startDate = new Date(dateRange.startDate)
    const endDate = new Date(dateRange.endDate)
    return recordDate >= startDate && recordDate <= endDate
  })

  // Filter class sessions by date range
  const filteredClassSessions = classSessions.filter(session => {
    const sessionDate = new Date(session.date)
    const startDate = new Date(dateRange.startDate)
    const endDate = new Date(dateRange.endDate)
    return sessionDate >= startDate && sessionDate <= endDate
  })

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newClass.course || !newClass.title || !newClass.date) {
      toast.error('Preencha todos os campos obrigatórios!')
      return
    }

    const classSession: ClassSession = {
      id: Date.now(),
      ...newClass,
      status: 'scheduled'
    }

    setClassSessions(prev => [...prev, classSession])
    toast.success('Aula adicionada com sucesso!')
    
    setNewClass({
      course: '',
      title: '',
      date: '',
      duration: 120,
      instructor: ''
    })
    setShowAddClass(false)
  }

  const handleTakeAttendance = (classSession: ClassSession) => {
    setSelectedClass(classSession)
    setShowAttendanceModal(true)
  }

  const handleAttendanceSubmit = (attendanceData: { [studentId: number]: 'present' | 'absent' | 'late' }) => {
    if (!selectedClass) return

    const newRecords: AttendanceRecord[] = Object.entries(attendanceData).map(([studentId, status]) => {
      const student = students.find(s => s.id === parseInt(studentId))
      return {
        id: Date.now() + parseInt(studentId),
        studentId: parseInt(studentId),
        studentName: student?.name || '',
        course: selectedClass.course,
        classDate: selectedClass.date,
        classTitle: selectedClass.title,
        status,
        recordedBy: 'Admin',
        recordedAt: new Date().toISOString()
      }
    })

    setAttendanceRecords(prev => {
      // Remove existing records for this class and students
      const filtered = prev.filter(r => 
        !(r.classDate === selectedClass.date && r.course === selectedClass.course)
      )
      return [...filtered, ...newRecords]
    })

    // Mark class as completed
    setClassSessions(prev => prev.map(c => 
      c.id === selectedClass.id ? { ...c, status: 'completed' } : c
    ))

    toast.success('Presença registrada com sucesso!')
    setShowAttendanceModal(false)
    setSelectedClass(null)
  }

  const exportAttendanceReport = () => {
    const csvContent = [
      ['Aluno', 'Curso', 'Total de Aulas', 'Presenças', 'Faltas', 'Atrasos', 'Percentual de Presença', 'Elegível para Certificado'].join(','),
      ...filteredStudents.map(student => {
        const stats = getStudentAttendanceStats(student.id, student.course)
        return [
          student.name,
          student.course,
          stats.totalClasses,
          stats.presentCount,
          stats.absentCount,
          stats.lateCount,
          `${stats.attendancePercentage}%`,
          stats.attendancePercentage >= 75 ? 'Sim' : 'Não'
        ].join(',')
      })
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `relatorio-presenca-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    
    toast.success('Relatório exportado com sucesso!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Sistema de Presença</h2>
          <p className="text-gray-600">Controle de frequência e elegibilidade para certificados</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowAddClass(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nova Aula</span>
          </button>
          <button
            onClick={exportAttendanceReport}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Exportar Relatório</span>
          </button>
        </div>
      </div>

      {/* Date Range Filter */}
      <DateRangeFilter
        selectedPeriod={selectedPeriod}
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        onPeriodChange={setSelectedPeriod}
        onDateChange={setDateRange}
      />

      {/* Other Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar alunos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos os Cursos</option>
            {courses.map(course => (
              <option key={course.id} value={course.title}>{course.title}</option>
            ))}
          </select>
          
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Class Sessions */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Aulas Programadas</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aula
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duração
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {classSessions
                .filter(c => selectedCourse === 'all' || c.course === selectedCourse)
                .filter(c => !selectedDate || c.date === selectedDate)
                .map((classSession) => (
                <tr key={classSession.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{classSession.title}</div>
                      <div className="text-sm text-gray-500">{classSession.course}</div>
                      <div className="text-sm text-gray-500">Prof: {classSession.instructor}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {new Date(classSession.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{classSession.duration} min</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      classSession.status === 'completed' ? 'bg-green-100 text-green-800' :
                      classSession.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {classSession.status === 'completed' ? 'Concluída' :
                       classSession.status === 'scheduled' ? 'Agendada' : 'Cancelada'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {classSession.status === 'scheduled' && (
                        <button
                          onClick={() => handleTakeAttendance(classSession)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Registrar Presença"
                        >
                          <Users className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-900"
                        title="Excluir"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Resumo de Presença dos Alunos</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aluno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total de Aulas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Presenças
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Faltas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Percentual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Certificado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => {
                const stats = getStudentAttendanceStats(student.id, student.course)
                return (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                        <div className="text-sm text-gray-500">{student.course}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {stats.totalClasses}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm text-gray-900">{stats.presentCount}</span>
                        {stats.lateCount > 0 && (
                          <span className="text-xs text-yellow-600 ml-1">({stats.lateCount} atrasos)</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <XCircle className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-sm text-gray-900">{stats.absentCount}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`text-sm font-medium ${
                          stats.attendancePercentage >= 75 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stats.attendancePercentage}%
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        stats.attendancePercentage >= 75 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {stats.attendancePercentage >= 75 ? 'Elegível' : 'Não Elegível'}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Class Modal */}
      {showAddClass && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Nova Aula</h3>
              <button
                onClick={() => setShowAddClass(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleAddClass} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Curso *
                </label>
                <select
                  value={newClass.course}
                  onChange={(e) => setNewClass({ ...newClass, course: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecione um curso</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.title}>{course.title}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título da Aula *
                </label>
                <input
                  type="text"
                  value={newClass.title}
                  onChange={(e) => setNewClass({ ...newClass, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data *
                </label>
                <input
                  type="date"
                  value={newClass.date}
                  onChange={(e) => setNewClass({ ...newClass, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duração (minutos)
                </label>
                <input
                  type="number"
                  value={newClass.duration}
                  onChange={(e) => setNewClass({ ...newClass, duration: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="30"
                  step="30"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instrutor
                </label>
                <input
                  type="text"
                  value={newClass.instructor}
                  onChange={(e) => setNewClass({ ...newClass, instructor: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddClass(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Adicionar Aula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attendance Modal */}
      {showAttendanceModal && selectedClass && (
        <AttendanceModal
          classSession={selectedClass}
          students={students.filter(s => s.course === selectedClass.course)}
          onSubmit={handleAttendanceSubmit}
          onClose={() => {
            setShowAttendanceModal(false)
            setSelectedClass(null)
          }}
        />
      )}
    </div>
  )
}

// Attendance Modal Component
interface AttendanceModalProps {
  classSession: ClassSession
  students: any[]
  onSubmit: (attendanceData: { [studentId: number]: 'present' | 'absent' | 'late' }) => void
  onClose: () => void
}

const AttendanceModal = ({ classSession, students, onSubmit, onClose }: AttendanceModalProps) => {
  const [attendanceData, setAttendanceData] = useState<{ [studentId: number]: 'present' | 'absent' | 'late' }>({})

  useEffect(() => {
    // Initialize all students as present by default
    const initialData: { [studentId: number]: 'present' | 'absent' | 'late' } = {}
    students.forEach(student => {
      initialData[student.id] = 'present'
    })
    setAttendanceData(initialData)
  }, [students])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(attendanceData)
  }

  const handleStatusChange = (studentId: number, status: 'present' | 'absent' | 'late') => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }))
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Registrar Presença</h3>
            <p className="text-sm text-gray-600">
              {classSession.title} - {new Date(classSession.date).toLocaleDateString('pt-BR')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aluno
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Presente
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Atrasado
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ausente
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <input
                        type="radio"
                        name={`attendance-${student.id}`}
                        value="present"
                        checked={attendanceData[student.id] === 'present'}
                        onChange={() => handleStatusChange(student.id, 'present')}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <input
                        type="radio"
                        name={`attendance-${student.id}`}
                        value="late"
                        checked={attendanceData[student.id] === 'late'}
                        onChange={() => handleStatusChange(student.id, 'late')}
                        className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <input
                        type="radio"
                        name={`attendance-${student.id}`}
                        value="absent"
                        checked={attendanceData[student.id] === 'absent'}
                        onChange={() => handleStatusChange(student.id, 'absent')}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Registrar Presença
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AttendanceSystem