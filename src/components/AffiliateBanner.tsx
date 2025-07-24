import { useState } from 'react'
import { Link } from 'react-router-dom'
import { DollarSign, Users, TrendingUp, ArrowRight, Star, Gift } from 'lucide-react'

const AffiliateBanner = () => {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white py-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute inset-0">
        <div className="absolute top-4 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-4 right-10 w-40 h-40 bg-green-300/20 rounded-full blur-2xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-0 right-4 text-white/70 hover:text-white text-xl font-bold"
        >
          ×
        </button>
        
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
              <Gift className="w-4 h-4 text-yellow-300" />
              Programa de Afiliados
            </div>
            
            <h2 className="text-3xl lg:text-4xl font-bold leading-tight">
              Ganhe Dinheiro Indicando
              <span className="block text-yellow-300">Nossos Cursos!</span>
            </h2>
            
            <p className="text-lg text-green-100 leading-relaxed">
              Torne-se nosso parceiro e receba comissões de até <strong className="text-yellow-300">30%</strong> por cada aluno que você indicar. 
              É simples, rápido e totalmente gratuito!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                to="/affiliate-register" 
                className="bg-white text-green-600 hover:bg-green-50 px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 inline-flex items-center justify-center gap-2"
              >
                Quero Ser Afiliado <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link 
                to="/affiliate-login" 
                className="border-2 border-white/30 hover:bg-white/10 backdrop-blur-sm px-6 py-3 rounded-lg font-semibold transition-all inline-flex items-center justify-center gap-2"
              >
                Já Sou Afiliado
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center transform hover:scale-105 transition-transform">
              <DollarSign className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-300">Até 30%</div>
              <div className="text-sm text-green-100">de Comissão</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center transform hover:scale-105 transition-transform">
              <Users className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-300">500+</div>
              <div className="text-sm text-green-100">Afiliados Ativos</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center transform hover:scale-105 transition-transform">
              <TrendingUp className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-300">R$ 2.5k</div>
              <div className="text-sm text-green-100">Média Mensal</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl text-center transform hover:scale-105 transition-transform">
              <Star className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-300">4.9</div>
              <div className="text-sm text-green-100">Satisfação</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AffiliateBanner