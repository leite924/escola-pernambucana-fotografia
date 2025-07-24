import { useState, useEffect } from 'react'
import { Settings, Users, DollarSign, TrendingUp, Edit, Save, X, Plus, Trash2, Eye, Mail, Phone, MapPin, Calendar, Award } from 'lucide-react'
import { toast } from 'sonner'

interface CommissionTier {
  id: number
  name: string
  minReferrals: number
  maxReferrals: number | null
  commissionRate: number
  description: string
}

interface AffiliateConfig {
  defaultCommissionRate: number
  paymentMinimum: number
  paymentDay: number
  autoApproval: boolean
  commissionTiers: CommissionTier[]
}

interface Affiliate {
  id: number
  name: string
  email: string
  phone?: string
  city?: string
  state?: string
  affiliateCode: string
  registeredAt: string
  totalReferrals: number
  totalEarnings: number
  pendingEarnings: number
  status: 'active' | 'inactive' | 'pending'
  currentTier: string
  commissionRate: number
}

interface StudentAffiliate {
  id: number
  name: string
  email: string
  affiliateCode: string
  isAffiliate: boolean
  totalReferrals: number
  totalEarnings: number
  pendingEarnings: number
  currentTier: string
  commissionRate: number
  becameAffiliateAt: string
}

const AffiliateSettings = () => {
  const [config, setConfig] = useState<AffiliateConfig>({
    defaultCommissionRate: 20,
    paymentMinimum: 50,
    paymentDay: 15,
    autoApproval: true,
    commissionTiers: [
      {
        id: 1,
        name: 'Iniciante',
        minReferrals: 0,
        maxReferrals: 5,
        commissionRate: 20,
        description: 'Para novos afiliados'
      },
      {
        id: 2,
        name: 'Intermediário',
        minReferrals: 6,
        maxReferrals: 15,
        commissionRate: 25,
        description: 'Para afiliados com experiência'
      },
      {
        id: 3,
        name: 'Avançado',
        minReferrals: 16,
        maxReferrals: null,
        commissionRate: 30,
        description: 'Para afiliados top performers'
      }
    ]
  })
  const [editingTier, setEditingTier] = useState<number | null>(null)
  const [newTier, setNewTier] = useState<Partial<CommissionTier>>({})
  const [showNewTierForm, setShowNewTierForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [studentAffiliates, setStudentAffiliates] = useState<StudentAffiliate[]>([])
  const [activeTab, setActiveTab] = useState<'config' | 'affiliates' | 'students'>('config')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAffiliate, setSelectedAffiliate] = useState<Affiliate | null>(null)
  const [showAffiliateModal, setShowAffiliateModal] = useState(false)

  useEffect(() => {
    // Carregar configurações salvas
    const savedConfig = localStorage.getItem('affiliateConfig')
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig))
    }

    // Carregar afiliados registrados
    const savedAffiliates = localStorage.getItem('affiliates')
    if (savedAffiliates) {
      const affiliatesData = JSON.parse(savedAffiliates)
      const processedAffiliates = affiliatesData.map((affiliate: any) => ({
        ...affiliate,
        totalReferrals: affiliate.totalReferrals || 0,
        totalEarnings: affiliate.totalEarnings || 0,
        pendingEarnings: affiliate.pendingEarnings || 0,
        status: affiliate.status || 'active',
        currentTier: affiliate.currentTier || 'Iniciante',
        commissionRate: affiliate.commissionRate || 20
      }))
      setAffiliates(processedAffiliates)
    } else {
      // Dados de exemplo para demonstração
      const exampleAffiliates: Affiliate[] = [
        {
          id: 1,
          name: 'Maria Silva',
          email: 'maria@email.com',
          phone: '(11) 99999-9999',
          city: 'São Paulo',
          state: 'SP',
          affiliateCode: 'MARIA2024',
          registeredAt: '2024-01-15T10:00:00Z',
          totalReferrals: 15,
          totalEarnings: 2500.00,
          pendingEarnings: 450.00,
          status: 'active',
          currentTier: 'Expert',
          commissionRate: 25
        },
        {
          id: 2,
          name: 'João Santos',
          email: 'joao@email.com',
          phone: '(21) 88888-8888',
          affiliateCode: 'JOAO2024',
          registeredAt: '2024-02-10T14:30:00Z',
          totalReferrals: 8,
          totalEarnings: 1200.00,
          pendingEarnings: 200.00,
          status: 'active',
          currentTier: 'Intermediário',
          commissionRate: 22
        }
      ]
      setAffiliates(exampleAffiliates)
    }

    // Carregar alunos que se tornaram afiliados
    const students = JSON.parse(localStorage.getItem('students') || '[]')
    const studentAffiliatesData = students
      .filter((student: any) => student.isAffiliate)
      .map((student: any) => ({
        id: student.id,
        name: student.name,
        email: student.email,
        affiliateCode: student.affiliateCode || `STU${student.id}`,
        isAffiliate: true,
        totalReferrals: student.totalReferrals || 0,
        totalEarnings: student.totalEarnings || 0,
        pendingEarnings: student.pendingEarnings || 0,
        currentTier: student.currentTier || 'Iniciante',
        commissionRate: student.commissionRate || 20,
        becameAffiliateAt: student.becameAffiliateAt || new Date().toISOString()
      }))
    
    if (studentAffiliatesData.length === 0) {
      // Dados de exemplo para demonstração
      const exampleStudentAffiliates: StudentAffiliate[] = [
        {
          id: 101,
          name: 'Ana Costa',
          email: 'ana@email.com',
          affiliateCode: 'STU101',
          isAffiliate: true,
          totalReferrals: 5,
          totalEarnings: 800.00,
          pendingEarnings: 150.00,
          currentTier: 'Iniciante',
          commissionRate: 20,
          becameAffiliateAt: '2024-03-01T09:00:00Z'
        },
        {
          id: 102,
          name: 'Carlos Oliveira',
          email: 'carlos@email.com',
          affiliateCode: 'STU102',
          isAffiliate: true,
          totalReferrals: 12,
          totalEarnings: 1500.00,
          pendingEarnings: 300.00,
          currentTier: 'Intermediário',
          commissionRate: 22,
          becameAffiliateAt: '2024-02-15T16:30:00Z'
        }
      ]
      setStudentAffiliates(exampleStudentAffiliates)
    } else {
      setStudentAffiliates(studentAffiliatesData)
    }
  }, [])

  const saveConfig = async () => {
    setLoading(true)
    try {
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      localStorage.setItem('affiliateConfig', JSON.stringify(config))
      toast.success('Configurações salvas com sucesso!')
    } catch (error) {
      toast.error('Erro ao salvar configurações')
    } finally {
      setLoading(false)
    }
  }

  const updateConfig = (field: keyof AffiliateConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }))
  }

  const updateTier = (tierId: number, field: keyof CommissionTier, value: any) => {
    setConfig(prev => ({
      ...prev,
      commissionTiers: prev.commissionTiers.map(tier =>
        tier.id === tierId ? { ...tier, [field]: value } : tier
      )
    }))
  }

  const deleteTier = (tierId: number) => {
    setConfig(prev => ({
      ...prev,
      commissionTiers: prev.commissionTiers.filter(tier => tier.id !== tierId)
    }))
    toast.success('Nível removido com sucesso!')
  }

  // Filtrar afiliados por termo de busca
  const filteredAffiliates = affiliates.filter(affiliate =>
    affiliate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    affiliate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    affiliate.affiliateCode.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredStudentAffiliates = studentAffiliates.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.affiliateCode.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Atualizar status do afiliado
  const updateAffiliateStatus = (affiliateId: number, newStatus: 'active' | 'inactive' | 'pending') => {
    const updatedAffiliates = affiliates.map(affiliate =>
      affiliate.id === affiliateId ? { ...affiliate, status: newStatus } : affiliate
    )
    setAffiliates(updatedAffiliates)
    
    // Atualizar no localStorage
    const savedAffiliates = JSON.parse(localStorage.getItem('affiliates') || '[]')
    const updatedSavedAffiliates = savedAffiliates.map((affiliate: any) =>
      affiliate.id === affiliateId ? { ...affiliate, status: newStatus } : affiliate
    )
    localStorage.setItem('affiliates', JSON.stringify(updatedSavedAffiliates))
    toast.success('Status do afiliado atualizado!')
  }

  // Calcular estatísticas
  const totalAffiliates = affiliates.length + studentAffiliates.length
  const activeAffiliates = affiliates.filter(a => a.status === 'active').length + studentAffiliates.length
  const totalEarnings = [...affiliates, ...studentAffiliates].reduce((sum, a) => sum + a.totalEarnings, 0)
  const pendingPayments = [...affiliates, ...studentAffiliates].reduce((sum, a) => sum + a.pendingEarnings, 0)

  const addNewTier = () => {
    if (!newTier.name || !newTier.commissionRate || newTier.minReferrals === undefined) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    const tier: CommissionTier = {
      id: Date.now(),
      name: newTier.name,
      minReferrals: newTier.minReferrals || 0,
      maxReferrals: newTier.maxReferrals || null,
      commissionRate: newTier.commissionRate || 0,
      description: newTier.description || ''
    }

    setConfig(prev => ({
      ...prev,
      commissionTiers: [...prev.commissionTiers, tier]
    }))

    setNewTier({})
    setShowNewTierForm(false)
    toast.success('Novo nível adicionado!')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Gestão de Afiliados</h2>
      </div>

      {/* Estatísticas Gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Afiliados</p>
              <p className="text-2xl font-bold text-gray-900">{totalAffiliates}</p>
            </div>
            <Users className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Afiliados Ativos</p>
              <p className="text-2xl font-bold text-green-600">{activeAffiliates}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Ganho</p>
              <p className="text-2xl font-bold text-purple-600">R$ {totalEarnings.toFixed(2)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pagamentos Pendentes</p>
              <p className="text-2xl font-bold text-orange-600">R$ {pendingPayments.toFixed(2)}</p>
            </div>
            <Award className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Navegação por Abas */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('config')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'config'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Configurações
            </button>
            <button
              onClick={() => setActiveTab('affiliates')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'affiliates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Afiliados ({affiliates.length})
            </button>
            <button
              onClick={() => setActiveTab('students')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'students'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Award className="w-4 h-4 inline mr-2" />
              Alunos Afiliados ({studentAffiliates.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'config' && (
            <div className="space-y-8">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Configurações de Afiliados</h3>
                  <p className="text-gray-600">Gerencie comissões e configurações do programa de afiliados</p>
                </div>
                <button
                  onClick={saveConfig}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Salvando...' : 'Salvar Configurações'}
                </button>
              </div>

      {/* Configurações Gerais */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configurações Gerais
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Comissão Padrão (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={config.defaultCommissionRate}
              onChange={(e) => updateConfig('defaultCommissionRate', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Valor Mínimo para Saque (R$)
            </label>
            <input
              type="number"
              min="0"
              value={config.paymentMinimum}
              onChange={(e) => updateConfig('paymentMinimum', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dia do Pagamento
            </label>
            <select
              value={config.paymentDay}
              onChange={(e) => updateConfig('paymentDay', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {Array.from({ length: 28 }, (_, i) => i + 1).map(day => (
                <option key={day} value={day}>Dia {day}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Aprovação Automática
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={config.autoApproval}
                onChange={(e) => updateConfig('autoApproval', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                {config.autoApproval ? 'Ativada' : 'Desativada'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Níveis de Comissão */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Níveis de Comissão
          </h3>
          <button
            onClick={() => setShowNewTierForm(true)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar Nível
          </button>
        </div>

        <div className="space-y-4">
          {config.commissionTiers.map((tier) => (
            <div key={tier.id} className="border border-gray-200 rounded-lg p-4">
              {editingTier === tier.id ? (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nome</label>
                    <input
                      type="text"
                      value={tier.name}
                      onChange={(e) => updateTier(tier.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Min. Indicações</label>
                    <input
                      type="number"
                      value={tier.minReferrals}
                      onChange={(e) => updateTier(tier.id, 'minReferrals', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Max. Indicações</label>
                    <input
                      type="number"
                      value={tier.maxReferrals || ''}
                      onChange={(e) => updateTier(tier.id, 'maxReferrals', e.target.value ? Number(e.target.value) : null)}
                      placeholder="Ilimitado"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Comissão (%)</label>
                    <input
                      type="number"
                      value={tier.commissionRate}
                      onChange={(e) => updateTier(tier.id, 'commissionRate', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <button
                      onClick={() => setEditingTier(null)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm flex items-center gap-1"
                    >
                      <Save className="w-3 h-3" />
                      Salvar
                    </button>
                    <button
                      onClick={() => setEditingTier(null)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900">{tier.name}</h4>
                      <p className="text-sm text-gray-600">{tier.description}</p>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">
                        {tier.minReferrals} - {tier.maxReferrals || '∞'} indicações
                      </span>
                    </div>
                    <div className="text-lg font-bold text-green-600">
                      {tier.commissionRate}%
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingTier(tier.id)}
                      className="p-2 text-gray-600 hover:text-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteTier(tier.id)}
                      className="p-2 text-gray-600 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Formulário para novo nível */}
        {showNewTierForm && (
          <div className="mt-6 border-t pt-6">
            <h4 className="font-medium text-gray-900 mb-4">Adicionar Novo Nível</h4>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Nome *</label>
                <input
                  type="text"
                  value={newTier.name || ''}
                  onChange={(e) => setNewTier(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  placeholder="Ex: Expert"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Min. Indicações *</label>
                <input
                  type="number"
                  value={newTier.minReferrals || ''}
                  onChange={(e) => setNewTier(prev => ({ ...prev, minReferrals: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Max. Indicações</label>
                <input
                  type="number"
                  value={newTier.maxReferrals || ''}
                  onChange={(e) => setNewTier(prev => ({ ...prev, maxReferrals: e.target.value ? Number(e.target.value) : null }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  placeholder="Deixe vazio para ilimitado"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Comissão (%) *</label>
                <input
                  type="number"
                  value={newTier.commissionRate || ''}
                  onChange={(e) => setNewTier(prev => ({ ...prev, commissionRate: Number(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                />
              </div>
              <div className="flex items-end gap-2">
                <button
                  onClick={addNewTier}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  Adicionar
                </button>
                <button
                  onClick={() => {
                    setShowNewTierForm(false)
                    setNewTier({})
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            </div>
            <div className="mt-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">Descrição</label>
              <input
                type="text"
                value={newTier.description || ''}
                onChange={(e) => setNewTier(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                placeholder="Descrição do nível"
              />
            </div>
          </div>
        )}
      </div>

            </div>
          )}

          {activeTab === 'affiliates' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Lista de Afiliados</h3>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="Buscar afiliados..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Afiliado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Indicações</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ganhos</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAffiliates.map((affiliate) => (
                      <tr key={affiliate.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-blue-600">
                                  {affiliate.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{affiliate.name}</div>
                              <div className="text-sm text-gray-500">{affiliate.email}</div>
                              {affiliate.phone && (
                                <div className="text-xs text-gray-400 flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  {affiliate.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                            {affiliate.affiliateCode}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {affiliate.totalReferrals}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">R$ {affiliate.totalEarnings.toFixed(2)}</div>
                          <div className="text-xs text-orange-600">Pendente: R$ {affiliate.pendingEarnings.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={affiliate.status}
                            onChange={(e) => updateAffiliateStatus(affiliate.id, e.target.value as 'active' | 'inactive' | 'pending')}
                            className={`text-xs font-medium px-2 py-1 rounded ${
                              affiliate.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : affiliate.status === 'inactive'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            <option value="active">Ativo</option>
                            <option value="inactive">Inativo</option>
                            <option value="pending">Pendente</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedAffiliate(affiliate)
                              setShowAffiliateModal(true)
                            }}
                            className="text-blue-600 hover:text-blue-900 flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            Ver Detalhes
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredAffiliates.length === 0 && (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum afiliado encontrado</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'students' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Alunos que se tornaram Afiliados</h3>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="Buscar alunos afiliados..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aluno</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Indicações</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ganhos</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Afiliado desde</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredStudentAffiliates.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                <span className="text-sm font-medium text-purple-600">
                                  {student.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-500">{student.email}</div>
                              <div className="text-xs text-purple-600 flex items-center gap-1">
                                <Award className="w-3 h-3" />
                                Aluno Afiliado
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded">
                            {student.affiliateCode}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {student.totalReferrals}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">R$ {student.totalEarnings.toFixed(2)}</div>
                          <div className="text-xs text-orange-600">Pendente: R$ {student.pendingEarnings.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(student.becameAffiliateAt).toLocaleDateString('pt-BR')}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredStudentAffiliates.length === 0 && (
                <div className="text-center py-8">
                  <Award className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Nenhum aluno afiliado encontrado</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AffiliateSettings