import { useState, useEffect } from 'react'
import { Brain, TrendingUp, Users, AlertTriangle, Lightbulb, Target, DollarSign, BookOpen } from 'lucide-react'

interface AIInsight {
  id: string
  type: 'prediction' | 'recommendation' | 'alert' | 'opportunity'
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  confidence: number
  actionable: boolean
  data?: any
}

interface StudentRiskProfile {
  id: string
  name: string
  course: string
  riskLevel: 'high' | 'medium' | 'low'
  riskFactors: string[]
  lastActivity: string
  paymentStatus: 'current' | 'late' | 'overdue'
}

interface CoursePerformance {
  id: string
  name: string
  enrollments: number
  completionRate: number
  revenue: number
  satisfaction: number
  trend: 'up' | 'down' | 'stable'
}

const AIAdminDashboard = () => {
  const [insights, setInsights] = useState<AIInsight[]>([])
  const [riskStudents, setRiskStudents] = useState<StudentRiskProfile[]>([])
  const [coursePerformance, setCoursePerformance] = useState<CoursePerformance[]>([])
  const [selectedTab, setSelectedTab] = useState<'insights' | 'predictions' | 'recommendations'>('insights')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simular carregamento de dados da IA
    setTimeout(() => {
      const mockInsights: AIInsight[] = [
        {
          id: '1',
          type: 'prediction',
          title: 'Risco de Evasão Detectado',
          description: '15 alunos apresentam alto risco de abandono nos próximos 30 dias. Principais fatores: baixa frequência e atraso nos pagamentos.',
          impact: 'high',
          confidence: 87,
          actionable: true,
          data: { studentsAtRisk: 15, potentialLoss: 45000 }
        },
        {
          id: '2',
          type: 'opportunity',
          title: 'Oportunidade de Expansão',
          description: 'Curso de Fotografia de Casamento tem demanda 300% maior que a oferta atual. Recomenda-se abrir 2 novas turmas.',
          impact: 'high',
          confidence: 92,
          actionable: true,
          data: { demandIncrease: 300, recommendedClasses: 2, projectedRevenue: 85000 }
        },
        {
          id: '3',
          type: 'recommendation',
          title: 'Otimização de Preços',
          description: 'Análise de mercado sugere aumento de 15% nos preços dos cursos avançados sem impacto significativo na demanda.',
          impact: 'medium',
          confidence: 78,
          actionable: true,
          data: { priceIncrease: 15, projectedRevenue: 25000 }
        },
        {
          id: '4',
          type: 'alert',
          title: 'Queda na Satisfação',
          description: 'Curso de Fotografia Digital apresentou queda de 20% na satisfação dos alunos no último mês.',
          impact: 'medium',
          confidence: 85,
          actionable: true,
          data: { satisfactionDrop: 20, affectedStudents: 45 }
        }
      ]

      const mockRiskStudents: StudentRiskProfile[] = [
        {
          id: '1',
          name: 'Ana Silva',
          course: 'Fotografia Digital Completa',
          riskLevel: 'high',
          riskFactors: ['Baixa frequência', 'Pagamento em atraso', 'Sem interação há 15 dias'],
          lastActivity: '2024-01-05',
          paymentStatus: 'overdue'
        },
        {
          id: '2',
          name: 'Carlos Santos',
          course: 'Retrato Profissional',
          riskLevel: 'medium',
          riskFactors: ['Frequência irregular', 'Baixo engajamento'],
          lastActivity: '2024-01-18',
          paymentStatus: 'current'
        }
      ]

      const mockCoursePerformance: CoursePerformance[] = [
        {
          id: '1',
          name: 'Fotografia Digital Completa',
          enrollments: 120,
          completionRate: 85,
          revenue: 180000,
          satisfaction: 4.2,
          trend: 'up'
        },
        {
          id: '2',
          name: 'Retrato Profissional',
          enrollments: 85,
          completionRate: 92,
          revenue: 127500,
          satisfaction: 4.6,
          trend: 'stable'
        },
        {
          id: '3',
          name: 'Fotografia de Casamento',
          enrollments: 45,
          completionRate: 78,
          revenue: 90000,
          satisfaction: 4.1,
          trend: 'down'
        }
      ]

      setInsights(mockInsights)
      setRiskStudents(mockRiskStudents)
      setCoursePerformance(mockCoursePerformance)
      setIsLoading(false)
    }, 2000)
  }, [])

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'prediction': return <TrendingUp className="h-5 w-5" />
      case 'recommendation': return <Lightbulb className="h-5 w-5" />
      case 'alert': return <AlertTriangle className="h-5 w-5" />
      case 'opportunity': return <Target className="h-5 w-5" />
      default: return <Brain className="h-5 w-5" />
    }
  }

  const getInsightColor = (type: string, impact: string) => {
    if (type === 'alert') return 'border-red-200 bg-red-50'
    if (type === 'opportunity') return 'border-green-200 bg-green-50'
    if (impact === 'high') return 'border-orange-200 bg-orange-50'
    return 'border-blue-200 bg-blue-50'
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const InsightsView = () => (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <Brain className="h-6 w-6 text-blue-600 animate-pulse" />
            <span className="text-gray-600">IA analisando dados...</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {insights.map((insight) => (
            <div key={insight.id} className={`p-6 rounded-lg border-2 ${getInsightColor(insight.type, insight.impact)}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {getInsightIcon(insight.type)}
                  <h3 className="font-semibold text-gray-900">{insight.title}</h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs bg-white px-2 py-1 rounded-full">
                    {insight.confidence}% confiança
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    insight.impact === 'high' ? 'bg-red-100 text-red-800' :
                    insight.impact === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {insight.impact === 'high' ? 'Alto Impacto' :
                     insight.impact === 'medium' ? 'Médio Impacto' : 'Baixo Impacto'}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{insight.description}</p>
              
              {insight.actionable && (
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Implementar Ação
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )

  const PredictionsView = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <Users className="h-5 w-5" />
          <span>Alunos em Risco de Evasão</span>
        </h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aluno</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Curso</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risco</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fatores</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {riskStudents.map((student) => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.course}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskColor(student.riskLevel)}`}>
                      {student.riskLevel === 'high' ? 'Alto' : student.riskLevel === 'medium' ? 'Médio' : 'Baixo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="space-y-1">
                      {student.riskFactors.slice(0, 2).map((factor, index) => (
                        <div key={index} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {factor}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button className="text-blue-600 hover:text-blue-900 text-sm">
                      Intervir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border">
        <h3 className="text-lg font-semibold mb-4 flex items-center space-x-2">
          <BookOpen className="h-5 w-5" />
          <span>Performance dos Cursos</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {coursePerformance.map((course) => (
            <div key={course.id} className="border rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">{course.name}</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Matrículas:</span>
                  <span className="font-medium">{course.enrollments}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxa de Conclusão:</span>
                  <span className="font-medium">{course.completionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Receita:</span>
                  <span className="font-medium">R$ {course.revenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Satisfação:</span>
                  <span className="font-medium">{course.satisfaction}/5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tendência:</span>
                  <span className={`font-medium ${
                    course.trend === 'up' ? 'text-green-600' :
                    course.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {course.trend === 'up' ? '↗ Crescendo' :
                     course.trend === 'down' ? '↘ Declinando' : '→ Estável'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const RecommendationsView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border">
          <div className="flex items-center space-x-2 mb-4">
            <DollarSign className="h-6 w-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-blue-900">Otimização de Receita</h3>
          </div>
          <ul className="space-y-3 text-sm text-blue-800">
            <li className="flex items-start space-x-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Aumentar preços dos cursos avançados em 15% (+R$ 25.000/mês)</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Criar pacotes de cursos com desconto para aumentar ticket médio</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Implementar programa de indicação com recompensas</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">Retenção de Alunos</h3>
          </div>
          <ul className="space-y-3 text-sm text-green-800">
            <li className="flex items-start space-x-2">
              <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Implementar sistema de mentoria para alunos em risco</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Criar grupos de estudo e networking entre alunos</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Oferecer aulas de reforço para alunos com dificuldades</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border">
          <div className="flex items-center space-x-2 mb-4">
            <Target className="h-6 w-6 text-purple-600" />
            <h3 className="text-lg font-semibold text-purple-900">Expansão de Mercado</h3>
          </div>
          <ul className="space-y-3 text-sm text-purple-800">
            <li className="flex items-start space-x-2">
              <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Lançar curso online de Fotografia Mobile (alta demanda)</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Abrir filial na zona sul (análise de mercado favorável)</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Parcerias com empresas para cursos corporativos</span>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-lg border">
          <div className="flex items-center space-x-2 mb-4">
            <Lightbulb className="h-6 w-6 text-orange-600" />
            <h3 className="text-lg font-semibold text-orange-900">Inovação Pedagógica</h3>
          </div>
          <ul className="space-y-3 text-sm text-orange-800">
            <li className="flex items-start space-x-2">
              <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Implementar realidade virtual para aulas práticas</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Criar app mobile para exercícios e feedback</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></span>
              <span>Desenvolver sistema de gamificação do aprendizado</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="h-8 w-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">IA Administrativa</h2>
        </div>
        <div className="text-sm text-gray-500">
          Última atualização: {new Date().toLocaleString('pt-BR')}
        </div>
      </div>

      {/* Navegação */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'insights', label: 'Insights Gerais' },
          { id: 'predictions', label: 'Análise Preditiva' },
          { id: 'recommendations', label: 'Recomendações' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedTab === tab.id
                ? 'bg-white text-blue-600 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      {selectedTab === 'insights' && <InsightsView />}
      {selectedTab === 'predictions' && <PredictionsView />}
      {selectedTab === 'recommendations' && <RecommendationsView />}
    </div>
  )
}

export default AIAdminDashboard