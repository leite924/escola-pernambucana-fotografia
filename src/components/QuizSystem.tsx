import { useState, useEffect } from 'react'
import { Play, CheckCircle, XCircle, Clock, BarChart3, Trophy, BookOpen, Target, ArrowRight, ArrowLeft, RotateCcw } from 'lucide-react'

interface Question {
  id: string
  type: 'multiple-choice' | 'true-false' | 'drag-drop' | 'image-selection' | 'text-input'
  question: string
  options?: string[]
  correctAnswer: string | string[]
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
  imageUrl?: string
  points: number
}

interface Quiz {
  id: string
  title: string
  description: string
  questions: Question[]
  timeLimit: number // em minutos
  passingScore: number // porcentagem
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  estimatedTime: number
}

interface QuizAttempt {
  id: string
  quizId: string
  answers: { [questionId: string]: string | string[] }
  score: number
  timeSpent: number
  completedAt: Date
  passed: boolean
}

const QuizSystem = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [questionId: string]: string | string[] }>({})
  const [timeLeft, setTimeLeft] = useState(0)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])
  const [selectedTab, setSelectedTab] = useState<'available' | 'results' | 'create'>('available')

  useEffect(() => {
    // Mock quizzes
    const mockQuizzes: Quiz[] = [
      {
        id: '1',
        title: 'Fundamentos da Fotografia',
        description: 'Teste seus conhecimentos sobre os conceitos básicos da fotografia digital.',
        timeLimit: 15,
        passingScore: 70,
        category: 'Básico',
        difficulty: 'easy',
        estimatedTime: 10,
        questions: [
          {
            id: '1-1',
            type: 'multiple-choice',
            question: 'O que significa a sigla ISO na fotografia?',
            options: [
              'International Standards Organization',
              'Image Sensor Output',
              'Internal Shutter Operation',
              'Integrated System Optimization'
            ],
            correctAnswer: 'International Standards Organization',
            explanation: 'ISO refere-se à International Standards Organization, que define os padrões de sensibilidade do sensor.',
            difficulty: 'easy',
            category: 'Técnica',
            points: 10
          },
          {
            id: '1-2',
            type: 'true-false',
            question: 'Um ISO mais alto sempre resulta em melhor qualidade de imagem.',
            correctAnswer: 'false',
            explanation: 'ISO mais alto aumenta a sensibilidade, mas também introduz ruído na imagem.',
            difficulty: 'easy',
            category: 'Técnica',
            points: 10
          },
          {
            id: '1-3',
            type: 'multiple-choice',
            question: 'Qual abertura permite maior profundidade de campo?',
            options: ['f/1.4', 'f/2.8', 'f/8', 'f/16'],
            correctAnswer: 'f/16',
            explanation: 'Aberturas menores (números maiores) como f/16 proporcionam maior profundidade de campo.',
            difficulty: 'medium',
            category: 'Técnica',
            points: 15
          }
        ]
      },
      {
        id: '2',
        title: 'Composição e Enquadramento',
        description: 'Avalie seu conhecimento sobre técnicas de composição fotográfica.',
        timeLimit: 20,
        passingScore: 75,
        category: 'Composição',
        difficulty: 'medium',
        estimatedTime: 15,
        questions: [
          {
            id: '2-1',
            type: 'multiple-choice',
            question: 'A regra dos terços sugere dividir a imagem em quantas partes?',
            options: ['6 partes', '9 partes', '12 partes', '16 partes'],
            correctAnswer: '9 partes',
            explanation: 'A regra dos terços divide a imagem em 9 partes iguais com duas linhas horizontais e duas verticais.',
            difficulty: 'easy',
            category: 'Composição',
            points: 10
          },
          {
            id: '2-2',
            type: 'image-selection',
            question: 'Qual imagem demonstra melhor a aplicação da regra dos terços?',
            options: ['Imagem A', 'Imagem B', 'Imagem C', 'Imagem D'],
            correctAnswer: 'Imagem B',
            explanation: 'A Imagem B posiciona o elemento principal nos pontos de intersecção das linhas da regra dos terços.',
            difficulty: 'medium',
            category: 'Composição',
            points: 20,
            imageUrl: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=photography%20composition%20rule%20of%20thirds%20examples&image_size=landscape_16_9'
          }
        ]
      },
      {
        id: '3',
        title: 'Iluminação Avançada',
        description: 'Desafie-se com questões sobre técnicas avançadas de iluminação.',
        timeLimit: 25,
        passingScore: 80,
        category: 'Iluminação',
        difficulty: 'hard',
        estimatedTime: 20,
        questions: [
          {
            id: '3-1',
            type: 'text-input',
            question: 'Qual é a temperatura de cor típica da luz do sol ao meio-dia? (responda em Kelvin)',
            correctAnswer: '5500',
            explanation: 'A luz solar ao meio-dia tem aproximadamente 5500K de temperatura de cor.',
            difficulty: 'medium',
            category: 'Iluminação',
            points: 15
          }
        ]
      }
    ]

    setQuizzes(mockQuizzes)

    // Mock attempts
    const mockAttempts: QuizAttempt[] = [
      {
        id: '1',
        quizId: '1',
        answers: {},
        score: 85,
        timeSpent: 12,
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        passed: true
      },
      {
        id: '2',
        quizId: '2',
        answers: {},
        score: 65,
        timeSpent: 18,
        completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        passed: false
      }
    ]

    setAttempts(mockAttempts)
  }, [])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (quizStarted && timeLeft > 0 && !quizCompleted) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    } else if (timeLeft === 0 && quizStarted) {
      handleQuizComplete()
    }
    return () => clearTimeout(timer)
  }, [timeLeft, quizStarted, quizCompleted])

  const startQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz)
    setCurrentQuestionIndex(0)
    setAnswers({})
    setTimeLeft(quiz.timeLimit * 60)
    setQuizStarted(true)
    setQuizCompleted(false)
    setShowResults(false)
  }

  const handleAnswer = (questionId: string, answer: string | string[]) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
  }

  const nextQuestion = () => {
    if (currentQuiz && currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      handleQuizComplete()
    }
  }

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleQuizComplete = () => {
    if (!currentQuiz) return

    let totalScore = 0
    let maxScore = 0

    currentQuiz.questions.forEach(question => {
      maxScore += question.points
      const userAnswer = answers[question.id]
      if (userAnswer === question.correctAnswer) {
        totalScore += question.points
      }
    })

    const percentage = Math.round((totalScore / maxScore) * 100)
    const timeSpent = Math.round((currentQuiz.timeLimit * 60 - timeLeft) / 60)
    const passed = percentage >= currentQuiz.passingScore

    const newAttempt: QuizAttempt = {
      id: Date.now().toString(),
      quizId: currentQuiz.id,
      answers,
      score: percentage,
      timeSpent,
      completedAt: new Date(),
      passed
    }

    setAttempts(prev => [newAttempt, ...prev])
    setQuizCompleted(true)
    setShowResults(true)
  }

  const resetQuiz = () => {
    setCurrentQuiz(null)
    setQuizStarted(false)
    setQuizCompleted(false)
    setShowResults(false)
    setCurrentQuestionIndex(0)
    setAnswers({})
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const renderQuestion = (question: Question) => {
    const userAnswer = answers[question.id]

    switch (question.type) {
      case 'multiple-choice':
        return (
          <div className="space-y-3">
            {question.options?.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={userAnswer === option}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  className="text-blue-600"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )

      case 'true-false':
        return (
          <div className="space-y-3">
            {['true', 'false'].map((option) => (
              <label key={option} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={userAnswer === option}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  className="text-blue-600"
                />
                <span>{option === 'true' ? 'Verdadeiro' : 'Falso'}</span>
              </label>
            ))}
          </div>
        )

      case 'text-input':
        return (
          <input
            type="text"
            value={userAnswer as string || ''}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Digite sua resposta..."
          />
        )

      case 'image-selection':
        return (
          <div className="space-y-4">
            {question.imageUrl && (
              <img src={question.imageUrl} alt="Questão" className="w-full max-w-2xl mx-auto rounded-lg" />
            )}
            <div className="grid grid-cols-2 gap-3">
              {question.options?.map((option, index) => (
                <label key={index} className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name={question.id}
                    value={option}
                    checked={userAnswer === option}
                    onChange={(e) => handleAnswer(question.id, e.target.value)}
                    className="text-blue-600"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        )

      default:
        return <div>Tipo de questão não suportado</div>
    }
  }

  const AvailableQuizzesView = () => (
    <div className="space-y-6">
      <div className="grid gap-6">
        {quizzes.map((quiz) => {
          const lastAttempt = attempts.find(a => a.quizId === quiz.id)
          return (
            <div key={quiz.id} className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{quiz.title}</h3>
                  <p className="text-gray-600 mb-3">{quiz.description}</p>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{quiz.timeLimit} min</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Target className="h-4 w-4" />
                      <span>{quiz.passingScore}% para aprovação</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <BookOpen className="h-4 w-4" />
                      <span>{quiz.questions.length} questões</span>
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                    {quiz.difficulty === 'easy' ? 'Fácil' :
                     quiz.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                  </span>
                  
                  {lastAttempt && (
                    <div className={`text-sm px-2 py-1 rounded ${
                      lastAttempt.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      Última tentativa: {lastAttempt.score}%
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Categoria: {quiz.category}</span>
                <button
                  onClick={() => startQuiz(quiz)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>Iniciar Quiz</span>
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const ResultsView = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Estatísticas Gerais</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{attempts.length}</div>
            <div className="text-sm text-gray-600">Tentativas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{attempts.filter(a => a.passed).length}</div>
            <div className="text-sm text-gray-600">Aprovações</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {attempts.length > 0 ? Math.round(attempts.reduce((acc, a) => acc + a.score, 0) / attempts.length) : 0}%
            </div>
            <div className="text-sm text-gray-600">Média</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {attempts.length > 0 ? Math.round(attempts.reduce((acc, a) => acc + a.timeSpent, 0) / attempts.length) : 0}min
            </div>
            <div className="text-sm text-gray-600">Tempo Médio</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Histórico de Tentativas</h3>
        <div className="space-y-3">
          {attempts.map((attempt) => {
            const quiz = quizzes.find(q => q.id === attempt.quizId)
            return (
              <div key={attempt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${
                    attempt.passed ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {attempt.passed ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{quiz?.title}</div>
                    <div className="text-sm text-gray-500">
                      {attempt.completedAt.toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold">{attempt.score}%</div>
                    <div className="text-gray-500">Pontuação</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{attempt.timeSpent}min</div>
                    <div className="text-gray-500">Tempo</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    attempt.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {attempt.passed ? 'Aprovado' : 'Reprovado'}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )

  if (quizStarted && currentQuiz && !showResults) {
    const currentQuestion = currentQuiz.questions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white p-6 rounded-lg border mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">{currentQuiz.title}</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-red-600">
                  <Clock className="h-5 w-5" />
                  <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
                </div>
                <button
                  onClick={resetQuiz}
                  className="text-gray-600 hover:text-gray-800"
                  title="Sair do quiz"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="text-sm text-gray-600">
              Questão {currentQuestionIndex + 1} de {currentQuiz.questions.length}
            </div>
          </div>

          {/* Question */}
          <div className="bg-white p-6 rounded-lg border mb-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex-1">
                {currentQuestion.question}
              </h3>
              <div className="flex items-center space-x-2 ml-4">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(currentQuestion.difficulty)}`}>
                  {currentQuestion.difficulty === 'easy' ? 'Fácil' :
                   currentQuestion.difficulty === 'medium' ? 'Médio' : 'Difícil'}
                </span>
                <span className="text-sm text-gray-500">{currentQuestion.points} pts</span>
              </div>
            </div>
            
            {renderQuestion(currentQuestion)}
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
              className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Anterior</span>
            </button>
            
            <div className="text-sm text-gray-500">
              {Object.keys(answers).length} de {currentQuiz.questions.length} respondidas
            </div>
            
            <button
              onClick={nextQuestion}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <span>{currentQuestionIndex === currentQuiz.questions.length - 1 ? 'Finalizar' : 'Próxima'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (showResults && currentQuiz) {
    const lastAttempt = attempts[0]
    const totalQuestions = currentQuiz.questions.length
    const correctAnswers = currentQuiz.questions.filter(q => answers[q.id] === q.correctAnswer).length

    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-8 rounded-lg border text-center">
            <div className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
              lastAttempt.passed ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {lastAttempt.passed ? (
                <Trophy className="h-10 w-10 text-green-600" />
              ) : (
                <XCircle className="h-10 w-10 text-red-600" />
              )}
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {lastAttempt.passed ? 'Parabéns!' : 'Não foi dessa vez!'}
            </h2>
            
            <p className="text-gray-600 mb-6">
              {lastAttempt.passed 
                ? 'Você foi aprovado no quiz!' 
                : `Você precisa de ${currentQuiz.passingScore}% para ser aprovado.`
              }
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center">
                <div className={`text-3xl font-bold ${
                  lastAttempt.passed ? 'text-green-600' : 'text-red-600'
                }`}>
                  {lastAttempt.score}%
                </div>
                <div className="text-sm text-gray-600">Pontuação</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600">{correctAnswers}/{totalQuestions}</div>
                <div className="text-sm text-gray-600">Corretas</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">{lastAttempt.timeSpent}min</div>
                <div className="text-sm text-gray-600">Tempo Gasto</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600">{currentQuiz.passingScore}%</div>
                <div className="text-sm text-gray-600">Necessário</div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Revisão das Questões</h3>
              <div className="space-y-3 text-left">
                {currentQuiz.questions.map((question, index) => {
                  const userAnswer = answers[question.id]
                  const isCorrect = userAnswer === question.correctAnswer
                  
                  return (
                    <div key={question.id} className={`p-4 rounded-lg border ${
                      isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                    }`}>
                      <div className="flex items-start space-x-3">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 mb-1">
                            {index + 1}. {question.question}
                          </div>
                          <div className="text-sm space-y-1">
                            <div>
                              <span className="font-medium">Sua resposta: </span>
                              <span className={isCorrect ? 'text-green-700' : 'text-red-700'}>
                                {userAnswer || 'Não respondida'}
                              </span>
                            </div>
                            {!isCorrect && (
                              <div>
                                <span className="font-medium">Resposta correta: </span>
                                <span className="text-green-700">{question.correctAnswer}</span>
                              </div>
                            )}
                            <div className="text-gray-600 italic">{question.explanation}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
            
            <div className="flex justify-center space-x-4 mt-8">
              <button
                onClick={() => startQuiz(currentQuiz)}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Tentar Novamente</span>
              </button>
              <button
                onClick={resetQuiz}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Voltar aos Quizzes
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Target className="h-8 w-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Sistema de Quiz</h2>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'available', label: 'Quizzes Disponíveis', icon: BookOpen },
          { id: 'results', label: 'Resultados', icon: BarChart3 }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
              selectedTab === tab.id
                ? 'bg-white text-blue-600 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {selectedTab === 'available' && <AvailableQuizzesView />}
      {selectedTab === 'results' && <ResultsView />}
    </div>
  )
}

export default QuizSystem