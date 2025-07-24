import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Star, Clock, Users, BookOpen, ShoppingCart, ArrowRight } from 'lucide-react'
import { useStore } from '../store/useStore'
import { toast } from 'sonner'
import ClassSelector from '../components/ClassSelector'

const Courses = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  const { courses, classSchedules, setSelectedCourse, addToCart } = useStore()

  const handleAddToCart = (classSchedule: any, course: any) => {
    addToCart(classSchedule, course)
    toast.success(`Turma ${classSchedule.shift} de ${course.title} adicionada ao carrinho!`)
  }

  const getClassesForCourse = (courseId: number) => {
    return classSchedules.filter(cls => cls.courseId === courseId && cls.status === 'active')
  }

  const handleCourseClick = (course: any) => {
    setSelectedCourse(course)
  }

  const categories = [
    { id: 'all', name: 'Todos os Cursos' },
    { id: 'digital', name: 'Fotografia Digital' },
    { id: 'portrait', name: 'Retrato' },
    { id: 'wedding', name: 'Casamento' },
    { id: 'fashion', name: 'Moda' },
    { id: 'landscape', name: 'Paisagem' },
    { id: 'commercial', name: 'Comercial' }
  ]

  const levels = [
    { id: 'all', name: 'Todos os Níveis' },
    { id: 'beginner', name: 'Iniciante' },
    { id: 'intermediate', name: 'Intermediário' },
    { id: 'advanced', name: 'Avançado' }
  ]



  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesCategory && matchesLevel && matchesSearch
  })

  const getLevelLabel = (level: string) => {
    switch (level) {
      case 'beginner': return 'Iniciante'
      case 'intermediate': return 'Intermediário'
      case 'advanced': return 'Avançado'
      default: return level
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Nossos Cursos
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Escolha entre nossa seleção de cursos profissionais e transforme sua paixão pela fotografia em uma carreira de sucesso
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar cursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {levels.map(level => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSelectedCategory('all')
                setSelectedLevel('all')
                setSearchTerm('')
              }}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Limpar Filtros
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Mostrando {filteredCourses.length} de {courses.length} cursos
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-2 py-1 rounded text-sm font-medium ${getLevelColor(course.level)}`}>
                    {getLevelLabel(course.level)}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                
                <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {course.students}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    {course.rating}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-green-600">R$ {course.price}</span>
                    <span className="text-gray-500 line-through ml-2">R$ {course.originalPrice}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {course.modules} módulos
                  </div>
                </div>
                
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Instrutor:</span> {course.instructor}
                  </p>
                </div>
                
                {/* Seleção de Turma */}
                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-3">Escolha sua turma:</h4>
                  <ClassSelector 
                    course={course} 
                    onAddToCart={handleAddToCart}
                  />
                </div>

                <div className="space-y-2">
                  <Link
                    to={`/curso/${course.id}`}
                    onClick={() => handleCourseClick(course)}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
                  >
                    Ver Detalhes
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nenhum curso encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              Tente ajustar os filtros ou termos de busca
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all')
                setSelectedLevel('all')
                setSearchTerm('')
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
            >
              Ver Todos os Cursos
            </button>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-blue-600 text-white rounded-lg p-8 mt-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Não encontrou o curso ideal?
          </h2>
          <p className="text-lg mb-6">
            Entre em contato conosco e vamos ajudar você a escolher o melhor caminho para sua carreira
          </p>
          <Link
            to="/contato"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
          >
            Falar com Especialista
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Courses