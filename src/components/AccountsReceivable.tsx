import { useState, useEffect } from 'react'
import { Calendar, DollarSign, FileText, Plus, Search, Filter, Download, Edit, Trash2, Check, X, CreditCard, QrCode, Settings } from 'lucide-react'
import { toast } from 'sonner'
import { asaasService } from '../services/asaasService'
import { CategoryManager } from './CategoryManager'
import DateRangeFilter from './DateRangeFilter'

interface AccountReceivable {
  id: number
  studentName: string
  studentEmail: string
  course: string
  amount: number
  dueDate: string
  status: 'pending' | 'paid' | 'overdue' | 'cancelled'
  paymentMethod?: 'credit_card' | 'pix' | 'boleto' | 'manual'
  asaasPaymentId?: string
  paymentDate?: string
  notes?: string
  source: 'asaas' | 'manual'
  categoryId: number
  subcategoryId?: number
}

const AccountsReceivable = () => {
  const [accounts, setAccounts] = useState<AccountReceivable[]>([
    {
      id: 1,
      studentName: 'João Silva',
      studentEmail: 'joao@email.com',
      course: 'Fotografia Digital Básica',
      amount: 299.90,
      dueDate: '2024-01-15',
      status: 'paid',
      paymentMethod: 'credit_card',
      paymentDate: '2024-01-10',
      source: 'asaas',
      categoryId: 1,
      subcategoryId: 1
    },
    {
      id: 2,
      studentName: 'Maria Santos',
      studentEmail: 'maria@email.com',
      course: 'Fotografia Avançada',
      amount: 499.90,
      dueDate: '2024-01-20',
      status: 'pending',
      source: 'manual',
      categoryId: 1,
      subcategoryId: 2
    }
  ])
  
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAccount, setEditingAccount] = useState<AccountReceivable | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [showCategoryManager, setShowCategoryManager] = useState(false)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom'>('month')
  
  const [formData, setFormData] = useState({
    studentName: '',
    studentEmail: '',
    course: '',
    amount: '',
    dueDate: '',
    categoryId: 0,
    subcategoryId: 0,
    notes: ''
  })

  const courses = [
    'Fotografia Digital Básica',
    'Fotografia Avançada',
    'Fotografia de Retrato',
    'Fotografia de Paisagem',
    'Edição e Pós-produção'
  ]

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.studentEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.course.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || account.status === statusFilter
    const matchesSource = sourceFilter === 'all' || account.source === sourceFilter
    
    // Date range filter
    const accountDate = new Date(account.dueDate)
    const startDate = new Date(dateRange.startDate)
    const endDate = new Date(dateRange.endDate)
    const matchesDate = accountDate >= startDate && accountDate <= endDate
    
    return matchesSearch && matchesStatus && matchesSource && matchesDate
  })

  const totalPending = accounts
    .filter(acc => acc.status === 'pending')
    .reduce((sum, acc) => sum + acc.amount, 0)

  const totalReceived = accounts
    .filter(acc => acc.status === 'paid')
    .reduce((sum, acc) => sum + acc.amount, 0)

  const totalOverdue = accounts
    .filter(acc => acc.status === 'overdue')
    .reduce((sum, acc) => sum + acc.amount, 0)

  // Sincronizar com pagamentos do Asaas
  const syncAsaasPayments = async () => {
    try {
      // Simular sincronização com Asaas - implementar quando API estiver disponível
      const mockAsaasPayments = [
        {
          id: 1001,
          studentName: 'Cliente Asaas 1',
          studentEmail: 'cliente1@asaas.com',
          course: 'Fotografia Digital Básica',
          amount: 299.90,
          dueDate: '2024-01-25',
          status: 'paid' as const,
          paymentMethod: 'credit_card' as const,
          asaasPaymentId: 'asaas_001',
          paymentDate: '2024-01-20',
          source: 'asaas' as const,
          categoryId: 1,
          subcategoryId: 1
        }
      ]
      
      // Atualizar apenas contas do Asaas
      setAccounts(prev => [
        ...prev.filter(acc => acc.source === 'manual'),
        ...mockAsaasPayments
      ])
      
      toast.success('Pagamentos sincronizados com sucesso!')
    } catch (error) {
      console.error('Erro ao sincronizar pagamentos:', error)
      toast.error('Erro ao sincronizar com Asaas')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const accountData = {
      ...formData,
      amount: parseFloat(formData.amount),
      status: 'pending' as const,
      source: 'manual' as const
    }

    if (editingAccount) {
      setAccounts(prev => prev.map(acc => 
        acc.id === editingAccount.id 
          ? { ...acc, ...accountData }
          : acc
      ))
      toast.success('Conta atualizada com sucesso!')
      setEditingAccount(null)
    } else {
      const newAccount: AccountReceivable = {
        id: Date.now(),
        ...accountData
      }
      setAccounts(prev => [...prev, newAccount])
      toast.success('Conta adicionada com sucesso!')
    }
    
    setFormData({
      studentName: '',
      studentEmail: '',
      course: '',
      amount: '',
      dueDate: '',
      categoryId: 0,
      subcategoryId: 0,
      notes: ''
    })
    setShowAddForm(false)
  }

  const handleEdit = (account: AccountReceivable) => {
    if (account.source === 'asaas') {
      toast.error('Contas do Asaas não podem ser editadas manualmente')
      return
    }
    
    setEditingAccount(account)
    setFormData({
      studentName: account.studentName,
      studentEmail: account.studentEmail,
      course: account.course,
      amount: account.amount.toString(),
      dueDate: account.dueDate,
      categoryId: account.categoryId,
      subcategoryId: account.subcategoryId || 0,
      notes: account.notes || ''
    })
    setShowAddForm(true)
  }

  const handleDelete = (id: number) => {
    const account = accounts.find(acc => acc.id === id)
    if (account?.source === 'asaas') {
      toast.error('Contas do Asaas não podem ser excluídas')
      return
    }
    
    if (confirm('Tem certeza que deseja excluir esta conta?')) {
      setAccounts(prev => prev.filter(acc => acc.id !== id))
      toast.success('Conta excluída com sucesso!')
    }
  }

  const handleMarkAsPaid = (id: number) => {
    const account = accounts.find(acc => acc.id === id)
    if (account?.source === 'asaas') {
      toast.error('Use o painel do Asaas para confirmar pagamentos')
      return
    }
    
    setAccounts(prev => prev.map(acc => 
      acc.id === id 
        ? { 
            ...acc, 
            status: 'paid' as const, 
            paymentDate: new Date().toISOString().split('T')[0],
            paymentMethod: 'manual' as const
          }
        : acc
    ))
    toast.success('Pagamento registrado com sucesso!')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100'
      case 'overdue': return 'text-red-600 bg-red-100'
      case 'cancelled': return 'text-gray-600 bg-gray-100'
      default: return 'text-yellow-600 bg-yellow-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Pago'
      case 'overdue': return 'Vencido'
      case 'cancelled': return 'Cancelado'
      default: return 'Pendente'
    }
  }

  const getPaymentMethodIcon = (method?: string) => {
    switch (method) {
      case 'credit_card': return <CreditCard className="h-4 w-4" />
      case 'pix': return <QrCode className="h-4 w-4" />
      case 'boleto': return <FileText className="h-4 w-4" />
      default: return <DollarSign className="h-4 w-4" />
    }
  }

  const getPaymentMethodText = (method?: string) => {
    switch (method) {
      case 'credit_card': return 'Cartão'
      case 'pix': return 'PIX'
      case 'boleto': return 'Boleto'
      case 'manual': return 'Manual'
      default: return 'N/A'
    }
  }

  const handleCategorySelect = (categoryId: number, subcategoryId?: number) => {
    setFormData(prev => ({
      ...prev,
      categoryId,
      subcategoryId: subcategoryId || 0
    }))
    setShowCategoryManager(false)
  }

  return (
    <div className="space-y-6">
      {/* Category Manager */}
      {showCategoryManager && (
        <CategoryManager
          type="receivable"
          onCategorySelect={handleCategorySelect}
          selectedCategoryId={formData.categoryId}
          selectedSubcategoryId={formData.subcategoryId}
          onClose={() => setShowCategoryManager(false)}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Contas a Receber</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowCategoryManager(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Settings className="h-4 w-4" />
            <span>Categorias</span>
          </button>
          <button
            onClick={syncAsaasPayments}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Sincronizar Asaas</span>
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="h-4 w-4" />
            <span>Nova Conta</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">A Receber</p>
              <p className="text-2xl font-bold text-yellow-600">R$ {totalPending.toFixed(2)}</p>
            </div>
            <Calendar className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Recebido</p>
              <p className="text-2xl font-bold text-green-600">R$ {totalReceived.toFixed(2)}</p>
            </div>
            <Check className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Vencido</p>
              <p className="text-2xl font-bold text-red-600">R$ {totalOverdue.toFixed(2)}</p>
            </div>
            <X className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Contas</p>
              <p className="text-2xl font-bold text-blue-600">{accounts.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
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

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar por aluno, email ou curso..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos os Status</option>
              <option value="pending">Pendente</option>
              <option value="paid">Pago</option>
              <option value="overdue">Vencido</option>
              <option value="cancelled">Cancelado</option>
            </select>
            
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas as Origens</option>
              <option value="asaas">Asaas</option>
              <option value="manual">Manual</option>
            </select>
          </div>
        </div>
      </div>

      {/* Accounts Table */}
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
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vencimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pagamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Origem
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAccounts.map((account) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{account.studentName}</div>
                      <div className="text-sm text-gray-500">{account.studentEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {account.course}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    R$ {account.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(account.dueDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(account.status)}`}>
                      {getStatusText(account.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      {getPaymentMethodIcon(account.paymentMethod)}
                      <span className="text-sm text-gray-900">
                        {getPaymentMethodText(account.paymentMethod)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      account.source === 'asaas' ? 'text-blue-600 bg-blue-100' : 'text-gray-600 bg-gray-100'
                    }`}>
                      {account.source === 'asaas' ? 'Asaas' : 'Manual'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {account.status === 'pending' && account.source === 'manual' && (
                        <button
                          onClick={() => handleMarkAsPaid(account.id)}
                          className="text-green-600 hover:text-green-900"
                          title="Marcar como pago"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                      {account.source === 'manual' && (
                        <>
                          <button
                            onClick={() => handleEdit(account)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(account.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingAccount ? 'Editar Conta' : 'Nova Conta a Receber'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingAccount(null)
                    setFormData({
                      studentName: '',
                      studentEmail: '',
                      course: '',
                      amount: '',
                      dueDate: '',
                      categoryId: 0,
                      subcategoryId: 0,
                      notes: ''
                    })
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Aluno
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email do Aluno
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.studentEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, studentEmail: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Curso
                  </label>
                  <select
                    required
                    value={formData.course}
                    onChange={(e) => setFormData(prev => ({ ...prev, course: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Selecione um curso</option>
                    {courses.map(course => (
                      <option key={course} value={course}>{course}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Vencimento
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria e Subcategoria
                  </label>
                  <div className="text-sm text-gray-600 mb-2">
                    {formData.categoryId > 0 ? (
                      <span>
                        Categoria: {formData.categoryId}
                        {formData.subcategoryId > 0 && (
                          <span> | Subcategoria: {formData.subcategoryId}</span>
                        )}
                      </span>
                    ) : (
                      <span className="text-red-500">Selecione uma categoria usando o botão "Categorias" acima</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowCategoryManager(true)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-left text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {formData.categoryId > 0 ? 'Alterar Categoria' : 'Selecionar Categoria'}
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Observações adicionais..."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingAccount(null)
                      setFormData({
                        studentName: '',
                        studentEmail: '',
                        course: '',
                        amount: '',
                        dueDate: '',
                        categoryId: 0,
                        subcategoryId: 0,
                        notes: ''
                      })
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingAccount ? 'Atualizar' : 'Adicionar'}
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

export default AccountsReceivable