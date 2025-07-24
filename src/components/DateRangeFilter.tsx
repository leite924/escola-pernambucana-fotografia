import { useState } from 'react'
import { Calendar, Filter } from 'lucide-react'

interface DateRangeFilterProps {
  selectedPeriod: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom'
  startDate: string
  endDate: string
  onPeriodChange: (period: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom') => void
  onDateChange: (dateRange: { startDate: string; endDate: string }) => void
  className?: string
}

const DateRangeFilter = ({ 
  selectedPeriod, 
  startDate, 
  endDate, 
  onPeriodChange, 
  onDateChange, 
  className = '' 
}: DateRangeFilterProps) => {
  const [showCustomDates, setShowCustomDates] = useState(selectedPeriod === 'custom')

  function getDefaultStartDate(period: string): string {
    const now = new Date()
    switch (period) {
      case 'today':
        return now.toISOString().split('T')[0]
      case 'week':
        const weekStart = new Date(now)
        weekStart.setDate(now.getDate() - now.getDay())
        return weekStart.toISOString().split('T')[0]
      case 'month':
        return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
      case 'quarter':
        const quarterStart = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
        return quarterStart.toISOString().split('T')[0]
      case 'year':
        return new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0]
      default:
        return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
    }
  }

  function getDefaultEndDate(): string {
    return new Date().toISOString().split('T')[0]
  }

  const handlePeriodChange = (period: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom') => {
    onPeriodChange(period)
    
    if (period === 'custom') {
      setShowCustomDates(true)
      return
    }
    
    setShowCustomDates(false)
    const newStartDate = getDefaultStartDate(period)
    const newEndDate = getDefaultEndDate()
    
    onDateChange({ startDate: newStartDate, endDate: newEndDate })
  }

  const handleCustomDateChange = (newStartDate: string, newEndDate: string) => {
    onDateChange({ startDate: newStartDate, endDate: newEndDate })
  }

  const periods: Array<{ id: 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom'; label: string }> = [
    { id: 'today', label: 'Hoje' },
    { id: 'week', label: 'Esta Semana' },
    { id: 'month', label: 'Este Mês' },
    { id: 'quarter', label: 'Este Trimestre' },
    { id: 'year', label: 'Este Ano' },
    { id: 'custom', label: 'Período Personalizado' }
  ]

  return (
    <div className={`bg-white p-4 rounded-lg shadow border ${className}`}>
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Período:</span>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {periods.map((period) => (
            <button
              key={period.id}
              onClick={() => handlePeriodChange(period.id)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedPeriod === period.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
        
        {(showCustomDates || selectedPeriod === 'custom') && (
          <div className="flex items-center space-x-2 ml-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                if (selectedPeriod === 'custom') {
                  handleCustomDateChange(e.target.value, endDate)
                }
              }}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="text-gray-500 text-sm">até</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                if (selectedPeriod === 'custom') {
                  handleCustomDateChange(startDate, e.target.value)
                }
              }}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default DateRangeFilter