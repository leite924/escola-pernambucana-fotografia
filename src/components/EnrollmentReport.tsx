import React, { useState } from 'react'
import { useStore } from '../store/useStore'
import { Download, Filter, Users, Calendar, Clock } from 'lucide-react'
import DateRangeFilter from './DateRangeFilter'

const EnrollmentReport: React.FC = () => {
  const { students, classSchedules, courses } = useStore()
  const [selectedClass, setSelectedClass] = useState('')
  const [selectedCourse, setSelectedCourse] = useState('')
  const [selectedShift, setSelectedShift] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom'>('month')

  // Filter students based on selected criteria
  const filteredStudents = students.filter(student => {
    if (selectedClass && student.classId !== selectedClass) return false
    if (selectedCourse && student.course !== selectedCourse) return false
    if (selectedShift && student.shift !== selectedShift) return false
    if (selectedStatus && student.status !== selectedStatus) return false
    
    // Date range filter
    if (student.enrollDate) {
      const enrollDate = new Date(student.enrollDate)
      const startDate = new Date(dateRange.startDate)
      const endDate = new Date(dateRange.endDate)
      if (enrollDate < startDate || enrollDate > endDate) return false
    }
    
    return true
  })

  // Get unique values for filters
  const uniqueCourses = [...new Set(students.map(s => s.course))]
  const uniqueShifts = [...new Set(students.map(s => s.shift).filter(Boolean))]
  const uniqueStatuses = [...new Set(students.map(s => s.status))]

  // Get class info for selected class
  const selectedClassInfo = classSchedules.find(cls => cls.id === selectedClass)

  const exportToCSV = () => {
    const headers = [
      'Nome',
      'Email',
      'Telefone',
      'Curso',
      'Turma',
      'Turno',
      'Data de Matrícula',
      'Status',
      'Status de Pagamento',
      'Endereço',
      'Data de Nascimento',
      'Contato de Emergência',
      'Telefone de Emergência',
      'Como Soube',
      'Experiência Anterior',
      'Observações'
    ]

    const csvContent = [
      headers.join(','),
      ...filteredStudents.map(student => [
        student.name,
        student.email,
        student.phone,
        student.course,
        student.className || '',
        student.shift || '',
        student.enrollDate,
        student.status,
        student.paymentStatus || '',
        student.address || '',
        student.birthDate || '',
        student.emergencyContact || '',
        student.emergencyPhone || '',
        student.howDidYouHear || '',
        student.previousExperience || '',
        student.notes || ''
      ].map(field => `"${field}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `relatorio-matriculas-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Users className="h-6 w-6 mr-2 text-primary-600" />
          Relatório de Matrículas
        </h2>
        <button
          onClick={exportToCSV}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar CSV
        </button>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Filter className="h-4 w-4 inline mr-1" />
            Curso
          </label>
          <select
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todos os cursos</option>
            {uniqueCourses.map(course => (
              <option key={course} value={course}>{course}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Turma
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todas as turmas</option>
            {classSchedules.map(cls => (
              <option key={cls.id} value={cls.id}>
                {cls.courseName} - {cls.shift} ({cls.startDate})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Clock className="h-4 w-4 inline mr-1" />
            Turno
          </label>
          <select
            value={selectedShift}
            onChange={(e) => setSelectedShift(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todos os turnos</option>
            {uniqueShifts.map(shift => (
              <option key={shift} value={shift}>{shift}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="">Todos os status</option>
            {uniqueStatuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={() => {
              setSelectedClass('')
              setSelectedCourse('')
              setSelectedShift('')
              setSelectedStatus('')
            }}
            className="w-full px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* Selected Class Info */}
      {selectedClassInfo && (
        <div className="mb-6 p-4 bg-primary-50 border border-primary-200 rounded-lg">
          <h3 className="font-semibold text-primary-900 mb-2 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Informações da Turma Selecionada
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium text-primary-700">Curso:</span> {selectedClassInfo.courseName}
            </div>
            <div>
              <span className="font-medium text-primary-700">Turno:</span> {selectedClassInfo.shift}
            </div>
            <div>
              <span className="font-medium text-primary-700">Período:</span> {selectedClassInfo.startDate} a {selectedClassInfo.endDate}
            </div>
            <div>
              <span className="font-medium text-primary-700">Horário:</span> {selectedClassInfo.schedule}
            </div>
            <div>
              <span className="font-medium text-primary-700">Instrutor:</span> {selectedClassInfo.instructor}
            </div>
            <div>
              <span className="font-medium text-primary-700">Vagas:</span> {selectedClassInfo.enrolledStudents}/{selectedClassInfo.maxStudents}
            </div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{filteredStudents.length}</div>
          <div className="text-sm text-blue-600">Total de Alunos</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">
            {filteredStudents.filter(s => s.status === 'Ativo').length}
          </div>
          <div className="text-sm text-green-600">Ativos</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-yellow-600">
            {filteredStudents.filter(s => s.status === 'pending').length}
          </div>
          <div className="text-sm text-yellow-600">Pendentes</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-red-600">
            {filteredStudents.filter(s => s.status === 'Inativo').length}
          </div>
          <div className="text-sm text-red-600">Inativos</div>
        </div>
      </div>

      {/* Students Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Aluno
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Curso/Turma
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Turno
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Matrícula
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pagamento
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                    <div className="text-sm text-gray-500">{student.email}</div>
                    <div className="text-sm text-gray-500">{student.phone}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{student.course}</div>
                  <div className="text-sm text-gray-500">{student.className}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{student.shift}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{student.enrollDate}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    student.status === 'Ativo' 
                      ? 'bg-green-100 text-green-800'
                      : student.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {student.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    student.paymentStatus === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : student.paymentStatus === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {student.paymentStatus === 'paid' ? 'Pago' : 
                     student.paymentStatus === 'pending' ? 'Pendente' : 'Em atraso'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Nenhum aluno encontrado com os filtros selecionados.
        </div>
      )}
    </div>
  )
}

export default EnrollmentReport