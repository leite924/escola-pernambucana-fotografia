import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Gift,
  Settings,
  LogOut,
  Copy,
  Share2,
  ExternalLink,
  BarChart3
} from 'lucide-react'
import { toast } from 'sonner'

interface Commission {
  id: number
  studentName: string
  courseName: string
  saleValue: number
  commissionValue: number
  commissionRate: number
  status: 'paid' | 'pending' | 'cancelled'
  saleDate: string
  paymentDate?: string
}

interface AffiliateStats {
  totalEarnings: number
  pendingEarnings: number
  totalReferrals: number
  conversionRate: number
  thisMonthEarnings: number
  thisMonthReferrals: number
}

interface AffiliateUser {
  id: number
  name: string
  email: string
  affiliateCode: string
  joinDate: string
}

const AffiliateDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [affiliateUser, setAffiliateUser] = useState<AffiliateUser | null>(null)
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [stats, setStats] = useState<AffiliateStats>({
    totalEarnings: 0,
    pendingEarnings: 0,
    totalReferrals: 0,
    conversionRate: 0,
    thisMonthEarnings: 0,
    thisMonthReferrals: 0
  })

  const affiliateLink = `https://escolafotografia.com.br/cursos?ref=${affiliateUser?.affiliateCode || 'DEMO123'}`

  useEffect(() => {
    // Verificar se há usuário afiliado logado
    const savedAffiliate = localStorage.getItem('affiliateUser')
    
    if (!savedAffiliate) {
      navigate('/affiliate-login')
      return
    }

    const affiliate = JSON.parse(savedAffiliate)
    setAffiliateUser(affiliate)
    
    // Sempre carregar dados mockados
    loadMockData()
  }, [])

  const loadMockData = () => {
    // Sempre criar dados mockados frescos para garantir que apareçam
    const mockCommissions: Commission[] = [
      {
        id: 1,
        studentName: 'Maria Silva',
        courseName: 'Fotografia Digital Completa',
        saleValue: 497,
        commissionValue: 99.40,
        commissionRate: 20,
        status: 'paid',
        saleDate: '2024-01-15',
        paymentDate: '2024-01-20'
      },
      {
        id: 2,
        studentName: 'João Santos',
        courseName: 'Fotografia de Retrato',
        saleValue: 697,
        commissionValue: 139.40,
        commissionRate: 20,
        status: 'pending',
        saleDate: '2024-01-18'
      },
      {
        id: 3,
        studentName: 'Ana Costa',
        courseName: 'Fotografia de Casamento',
        saleValue: 897,
        commissionValue: 179.40,
        commissionRate: 20,
        status: 'paid',
        saleDate: '2024-01-10',
        paymentDate: '2024-01-15'
      },
      {
        id: 4,
        studentName: 'Carlos Oliveira',
        courseName: 'Fotografia Comercial',
        saleValue: 1200,
        commissionValue: 240.00,
        commissionRate: 20,
        status: 'paid',
        saleDate: '2024-01-05',
        paymentDate: '2024-01-10'
      },
      {
        id: 5,
        studentName: 'Fernanda Lima',
        courseName: 'Fotografia de Produto',
        saleValue: 850,
        commissionValue: 170.00,
        commissionRate: 20,
        status: 'pending',
        saleDate: '2024-01-20'
      }
    ]
    
    // Salvar no localStorage para persistência
    localStorage.setItem('affiliateCommissions', JSON.stringify(mockCommissions))
    setCommissions(mockCommissions)

    // Calcular estatísticas
    const totalEarnings = mockCommissions
      .filter(c => c.status === 'paid')
      .reduce((sum, c) => sum + c.commissionValue, 0)
    
    const pendingEarnings = mockCommissions
      .filter(c => c.status === 'pending')
      .reduce((sum, c) => sum + c.commissionValue, 0)

    const calculatedStats = {
      totalEarnings,
      pendingEarnings,
      totalReferrals: mockCommissions.length,
      conversionRate: 18.2,
      thisMonthEarnings: totalEarnings,
      thisMonthReferrals: mockCommissions.length
    }
    
    setStats(calculatedStats)
  }

  const handleLogout = () => {
    localStorage.removeItem('affiliateUser')
    localStorage.removeItem('affiliateCommissions')
    navigate('/affiliate-login')
    toast.success('Logout realizado com sucesso!')
  }

  const copyAffiliateLink = () => {
    navigator.clipboard.writeText(affiliateLink)
    toast.success('Link copiado para a área de transferência!')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-600" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Pago'
      case 'pending':
        return 'Pendente'
      case 'cancelled':
        return 'Cancelado'
      default:
        return status
    }
  }

  if (!affiliateUser) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-gray-600 hover:text-gray-700">
                <Gift className="w-8 h-8" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Painel do Afiliado</h1>
                <p className="text-sm text-gray-600">Bem-vindo, {affiliateUser.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-600 hover:text-gray-900">
                <Settings className="w-5 h-5" />
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-5 h-5" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dashboard'
                  ? 'border-gray-500 text-gray-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('commissions')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'commissions'
                  ? 'border-gray-500 text-gray-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Comissões
            </button>
            <button
              onClick={() => setActiveTab('links')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'links'
                  ? 'border-gray-500 text-gray-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Links de Afiliado
            </button>
          </nav>
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Ganho</p>
                    <p className="text-2xl font-bold text-gray-900">
                      R$ {stats.totalEarnings.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-full">
                    <DollarSign className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pendente</p>
                    <p className="text-2xl font-bold text-gray-900">
                      R$ {stats.pendingEarnings.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-full">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Indicações</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalReferrals}</p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-full">
                    <Users className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Conversão</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
                  </div>
                  <div className="p-3 bg-gray-100 rounded-full">
                    <TrendingUp className="w-6 h-6 text-gray-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Commissions */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Comissões Recentes ({commissions.length} total)</h3>
              </div>
              <div className="p-6">
                {commissions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">Nenhuma comissão encontrada</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {commissions.slice(0, 5).map((commission) => (
                      <div key={commission.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                          {getStatusIcon(commission.status)}
                          <div>
                            <p className="font-medium text-gray-900">{commission.studentName}</p>
                            <p className="text-sm text-gray-600">{commission.courseName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            R$ {commission.commissionValue.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-600">
                            {getStatusText(commission.status)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Commissions Tab */}
        {activeTab === 'commissions' && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Todas as Comissões</h3>
            </div>
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
                      Valor da Venda
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Comissão
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {commissions.map((commission) => (
                    <tr key={commission.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {commission.studentName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {commission.courseName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        R$ {commission.saleValue.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">
                        R$ {commission.commissionValue.toFixed(2)} ({commission.commissionRate}%)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(commission.status)}
                          <span className="text-sm text-gray-900">
                            {getStatusText(commission.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(commission.saleDate).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Links Tab */}
        {activeTab === 'links' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Seu Link de Afiliado</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={affiliateLink}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                  />
                </div>
                <button
                  onClick={copyAffiliateLink}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Copiar
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Use este link para divulgar nossos cursos e ganhar comissão por cada venda.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Como Divulgar</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Share2 className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Redes Sociais</h4>
                      <p className="text-sm text-gray-600">
                        Compartilhe seu link no Instagram, Facebook, WhatsApp e outras redes.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ExternalLink className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Blog ou Site</h4>
                      <p className="text-sm text-gray-600">
                        Escreva artigos sobre fotografia e inclua seu link de afiliado.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Indicação Direta</h4>
                      <p className="text-sm text-gray-600">
                        Indique para amigos, familiares e conhecidos interessados em fotografia.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BarChart3 className="w-5 h-5 text-green-600 mt-1" />
                    <div>
                      <h4 className="font-medium text-gray-900">Email Marketing</h4>
                      <p className="text-sm text-gray-600">
                        Envie newsletters para sua lista de contatos com seu link.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AffiliateDashboard