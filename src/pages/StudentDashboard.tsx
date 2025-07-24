import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  BookOpen, Award, Brain, User, LogOut, BarChart3, Clock, 
  CheckCircle, Play, Download, Eye, Calendar, Trophy,
  FileText, Target, TrendingUp, Users
} from 'lucide-react'
import { toast } from 'sonner'
import { useStore } from '../store/useStore'
import QuizSystem from '../components/QuizSystem'
import StudentCourses from '../components/StudentCourses'
import StudentCertificates from '../components/StudentCertificates'
import StudentAffiliateInfo from '../components/StudentAffiliateInfo'
import AIStudentDashboard from '../components/AIStudentDashboard'

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'courses' | 'quiz' | 'certificates' | 'affiliates' | 'ai-dashboard'>('dashboard')
  const navigate = useNavigate()
  const { user, isStudentAuthenticated, logoutStudent, students } = useStore()

  // Check authentication
  useEffect(() => {
    if (!isStudentAuthenticated) {
      navigate('/aluno/login')
    }
  }, [isStudentAuthenticated, navigate])

  const handleLogout = () => {
    logoutStudent()
    toast.success('Logout realizado com sucesso!')
    navigate('/aluno/login')
  }

  // Get current student data
  const currentStudent = students.find(s => s.email === user?.email)

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'courses', label: 'Meus Cursos', icon: BookOpen },
    { id: 'ai-dashboard', label: 'Inteligência Artificial', icon: Brain },
    { id: 'quiz', label: 'Quiz', icon: Target },
    { id: 'certificates', label: 'Certificados', icon: Award },
    { id: 'affiliates', label: 'Afiliados', icon: Users }
  ]

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Bem-vindo, {currentStudent?.name || user?.name}!
        </h1>
        <p className="text-blue-100">
          Continue sua jornada de aprendizado em fotografia
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Curso Atual</p>
              <p className="text-lg font-semibold text-gray-900">
                {currentStudent?.course || 'Nenhum'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Presença</p>
              <p className="text-lg font-semibold text-gray-900">
                {currentStudent?.attendancePercentage || 0}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Brain className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Quiz Realizados</p>
              <p className="text-lg font-semibold text-gray-900">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Award className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Certificados</p>
              <p className="text-lg font-semibold text-gray-900">
                {currentStudent?.certificateNumber ? '1' : '0'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress Overview */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Progresso do Curso</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Módulo 1: Fundamentos</span>
                  <span className="text-gray-600">Concluído</span>
                </div>
                <div className="mt-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Módulo 2: Composição</span>
                  <span className="text-gray-600">Em andamento</span>
                </div>
                <div className="mt-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Módulo 3: Iluminação</span>
                  <span className="text-gray-400">Bloqueado</span>
                </div>
                <div className="mt-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-gray-300 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Ações Rápidas</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <button
                onClick={() => setActiveTab('courses')}
                className="w-full flex items-center p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <BookOpen className="h-5 w-5 text-gray-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Continuar Estudos</p>
                  <p className="text-sm text-gray-600">Acesse o material do curso</p>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('quiz')}
                className="w-full flex items-center p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Brain className="h-5 w-5 text-gray-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Fazer Quiz</p>
                  <p className="text-sm text-gray-600">Teste seus conhecimentos</p>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('certificates')}
                className="w-full flex items-center p-3 text-left bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors"
              >
                <Award className="h-5 w-5 text-yellow-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Ver Certificados</p>
                  <p className="text-sm text-gray-600">Baixe seus certificados</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard()
      case 'courses':
        return <StudentCourses />
      case 'ai-dashboard':
        return <AIStudentDashboard />
      case 'quiz':
        return <QuizSystem />
      case 'certificates':
        return <StudentCertificates />
      case 'affiliates':
        return <StudentAffiliateInfo />
      default:
        return renderDashboard()
    }
  }

  if (!isStudentAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Área do Aluno</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-700">{user?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-gray-500 hover:text-gray-700"
              >
                <LogOut className="h-5 w-5" />
                <span className="text-sm">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-lg shadow p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveTab(item.id as any)}
                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          activeTab === item.id
                            ? 'bg-gray-100 text-gray-700'
                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <Icon className="h-5 w-5 mr-3" />
                        {item.label}
                      </button>
                    </li>
                  )
                })}
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudentDashboard