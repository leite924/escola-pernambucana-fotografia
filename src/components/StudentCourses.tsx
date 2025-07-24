import { useState, useEffect } from 'react'
import { 
  BookOpen, Play, Download, Eye, Clock, CheckCircle, 
  FileText, Video, Image, Lock, Star, Calendar,
  ChevronRight, ChevronDown, BarChart3, Camera, Upload
} from 'lucide-react'
import { useStore } from '../store/useStore'
import PhotoSubmission from './PhotoSubmission'

interface LearningMaterial {
  id: string
  title: string
  type: 'video' | 'pdf' | 'image' | 'quiz' | 'assignment'
  duration?: string
  size?: string
  url: string
  completed: boolean
  locked: boolean
}

interface CourseModule {
  id: string
  title: string
  description: string
  materials: LearningMaterial[]
  completed: boolean
  progress: number
  unlocked: boolean
}

interface StudentCourse {
  id: string
  title: string
  description: string
  instructor: string
  progress: number
  totalModules: number
  completedModules: number
  enrollDate: string
  estimatedCompletion: string
  modules: CourseModule[]
  image: string
}

const StudentCourses = () => {
  const [courses, setCourses] = useState<StudentCourse[]>([])
  const [selectedCourse, setSelectedCourse] = useState<StudentCourse | null>(null)
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [showPhotoSubmission, setShowPhotoSubmission] = useState(false)
  const { user, students } = useStore()

  useEffect(() => {
    // Get current student
    const currentStudent = students.find(s => s.email === user?.email)
    
    // Mock student courses with learning materials
    const mockCourses: StudentCourse[] = [
      {
        id: '1',
        title: 'Fotografia Digital Completa',
        description: 'Aprenda todos os fundamentos da fotografia digital, desde o básico até técnicas avançadas.',
        instructor: 'Carlos Silva',
        progress: 65,
        totalModules: 4,
        completedModules: 2,
        enrollDate: currentStudent?.enrollDate || '2024-01-15',
        estimatedCompletion: '2024-03-15',
        image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20photography%20course%20digital%20camera%20studio%20setup&image_size=landscape_16_9',
        modules: [
          {
            id: 'm1',
            title: 'Fundamentos da Fotografia',
            description: 'Conceitos básicos e configurações de câmera',
            completed: true,
            progress: 100,
            unlocked: true,
            materials: [
              {
                id: 'm1-1',
                title: 'Introdução à Fotografia Digital',
                type: 'video',
                duration: '15 min',
                url: '#',
                completed: true,
                locked: false
              },
              {
                id: 'm1-2',
                title: 'Tipos de Câmeras e Lentes',
                type: 'video',
                duration: '20 min',
                url: '#',
                completed: true,
                locked: false
              },
              {
                id: 'm1-3',
                title: 'Manual de Configurações Básicas',
                type: 'pdf',
                size: '2.5 MB',
                url: '#',
                completed: true,
                locked: false
              },
              {
                id: 'm1-4',
                title: 'Quiz: Fundamentos',
                type: 'quiz',
                url: '#',
                completed: true,
                locked: false
              }
            ]
          },
          {
            id: 'm2',
            title: 'Composição e Enquadramento',
            description: 'Técnicas de composição para fotos impactantes',
            completed: true,
            progress: 100,
            unlocked: true,
            materials: [
              {
                id: 'm2-1',
                title: 'Regra dos Terços',
                type: 'video',
                duration: '18 min',
                url: '#',
                completed: true,
                locked: false
              },
              {
                id: 'm2-2',
                title: 'Linhas de Força e Perspectiva',
                type: 'video',
                duration: '22 min',
                url: '#',
                completed: true,
                locked: false
              },
              {
                id: 'm2-3',
                title: 'Exemplos de Composição',
                type: 'image',
                size: '15 MB',
                url: '#',
                completed: true,
                locked: false
              }
            ]
          },
          {
            id: 'm3',
            title: 'Iluminação e Exposição',
            description: 'Dominando a luz em suas fotografias',
            completed: false,
            progress: 60,
            unlocked: true,
            materials: [
              {
                id: 'm3-1',
                title: 'Entendendo a Exposição',
                type: 'video',
                duration: '25 min',
                url: '#',
                completed: true,
                locked: false
              },
              {
                id: 'm3-2',
                title: 'Trabalhando com Luz Natural',
                type: 'video',
                duration: '30 min',
                url: '#',
                completed: true,
                locked: false
              },
              {
                id: 'm3-3',
                title: 'Uso do Flash',
                type: 'video',
                duration: '20 min',
                url: '#',
                completed: false,
                locked: false
              },
              {
                id: 'm3-4',
                title: 'Exercício Prático: Golden Hour',
                type: 'assignment',
                url: '#',
                completed: false,
                locked: false
              }
            ]
          },
          {
            id: 'm4',
            title: 'Pós-Produção e Edição',
            description: 'Finalizando suas fotos com edição profissional',
            completed: false,
            progress: 0,
            unlocked: false,
            materials: [
              {
                id: 'm4-1',
                title: 'Introdução ao Lightroom',
                type: 'video',
                duration: '35 min',
                url: '#',
                completed: false,
                locked: true
              },
              {
                id: 'm4-2',
                title: 'Técnicas de Correção',
                type: 'video',
                duration: '40 min',
                url: '#',
                completed: false,
                locked: true
              }
            ]
          }
        ]
      }
    ]

    setCourses(mockCourses)
    if (mockCourses.length > 0) {
      setSelectedCourse(mockCourses[0])
    }
  }, [user, students])

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId)
    } else {
      newExpanded.add(moduleId)
    }
    setExpandedModules(newExpanded)
  }

  const getMaterialIcon = (type: string) => {
    switch (type) {
      case 'video': return Video
      case 'pdf': return FileText
      case 'image': return Image
      case 'quiz': return BarChart3
      case 'assignment': return CheckCircle
      default: return FileText
    }
  }

  const handleMaterialClick = (material: LearningMaterial) => {
    if (material.locked) {
      return
    }
    // Here you would implement the logic to open/play the material
    console.log('Opening material:', material.title)
  }

  if (!selectedCourse) {
    return (
      <div className="text-center py-12">
        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum curso encontrado</h3>
        <p className="text-gray-600">Você ainda não está matriculado em nenhum curso.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Course Header */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3">
            <img
              src={selectedCourse.image}
              alt={selectedCourse.title}
              className="h-48 w-full object-cover md:h-full"
            />
          </div>
          <div className="p-6 md:w-2/3">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">{selectedCourse.title}</h1>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setShowPhotoSubmission(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
                >
                  <Camera className="h-4 w-4" />
                  <span>Enviar Foto</span>
                </button>
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600">4.9</span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 mb-4">{selectedCourse.description}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Instrutor</p>
                <p className="font-medium">{selectedCourse.instructor}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Progresso</p>
                <p className="font-medium">{selectedCourse.progress}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Módulos</p>
                <p className="font-medium">{selectedCourse.completedModules}/{selectedCourse.totalModules}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Conclusão</p>
                <p className="font-medium">{new Date(selectedCourse.estimatedCompletion).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${selectedCourse.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Modules */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Conteúdo do Curso</h2>
        </div>
        
        <div className="divide-y divide-gray-200">
          {selectedCourse.modules.map((module, index) => (
            <div key={module.id} className="p-6">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => module.unlocked && toggleModule(module.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    module.completed 
                      ? 'bg-green-100 text-green-600' 
                      : module.unlocked 
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-400'
                  }`}>
                    {module.completed ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : module.unlocked ? (
                      <span className="text-sm font-medium">{index + 1}</span>
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </div>
                  
                  <div>
                    <h3 className={`font-medium ${
                      module.unlocked ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {module.title}
                    </h3>
                    <p className={`text-sm ${
                      module.unlocked ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {module.description}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  {module.unlocked && (
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {module.materials.filter(m => m.completed).length}/{module.materials.length} concluídos
                      </p>
                      <div className="w-20 bg-gray-200 rounded-full h-1 mt-1">
                        <div 
                          className="bg-blue-600 h-1 rounded-full" 
                          style={{ width: `${module.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                  
                  {module.unlocked && (
                    expandedModules.has(module.id) ? (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    )
                  )}
                </div>
              </div>
              
              {/* Module Materials */}
              {expandedModules.has(module.id) && module.unlocked && (
                <div className="mt-4 ml-12 space-y-2">
                  {module.materials.map((material) => {
                    const Icon = getMaterialIcon(material.type)
                    return (
                      <div 
                        key={material.id}
                        className={`flex items-center justify-between p-3 rounded-lg border ${
                          material.locked 
                            ? 'bg-gray-50 border-gray-200'
                            : 'bg-white border-gray-200 hover:border-blue-300 cursor-pointer'
                        }`}
                        onClick={() => handleMaterialClick(material)}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className={`h-5 w-5 ${
                            material.locked ? 'text-gray-400' : 'text-blue-600'
                          }`} />
                          <div>
                            <p className={`font-medium ${
                              material.locked ? 'text-gray-400' : 'text-gray-900'
                            }`}>
                              {material.title}
                            </p>
                            {(material.duration || material.size) && (
                              <p className="text-sm text-gray-500">
                                {material.duration || material.size}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {material.completed && (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                          {material.locked ? (
                            <Lock className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Play className="h-4 w-4 text-blue-600" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Photo Submission Modal */}
      <PhotoSubmission
        isOpen={showPhotoSubmission}
        onClose={() => setShowPhotoSubmission(false)}
        studentCourse={selectedCourse?.title || 'Curso Atual'}
      />
    </div>
  )
}

export default StudentCourses