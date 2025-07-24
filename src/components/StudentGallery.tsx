import { useState, useEffect } from 'react'
import { Camera, Heart, Eye, User, Calendar, Filter, Search } from 'lucide-react'
import { toast } from 'sonner'

interface Photo {
  id: number
  title: string
  imageUrl: string
  studentName: string
  studentId: number
  course: string
  category: string
  description: string
  likes: number
  views: number
  uploadDate: string
  status: 'approved' | 'pending' | 'rejected'
  tags: string[]
  camera?: string
  settings?: {
    aperture?: string
    shutter?: string
    iso?: string
    focal?: string
  }
}



const StudentGallery = () => {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [filteredPhotos, setFilteredPhotos] = useState<Photo[]>([])
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const categories = [
    { value: 'all', label: 'Todas as Categorias' },
    { value: 'portrait', label: 'Retrato' },
    { value: 'landscape', label: 'Paisagem' },
    { value: 'street', label: 'Street Photography' },
    { value: 'macro', label: 'Macro' },
    { value: 'wedding', label: 'Casamento' },
    { value: 'fashion', label: 'Moda' },
    { value: 'product', label: 'Produto' },
    { value: 'architecture', label: 'Arquitetura' },
    { value: 'nature', label: 'Natureza' },
    { value: 'event', label: 'Eventos' }
  ]

  // Mock data - em produção viria de uma API
  useEffect(() => {
    const mockPhotos: Photo[] = [
      {
        id: 1,
        title: 'Retrato em Golden Hour',
        imageUrl: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20portrait%20photography%20golden%20hour%20natural%20lighting%20professional%20quality&image_size=landscape_4_3',
        studentName: 'Ana Silva',
        studentId: 1,
        course: 'Fotografia Digital Completa',
        category: 'portrait',
        description: 'Retrato capturado durante o golden hour, explorando a luz natural e técnicas de composição aprendidas no curso.',
        likes: 24,
        views: 156,
        uploadDate: '2024-01-15',
        status: 'approved',
        tags: ['retrato', 'golden-hour', 'luz-natural'],
        camera: 'Canon EOS R6',
        settings: {
          aperture: 'f/2.8',
          shutter: '1/250s',
          iso: '400',
          focal: '85mm'
        }
      },
      {
        id: 2,
        title: 'Paisagem Urbana Noturna',
        imageUrl: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=urban%20night%20cityscape%20photography%20long%20exposure%20city%20lights%20professional&image_size=landscape_16_9',
        studentName: 'Carlos Mendes',
        studentId: 2,
        course: 'Fotografia Noturna',
        category: 'landscape',
        description: 'Captura noturna da cidade utilizando técnicas de longa exposição para criar rastros de luz.',
        likes: 31,
        views: 203,
        uploadDate: '2024-01-12',
        status: 'approved',
        tags: ['noturna', 'cidade', 'longa-exposição'],
        camera: 'Sony A7 III',
        settings: {
          aperture: 'f/8',
          shutter: '30s',
          iso: '100',
          focal: '24mm'
        }
      },
      {
        id: 3,
        title: 'Street Photography - Movimento',
        imageUrl: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=street%20photography%20urban%20life%20candid%20moment%20black%20white%20documentary%20style&image_size=square_hd',
        studentName: 'Marina Costa',
        studentId: 3,
        course: 'Street Photography',
        category: 'street',
        description: 'Momento espontâneo capturado nas ruas, demonstrando técnicas de fotografia documental.',
        likes: 18,
        views: 89,
        uploadDate: '2024-01-10',
        status: 'approved',
        tags: ['street', 'documental', 'preto-branco'],
        camera: 'Fujifilm X-T4',
        settings: {
          aperture: 'f/5.6',
          shutter: '1/125s',
          iso: '800',
          focal: '35mm'
        }
      }
    ]
    setPhotos(mockPhotos)
    setFilteredPhotos(mockPhotos)
  }, [])

  // Filtrar fotos
  useEffect(() => {
    let filtered = photos.filter(photo => photo.status === 'approved')
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(photo => photo.category === selectedCategory)
    }
    
    if (searchTerm) {
      filtered = filtered.filter(photo => 
        photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        photo.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        photo.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }
    
    setFilteredPhotos(filtered)
  }, [photos, selectedCategory, searchTerm])



  const handleLike = (photoId: number) => {
    setPhotos(prev => prev.map(photo => 
      photo.id === photoId 
        ? { ...photo, likes: photo.likes + 1 }
        : photo
    ))
    toast.success('Curtida adicionada!')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Galeria dos Alunos
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Explore os trabalhos incríveis dos nossos alunos. Para enviar suas fotos, acesse a área do aluno em "Meus Cursos".
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar por título, aluno ou tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Category Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {filteredPhotos.map((photo) => (
            <div key={photo.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              {/* Image */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={photo.imageUrl}
                  alt={photo.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                  {categories.find(c => c.value === photo.category)?.label}
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{photo.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{photo.description}</p>
                
                {/* Student Info */}
                <div className="flex items-center space-x-2 mb-4">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{photo.studentName}</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-sm text-gray-500">{photo.course}</span>
                </div>
                
                {/* Camera Settings */}
                {photo.settings && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Camera className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">{photo.camera}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      {photo.settings.aperture && <span>f/{photo.settings.aperture}</span>}
                      {photo.settings.shutter && <span>{photo.settings.shutter}</span>}
                      {photo.settings.iso && <span>ISO {photo.settings.iso}</span>}
                      {photo.settings.focal && <span>{photo.settings.focal}</span>}
                    </div>
                  </div>
                )}
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {photo.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                
                {/* Stats and Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{photo.views}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(photo.uploadDate).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleLike(photo.id)}
                    className="flex items-center space-x-1 text-red-500 hover:text-red-600 transition-colors"
                  >
                    <Heart className="h-4 w-4" />
                    <span className="text-sm">{photo.likes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPhotos.length === 0 && (
          <div className="text-center py-12">
            <Camera className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Nenhuma foto encontrada
            </h3>
            <p className="text-gray-500">
              Tente ajustar os filtros ou seja o primeiro a compartilhar uma foto!
            </p>
          </div>
        )}


      </div>
    </div>
  )
}

export default StudentGallery