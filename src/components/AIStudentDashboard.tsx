import { useState, useEffect, useRef } from 'react'
import { Bot, Send, User, Camera, BookOpen, Award, TrendingUp, Lightbulb, MessageCircle } from 'lucide-react'

interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  suggestions?: string[]
}

interface PersonalizedRecommendation {
  id: string
  type: 'course' | 'exercise' | 'technique' | 'equipment'
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  relevanceScore: number
}

interface LearningProgress {
  currentCourse: string
  completionPercentage: number
  skillsAcquired: string[]
  nextMilestone: string
  weakAreas: string[]
  strengths: string[]
}

const AIStudentDashboard = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([])
  const [progress, setProgress] = useState<LearningProgress | null>(null)
  const [selectedTab, setSelectedTab] = useState<'chat' | 'recommendations' | 'progress'>('chat')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Inicializar com mensagem de boas-vindas
    const welcomeMessage: ChatMessage = {
      id: '1',
      type: 'ai',
      content: 'Olá! Sou sua assistente de fotografia com IA. Posso ajudar com técnicas, equipamentos, composição e muito mais. Como posso ajudar você hoje?',
      timestamp: new Date(),
      suggestions: [
        'Como melhorar a composição das minhas fotos?',
        'Qual equipamento é ideal para retratos?',
        'Dicas para fotografia noturna',
        'Como usar a regra dos terços?'
      ]
    }

    setMessages([welcomeMessage])

    // Mock data para recomendações
    const mockRecommendations: PersonalizedRecommendation[] = [
      {
        id: '1',
        type: 'exercise',
        title: 'Prática de Retrato com Luz Natural',
        description: 'Baseado no seu progresso, recomendo praticar retratos usando apenas luz natural. Foque na direção da luz e sombras.',
        difficulty: 'intermediate',
        estimatedTime: '2 horas',
        relevanceScore: 95
      },
      {
        id: '2',
        type: 'technique',
        title: 'Técnica de Foco Seletivo',
        description: 'Aprenda a usar abertura ampla para criar desfoque artístico e destacar seu assunto principal.',
        difficulty: 'beginner',
        estimatedTime: '30 minutos',
        relevanceScore: 88
      },
      {
        id: '3',
        type: 'course',
        title: 'Curso: Fotografia de Rua Avançada',
        description: 'Com base no seu interesse em fotografia urbana, este curso pode expandir suas habilidades.',
        difficulty: 'advanced',
        estimatedTime: '8 semanas',
        relevanceScore: 82
      },
      {
        id: '4',
        type: 'equipment',
        title: 'Lente 85mm para Retratos',
        description: 'Considerando seu foco em retratos, uma lente 85mm f/1.8 seria um excelente investimento.',
        difficulty: 'intermediate',
        estimatedTime: 'Investimento',
        relevanceScore: 90
      }
    ]

    const mockProgress: LearningProgress = {
      currentCourse: 'Fotografia Digital Completa',
      completionPercentage: 68,
      skillsAcquired: ['Composição Básica', 'Controle de Exposição', 'Edição Básica', 'Retrato'],
      nextMilestone: 'Fotografia Noturna',
      weakAreas: ['Fotografia de Movimento', 'Uso de Flash'],
      strengths: ['Composição', 'Edição', 'Retrato']
    }

    setRecommendations(mockRecommendations)
    setProgress(mockProgress)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsTyping(true)

    // Simular resposta da IA
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage)
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions
      }
      
      setMessages(prev => [...prev, aiMessage])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (userInput: string): { content: string; suggestions?: string[] } => {
    const input = userInput.toLowerCase()
    
    if (input.includes('composição') || input.includes('regra dos terços')) {
      return {
        content: 'A regra dos terços é fundamental! Imagine sua foto dividida em 9 partes iguais por 2 linhas horizontais e 2 verticais. Posicione elementos importantes nos pontos de interseção. Isso cria mais dinamismo que centralizar o assunto. Para retratos, coloque os olhos na linha superior. Para paisagens, posicione o horizonte na linha inferior ou superior, nunca no centro.',
        suggestions: [
          'Como aplicar a regra dos terços em retratos?',
          'Outras técnicas de composição importantes',
          'Exercícios práticos de composição'
        ]
      }
    }
    
    if (input.includes('equipamento') || input.includes('câmera') || input.includes('lente')) {
      return {
        content: 'Para iniciantes, recomendo começar com uma câmera DSLR ou mirrorless de entrada com lente kit 18-55mm. É versátil para aprender. Para retratos, uma 50mm f/1.8 é excelente e acessível. Para paisagens, considere uma grande angular 10-24mm. Lembre-se: o fotógrafo faz a foto, não o equipamento!',
        suggestions: [
          'Diferenças entre DSLR e mirrorless',
          'Qual lente escolher para cada tipo de foto?',
          'Acessórios essenciais para fotografia'
        ]
      }
    }
    
    if (input.includes('noturna') || input.includes('noite') || input.includes('escuro')) {
      return {
        content: 'Fotografia noturna requer técnica específica! Use tripé sempre, ISO alto (mas cuidado com ruído), abertura ampla (f/2.8 ou menor) e velocidades lentas. Para estrelas, use regra 500 (500/distância focal = tempo máximo sem rastro). Para cidade, experimente diferentes exposições para capturar luzes interessantes.',
        suggestions: [
          'Como fotografar a Via Láctea?',
          'Técnicas para reduzir ruído em ISO alto',
          'Fotografia urbana noturna'
        ]
      }
    }
    
    if (input.includes('retrato') || input.includes('pessoa') || input.includes('modelo')) {
      return {
        content: 'Para retratos impactantes: use abertura ampla (f/1.4-f/2.8) para desfoque, foque sempre nos olhos, cuidado com a direção da luz (luz lateral cria volume), comunique-se com o modelo para expressões naturais. A distância focal ideal é 85-135mm para evitar distorção facial.',
        suggestions: [
          'Como dirigir modelos durante o ensaio?',
          'Iluminação natural vs artificial para retratos',
          'Poses que funcionam para diferentes tipos de corpo'
        ]
      }
    }
    
    // Resposta genérica
    return {
      content: 'Interessante pergunta! A fotografia é uma arte que combina técnica e criatividade. Posso ajudar com aspectos técnicos como configurações da câmera, composição, iluminação, ou questões criativas como desenvolvimento do seu estilo pessoal. Sobre o que especificamente você gostaria de saber mais?',
      suggestions: [
        'Técnicas básicas de fotografia',
        'Como desenvolver meu estilo pessoal?',
        'Dicas para melhorar minhas fotos'
      ]
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
  }

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'course': return <BookOpen className="h-5 w-5" />
      case 'exercise': return <Camera className="h-5 w-5" />
      case 'technique': return <Lightbulb className="h-5 w-5" />
      case 'equipment': return <Award className="h-5 w-5" />
      default: return <BookOpen className="h-5 w-5" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const ChatView = () => (
    <div className="flex flex-col h-96">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
              message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.type === 'user' ? 'bg-blue-600' : 'bg-purple-600'
              }`}>
                {message.type === 'user' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-white" />
                )}
              </div>
              <div className={`rounded-lg p-3 ${
                message.type === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Sugestões */}
      {messages.length > 0 && messages[messages.length - 1].suggestions && (
        <div className="p-4 border-t bg-gray-50">
          <p className="text-xs text-gray-600 mb-2">Sugestões:</p>
          <div className="flex flex-wrap gap-2">
            {messages[messages.length - 1].suggestions!.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1 hover:bg-gray-100 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Digite sua pergunta sobre fotografia..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            className="bg-purple-600 text-white p-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )

  const RecommendationsView = () => (
    <div className="space-y-4">
      {recommendations.map((rec) => (
        <div key={rec.id} className="bg-white p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2">
              {getRecommendationIcon(rec.type)}
              <h3 className="font-semibold text-gray-900">{rec.title}</h3>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(rec.difficulty)}`}>
                {rec.difficulty === 'beginner' ? 'Iniciante' :
                 rec.difficulty === 'intermediate' ? 'Intermediário' : 'Avançado'}
              </span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {rec.relevanceScore}% relevante
              </span>
            </div>
          </div>
          
          <p className="text-gray-700 mb-3">{rec.description}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">
              Tempo estimado: {rec.estimatedTime}
            </span>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm">
              {rec.type === 'course' ? 'Ver Curso' :
               rec.type === 'exercise' ? 'Começar Prática' :
               rec.type === 'equipment' ? 'Ver Detalhes' : 'Aprender'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )

  const ProgressView = () => (
    <div className="space-y-6">
      {progress && (
        <>
          <div className="bg-white p-6 rounded-lg border">
            <h3 className="text-lg font-semibold mb-4">Progresso Atual</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{progress.currentCourse}</span>
                  <span className="text-sm text-gray-500">{progress.completionPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${progress.completionPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600 mb-2">Próximo marco:</p>
                <p className="font-medium text-gray-900">{progress.nextMilestone}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border">
              <h4 className="font-semibold text-green-700 mb-3 flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Pontos Fortes</span>
              </h4>
              <div className="space-y-2">
                {progress.strengths.map((strength, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{strength}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border">
              <h4 className="font-semibold text-orange-700 mb-3 flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Áreas para Melhorar</span>
              </h4>
              <div className="space-y-2">
                {progress.weakAreas.map((area, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{area}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <h4 className="font-semibold text-blue-700 mb-3">Habilidades Adquiridas</h4>
            <div className="flex flex-wrap gap-2">
              {progress.skillsAcquired.map((skill, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bot className="h-8 w-8 text-purple-600" />
          <h2 className="text-2xl font-bold text-gray-900">Assistente IA de Fotografia</h2>
        </div>
      </div>

      {/* Navegação */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'chat', label: 'Chat com IA', icon: MessageCircle },
          { id: 'recommendations', label: 'Recomendações', icon: Lightbulb },
          { id: 'progress', label: 'Meu Progresso', icon: TrendingUp }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
              selectedTab === tab.id
                ? 'bg-white text-purple-600 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      <div className="bg-white rounded-lg shadow border">
        {selectedTab === 'chat' && <ChatView />}
        {selectedTab === 'recommendations' && (
          <div className="p-6">
            <RecommendationsView />
          </div>
        )}
        {selectedTab === 'progress' && (
          <div className="p-6">
            <ProgressView />
          </div>
        )}
      </div>
    </div>
  )
}

export default AIStudentDashboard