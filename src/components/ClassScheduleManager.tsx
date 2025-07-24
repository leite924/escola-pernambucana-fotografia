import { useState, useEffect } from 'react'
import { Calendar, Clock, Users, MapPin, Edit, Trash2, Plus, Search, Filter } from 'lucide-react'
import { useStore } from '../store/useStore'
import { toast } from 'sonner'

interface ClassScheduleManagerProps {
  courseId?: number
  onSelectClass?: (classSchedule: any) => void
}

export default function ClassScheduleManager({ courseId, onSelectClass }: ClassScheduleManagerProps) {
  const { courses, classSchedules, addClassSchedule, updateClassSchedule, deleteClassSchedule } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterShift, setFilterShift] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [formData, setFormData] = useState({
    courseId: courseId || 0,
    shift: 'manhã' as 'manhã' | 'tarde' | 'noite' | 'sábado',
    startDate: '',
    endDate: '',
    schedule: '',
    startTime: '',
    endTime: '',
    daysOfWeek: [] as string[],
    maxStudents: 20,
    instructor: '',
    status: 'Aberta' as 'Aberta' | 'Em Andamento' | 'Concluída' | 'Cancelada'
  })

  const filteredClasses = classSchedules.filter(classSchedule => {
    const course = courses.find(c => c.id === classSchedule.courseId)
    const matchesSearch = course?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         classSchedule.instructor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesShift = !filterShift || classSchedule.shift === filterShift
    const matchesStatus = !filterStatus || classSchedule.status === filterStatus
    const matchesCourse = !courseId || classSchedule.courseId === courseId
    
    return matchesSearch && matchesShift && matchesStatus && matchesCourse
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.schedule && formData.startTime && formData.endTime && formData.daysOfWeek.length > 0) {
      formData.schedule = `${formData.daysOfWeek.join(', ')} das ${formData.startTime} às ${formData.endTime}`
    }
    
    const selectedCourse = courses.find(c => c.id === formData.courseId)
    if (!selectedCourse) {
      toast.error('Selecione um curso válido')
      return
    }
    
    if (editingClass) {
      updateClassSchedule(editingClass.id, {
        ...formData,
        courseName: selectedCourse.title,
        status: (formData.status === 'Aberta' ? 'active' : 
               formData.status === 'Em Andamento' ? 'active' :
               formData.status === 'Concluída' ? 'completed' : 'cancelled') as 'active' | 'inactive' | 'completed' | 'cancelled'
      })
      toast.success('Turma atualizada com sucesso!')
    } else {
      const newClass = {
        id: Date.now().toString(),
        ...formData,
        courseName: selectedCourse.title,
        enrolledStudents: 0,
        status: (formData.status === 'Aberta' ? 'active' : 
               formData.status === 'Em Andamento' ? 'active' :
               formData.status === 'Concluída' ? 'completed' : 'cancelled') as 'active' | 'inactive' | 'completed' | 'cancelled'
      }
      addClassSchedule(newClass)
      toast.success('Turma criada com sucesso!')
    }
    
    resetForm()
    setIsModalOpen(false)
    setEditingClass(null)
  }

  const resetForm = () => {
    setFormData({
      courseId: courseId || 0,
      shift: 'manhã' as 'manhã' | 'tarde' | 'noite' | 'sábado',
      startDate: '',
      endDate: '',
      schedule: '',
      startTime: '',
      endTime: '',
      daysOfWeek: [],
      maxStudents: 20,
      instructor: '',
      status: 'Aberta' as 'Aberta' | 'Em Andamento' | 'Concluída' | 'Cancelada'
    })
  }

  const handleEdit = (classSchedule: any) => {
    // Parse existing schedule to extract time and days if possible
    let startTime = ''
    let endTime = ''
    let daysOfWeek: string[] = []
    
    if (classSchedule.schedule) {
      // Try to parse schedule like "Segunda, Quarta das 19:00 às 22:00"
      const timeMatch = classSchedule.schedule.match(/das (\d{2}:\d{2}) às (\d{2}:\d{2})/)
      if (timeMatch) {
        startTime = timeMatch[1]
        endTime = timeMatch[2]
      }
      
      // Extract days
      const daysMatch = classSchedule.schedule.match(/^([^d]+) das/)
      if (daysMatch) {
        daysOfWeek = daysMatch[1].split(',').map((day: string) => day.trim())
      }
    }
    
    setFormData({
      courseId: classSchedule.courseId,
      shift: classSchedule.shift,
      startDate: classSchedule.startDate,
      endDate: classSchedule.endDate,
      schedule: classSchedule.schedule,
      startTime,
      endTime,
      daysOfWeek,
      maxStudents: classSchedule.maxStudents,
      instructor: classSchedule.instructor,
      status: classSchedule.status
    })
    setEditingClass(classSchedule)
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta turma?')) {
      deleteClassSchedule(id)
      toast.success('Turma excluída com sucesso!')
    }
  }

  const getShiftColor = (shift: string) => {
    switch (shift) {
      case 'manhã': return 'bg-yellow-100 text-yellow-800'
      case 'tarde': return 'bg-orange-100 text-orange-800'
      case 'noite': return 'bg-blue-100 text-blue-800'
      case 'sábado': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'inactive': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {courseId ? 'Turmas do Curso' : 'Gerenciar Turmas'}
          </h2>
          <p className="text-gray-600">Organize e gerencie as turmas dos cursos</p>
        </div>
        
        {!onSelectClass && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Nova Turma
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por curso ou instrutor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ring-primary focus:border-transparent"
          />
        </div>
        
        <select
          value={filterShift}
          onChange={(e) => setFilterShift(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ring-primary focus:border-transparent"
        >
          <option value="">Todos os turnos</option>
          <option value="manhã">Manhã</option>
          <option value="tarde">Tarde</option>
          <option value="noite">Noite</option>
          <option value="sábado">Sábado</option>
        </select>
        
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 ring-primary focus:border-transparent"
        >
          <option value="">Todos os status</option>
          <option value="Aberta">Aberta</option>
          <option value="Em Andamento">Em Andamento</option>
          <option value="Concluída">Concluída</option>
          <option value="Cancelada">Cancelada</option>
        </select>
      </div>

      {/* Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClasses.map((classSchedule) => {
          const course = courses.find(c => c.id === classSchedule.courseId)
          
          return (
            <div
              key={classSchedule.id}
              className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-200 ${
                onSelectClass ? 'cursor-pointer hover:shadow-md hover:border-primary' : 'hover:shadow-md'
              }`}
              onClick={() => onSelectClass?.(classSchedule)}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {course?.title || 'Curso não encontrado'}
                  </h3>
                  <div className="flex gap-2 mb-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getShiftColor(classSchedule.shift)}`}>
                      {classSchedule.shift.charAt(0).toUpperCase() + classSchedule.shift.slice(1)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(classSchedule.status)}`}>
                       {classSchedule.status === 'active' ? 'Ativa' : 
                        classSchedule.status === 'completed' ? 'Concluída' : 
                        classSchedule.status === 'cancelled' ? 'Cancelada' : 'Inativa'}
                     </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{new Date(classSchedule.startDate).toLocaleDateString('pt-BR')} - {new Date(classSchedule.endDate).toLocaleDateString('pt-BR')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span>{classSchedule.schedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  <span>{classSchedule.enrolledStudents || 0}/{classSchedule.maxStudents} alunos</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{classSchedule.instructor}</span>
                </div>
              </div>
              
              {!onSelectClass && (
                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEdit(classSchedule)
                    }}
                    className="p-2 text-gray-400 hover:text-primary transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(classSchedule.id)
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )
        })}
        
        {filteredClasses.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma turma encontrada</p>
            <p className="text-sm">Clique em "Nova Turma" para começar</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-semibold mb-6">
              {editingClass ? 'Editar Turma' : 'Nova Turma'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Curso
                    </label>
                    <select
                      value={formData.courseId}
                      onChange={(e) => setFormData({ ...formData, courseId: Number(e.target.value) })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 ring-primary focus:border-transparent"
                      required
                      disabled={!!courseId}
                    >
                      <option value={0}>Selecione um curso</option>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Turno
                    </label>
                    <select
                      value={formData.shift}
                      onChange={(e) => setFormData({ ...formData, shift: e.target.value as any })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 ring-primary focus:border-transparent"
                      required
                    >
                      <option value="manhã">Manhã</option>
                      <option value="tarde">Tarde</option>
                      <option value="noite">Noite</option>
                      <option value="sábado">Sábado</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Início
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Término
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hora de Início
                    </label>
                    <input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => {
                        const newFormData = { ...formData, startTime: e.target.value }
                        // Auto-generate schedule text
                        if (newFormData.startTime && newFormData.endTime && newFormData.daysOfWeek.length > 0) {
                          newFormData.schedule = `${newFormData.daysOfWeek.join(', ')} das ${newFormData.startTime} às ${newFormData.endTime}`
                        }
                        setFormData(newFormData)
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hora de Término
                    </label>
                    <input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => {
                        const newFormData = { ...formData, endTime: e.target.value }
                        // Auto-generate schedule text
                        if (newFormData.startTime && newFormData.endTime && newFormData.daysOfWeek.length > 0) {
                          newFormData.schedule = `${newFormData.daysOfWeek.join(', ')} das ${newFormData.startTime} às ${newFormData.endTime}`
                        }
                        setFormData(newFormData)
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Máximo de Alunos
                    </label>
                    <input
                      type="number"
                      value={formData.maxStudents}
                      onChange={(e) => setFormData({ ...formData, maxStudents: Number(e.target.value) })}
                      min="1"
                      max="50"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instrutor
                    </label>
                    <input
                      type="text"
                      value={formData.instructor}
                      onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 ring-primary focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 ring-primary focus:border-transparent"
                      required
                    >
                      <option value="Aberta">Aberta</option>
                      <option value="Em Andamento">Em Andamento</option>
                      <option value="Concluída">Concluída</option>
                      <option value="Cancelada">Cancelada</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dias da Semana
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { value: 'Segunda', label: 'Segunda' },
                      { value: 'Terça', label: 'Terça' },
                      { value: 'Quarta', label: 'Quarta' },
                      { value: 'Quinta', label: 'Quinta' },
                      { value: 'Sexta', label: 'Sexta' },
                      { value: 'Sábado', label: 'Sábado' },
                      { value: 'Domingo', label: 'Domingo' }
                    ].map((day) => (
                      <label key={day.value} className="flex items-center space-x-2 p-2 border rounded-lg hover:bg-gray-50 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.daysOfWeek.includes(day.value)}
                          onChange={(e) => {
                            let newDays = [...formData.daysOfWeek]
                            if (e.target.checked) {
                              newDays.push(day.value)
                            } else {
                              newDays = newDays.filter(d => d !== day.value)
                            }
                            const newFormData = { ...formData, daysOfWeek: newDays }
                            // Auto-generate schedule text
                            if (newFormData.startTime && newFormData.endTime && newFormData.daysOfWeek.length > 0) {
                              newFormData.schedule = `${newFormData.daysOfWeek.join(', ')} das ${newFormData.startTime} às ${newFormData.endTime}`
                            }
                            setFormData(newFormData)
                          }}
                          className="rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm">{day.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {formData.schedule && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Horário Gerado
                    </label>
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700">
                      {formData.schedule}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingClass(null)
                    resetForm()
                  }}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-primary"
                >
                  {editingClass ? 'Atualizar' : 'Criar'} Turma
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}