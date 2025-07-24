import { useState, useEffect } from 'react'
import { CreditCard, FileText, Eye, Download, RefreshCw, CheckCircle, XCircle, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { asaasService } from '../services/asaasService'
import { nfseService } from '../services/nfseService'
import DateRangeFilter from './DateRangeFilter'

interface Payment {
  id: string
  customer: {
    name: string
    email: string
  }
  value: number
  status: 'PENDING' | 'RECEIVED' | 'CONFIRMED' | 'OVERDUE' | 'REFUNDED'
  billingType: 'CREDIT_CARD' | 'PIX' | 'BOLETO'
  dueDate: string
  description: string
  invoiceUrl?: string
  bankSlipUrl?: string
  pixQrCode?: string
  nfse?: {
    numero: string
    link: string
    emitida: boolean
  }
}

const PaymentManagement = () => {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'overdue'>('all')
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom'>('month')

  useEffect(() => {
    loadPayments()
  }, [])

  const loadPayments = async () => {
    try {
      setLoading(true)
      // Simular dados de pagamento para demonstração
      const mockPayments: Payment[] = [
        {
          id: '1',
          customer: { name: 'João Silva', email: 'joao@email.com' },
          value: 299.90,
          status: 'CONFIRMED',
          billingType: 'CREDIT_CARD',
          dueDate: '2024-01-15',
          description: 'Curso: Fotografia Básica',
          nfse: { numero: '001', link: '#', emitida: true }
        },
        {
          id: '2',
          customer: { name: 'Maria Santos', email: 'maria@email.com' },
          value: 499.90,
          status: 'PENDING',
          billingType: 'PIX',
          dueDate: '2024-01-20',
          description: 'Curso: Retrato Profissional'
        }
      ]
      setPayments(mockPayments)
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error)
      toast.error('Erro ao carregar pagamentos')
    } finally {
      setLoading(false)
    }
  }

  const refreshPaymentStatus = async (paymentId: string) => {
    try {
      toast.success('Status atualizado')
    } catch (error) {
      toast.error('Erro ao atualizar status')
    }
  }

  const emitirNFSe = async (payment: Payment) => {
    try {
      const dadosAluno = {
        nome: payment.customer.name,
        email: payment.customer.email,
        cpf: '000.000.000-00'
      }

      const dadosCurso = {
        titulo: payment.description.replace('Curso: ', '')
      }

      // Simular emissão de NFSe
      setPayments(prev => 
        prev.map(p => 
          p.id === payment.id 
            ? { 
                ...p, 
                nfse: {
                  numero: `NFSe-${Date.now()}`,
                  link: '#',
                  emitida: true
                }
              } 
            : p
        )
      )

      toast.success('NFSe emitida com sucesso!')
    } catch (error: any) {
      console.error('Erro ao emitir NFSe:', error)
      toast.error(error.message || 'Erro ao emitir NFSe')
    }
  }

  const downloadNFSe = async (nfseNumero: string) => {
    try {
      toast.success('Download da NFSe iniciado')
    } catch (error) {
      toast.error('Erro ao baixar NFSe')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
      case 'RECEIVED':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'OVERDUE':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'Confirmado'
      case 'RECEIVED':
        return 'Recebido'
      case 'PENDING':
        return 'Pendente'
      case 'OVERDUE':
        return 'Vencido'
      case 'REFUNDED':
        return 'Reembolsado'
      default:
        return status
    }
  }

  const getBillingTypeText = (type: string) => {
    switch (type) {
      case 'CREDIT_CARD':
        return 'Cartão de Crédito'
      case 'PIX':
        return 'PIX'
      case 'BOLETO':
        return 'Boleto'
      default:
        return type
    }
  }

  const filteredPayments = payments.filter(payment => {
    // Status filter
    if (filter === 'pending' && payment.status !== 'PENDING') return false
    if (filter === 'confirmed' && !['CONFIRMED', 'RECEIVED'].includes(payment.status)) return false
    if (filter === 'overdue' && payment.status !== 'OVERDUE') return false
    
    // Date range filter
    const paymentDate = new Date(payment.dueDate)
    const startDate = new Date(dateRange.startDate)
    const endDate = new Date(dateRange.endDate)
    if (paymentDate < startDate || paymentDate > endDate) return false
    
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Carregando pagamentos...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gerenciamento de Pagamentos</h2>
        <button
          onClick={loadPayments}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Atualizar</span>
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

      {/* Status Filters */}
      <div className="flex space-x-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'pending'
              ? 'bg-yellow-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Pendentes
        </button>
        <button
          onClick={() => setFilter('confirmed')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'confirmed'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Confirmados
        </button>
        <button
          onClick={() => setFilter('overdue')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'overdue'
              ? 'bg-red-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Vencidos
        </button>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Curso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Método
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Vencimento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NFSe
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {payment.customer.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {payment.customer.email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.description.replace('Curso: ', '')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    R$ {payment.value.toFixed(2).replace('.', ',')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {getBillingTypeText(payment.billingType)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(payment.status)}
                      <span className="text-sm text-gray-900">
                        {getStatusText(payment.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(payment.dueDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.nfse?.emitida ? (
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600">Emitida</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Não emitida</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => refreshPaymentStatus(payment.id)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Atualizar status"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                    
                    {['CONFIRMED', 'RECEIVED'].includes(payment.status) && !payment.nfse?.emitida && (
                      <button
                        onClick={() => emitirNFSe(payment)}
                        className="text-green-600 hover:text-green-900"
                        title="Emitir NFSe"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                    )}
                    
                    {payment.nfse?.emitida && (
                      <button
                        onClick={() => downloadNFSe(payment.nfse!.numero)}
                        className="text-purple-600 hover:text-purple-900"
                        title="Baixar NFSe"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    )}
                    
                    {payment.bankSlipUrl && (
                      <a
                        href={payment.bankSlipUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:text-orange-900"
                        title="Ver boleto"
                      >
                        <Eye className="h-4 w-4" />
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredPayments.length === 0 && (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Nenhum pagamento encontrado</p>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Pagamentos</p>
              <p className="text-2xl font-semibold text-gray-900">{payments.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Confirmados</p>
              <p className="text-2xl font-semibold text-gray-900">
                {payments.filter(p => ['CONFIRMED', 'RECEIVED'].includes(p.status)).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pendentes</p>
              <p className="text-2xl font-semibold text-gray-900">
                {payments.filter(p => p.status === 'PENDING').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">NFSes Emitidas</p>
              <p className="text-2xl font-semibold text-gray-900">
                {payments.filter(p => p.nfse?.emitida).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentManagement