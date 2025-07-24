import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, DollarSign, FileText, Download } from 'lucide-react'
import { toast } from 'sonner'
import { asaasService } from '../services/asaasService'
import { nfseService } from '../services/nfseService'
import DateRangeFilter from './DateRangeFilter'

interface ReportData {
  totalRevenue: number
  totalPayments: number
  confirmedPayments: number
  pendingPayments: number
  overduePayments: number
  nfseEmitted: number
  monthlyRevenue: { month: string; revenue: number }[]
  paymentMethods: { method: string; count: number; total: number }[]
}

const FinancialReports = () => {
  const [reportData, setReportData] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom'>('month')

  useEffect(() => {
    loadReportData()
  }, [dateRange])

  const loadReportData = async () => {
    try {
      setLoading(true)
      
      // Simular dados de relatório (em produção, viria da API)
      const mockData: ReportData = {
        totalRevenue: 15750.00,
        totalPayments: 25,
        confirmedPayments: 18,
        pendingPayments: 5,
        overduePayments: 2,
        nfseEmitted: 16,
        monthlyRevenue: [
          { month: 'Jan', revenue: 3200 },
          { month: 'Fev', revenue: 4100 },
          { month: 'Mar', revenue: 3800 },
          { month: 'Abr', revenue: 4650 }
        ],
        paymentMethods: [
          { method: 'Cartão de Crédito', count: 12, total: 8400 },
          { method: 'PIX', count: 8, total: 5600 },
          { method: 'Boleto', count: 5, total: 1750 }
        ]
      }
      
      setReportData(mockData)
    } catch (error) {
      console.error('Erro ao carregar relatórios:', error)
      toast.error('Erro ao carregar relatórios')
    } finally {
      setLoading(false)
    }
  }

  const exportReport = async (format: 'pdf' | 'excel') => {
    try {
      toast.success(`Relatório ${format.toUpperCase()} será baixado em breve`)
      // Implementar exportação real
    } catch (error) {
      toast.error('Erro ao exportar relatório')
    }
  }

  const generateTaxReport = async () => {
    try {
      toast.success('Relatório fiscal gerado com sucesso')
      // Implementar geração de relatório fiscal
    } catch (error) {
      toast.error('Erro ao gerar relatório fiscal')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Carregando relatórios...</span>
      </div>
    )
  }

  if (!reportData) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">Nenhum dado encontrado</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Relatórios Financeiros</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => exportReport('pdf')}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => exportReport('excel')}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Excel</span>
          </button>
          <button
            onClick={generateTaxReport}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <FileText className="h-4 w-4" />
            <span>Relatório Fiscal</span>
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Receita Total</p>
              <p className="text-2xl font-semibold text-gray-900">
                R$ {reportData.totalRevenue.toFixed(2).replace('.', ',')}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total de Pagamentos</p>
              <p className="text-2xl font-semibold text-gray-900">{reportData.totalPayments}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Taxa de Conversão</p>
              <p className="text-2xl font-semibold text-gray-900">
                {((reportData.confirmedPayments / reportData.totalPayments) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FileText className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">NFSes Emitidas</p>
              <p className="text-2xl font-semibold text-gray-900">{reportData.nfseEmitted}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Receita Mensal</h3>
          <div className="space-y-4">
            {reportData.monthlyRevenue.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.month}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${(item.revenue / Math.max(...reportData.monthlyRevenue.map(r => r.revenue))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    R$ {item.revenue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Métodos de Pagamento</h3>
          <div className="space-y-4">
            {reportData.paymentMethods.map((method, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-900">{method.method}</span>
                  <p className="text-xs text-gray-500">{method.count} transações</p>
                </div>
                <span className="text-sm font-semibold text-gray-900">
                  R$ {method.total.toFixed(2).replace('.', ',')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Status */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Status dos Pagamentos</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{reportData.confirmedPayments}</p>
            <p className="text-sm text-green-700">Confirmados</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">{reportData.pendingPayments}</p>
            <p className="text-sm text-yellow-700">Pendentes</p>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">{reportData.overduePayments}</p>
            <p className="text-sm text-red-700">Vencidos</p>
          </div>
        </div>
      </div>

      {/* Tax Information */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações Fiscais</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">NFSe - Recife</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">NFSes Emitidas:</span>
                <span className="font-medium">{reportData.nfseEmitted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">ISS (5%):</span>
                <span className="font-medium">R$ {(reportData.totalRevenue * 0.05).toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Base de Cálculo:</span>
                <span className="font-medium">R$ {reportData.totalRevenue.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Impostos</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Simples Nacional:</span>
                <span className="font-medium text-green-600">Ativo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Alíquota Efetiva:</span>
                <span className="font-medium">6,5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total de Impostos:</span>
                <span className="font-medium">R$ {(reportData.totalRevenue * 0.065).toFixed(2).replace('.', ',')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FinancialReports