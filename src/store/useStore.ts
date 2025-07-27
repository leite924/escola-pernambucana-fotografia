import { create } from 'zustand'

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
  shifts: ('manhã' | 'tarde' | 'noite' | 'sábado')[] // Turnos disponíveis: manhã, tarde, noite, sábado
}

interface ClassSchedule {
  id: string
  courseId: number
  courseName: string
  shift: 'manhã' | 'tarde' | 'noite' | 'sábado'
  startDate: string
  endDate: string
  schedule: string // Ex: "Segunda e Quarta 19h às 22h"
  maxStudents: number
  enrolledStudents: number
  instructor: string
  status: 'active' | 'inactive' | 'completed' | 'cancelled'
}

interface Student {
  id: number
  name: string
  email: string
  phone: string
  course: string
  classId?: string // ID da turma específica
  className?: string // Nome da turma para exibição
  shift?: string // Turno da turma
  enrollDate: string
  status: 'Ativo' | 'Inativo' | 'pending' | 'Pausado' | 'Concluído'
  paymentStatus?: 'paid' | 'pending' | 'overdue'
  notes?: string
  address?: string
  birthDate?: string
  emergencyContact?: string
  emergencyPhone?: string
  howDidYouHear?: string
  previousExperience?: string
  attendancePercentage?: number
  totalClasses?: number
  attendedClasses?: number
  certificateNumber?: string
  certificateIssuedDate?: string
}

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'student'
}

interface AffiliateUser {
  id: number
  name: string
  email: string
  phone?: string
  registrationDate: string
}

interface CartItem {
  id: string
  classSchedule: ClassSchedule
  course: Course
  quantity: number
  addedAt: string
}

interface OrderBump {
  id: string
  title: string
  description: string
  originalPrice: number
  discountPrice: number
  image: string
  features: string[]
  courseIds: number[] // Cursos que este order bump se aplica
}

interface AppState {
  // Authentication
  user: User | null
  isAuthenticated: boolean
  isStudentAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loginStudent: (email: string, password: string) => Promise<boolean>
  logoutStudent: () => void
  
  // Affiliate Authentication
  affiliateUser: AffiliateUser | null
  setAffiliateUser: (user: AffiliateUser | null) => void
  
  // Cart functions
  cartItems: CartItem[]
  addToCart: (classSchedule: ClassSchedule, course: Course) => void
  removeFromCart: (classScheduleId: string) => void
  updateCartQuantity: (classScheduleId: string, quantity: number) => void
  clearCart: () => void
  getCartTotal: () => number
  getCartItemsCount: () => number
  
  // Order Bumps
  orderBumps: OrderBump[]
  selectedOrderBumps: string[]
  addOrderBump: (orderBumpId: string) => void
  removeOrderBump: (orderBumpId: string) => void
  getOrderBumpsForCart: () => OrderBump[]
  getOrderBumpsTotal: () => number
  
  // Courses
  courses: Course[]
  selectedCourse: Course | null
  setCourses: (courses: Course[]) => void
  setSelectedCourse: (course: Course | null) => void
  addCourse: (course: Omit<Course, 'id'>) => void
  updateCourse: (id: number, course: Partial<Course>) => void
  deleteCourse: (id: number) => void
  
  // Class Schedules
  classSchedules: ClassSchedule[]
  addClassSchedule: (classSchedule: Omit<ClassSchedule, 'id'>) => void
  updateClassSchedule: (id: string, classSchedule: Partial<ClassSchedule>) => void
  deleteClassSchedule: (id: string) => void
  getClassesByCourse: (courseId: number) => ClassSchedule[]
  
  // Students
  students: Student[]
  setStudents: (students: Student[]) => void
  addStudent: (student: Omit<Student, 'id'>) => void
  updateStudent: (id: number, student: Partial<Student>) => void
  deleteStudent: (id: number) => void
  
  // UI State
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  loading: boolean
  setLoading: (loading: boolean) => void
}

const mockCourses: Course[] = [
  {
    id: 1,
    title: 'Fotografia Digital Completa',
    description: 'Aprenda todos os fundamentos da fotografia digital, desde o básico até técnicas avançadas de composição e edição.',
    price: 497,
    originalPrice: 697,
    duration: '8 semanas',
    students: 1250,
    rating: 4.9,
    instructor: 'Carlos Silva',
    level: 'Iniciante',
    category: 'Digital',
    modules: 12,
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20photographer%20with%20DSLR%20camera%20teaching%20photography%20basics%20in%20modern%20studio%20setting&image_size=landscape_16_9',
    shifts: ['manhã', 'tarde', 'noite'],
    features: [
      'Acesso vitalício ao conteúdo',
      'Certificado de conclusão',
      'Suporte direto com instrutor',
      'Projetos práticos',
      'Comunidade exclusiva'
    ],
    curriculum: [
      {
        module: 'Fundamentos da Fotografia',
        lessons: ['Introdução à Fotografia', 'Tipos de Câmeras', 'Configurações Básicas']
      },
      {
        module: 'Composição e Enquadramento',
        lessons: ['Regra dos Terços', 'Linhas de Força', 'Perspectiva']
      },
      {
        module: 'Iluminação',
        lessons: ['Luz Natural', 'Flash', 'Modificadores de Luz']
      }
    ]
  },
  {
    id: 2,
    title: 'Fotografia de Retrato Profissional',
    description: 'Domine a arte do retrato profissional com técnicas avançadas de iluminação e direção.',
    price: 697,
    originalPrice: 897,
    duration: '10 semanas',
    students: 850,
    rating: 4.8,
    instructor: 'Ana Costa',
    level: 'Intermediário',
    category: 'Retrato',
    modules: 15,
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20portrait%20photography%20session%20with%20model%20and%20studio%20lighting%20setup&image_size=landscape_16_9',
    shifts: ['tarde', 'noite', 'sábado'],
    features: [
      'Técnicas de iluminação profissional',
      'Direção de modelos',
      'Pós-produção avançada',
      'Portfolio profissional',
      'Networking na área'
    ],
    curriculum: [
      {
        module: 'Fundamentos do Retrato',
        lessons: ['Psicologia do Retrato', 'Equipamentos Essenciais', 'Configurações de Câmera']
      },
      {
        module: 'Iluminação de Estúdio',
        lessons: ['Setup Básico', 'Modificadores', 'Esquemas de Luz']
      }
    ]
  },
  {
    id: 3,
    title: 'Fotografia de Casamento',
    description: 'Especialize-se em fotografia de casamento e construa uma carreira lucrativa neste mercado.',
    price: 897,
    originalPrice: 1197,
    duration: '12 semanas',
    students: 650,
    rating: 4.9,
    instructor: 'Roberto Lima',
    level: 'Avançado',
    category: 'Casamento',
    modules: 18,
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20wedding%20photography%20scene%20with%20bride%20and%20groom%20romantic%20lighting&image_size=landscape_16_9',
    shifts: ['manhã', 'tarde', 'sábado'],
    features: [
      'Planejamento completo',
      'Técnicas de cerimônia',
      'Gestão de clientes',
      'Precificação profissional',
      'Marketing para fotógrafos'
    ],
    curriculum: [
      {
        module: 'Planejamento do Casamento',
        lessons: ['Reunião com Noivos', 'Timeline do Evento', 'Equipamentos Necessários']
      },
      {
        module: 'Técnicas de Cerimônia',
        lessons: ['Fotografia Discreta', 'Momentos Únicos', 'Trabalho em Equipe']
      }
    ]
  }
]

const mockClassSchedules: ClassSchedule[] = [
  {
    id: 'class-1-morning',
    courseId: 1,
    courseName: 'Fotografia Digital Completa',
    shift: 'manhã',
    startDate: '2024-03-01',
    endDate: '2024-04-26',
    schedule: 'Segunda e Quarta 9h às 12h',
    maxStudents: 15,
    enrolledStudents: 8,
    instructor: 'Carlos Silva',
    status: 'active'
  },
  {
    id: 'class-1-evening',
    courseId: 1,
    courseName: 'Fotografia Digital Completa',
    shift: 'noite',
    startDate: '2024-03-01',
    endDate: '2024-04-26',
    schedule: 'Terça e Quinta 19h às 22h',
    maxStudents: 15,
    enrolledStudents: 12,
    instructor: 'Carlos Silva',
    status: 'active'
  },
  {
    id: 'class-2-afternoon',
    courseId: 2,
    courseName: 'Fotografia de Retrato Profissional',
    shift: 'tarde',
    startDate: '2024-03-15',
    endDate: '2024-05-24',
    schedule: 'Sábado 14h às 18h',
    maxStudents: 12,
    enrolledStudents: 7,
    instructor: 'Ana Costa',
    status: 'active'
  },
  {
    id: 'class-2-evening',
    courseId: 2,
    courseName: 'Fotografia de Retrato Profissional',
    shift: 'noite',
    startDate: '2024-03-15',
    endDate: '2024-05-24',
    schedule: 'Segunda e Quarta 19h às 22h',
    maxStudents: 12,
    enrolledStudents: 9,
    instructor: 'Ana Costa',
    status: 'active'
  },
  {
    id: 'class-3-saturday',
    courseId: 3,
    courseName: 'Fotografia de Casamento',
    shift: 'sábado',
    startDate: '2024-04-01',
    endDate: '2024-06-22',
    schedule: 'Sábado 8h às 17h',
    maxStudents: 10,
    enrolledStudents: 6,
    instructor: 'Roberto Lima',
    status: 'active'
  },
  {
    id: 'class-3-morning',
    courseId: 3,
    courseName: 'Fotografia de Casamento',
    shift: 'manhã',
    startDate: '2024-04-01',
    endDate: '2024-06-22',
    schedule: 'Terça e Quinta 9h às 12h',
    maxStudents: 10,
    enrolledStudents: 4,
    instructor: 'Roberto Lima',
    status: 'active'
  }
]

const mockStudents: Student[] = [
  {
    id: 1,
    name: 'Maria Silva',
    email: 'maria@email.com',
    phone: '(11) 99999-9999',
    course: 'Fotografia Digital Completa',
    enrollDate: '2024-01-15',
    status: 'Ativo'
  },
  {
    id: 2,
    name: 'João Santos',
    email: 'joao@email.com',
    phone: '(11) 88888-8888',
    course: 'Fotografia de Retrato Profissional',
    enrollDate: '2024-01-20',
    status: 'Ativo'
  },
  {
    id: 3,
    name: 'Pedro Costa',
    email: 'pedro@email.com',
    phone: '(11) 77777-7777',
    course: 'Fotografia de Casamento',
    enrollDate: '2024-02-01',
    status: 'Ativo'
  }
]

const mockOrderBumps: OrderBump[] = [
  {
    id: 'ob1',
    title: 'Kit Lightroom + Presets Profissionais',
    description: 'Pacote completo com 50+ presets profissionais para Lightroom e curso de edição avançada',
    originalPrice: 297,
    discountPrice: 97,
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=lightroom%20presets%20collection%20professional%20photography%20editing&image_size=landscape_16_9',
    features: [
      '50+ Presets Profissionais',
      'Curso de Edição no Lightroom',
      'Suporte por 30 dias',
      'Atualizações gratuitas'
    ],
    courseIds: [1, 2, 3]
  },
  {
    id: 'ob2',
    title: 'Mentoria Individual 1:1',
    description: 'Sessão de mentoria individual de 2 horas com instrutor especialista',
    originalPrice: 497,
    discountPrice: 197,
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=one%20on%20one%20photography%20mentoring%20session%20professional%20instructor&image_size=landscape_16_9',
    features: [
      '2 horas de mentoria individual',
      'Análise do seu portfólio',
      'Plano de carreira personalizado',
      'Gravação da sessão'
    ],
    courseIds: [2, 3]
  },
  {
    id: 'ob3',
    title: 'Equipamentos Essenciais - Guia Completo',
    description: 'E-book completo sobre equipamentos fotográficos com desconto em lojas parceiras',
    originalPrice: 97,
    discountPrice: 27,
    image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=photography%20equipment%20guide%20cameras%20lenses%20accessories&image_size=landscape_16_9',
    features: [
      'E-book com 100+ páginas',
      'Guia de compras atualizado',
      'Cupons de desconto',
      'Lista de fornecedores'
    ],
    courseIds: [1]
  }
]

export const useStore = create<AppState>((set, get) => ({
  // Authentication
  user: null,
  isAuthenticated: false,
  isStudentAuthenticated: false,
  
  // Affiliate Authentication
  affiliateUser: null,
  setAffiliateUser: (user) => set({ affiliateUser: user }),
  
  // Shopping Cart
  cartItems: [],
  
  addToCart: (classSchedule, course) => {
    const { cartItems } = get()
    const existingItem = cartItems.find(item => item.classSchedule.id === classSchedule.id)
    
    if (existingItem) {
      set({
        cartItems: cartItems.map(item =>
          item.classSchedule.id === classSchedule.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      })
    } else {
      const newItem: CartItem = {
        id: `cart-${Date.now()}-${classSchedule.id}`,
        classSchedule,
        course,
        quantity: 1,
        addedAt: new Date().toISOString()
      }
      set({ cartItems: [...cartItems, newItem] })
    }
  },
  
  removeFromCart: (classScheduleId) => {
    const { cartItems } = get()
    set({ cartItems: cartItems.filter(item => item.classSchedule.id !== classScheduleId) })
  },
  
  updateCartQuantity: (classScheduleId, quantity) => {
    const { cartItems } = get()
    if (quantity <= 0) {
      set({ cartItems: cartItems.filter(item => item.classSchedule.id !== classScheduleId) })
    } else {
      set({
        cartItems: cartItems.map(item =>
          item.classSchedule.id === classScheduleId
            ? { ...item, quantity }
            : item
        )
      })
    }
  },
  
  clearCart: () => set({ cartItems: [] }),
  
  getCartTotal: () => {
    const { cartItems } = get()
    return cartItems.reduce((total, item) => total + (item.course.price * item.quantity), 0)
  },
  
  getCartItemsCount: () => {
    const { cartItems } = get()
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  },
  
  // Order Bumps
  orderBumps: mockOrderBumps,
  selectedOrderBumps: [],
  
  addOrderBump: (orderBumpId) => {
    const { selectedOrderBumps } = get()
    if (!selectedOrderBumps.includes(orderBumpId)) {
      set({ selectedOrderBumps: [...selectedOrderBumps, orderBumpId] })
    }
  },
  
  removeOrderBump: (orderBumpId) => {
    const { selectedOrderBumps } = get()
    set({ selectedOrderBumps: selectedOrderBumps.filter(id => id !== orderBumpId) })
  },
  
  getOrderBumpsForCart: () => {
    const { cartItems, orderBumps } = get()
    const cartCourseIds = cartItems.map(item => item.course.id)
    
    return orderBumps.filter(bump => 
      bump.courseIds.some(courseId => cartCourseIds.includes(courseId))
    )
  },
  
  getOrderBumpsTotal: () => {
    const { selectedOrderBumps, orderBumps } = get()
    return selectedOrderBumps.reduce((total, bumpId) => {
      const bump = orderBumps.find(b => b.id === bumpId)
      return total + (bump ? bump.discountPrice : 0)
    }, 0)
  },
  
  login: async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Demo credentials
    if (email === 'admin@escola.com' && password === 'admin123') {
      const user = {
        id: 1,
        name: 'Administrador',
        email: 'admin@escola.com',
        role: 'admin' as const
      }
      
      set({ user, isAuthenticated: true })
      localStorage.setItem('adminAuth', 'true')
      localStorage.setItem('adminUser', JSON.stringify(user))
      return true
    }
    
    return false
  },
  
  logout: () => {
    set({ user: null, isAuthenticated: false })
    localStorage.removeItem('adminAuth')
    localStorage.removeItem('adminUser')
  },
  
  loginStudent: async (email: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Demo credentials for student
    if (email === 'aluno@escola.com' && password === 'aluno123') {
      const user = {
        id: 2,
        name: 'Aluno Demonstração',
        email: 'aluno@escola.com',
        role: 'student' as const
      }
      
      set({ user, isStudentAuthenticated: true })
      localStorage.setItem('studentAuth', 'true')
      localStorage.setItem('studentUser', JSON.stringify(user))
      return true
    }
    
    // Check if email exists in students list
    const students = get().students
    const student = students.find(s => s.email === email)
    
    if (student && password === 'senha123') { // Default password for demo
      const user = {
        id: student.id,
        name: student.name,
        email: student.email,
        role: 'student' as const
      }
      
      set({ user, isStudentAuthenticated: true })
      localStorage.setItem('studentAuth', 'true')
      localStorage.setItem('studentUser', JSON.stringify(user))
      return true
    }
    
    return false
  },
  
  logoutStudent: () => {
    set({ user: null, isStudentAuthenticated: false })
    localStorage.removeItem('studentAuth')
    localStorage.removeItem('studentUser')
  },
  
  // Courses
  courses: mockCourses,
  selectedCourse: null,
  
  // Class Schedules
  classSchedules: mockClassSchedules,
  
  setCourses: (courses) => set({ courses }),
  setSelectedCourse: (course) => set({ selectedCourse: course }),
  
  addCourse: (courseData) => {
    const newCourse = {
      ...courseData,
      id: Date.now() // Simple ID generation
    }
    set(state => ({ courses: [...state.courses, newCourse] }))
  },
  
  updateCourse: (id, courseData) => {
    set(state => ({
      courses: state.courses.map(course => 
        course.id === id ? { ...course, ...courseData } : course
      )
    }))
  },
  
  deleteCourse: (id) => {
    set(state => ({
      courses: state.courses.filter(course => course.id !== id)
    }))
  },
  
  // Class Schedules
  addClassSchedule: (classScheduleData) => {
    const newClassSchedule = {
      ...classScheduleData,
      id: Date.now().toString()
    }
    set(state => ({ classSchedules: [...state.classSchedules, newClassSchedule] }))
  },

  updateClassSchedule: (id, classScheduleData) => {
    set(state => ({
      classSchedules: state.classSchedules.map(classSchedule => 
        classSchedule.id === id ? { ...classSchedule, ...classScheduleData } : classSchedule
      )
    }))
  },

  deleteClassSchedule: (id) => {
    set(state => ({
      classSchedules: state.classSchedules.filter(classSchedule => classSchedule.id !== id)
    }))
  },
  
  getClassesByCourse: (courseId) => {
    return get().classSchedules.filter(classSchedule => classSchedule.courseId === courseId)
  },
  
  // Students
  students: mockStudents,
  
  setStudents: (students) => set({ students }),
  
  addStudent: (studentData) => {
    const newStudent = {
      ...studentData,
      id: Date.now()
    }
    set(state => ({ students: [...state.students, newStudent] }))
  },
  
  updateStudent: (id, studentData) => {
    set(state => ({
      students: state.students.map(student => 
        student.id === id ? { ...student, ...studentData } : student
      )
    }))
  },
  
  deleteStudent: (id) => {
    set(state => ({
      students: state.students.filter(student => student.id !== id)
    }))
  },
  
  // UI State
  sidebarOpen: false,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  
  loading: false,
  setLoading: (loading) => set({ loading })
}))

// Initialize auth state from localStorage
if (typeof window !== 'undefined') {
  const adminAuth = localStorage.getItem('adminAuth')
  const adminUser = localStorage.getItem('adminUser')
  const studentAuth = localStorage.getItem('studentAuth')
  const studentUser = localStorage.getItem('studentUser')
  
  if (adminAuth && adminUser) {
    try {
      const user = JSON.parse(adminUser)
      useStore.setState({ user, isAuthenticated: true })
    } catch (error) {
      console.error('Error parsing stored admin user data:', error)
      localStorage.removeItem('adminAuth')
      localStorage.removeItem('adminUser')
    }
  }
  
  if (studentAuth && studentUser) {
    try {
      const user = JSON.parse(studentUser)
      useStore.setState({ user, isStudentAuthenticated: true })
    } catch (error) {
      console.error('Error parsing stored student user data:', error)
      localStorage.removeItem('studentAuth')
      localStorage.removeItem('studentUser')
    }
  }
}