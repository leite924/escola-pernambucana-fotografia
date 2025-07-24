import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Clock, Users, Star, CheckCircle, Play, Download, Award, ArrowLeft, ShoppingCart } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useStore } from '../store/useStore'
import CheckoutAsaas from '../components/CheckoutAsaas'
import ClassSelector from '../components/ClassSelector'

const enrollmentSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  classId: z.string().min(1, 'Selecione uma turma'),
  className: z.string().optional(),
  shift: z.string().optional(),
  address: z.string().optional(),
  birthDate: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  howDidYouHear: z.string().optional(),
  previousExperience: z.string().optional(),
  notes: z.string().optional()
})

type EnrollmentForm = z.infer<typeof enrollmentSchema>

const CourseDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [enrollmentData, setEnrollmentData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    enrollDate: new Date().toISOString().split('T')[0],
    status: 'pending' as const,
    classId: '',
    className: '',
    shift: '',
    address: '',
    birthDate: '',
    emergencyContact: '',
    emergencyPhone: '',
    howDidYouHear: '',
    previousExperience: '',
    paymentStatus: 'pending' as const,
    notes: ''
  })

  const { courses, selectedCourse, setSelectedCourse, addStudent, classSchedules, addToCart } = useStore()

  const handleAddToCart = (classSchedule: any, course: any) => {
    addToCart(classSchedule, course)
    toast.success(`Turma ${classSchedule.shift} de ${course.title} adicionada ao carrinho!`)
  }

  const getClassesForCourse = (courseId: number) => {
    return classSchedules.filter(cls => cls.courseId === courseId && cls.status === 'active')
  }
  
  // Get course data from store or find by ID
  const course = selectedCourse || courses.find(c => c.id === parseInt(id || '0'))
  
  // Get available classes for this course
  const availableClasses = course ? classSchedules.filter(cls => 
    cls.courseName === course.title && cls.status === 'active'
  ) : []
  
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<EnrollmentForm>({
    resolver: zodResolver(enrollmentSchema)
  })
  
  useEffect(() => {
    if (!course && id) {
      const foundCourse = courses.find(c => c.id === parseInt(id))
      if (foundCourse) {
        setSelectedCourse(foundCourse)
      } else {
        navigate('/cursos')
      }
    }
  }, [id, course, courses, setSelectedCourse, navigate])
  
  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Curso não encontrado</h2>
          <Link to="/cursos" className="text-blue-600 hover:text-blue-700">
            Voltar para cursos
          </Link>
        </div>
      </div>
    )
  }

  // Extended course data with additional fields
  const extendedCourse = {
    ...course,
    longDescription: course.description || 'Este curso completo de fotografia digital foi desenvolvido para levar você do nível iniciante ao profissional. Você aprenderá desde os fundamentos básicos da fotografia até técnicas avançadas de composição, iluminação e pós-produção. Com aulas práticas em estúdio profissional e mentoria individualizada, você estará preparado para iniciar sua carreira como fotógrafo profissional.',
    reviews: 324,
    instructorData: {
      name: course.instructor,
      bio: 'Fotógrafo profissional há mais de 15 anos, especialista em fotografia digital e comercial. Já trabalhou com grandes marcas e possui diversos prêmios nacionais e internacionais.',
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20male%20photographer%20instructor%20portrait&image_size=square',
      experience: '15+ anos',
      students: '3.500+ alunos'
    },
    modulesList: course.curriculum || [
      {
        title: 'Fundamentos da Fotografia',
        lessons: 6,
        duration: '2h 30min',
        topics: ['História da fotografia', 'Tipos de câmeras', 'Conceitos básicos', 'Exercícios práticos']
      },
      {
        title: 'Configurações da Câmera',
        lessons: 8,
        duration: '3h 15min',
        topics: ['Abertura do diafragma', 'Velocidade do obturador', 'ISO', 'Modos de foco']
      },
      {
        title: 'Composição e Enquadramento',
        lessons: 7,
        duration: '2h 45min',
        topics: ['Regra dos terços', 'Linhas guia', 'Simetria', 'Perspectiva']
      },
      {
        title: 'Iluminação Natural e Artificial',
        lessons: 9,
        duration: '4h 20min',
        topics: ['Luz natural', 'Flash externo', 'Iluminação de estúdio', 'Modificadores de luz']
      },
      {
        title: 'Pós-produção e Edição',
        lessons: 10,
        duration: '5h 10min',
        topics: ['Adobe Lightroom', 'Adobe Photoshop', 'Correção de cores', 'Retoque profissional']
      },
      {
        title: 'Projeto Final e Portfólio',
        lessons: 5,
        duration: '3h 00min',
        topics: ['Planejamento do projeto', 'Execução', 'Montagem do portfólio', 'Apresentação']
      }
    ],
    benefits: course.features || [
      'Certificado reconhecido pelo mercado',
      'Acesso vitalício ao conteúdo',
      'Aulas práticas em estúdio profissional',
      'Mentoria individual',
      'Comunidade exclusiva de alunos',
      'Suporte para montagem de portfólio',
      'Material complementar para download',
      'Aulas ao vivo mensais'
    ],
    requirements: [
      'Câmera digital (DSLR ou mirrorless)',
      'Computador com acesso à internet',
      'Disponibilidade de 3-4 horas por semana',
      'Vontade de aprender e praticar'
    ]
  }

  const onSubmit = (data: EnrollmentForm) => {
    const selectedClass = availableClasses.find(cls => cls.id === data.classId)
    
    const newStudent = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      phone: data.phone,
      course: course.title,
      enrollDate: new Date().toISOString().split('T')[0],
      status: 'Ativo' as const,
      classId: data.classId,
      className: selectedClass?.courseName || '',
      shift: selectedClass?.shift || '',
      address: data.address || '',
      birthDate: data.birthDate || '',
      emergencyContact: data.emergencyContact || '',
      emergencyPhone: data.emergencyPhone || '',
      howDidYouHear: data.howDidYouHear || '',
      previousExperience: data.previousExperience || '',
      paymentStatus: 'pending' as const,
      notes: data.notes || ''
    }

    addStudent(newStudent)
    toast.success('Matrícula realizada com sucesso!')
    setShowEnrollmentForm(false)
  }

  const handleCheckoutSuccess = (paymentData: any) => {
    // Adicionar aluno após pagamento confirmado
    const newStudent = {
      id: Date.now(),
      name: paymentData.customer?.name || 'Aluno',
      email: paymentData.customer?.email || '',
      phone: paymentData.customer?.phone || '',
      course: course.title,
      enrollDate: new Date().toISOString().split('T')[0],
      status: 'Ativo' as const
    }

    addStudent(newStudent)
    toast.success('Pagamento confirmado! Matrícula realizada com sucesso!')
    setShowCheckout(false)
    
    // Redirecionar para área do aluno ou página de sucesso
    navigate('/courses')
  }

  const handleCheckoutCancel = () => {
    setShowCheckout(false)
  }

  const tabs = [
    { id: 'overview', label: 'Visão Geral' },
    { id: 'curriculum', label: 'Conteúdo' },
    { id: 'instructor', label: 'Instrutor' },
    { id: 'reviews', label: 'Avaliações' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link to="/cursos" className="text-blue-600 hover:text-blue-700 inline-flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar para Cursos
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                    {course.level}
                  </span>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {course.students} alunos
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      {course.rating} ({extendedCourse.reviews} avaliações)
                    </div>
                  </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {course.title}
                </h1>
                <p className="text-lg text-gray-600 mb-6">
                  {course.description}
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-lg">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Sobre o Curso</h3>
                      <p className="text-gray-700 leading-relaxed">{extendedCourse.longDescription}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">O que você vai aprender</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {(extendedCourse.benefits || []).map((benefit, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-700">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Requisitos</h3>
                      <ul className="space-y-2">
                        {(extendedCourse.requirements || []).map((requirement, index) => (
                          <li key={index} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                            <span className="text-gray-700">{requirement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Curriculum Tab */}
                {activeTab === 'curriculum' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Conteúdo do Curso</h3>
                    {(extendedCourse.modulesList || []).map((module, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg">
                        <div className="p-4 bg-gray-50">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900">
                              Módulo {index + 1}: {module.title}
                            </h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{module.lessons} aulas</span>
                              <span>{module.duration}</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <ul className="space-y-2">
                            {(module.topics || []).map((topic, topicIndex) => (
                              <li key={topicIndex} className="flex items-center space-x-2">
                                <Play className="h-4 w-4 text-blue-500" />
                                <span className="text-gray-700">{topic}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Instructor Tab */}
                {activeTab === 'instructor' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Seu Instrutor</h3>
                    <div className="flex items-start space-x-6">
                      <img
                        src={extendedCourse.instructorData?.image || 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20photographer%20instructor%20portrait&image_size=square'}
                        alt={extendedCourse.instructorData?.name || 'Instrutor'}
                        className="w-24 h-24 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-2">{extendedCourse.instructorData?.name || 'Instrutor'}</h4>
                        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                          <span>{extendedCourse.instructorData?.experience || '10+ anos'}</span>
                          <span>{extendedCourse.instructorData?.students || '1000+ alunos'}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{extendedCourse.instructorData?.bio || 'Instrutor experiente em fotografia digital.'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Avaliações dos Alunos</h3>
                    <div className="text-center py-8">
                      <div className="text-4xl font-bold text-gray-900 mb-2">{course.rating}</div>
                      <div className="flex justify-center mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="text-gray-600">{extendedCourse.reviews} avaliações</p>
                    </div>
                    <div className="text-center text-gray-500">
                      <p>Avaliações detalhadas em breve...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  R$ {course.price}
                </div>
                <div className="text-gray-500 line-through">
                  R$ {course.originalPrice}
                </div>
                <div className="text-sm text-green-600 font-medium">
                  Economize R$ {course.originalPrice - course.price}
                </div>
              </div>

              {/* Seleção de Turma */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Escolha sua turma:</h4>
                <ClassSelector 
                  course={course} 
                  onAddToCart={handleAddToCart}
                />
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duração:</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Nível:</span>
                  <span className="font-medium">{course.level}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Alunos:</span>
                  <span className="font-medium">{course.students}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Certificado:</span>
                  <span className="font-medium flex items-center">
                    <Award className="h-4 w-4 mr-1 text-yellow-500" />
                    Sim
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">Este curso inclui:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Acesso vitalício</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Certificado de conclusão</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Suporte do instrutor</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Download className="h-4 w-4 text-green-500" />
                    <span>Material para download</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Modal */}
      {showEnrollmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Inscrever-se no Curso</h3>
                <button
                  onClick={() => setShowEnrollmentForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Informações Pessoais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome Completo *
                    </label>
                    <input
                      {...register('name')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.email && (
                      <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone *
                    </label>
                    <input
                      {...register('phone')}
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Nascimento
                    </label>
                    <input
                      {...register('birthDate')}
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Endereço
                  </label>
                  <input
                    {...register('address')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Rua, número, bairro, cidade"
                  />
                </div>

                {/* Contato de Emergência */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contato de Emergência
                    </label>
                    <input
                      {...register('emergencyContact')}
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Nome do contato"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefone de Emergência
                    </label>
                    <input
                      {...register('emergencyPhone')}
                      type="tel"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Seleção de Turma */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Turma *
                  </label>
                  <select
                    {...register('classId')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    onChange={(e) => {
                      const selectedClass = availableClasses.find(cls => cls.id === e.target.value)
                      if (selectedClass) {
                        setValue('className', selectedClass.courseName)
                        setValue('shift', selectedClass.shift)
                      }
                    }}
                  >
                    <option value="">Selecione uma turma...</option>
                    {availableClasses.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.courseName} - {cls.shift} ({cls.startDate} a {cls.endDate})
                      </option>
                    ))}
                  </select>
                  {errors.classId && (
                    <p className="text-red-500 text-sm mt-1">{errors.classId.message}</p>
                  )}
                </div>

                {/* Informações Adicionais */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nível de Experiência
                    </label>
                    <select
                      {...register('previousExperience')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Selecione...</option>
                      <option value="Nenhuma">Nenhuma</option>
                      <option value="Básica">Básica</option>
                      <option value="Intermediária">Intermediária</option>
                      <option value="Avançada">Avançada</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Como soube do curso?
                    </label>
                    <select
                      {...register('howDidYouHear')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">Selecione...</option>
                      <option value="Google">Google</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Indicação">Indicação de amigo</option>
                      <option value="Outros">Outros</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observações
                  </label>
                  <textarea
                    {...register('notes')}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Conte-nos sobre seus objetivos ou alguma informação adicional..."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEnrollmentForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Inscrever-se
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <CheckoutAsaas
          course={course}
          onSuccess={handleCheckoutSuccess}
          onCancel={handleCheckoutCancel}
        />
      )}
    </div>
  )
}

export default CourseDetail