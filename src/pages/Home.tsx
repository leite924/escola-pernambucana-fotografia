import { Link } from 'react-router-dom'
import { Camera, Users, Award, BookOpen, Star, Play, CheckCircle, ArrowRight, Zap, Target, Trophy } from 'lucide-react'
import AffiliateBanner from '../components/AffiliateBanner'
import ClassSelector from '../components/ClassSelector'
import { useStore } from '../store/useStore'

const Home = () => {
  const { courses, addToCart } = useStore()
  
  const featuredCourses = [
    {
      id: 1,
      title: 'Fotografia Digital Completa',
      description: 'Do básico ao avançado em 12 semanas',
      price: 'R$ 497',
      originalPrice: 'R$ 897',
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20photographer%20teaching%20digital%20photography%20in%20modern%20studio&image_size=landscape_4_3',
      level: 'Iniciante',
      duration: '12 semanas'
    },
    {
      id: 2,
      title: 'Fotografia de Retrato Profissional',
      description: 'Técnicas avançadas para retratos impactantes',
      price: 'R$ 697',
      originalPrice: 'R$ 1.197',
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=portrait%20photography%20session%20with%20professional%20lighting%20setup&image_size=landscape_4_3',
      level: 'Intermediário',
      duration: '8 semanas'
    },
    {
      id: 3,
      title: 'Fotografia de Casamento',
      description: 'Capture momentos únicos e emocionantes',
      price: 'R$ 897',
      originalPrice: 'R$ 1.497',
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=wedding%20photographer%20capturing%20romantic%20moment%20with%20professional%20camera&image_size=landscape_4_3',
      level: 'Avançado',
      duration: '10 semanas'
    }
  ]

  const testimonials = [
    {
      name: 'Maria Silva',
      role: 'Fotógrafa Freelancer',
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20female%20photographer%20smiling%20portrait&image_size=square',
      text: 'Depois do curso, consegui triplicar minha renda como fotógrafa. As técnicas ensinadas são realmente profissionais!',
      rating: 5
    },
    {
      name: 'João Santos',
      role: 'Fotógrafo de Eventos',
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20male%20photographer%20with%20camera%20portrait&image_size=square',
      text: 'Saí do zero e hoje tenho meu próprio estúdio. O curso mudou minha vida profissional completamente.',
      rating: 5
    },
    {
      name: 'Ana Costa',
      role: 'Fotógrafa de Moda',
      image: 'https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=fashion%20photographer%20woman%20professional%20portrait&image_size=square',
      text: 'Os professores são incríveis! Aprendi técnicas que só via em grandes produções internacionais.',
      rating: 5
    }
  ]

  const benefits = [
    'Certificado reconhecido pelo mercado',
    'Aulas práticas em estúdio profissional',
    'Mentoria individual com fotógrafos renomados',
    'Acesso vitalício ao material do curso',
    'Comunidade exclusiva de alunos',
    'Suporte para montagem de portfólio'
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white py-24 overflow-hidden" style={{background: 'linear-gradient(135deg, #6246de 0%, #4338ca 50%, #3730a3 100%)'}}>
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium">
                <Zap className="w-4 h-4 text-yellow-400" />
                Escola de Fotografia #1 do Recife
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Domine a Arte da
                <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Fotografia Profissional
                </span>
              </h1>
              <p className="text-xl text-gray-100 leading-relaxed max-w-lg">
                Transforme sua paixão em uma carreira de sucesso. Aprenda com fotógrafos renomados, 
                domine técnicas avançadas e construa um portfólio impressionante que abre portas no mercado.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/cursos" 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 inline-flex items-center justify-center gap-2"
                >
                  Começar Agora <ArrowRight className="w-5 h-5" />
                </Link>
                <button className="border-2 border-white/30 hover:bg-white/10 backdrop-blur-sm px-8 py-4 rounded-lg font-semibold text-lg transition-all inline-flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" /> Ver Demonstração
                </button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">500+</div>
                  <div className="text-sm text-gray-200">Alunos Formados</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">98%</div>
                  <div className="text-sm text-gray-200">Satisfação</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">15+</div>
                  <div className="text-sm text-gray-200">Anos Experiência</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10">
                <img 
                  src="https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=professional%20photographer%20with%20modern%20DSLR%20camera%20in%20beautiful%20studio%20setting%20with%20soft%20lighting%20and%20purple%20accents&image_size=square_hd" 
                  alt="Fotógrafo profissional em estúdio moderno" 
                  className="rounded-2xl shadow-2xl transform hover:scale-105 transition-transform"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 bg-white text-gray-900 p-6 rounded-2xl shadow-xl z-20">
                <div className="flex items-center gap-4">
                  <div className="text-white p-3 rounded-full" style={{backgroundColor: '#6246de'}}>
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">Certificação</p>
                    <p className="text-sm text-gray-600">Reconhecida no Mercado</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 text-white p-4 rounded-xl shadow-xl z-20" style={{background: 'linear-gradient(135deg, #6246de, #4338ca)'}}>
                <div className="text-center">
                  <div className="flex items-center gap-1 justify-center mb-1">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold">4.9</span>
                  </div>
                  <p className="text-xs opacity-90">Avaliação</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Números que Comprovam Nossa Excelência
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Mais de uma década formando os melhores fotógrafos profissionais do mercado
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 transform hover:scale-105 transition-transform">
              <div className="text-5xl font-bold mb-2" style={{color: '#6246de'}}>2.500+</div>
              <div className="text-gray-600 font-medium">Alunos Formados</div>
              <div className="text-sm text-gray-500 mt-1">Em 15 anos de história</div>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 transform hover:scale-105 transition-transform">
              <div className="text-5xl font-bold text-gray-600 mb-2">98%</div>
              <div className="text-gray-600 font-medium">Taxa de Satisfação</div>
              <div className="text-sm text-gray-500 mt-1">Avaliação dos alunos</div>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-yellow-50 transform hover:scale-105 transition-transform">
              <div className="text-5xl font-bold text-orange-600 mb-2">15</div>
              <div className="text-gray-600 font-medium">Anos de Experiência</div>
              <div className="text-sm text-gray-500 mt-1">Liderando o mercado</div>
            </div>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 transform hover:scale-105 transition-transform">
              <div className="text-5xl font-bold text-gray-600 mb-2">50+</div>
              <div className="text-gray-600 font-medium">Prêmios Conquistados</div>
              <div className="text-sm text-gray-500 mt-1">Reconhecimento nacional</div>
            </div>
          </div>
        </div>
      </section>

      {/* Affiliate Banner */}
      <AffiliateBanner />

      {/* Featured Courses */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cursos em Destaque
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Escolha o curso ideal para o seu nível e comece sua jornada profissional hoje mesmo
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded">
                      {course.level}
                    </span>
                    <span className="text-gray-500 text-sm">{course.duration}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                  <p className="text-gray-600 mb-4">{course.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-gray-600">{course.price}</span>
                      <span className="text-gray-500 line-through ml-2">{course.originalPrice}</span>
                    </div>
                  </div>
                  <Link
                    to={`/curso/${course.id}`}
                    className="w-full text-white py-3 px-4 rounded-lg font-semibold transition-all transform hover:scale-105 inline-flex items-center justify-center"
                    style={{background: 'linear-gradient(135deg, #6246de, #4338ca)'}}
                  >
                    Saiba Mais
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Course Selection */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full text-sm font-medium text-blue-800 mb-4">
              <Zap className="w-4 h-4 text-blue-600" />
              Matrícula Simplificada
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Escolha Seu Curso e Turma
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Selecione facilmente o curso desejado, escolha o mês e turno que melhor se adequa à sua rotina
            </p>
          </div>
          
          <div className="relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-r from-white to-transparent w-12 h-full"></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-l from-white to-transparent w-12 h-full"></div>
            
            <div className="overflow-x-auto pb-4 px-2 -mx-2 scrollbar-hide">
              <div className="flex space-x-6 pb-4" style={{minWidth: 'max-content'}}>
                {courses.map((course) => (
                  <div key={course.id} className="flex-shrink-0 w-80">
                    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100">
                      <div className="flex items-center space-x-4 mb-4">
                        <img
                          src={course.image}
                          alt={course.title}
                          className="w-16 h-16 object-cover rounded-lg shadow-sm"
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{course.title}</h3>
                          <p className="text-sm text-gray-600">{course.level} • {course.duration}</p>
                          <p className="text-lg font-bold text-blue-600">R$ {course.price.toFixed(2).replace('.', ',')}</p>
                        </div>
                      </div>
                      <ClassSelector 
                        course={course} 
                        onAddToCart={(classSchedule) => addToCart(classSchedule, course)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Por que escolher a FotoEscola?
              </h2>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-gray-500 flex-shrink-0" />
                    <span className="text-lg text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <img
                src="https://trae-api-us.mchost.guru/api/ide/v1/text_to_image?prompt=photography%20students%20learning%20in%20modern%20classroom%20with%20professional%20equipment&image_size=square_hd"
                alt="Alunos aprendendo fotografia"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              O que nossos alunos dizem
            </h2>
            <p className="text-xl text-gray-600">
              Histórias reais de transformação profissional
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-white relative overflow-hidden" style={{background: 'linear-gradient(135deg, #6246de 0%, #4338ca 50%, #3730a3 100%)'}}>
        <div className="absolute inset-0">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-purple-300/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              Sua Jornada Profissional
              <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Começa Agora
              </span>
            </h2>
            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-gray-100">
              Não deixe seus sonhos para depois. Milhares de fotógrafos já transformaram suas vidas conosco. 
              Seja o próximo a conquistar o sucesso que você merece.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link
                to="/cursos"
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black px-10 py-5 rounded-lg text-xl font-bold transition-all transform hover:scale-105 inline-flex items-center justify-center"
              >
                Escolher Meu Curso
                <ArrowRight className="ml-3 h-6 w-6" />
              </Link>
              <Link
                to="/contato"
                className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-10 py-5 rounded-lg text-xl font-bold transition-all inline-flex items-center justify-center"
              >
                Falar com Especialista
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
                  <Target className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Foco no Mercado</h3>
                  <p className="text-gray-200 text-sm">Técnicas atuais que o mercado procura</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
                  <Users className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Mentoria Exclusiva</h3>
                  <p className="text-gray-200 text-sm">Acompanhamento personalizado</p>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
                  <Trophy className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Certificação</h3>
                  <p className="text-gray-200 text-sm">Reconhecida em todo o país</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home