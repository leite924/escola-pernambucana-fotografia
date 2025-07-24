import React, { useState } from 'react'
import { Plus, Search, Filter, Edit, Trash2, UserPlus, Mail, Phone, Calendar, BookOpen, X, MapPin, Heart, Users } from 'lucide-react'
import { toast } from 'sonner'
import { useStore } from '../store/useStore'
import ClassScheduleManager from './ClassScheduleManager'

interface EnrollmentForm {
  name: string
  email: string
  phone: string
  course: string
  classId: number
  className: string
  shift: string
  enrollDate: string
  status: 'Ativo' | 'Concluído' | 'Pausado'
  paymentStatus: 'Pago' | 'Pendente' | 'Parcial'
  notes?: string
  address: string
  birthDate: string
  emergencyContact: string
  emergencyPhone: string
  howDidYouHear: string
  previousExperience: string
}

const ManualEnrollment = () => {
  const { students, courses, addStudent, updateStudent, deleteStudent, classSchedules } = useStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [courseFilter, setCourseFilter] = useState<string>('all')
  const [selectedClass, setSelectedClass] = useState<any>(null)
  const [showClassSelector, setShowClassSelector] = useState(false)
  
  const [formData, setFormData] = useState<EnrollmentForm>({
    name: '',
    email: '',
    phone: '',
    course: '',
    classId: 0,
    className: '',
    shift: '',
    enrollDate: new Date().toISOString().split('T')[0],
    status: 'Ativo',
    paymentStatus: 'Pendente',
    notes: '',
    address: '',
    birthDate: '',
    emergencyContact: '',
    emergencyPhone: '',
    howDidYouHear: '',
    previousExperience: ''
  })

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || student.status === statusFilter
    const matchesCourse = courseFilter === 'all' || student.course === courseFilter
    return matchesSearch && matchesStatus && matchesCourse
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.course) {
      toast.error('Preencha todos os campos obrigatórios!')
      return
    }

    const studentData = {
      ...formData,
      id: editingStudent ? editingStudent.id : Date.now(),
      classId: formData.classId.toString(),
      paymentStatus: (formData.paymentStatus === 'Pendente' ? 'pending' : formData.paymentStatus === 'Pago' ? 'paid' : 'overdue') as 'pending' | 'paid' | 'overdue'
    }

    if (editingStudent) {
      updateStudent(editingStudent.id, studentData)
      toast.success('Aluno atualizado com sucesso!')
      setEditingStudent(null)
    } else {
      addStudent(studentData)
      toast.success('Aluno matriculado com sucesso!')
    }
    
    resetForm()
    setShowAddForm(false)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      course: '',
      classId: 0,
      className: '',
      shift: '',
      enrollDate: new Date().toISOString().split('T')[0],
      status: 'Ativo',
      paymentStatus: 'Pendente',
      notes: '',
      address: '',
      birthDate: '',
      emergencyContact: '',
      emergencyPhone: '',
      howDidYouHear: '',
      previousExperience: ''
    })
  }

  const handleEdit = (student: any) => {
    setEditingStudent(student)
    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone || '',
      course: student.course,
      classId: student.classId || 0,
      className: student.className || '',
      shift: student.shift || '',
      enrollDate: student.enrollDate,
      status: student.status,
      paymentStatus: student.paymentStatus || 'Pendente',
      notes: student.notes || '',
      address: student.address || '',
      birthDate: student.birthDate || '',
      emergencyContact: student.emergencyContact || '',
      emergencyPhone: student.emergencyPhone || '',
      howDidYouHear: student.howDidYouHear || '',
      previousExperience: student.previousExperience || ''
    })
    setShowAddForm(true)
  }

  const handleDelete = (id: number) => {
    if (confirm('Tem certeza que deseja excluir este aluno?')) {
      deleteStudent(id)
      toast.success('Aluno excluído com sucesso!')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ativo': return 'bg-gray-100 text-gray-800'
      case 'Concluído': return 'bg-gray-100 text-gray-800'
      case 'Pausado': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Pago': return 'bg-gray-100 text-gray-800'
      case 'Pendente': return 'bg-gray-100 text-gray-800'
      case 'Parcial': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Matrículas Manuais</h2>
          <p className="text-gray-600">Gerencie matrículas de alunos diretamente pelo painel administrativo</p>
        </div>
        <button
          onClick={() => {
            resetForm()
            setEditingStudent(null)
            setShowAddForm(true)
          }}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <UserPlus className="h-4 w-4" />
          <span>Nova Matrícula</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Alunos</p>
              <p className="text-2xl font-bold text-gray-600">{students.length}</p>
            </div>
            <UserPlus className="h-8 w-8 text-gray-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Alunos Ativos</p>
              <p className="text-2xl font-bold text-green-600">
                {students.filter(s => s.status === 'Ativo').length}
              </p>
            </div>
            <UserPlus className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Concluídos</p>
              <p className="text-2xl font-bold text-blue-600">
                {students.filter(s => s.status === 'Concluído').length}
              </p>
            </div>
            <UserPlus className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pausados</p>
              <p className="text-2xl font-bold text-yellow-600">
                {students.filter(s => s.status === 'Pausado').length}
              </p>
            </div>
            <UserPlus className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos os Status</option>
            <option value="Ativo">Ativo</option>
            <option value="Concluído">Concluído</option>
            <option value="Pausado">Pausado</option>
          </select>
          
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Todos os Cursos</option>
            {courses.map(course => (
              <option key={course.id} value={course.title}>{course.title}</option>
            ))}
          </select>
          
          <button
            onClick={() => {
              setSearchTerm('')
              setStatusFilter('all')
              setCourseFilter('all')
            }}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center justify-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aluno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Curso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data de Matrícula
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pagamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {student.email}
                      </div>
                      {student.phone && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <Phone className="h-3 w-3 mr-1" />
                          {student.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <BookOpen className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{student.course}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">
                        {new Date(student.enrollDate).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      getStatusColor(student.status)
                    }`}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      getPaymentStatusColor(student.paymentStatus || 'Pendente')
                    }`}>
                      {student.paymentStatus || 'Pendente'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(student)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(student.id)}
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
        
        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <UserPlus className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum aluno encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== 'all' || courseFilter !== 'all'
                ? 'Tente ajustar os filtros de busca.'
                : 'Comece criando uma nova matrícula.'}
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">
                {editingStudent ? 'Editar Aluno' : 'Nova Matrícula'}
              </h3>
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setEditingStudent(null)
                  resetForm()
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informações Pessoais */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Informações Pessoais
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Nascimento
                    </label>
                    <input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <MapPin className="h-4 w-4 inline mr-1" />
                      Endereço
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Rua, número, bairro, cidade"
                    />
                  </div>
                </div>
              </div>

              {/* Contato de Emergência */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Contato de Emergência
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do Contato
                    </label>
                    <input
                      type="text"
                      value={formData.emergencyContact}
                      onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone de Emergência
                    </label>
                    <input
                      type="tel"
                      value={formData.emergencyPhone}
                      onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Informações do Curso */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Informações do Curso
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Curso *
                    </label>
                    <select
                      value={formData.course}
                      onChange={(e) => {
                        setFormData({ ...formData, course: e.target.value, classId: 0, className: '', shift: '' })
                      }}
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
                      Turma *
                    </label>
                    <div className="flex space-x-2">
                      <select
                        value={formData.classId}
                        onChange={(e) => {
                          const classId = parseInt(e.target.value)
                          const selectedClass = classSchedules.find(c => c.id === classId.toString())
                          setFormData({ 
                             ...formData, 
                             classId,
                             className: selectedClass?.courseName || '',
                             shift: selectedClass?.shift || ''
                           })
                        }}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value={0}>Selecione uma turma</option>
                        {classSchedules
                           .filter(cls => cls.courseName === formData.course)
                           .map(cls => (
                             <option key={cls.id} value={cls.id}>
                               {cls.courseName} - {cls.shift} ({cls.schedule})
                             </option>
                           ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setShowClassSelector(true)}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                        title="Gerenciar turmas"
                      >
                        <Users className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Matrícula
                    </label>
                    <input
                      type="date"
                      value={formData.enrollDate}
                      onChange={(e) => setFormData({ ...formData, enrollDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Ativo">Ativo</option>
                      <option value="Concluído">Concluído</option>
                      <option value="Pausado">Pausado</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status do Pagamento
                    </label>
                    <select
                      value={formData.paymentStatus}
                      onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value as any })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Pago">Pago</option>
                      <option value="Parcial">Parcial</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Informações Adicionais */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Informações Adicionais
                </h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Como conheceu nosso estúdio?
                    </label>
                    <select
                      value={formData.howDidYouHear}
                      onChange={(e) => setFormData({ ...formData, howDidYouHear: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione uma opção</option>
                      <option value="Redes Sociais">Redes Sociais</option>
                      <option value="Indicação de Amigo">Indicação de Amigo</option>
                      <option value="Google">Google</option>
                      <option value="Panfleto">Panfleto</option>
                      <option value="Passando na Rua">Passando na Rua</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Experiência Anterior com Dança
                    </label>
                    <textarea
                      value={formData.previousExperience}
                      onChange={(e) => setFormData({ ...formData, previousExperience: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Descreva sua experiência anterior com dança (opcional)"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observações
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Observações adicionais sobre a matrícula..."
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingStudent(null)
                    resetForm()
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {editingStudent ? 'Atualizar' : 'Matricular'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Class Schedule Manager Modal */}
       {showClassSelector && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-2xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-semibold">Gerenciar Turmas</h3>
               <button
                 onClick={() => setShowClassSelector(false)}
                 className="p-2 text-gray-400 hover:text-gray-600"
               >
                 <X className="w-5 h-5" />
               </button>
             </div>
             <ClassScheduleManager />
           </div>
         </div>
       )}
    </div>
  )
}

export default ManualEnrollment