import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, DollarSign, Calendar, Plus, Download, Eye } from 'lucide-react'
import DateRangeFilter from './DateRangeFilter'

interface CashFlowEntry {
  id: string
  type: 'income' | 'expense'
  amount: number
  category: string
  description: string
  date: string
  recurring?: boolean
  attachment?: string
}

interface CashFlowProjection {
  month: string
  optimistic: number
  realistic: number
  pessimistic: number
  actual?: number
}

const CashFlow = () => {
  const [entries, setEntries] = useState<CashFlowEntry[]>([])
  const [filteredEntries, setFilteredEntries] = useState<CashFlowEntry[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [currentBalance, setCurrentBalance] = useState(0)
  const [projections, setProjections] = useState<CashFlowProjection[]>([])
  const [selectedView, setSelectedView] = useState<'dashboard' | 'entries' | 'projections'>('dashboard')
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom'>('month')

  // Mock data para demonstração
  useEffect(() => {
    const mockEntries: CashFlowEntry[] = [
      {
        id: '1',
        type: 'income',
        amount: 15000,
        category: 'Matrículas',
        description: 'Curso Fotografia Digital - Janeiro',
        date: '2024-01-15',
        recurring: true
      },
      {
        id: '2',
        type: 'expense',
        amount: 3500,
        category: 'Equipamentos',
        description: 'Câmeras para aulas práticas',
        date: '2024-01-10'
      },
      {
        id: '3',
        type: 'income',
        amount: 8500,
        category: 'Workshops',
        description: 'Workshop Retrato Profissional',
        date: '2024-01-20'
      }
    ]

    const mockProjections: CashFlowProjection[] = [
      { month: 'Fev/2024', optimistic: 25000, realistic: 20000, pessimistic: 15000 },
      { month: 'Mar/2024', optimistic: 30000, realistic: 25000, pessimistic: 18000 },
      { month: 'Abr/2024', optimistic: 28000, realistic: 23000, pessimistic: 17000 }
    ]

    setEntries(mockEntries)
    setFilteredEntries(mockEntries)
    setProjections(mockProjections)
    
    // Calcular saldo atual
    const balance = mockEntries.reduce((acc, entry) => {
      return entry.type === 'income' ? acc + entry.amount : acc - entry.amount
    }, 50000) // Saldo inicial fictício
    
    setCurrentBalance(balance)
  }, [])

  const handleDateRangeChange = (newDateRange: { startDate: string; endDate: string }) => {
    setDateRange(newDateRange)
    const filtered = entries.filter(entry => {
      const entryDate = new Date(entry.date)
      const start = new Date(newDateRange.startDate)
      const end = new Date(newDateRange.endDate)
      return entryDate >= start && entryDate <= end
    })
    setFilteredEntries(filtered)
  }

  const totalIncome = filteredEntries
    .filter(entry => entry.type === 'income')
    .reduce((sum, entry) => sum + entry.amount, 0)

  const totalExpenses = filteredEntries
    .filter(entry => entry.type === 'expense')
    .reduce((sum, entry) => sum + entry.amount, 0)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const DashboardView = () => (
    <div className="space-y-6">
      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Saldo Atual</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(currentBalance)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receitas</p>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Despesas</p>
              <p className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</p>
            </div>
            <TrendingDown className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Resultado</p>
              <p className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(totalIncome - totalExpenses)}
              </p>
            </div>
            <TrendingUp className={`h-8 w-8 ${totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`} />
          </div>
        </div>
      </div>

      {/* Gráfico de Tendência */}
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold mb-4">Tendência de Fluxo de Caixa</h3>
        <div className="h-64 flex items-end justify-around bg-gray-50 rounded p-4">
          {projections.map((proj, index) => (
            <div key={index} className="flex flex-col items-center space-y-2">
              <div className="flex space-x-1">
                <div 
                  className="w-4 bg-green-400 rounded-t" 
                  style={{ height: `${(proj.optimistic / 30000) * 150}px` }}
                  title={`Otimista: ${formatCurrency(proj.optimistic)}`}
                />
                <div 
                  className="w-4 bg-blue-500 rounded-t" 
                  style={{ height: `${(proj.realistic / 30000) * 150}px` }}
                  title={`Realista: ${formatCurrency(proj.realistic)}`}
                />
                <div 
                  className="w-4 bg-red-400 rounded-t" 
                  style={{ height: `${(proj.pessimistic / 30000) * 150}px` }}
                  title={`Pessimista: ${formatCurrency(proj.pessimistic)}`}
                />
              </div>
              <span className="text-xs text-gray-600">{proj.month}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-center space-x-4 mt-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-400 rounded"></div>
            <span>Otimista</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Realista</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-400 rounded"></div>
            <span>Pessimista</span>
          </div>
        </div>
      </div>
    </div>
  )

  const EntriesView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Lançamentos</h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Lançamento</span>
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoria</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEntries.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(entry.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      entry.type === 'income' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {entry.type === 'income' ? 'Receita' : 'Despesa'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{entry.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{entry.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={entry.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                      {entry.type === 'income' ? '+' : '-'}{formatCurrency(entry.amount)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-900 mr-2">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

  const ProjectionsView = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Projeções de Fluxo de Caixa</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {projections.map((proj, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow border">
            <h4 className="font-semibold text-gray-900 mb-4">{proj.month}</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cenário Otimista:</span>
                <span className="font-medium text-green-600">{formatCurrency(proj.optimistic)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cenário Realista:</span>
                <span className="font-medium text-blue-600">{formatCurrency(proj.realistic)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Cenário Pessimista:</span>
                <span className="font-medium text-red-600">{formatCurrency(proj.pessimistic)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Fluxo de Caixa</h2>
        <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
          <Download className="h-4 w-4" />
          <span>Exportar Relatório</span>
        </button>
      </div>

      {/* Filtros de Data */}
      <DateRangeFilter
        selectedPeriod={selectedPeriod}
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        onPeriodChange={setSelectedPeriod}
        onDateChange={handleDateRangeChange}
      />

      {/* Navegação */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'entries', label: 'Lançamentos' },
          { id: 'projections', label: 'Projeções' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedView(tab.id as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedView === tab.id
                ? 'bg-white text-blue-600 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      {selectedView === 'dashboard' && <DashboardView />}
      {selectedView === 'entries' && <EntriesView />}
      {selectedView === 'projections' && <ProjectionsView />}
    </div>
  )
}

export default CashFlow