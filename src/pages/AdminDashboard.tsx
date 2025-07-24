import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts'
import { 
  Users, BookOpen, DollarSign, TrendingUp, Plus, Edit, Trash2, 
  Eye, LogOut, Menu, X, Calendar, Award, Mail, CreditCard, Shield,
  BarChart3, FileText, UserPlus, ClipboardCheck, Receipt, Settings, Share2, Brain
} from 'lucide-react'
import { toast } from 'sonner'
import { useStore } from '../store/useStore'
import FinancialReports from '../components/FinancialReports'
import PaymentManagement from '../components/PaymentManagement'
import CertificadoDigitalConfig from '../components/CertificadoDigitalConfig'
import ManualEnrollment from '../components/ManualEnrollment'
import AttendanceSystem from '../components/AttendanceSystem'
import AccountsPayable from '../components/AccountsPayable'
import AccountsReceivable from '../components/AccountsReceivable'
import AdminAccessLevels from '../components/AdminAccessLevels'
import AffiliateSettings from '../components/AffiliateSettings'
import AIAdminDashboard from '../components/AIAdminDashboard'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isNewCourseModalOpen, setIsNewCourseModalOpen] = useState(false)
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [newCourseData, setNewCourseData] = useState({
    title: '',
    description: '',
    price: 0,
    originalPrice: 0,
    duration: '',
    instructor: '',
    level: 'Iniciante',
    category: '',
    modules: 0,
    image: '',
    features: [''],
    curriculum: [{ module: '', lessons: [''] }],
    shifts: [] as ('manhã' | 'tarde' | 'noite' | 'sábado')[]
  })
  const navigate = useNavigate()
  
  const { 
    isAuthenticated, 
    logout, 
    courses, 
    students, 
    sidebarOpen, 
    setSidebarOpen,
    addCourse,
    updateCourse,
    deleteCourse
  } = useStore()

  const handleCreateCourse = () => {
    if (!newCourseData.title || !newCourseData.description || !newCourseData.instructor) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    const courseToAdd = {
      ...newCourseData,
      students: 0,
      rating: 0,
      image: newCourseData.image || `https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20photography%20course%20${encodeURIComponent(newCourseData.category)}%20modern%20studio&image_size=landscape_16_9`
    }

    if (editingCourseId) {
      updateCourse(editingCourseId, courseToAdd)
      toast.success('Curso atualizado com sucesso!')
    } else {
      addCourse(courseToAdd)
      toast.success('Curso criado com sucesso!')
    }
    
    setIsNewCourseModalOpen(false)
    setEditingCourseId(null)
    setNewCourseData({
      title: '',
      description: '',
      price: 0,
      originalPrice: 0,
      duration: '',
      instructor: '',
      level: 'Iniciante',
      category: '',
      modules: 0,
      image: '',
      features: [''],
      curriculum: [{ module: '', lessons: [''] }],
      shifts: []
    })
  }

  const handleAddFeature = () => {
    setNewCourseData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }))
  }

  const handleRemoveFeature = (index: number) => {
    setNewCourseData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const handleFeatureChange = (index: number, value: string) => {
    setNewCourseData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }))
  }

  const handleShiftToggle = (shift: 'manhã' | 'tarde' | 'noite' | 'sábado') => {
    setNewCourseData(prev => ({
      ...prev,
      shifts: prev.shifts.includes(shift)
        ? prev.shifts.filter(s => s !== shift)
        : [...prev.shifts, shift]
    }))
  }

  // Handlers para ações dos cursos
  const handleViewCourse = (courseId: number) => {
    navigate(`/curso/${courseId}`)
  }

  const handleEditCourse = (courseId: number) => {
    const course = courses.find(c => c.id === courseId)
    if (course) {
      setNewCourseData({
        title: course.title,
        description: course.description,
        price: course.price,
        originalPrice: course.originalPrice || course.price,
        duration: course.duration,
        instructor: course.instructor,
        level: course.level,
        category: course.category || '',
        modules: course.modules || 0,
        image: course.image,
        features: course.features || [''],
        curriculum: course.curriculum || [{ module: '', lessons: [''] }],
        shifts: course.shifts || []
      })
      setEditingCourseId(courseId)
      setIsNewCourseModalOpen(true)
    }
  }

  const handleDeleteCourse = (courseId: number) => {
    if (window.confirm('Tem certeza que deseja excluir este curso?')) {
      deleteCourse(courseId)
      toast.success('Curso excluído com sucesso!')
    }
  }

  // Handlers para ações dos alunos
  const handleViewStudent = (studentId: number) => {
    const student = students.find(s => s.id === studentId)
    if (student) {
      alert(`Detalhes do aluno:\n\nNome: ${student.name}\nEmail: ${student.email}\nCurso: ${student.course}\nStatus: ${student.status}\nData de Inscrição: ${new Date(student.enrollDate).toLocaleDateString('pt-BR')}`)
    }
  }

  const handleEmailStudent = (studentId: number) => {
    const student = students.find(s => s.id === studentId)
    if (student) {
      window.open(`mailto:${student.email}?subject=Contato da Escola de Fotografia&body=Olá ${student.name},`)
    }
  }

  const handleSearchStudents = () => {
    if (searchTerm.trim()) {
      const filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.course.toLowerCase().includes(searchTerm.toLowerCase())
      )
      if (filteredStudents.length === 0) {
        toast.info('Nenhum aluno encontrado com esse termo de busca.')
      } else {
        toast.success(`${filteredStudents.length} aluno(s) encontrado(s).`)
      }
    }
  }

  // Check authentication
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login')
    }
  }, [isAuthenticated, navigate])

  const handleLogout = () => {
    logout()
    toast.success('Logout realizado com sucesso!')
    navigate('/admin/login')
  }

  // Calculate stats from store data
  const stats = {
    totalStudents: students.length,
    activeCourses: courses.length,
    monthlyRevenue: courses.reduce((total, course) => total + (course.price * course.students), 0),
    conversionRate: 12.5
  }

  const monthlyData = [
    { month: 'Jan', revenue: 32000, students: 85 },
    { month: 'Fev', revenue: 38000, students: 92 },
    { month: 'Mar', revenue: 42000, students: 108 },
    { month: 'Abr', revenue: 45780, students: 125 },
    { month: 'Mai', revenue: 48000, students: 135 },
    { month: 'Jun', revenue: 52000, students: 148 }
  ]

  const courseData = courses.map((course, index) => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#F97316']
    return {
      name: course.title.split(' ').slice(0, 2).join(' '),
      students: course.students,
      color: colors[index % colors.length]
    }
  })

  const coursesWithRevenue = courses.map(course => ({
    ...course,
    revenue: `R$ ${(course.price * course.students).toLocaleString()}`,
    status: 'Ativo'
  }))

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'students', label: 'Alunos', icon: Users },
    { id: 'courses', label: 'Cursos', icon: BookOpen },
    { id: 'ai-dashboard', label: 'Inteligência Artificial', icon: Brain },
    { id: 'manual-enrollment', label: 'Matrículas Manuais', icon: UserPlus },
    { id: 'attendance', label: 'Sistema de Presença', icon: ClipboardCheck },
    { id: 'payments', label: 'Pagamentos', icon: CreditCard },
    { id: 'accounts-receivable', label: 'Contas a Receber', icon: DollarSign },
    { id: 'accounts-payable', label: 'Contas a Pagar', icon: Receipt },
    { id: 'reports', label: 'Relatórios', icon: FileText },
    { id: 'certificado', label: 'Certificado Digital', icon: Shield },
    { id: 'affiliates', label: 'Afiliados', icon: Share2 },
    { id: 'admin-access', label: 'Níveis de Acesso', icon: Settings },
  ]

  const renderDashboard = () => (
    <div className="space-y-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Total de Alunos</p>
              <p className="text-xl font-bold text-gray-900">{stats.totalStudents}</p>
            </div>
            <Users className="h-6 w-6 text-gray-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Cursos Ativos</p>
              <p className="text-xl font-bold text-gray-900">{stats.activeCourses}</p>
            </div>
            <BookOpen className="h-6 w-6 text-gray-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Receita Mensal</p>
              <p className="text-xl font-bold text-gray-900">R$ {stats.monthlyRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-6 w-6 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Taxa de Conversão</p>
              <p className="text-xl font-bold text-gray-900">{stats.conversionRate}%</p>
            </div>
            <TrendingUp className="h-6 w-6 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Receita Mensal</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(value) => [`R$ ${value.toLocaleString()}`, 'Receita']} />
              <Bar dataKey="revenue" fill="#6B7280" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Course Distribution */}
        <div className="bg-white rounded-lg shadow p-4">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Distribuição de Alunos por Curso</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={courseData}
                cx="50%"
                cy="50%"
                outerRadius={60}
                dataKey="students"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                fontSize={10}
              >
                {courseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-base font-semibold text-gray-900">Atividade Recente</h3>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="bg-gray-100 p-1.5 rounded-full">
                <Users className="h-3 w-3 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-gray-900">Novo aluno inscrito</p>
                <p className="text-xs text-gray-500">Maria Silva se inscreveu no curso de Fotografia Digital</p>
              </div>
              <span className="text-xs text-gray-400">2 min atrás</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-gray-100 p-1.5 rounded-full">
                <BookOpen className="h-3 w-3 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Curso atualizado</p>
                <p className="text-sm text-gray-500">Conteúdo do curso de Retrato foi atualizado</p>
              </div>
              <span className="text-sm text-gray-400">1 hora atrás</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-100 p-2 rounded-full">
                <Award className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Certificado emitido</p>
                <p className="text-sm text-gray-500">João Santos concluiu o curso de Retrato Profissional</p>
              </div>
              <span className="text-sm text-gray-400">3 horas atrás</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCourses = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gerenciar Cursos</h2>
        <button 
          onClick={() => setIsNewCourseModalOpen(true)}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium inline-flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Curso
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Curso
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Alunos
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Receita
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
            {coursesWithRevenue.map((course) => (
              <tr key={course.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{course.title}</div>
                    <div className="text-sm text-gray-500">Instrutor: {course.instructor}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {course.students}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {course.revenue}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {course.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleViewCourse(course.id)}
                      className="text-gray-600 hover:text-gray-900"
                      title="Visualizar curso"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleEditCourse(course.id)}
                      className="text-yellow-600 hover:text-yellow-900"
                      title="Editar curso"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleDeleteCourse(course.id)}
                      className="text-gray-600 hover:text-gray-900"
                      title="Excluir curso"
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
  )

  const renderStudents = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gerenciar Alunos</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            placeholder="Buscar alunos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearchStudents()}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button 
            onClick={handleSearchStudents}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Buscar
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
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
                Data de Inscrição
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
            {students.map((student) => (
              <tr key={student.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{student.name}</div>
                    <div className="text-sm text-gray-500">{student.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {student.course}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(student.enrollDate).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    student.status === 'Ativo' ? 'bg-gray-100 text-gray-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {student.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => handleViewStudent(student.id)}
                      className="text-gray-600 hover:text-gray-900"
                      title="Visualizar detalhes do aluno"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button 
                      onClick={() => handleEmailStudent(student.id)}
                      className="text-gray-600 hover:text-gray-900"
                      title="Enviar email para o aluno"
                    >
                      <Mail className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderReports = () => {
    // Navigate to dedicated reports page
    navigate('/admin/relatorios')
    return null
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return renderDashboard()
      case 'courses': return renderCourses()
      case 'students': return renderStudents()
      case 'ai-dashboard': return <AIAdminDashboard />
      case 'manual-enrollment': return <ManualEnrollment />
      case 'attendance': return <AttendanceSystem />
      case 'payments': return <PaymentManagement />
      case 'accounts-receivable': return <AccountsReceivable />
      case 'accounts-payable': return <AccountsPayable />
      case 'reports': return renderReports()
      case 'certificado': return <CertificadoDigitalConfig />
      case 'affiliates': return <AffiliateSettings />
      case 'admin-access': return <AdminAccessLevels />
      default: return renderDashboard()
    }
  }

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex lg:flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200 flex-shrink-0">
          <h1 className="text-lg font-bold text-gray-900">FotoEscola</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-2">
          {menuItems.map((item) => {
            const IconComponent = item.icon
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id)
                  setSidebarOpen(false)
                }}
                className={`w-full flex items-center px-4 py-2 text-sm text-left hover:bg-gray-50 ${
                  activeTab === item.id ? 'bg-gray-50 text-gray-600 border-r-2 border-gray-600' : 'text-gray-700'
                }`}
              >
                <IconComponent className="h-4 w-4 mr-3 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            )
          })}
        </nav>
        
        <div className="border-t border-gray-200 p-4 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            <LogOut className="h-4 w-4 mr-3" />
            Sair
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between h-14 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">Bem-vindo, Administrador</span>
              <div className="w-7 h-7 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-medium">A</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-4">
          {renderContent()}
        </div>
      </div>

      {/* Modal para Novo Curso */}
      {isNewCourseModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{editingCourseId ? 'Editar Curso' : 'Criar Novo Curso'}</h2>
                <button
                  onClick={() => {
                    setIsNewCourseModalOpen(false)
                    setEditingCourseId(null)
                    setNewCourseData({
                      title: '',
                      description: '',
                      price: 0,
                      originalPrice: 0,
                      duration: '',
                      instructor: '',
                      level: 'Iniciante',
                      category: '',
                      modules: 0,
                      image: '',
                      features: [''],
                      curriculum: [{ module: '', lessons: [''] }],
                      shifts: []
                    })
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={(e) => { e.preventDefault(); handleCreateCourse(); }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título do Curso *
                    </label>
                    <input
                      type="text"
                      value={newCourseData.title}
                      onChange={(e) => setNewCourseData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6246de]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Instrutor *
                    </label>
                    <input
                      type="text"
                      value={newCourseData.instructor}
                      onChange={(e) => setNewCourseData(prev => ({ ...prev, instructor: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6246de]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço (R$)
                    </label>
                    <input
                      type="number"
                      value={newCourseData.price}
                      onChange={(e) => setNewCourseData(prev => ({ ...prev, price: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6246de]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preço Original (R$)
                    </label>
                    <input
                      type="number"
                      value={newCourseData.originalPrice}
                      onChange={(e) => setNewCourseData(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6246de]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Duração
                    </label>
                    <input
                      type="text"
                      value={newCourseData.duration}
                      onChange={(e) => setNewCourseData(prev => ({ ...prev, duration: e.target.value }))}
                      placeholder="Ex: 8 semanas"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6246de]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nível
                    </label>
                    <select
                      value={newCourseData.level}
                      onChange={(e) => setNewCourseData(prev => ({ ...prev, level: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6246de]"
                    >
                      <option value="Iniciante">Iniciante</option>
                      <option value="Intermediário">Intermediário</option>
                      <option value="Avançado">Avançado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categoria
                    </label>
                    <input
                      type="text"
                      value={newCourseData.category}
                      onChange={(e) => setNewCourseData(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="Ex: Digital, Retrato, Casamento"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6246de]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Módulos
                    </label>
                    <input
                      type="number"
                      value={newCourseData.modules}
                      onChange={(e) => setNewCourseData(prev => ({ ...prev, modules: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6246de]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição *
                  </label>
                  <textarea
                    value={newCourseData.description}
                    onChange={(e) => setNewCourseData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6246de]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL da Imagem (opcional)
                  </label>
                  <input
                    type="url"
                    value={newCourseData.image}
                    onChange={(e) => setNewCourseData(prev => ({ ...prev, image: e.target.value }))}
                    placeholder="Se não informado, será gerada automaticamente"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6246de]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Turnos Disponíveis
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['manhã', 'tarde', 'noite', 'sábado'].map((shift) => (
                      <button
                        key={shift}
                        type="button"
                        onClick={() => handleShiftToggle(shift as any)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          newCourseData.shifts.includes(shift as any)
                            ? 'bg-[#6246de] text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {shift.charAt(0).toUpperCase() + shift.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Características do Curso
                  </label>
                  <div className="space-y-2">
                    {newCourseData.features.map((feature, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={feature}
                          onChange={(e) => handleFeatureChange(index, e.target.value)}
                          placeholder="Ex: Acesso vitalício ao conteúdo"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6246de]"
                        />
                        {newCourseData.features.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveFeature(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddFeature}
                      className="text-[#6246de] hover:text-[#5a3bc4] text-sm font-medium flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar Característica
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setIsNewCourseModalOpen(false)
                      setEditingCourseId(null)
                      setNewCourseData({
                        title: '',
                        description: '',
                        price: 0,
                        originalPrice: 0,
                        duration: '',
                        instructor: '',
                        level: 'Iniciante',
                        category: '',
                        modules: 0,
                        image: '',
                        features: [''],
                        curriculum: [{ module: '', lessons: [''] }],
                        shifts: []
                      })
                    }}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#6246de] text-white rounded-lg hover:bg-[#5a3bc4] transition-colors"
                  >
                    {editingCourseId ? 'Atualizar Curso' : 'Criar Curso'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard