import { useState } from 'react'
import { ShoppingCart, Calendar, Clock, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

interface Course {
  id: number
  title: string
  description: string
  price: number
  originalPrice?: number
  duration: string
  students: number
  rating: number
  instructor: string
  level: string
  category: string
  modules: number
  image: string
  features: string[]
  curriculum: {
    module: string
    lessons: string[]
  }[]
  shifts: ('manhã' | 'tarde' | 'noite' | 'sábado')[]
}

interface ClassSchedule {
  id: string
  courseId: number
  courseName: string
  shift: 'manhã' | 'tarde' | 'noite' | 'sábado'
  startDate: string
  endDate: string
  schedule: string
  maxStudents: number
  enrolledStudents: number
  instructor: string
  status: 'active' | 'inactive' | 'completed' | 'cancelled'
}

interface ClassSelectorProps {
  course: Course
  onAddToCart: (classSchedule: ClassSchedule, course: Course) => void
}

const ClassSelector = ({ course, onAddToCart }: ClassSelectorProps) => {
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedShift, setSelectedShift] = useState('')
  const navigate = useNavigate()

  const months = [
    { value: '03', label: 'Março 2024' },
    { value: '04', label: 'Abril 2024' },
    { value: '05', label: 'Maio 2024' },
    { value: '06', label: 'Junho 2024' },
    { value: '07', label: 'Julho 2024' },
    { value: '08', label: 'Agosto 2024' }
  ]

  const shifts = [
    { value: 'manhã', label: 'Manhã (9h às 12h)', icon: '🌅' },
    { value: 'tarde', label: 'Tarde (14h às 17h)', icon: '☀️' },
    { value: 'noite', label: 'Noite (19h às 22h)', icon: '🌙' },
    { value: 'sábado', label: 'Sábado (8h às 17h)', icon: '📅' }
  ]

  const handleAddToCart = () => {
    if (!selectedMonth || !selectedShift) {
      toast.error('Por favor, selecione o mês e o turno')
      return
    }

    // Criar uma turma baseada na seleção
    const classSchedule: ClassSchedule = {
      id: `class-${course.id}-${selectedMonth}-${selectedShift}`,
      courseId: course.id,
      courseName: course.title,
      shift: selectedShift as 'manhã' | 'tarde' | 'noite' | 'sábado',
      startDate: `2024-${selectedMonth}-01`,
      endDate: `2024-${String(parseInt(selectedMonth) + 2).padStart(2, '0')}-30`,
      schedule: getScheduleText(selectedShift),
      maxStudents: 15,
      enrolledStudents: Math.floor(Math.random() * 10) + 3, // Simulação
      instructor: course.instructor,
      status: 'active'
    }

    onAddToCart(classSchedule, course)
    toast.success(`Turma de ${course.title} adicionada ao carrinho!`)
    
    // Reset selections
    setSelectedMonth('')
    setSelectedShift('')
  }

  const getScheduleText = (shift: string) => {
    switch (shift) {
      case 'manhã':
        return 'Segunda e Quarta 9h às 12h'
      case 'tarde':
        return 'Terça e Quinta 14h às 17h'
      case 'noite':
        return 'Segunda e Quarta 19h às 22h'
      case 'sábado':
        return 'Sábado 8h às 17h'
      default:
        return ''
    }
  }

  return (
    <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
      {/* Seleção de Mês */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Calendar className="inline h-4 w-4 mr-1" />
          Mês de início:
        </label>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Selecione o mês</option>
          {months.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
      </div>

      {/* Seleção de Turno */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Clock className="inline h-4 w-4 mr-1" />
          Turno:
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {shifts
            .filter(shift => course.shifts.includes(shift.value as any))
            .map((shift) => (
            <button
              key={shift.value}
              onClick={() => setSelectedShift(shift.value)}
              className={`p-3 text-left border rounded-md transition-colors ${
                selectedShift === shift.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center space-x-2">
                <span className="text-lg">{shift.icon}</span>
                <div>
                  <div className="font-medium text-sm">{shift.value.charAt(0).toUpperCase() + shift.value.slice(1)}</div>
                  <div className="text-xs text-gray-600">{shift.label.split('(')[1]?.replace(')', '')}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Botões de Ação */}
      <div className="flex space-x-3">
        <button
          onClick={handleAddToCart}
          disabled={!selectedMonth || !selectedShift}
          className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center space-x-2 ${
            selectedMonth && selectedShift
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ShoppingCart className="h-4 w-4" />
          <span>Adicionar ao Carrinho</span>
        </button>
        
        <button
          onClick={() => navigate('/cursos')}
          className="flex-1 py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Continuar Comprando</span>
        </button>
      </div>

      {selectedMonth && selectedShift && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800">
            <strong>Turma selecionada:</strong> {months.find(m => m.value === selectedMonth)?.label} - {selectedShift.charAt(0).toUpperCase() + selectedShift.slice(1)}
          </p>
          <p className="text-xs text-blue-600 mt-1">
            Horário: {getScheduleText(selectedShift)}
          </p>
        </div>
      )}
    </div>
  )
}

export default ClassSelector