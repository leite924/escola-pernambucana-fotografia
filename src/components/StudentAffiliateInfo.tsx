import { useState, useEffect } from 'react'
import { Users, DollarSign, Share2, Copy, ExternalLink, Gift, TrendingUp, Calendar } from 'lucide-react'
import { toast } from 'sonner'

interface AffiliateData {
  isAffiliate: boolean
  affiliateCode: string
  totalReferrals: number
  totalEarnings: number
  pendingEarnings: number
  currentTier: string
  commissionRate: number
  nextTierRequirement: number
  referralLink: string
  lastPayment: {
    date: string
    amount: number
  } | null
}

const StudentAffiliateInfo = () => {
  const [affiliateData, setAffiliateData] = useState<AffiliateData>({
    isAffiliate: false,
    affiliateCode: '',
    totalReferrals: 0,
    totalEarnings: 0,
    pendingEarnings: 0,
    currentTier: 'Iniciante',
    commissionRate: 20,
    nextTierRequirement: 6,
    referralLink: '',
    lastPayment: null
  })
  const [showBecomeAffiliate, setShowBecomeAffiliate] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Verificar se o aluno já é afiliado
    const studentData = JSON.parse(localStorage.getItem('studentUser') || '{}')
    const affiliateInfo = localStorage.getItem(`affiliate_${studentData.email}`)
    
    if (affiliateInfo) {
      const data = JSON.parse(affiliateInfo)
      setAffiliateData({
        isAffiliate: true,
        affiliateCode: data.code || 'STU001',
        totalReferrals: 3,
        totalEarnings: 450.00,
        pendingEarnings: 120.00,
        currentTier: 'Iniciante',
        commissionRate: 20,
        nextTierRequirement: 6,
        referralLink: `https://escolafotografia.com.br/ref/${data.code || 'STU001'}`,
        lastPayment: {
          date: '2024-01-15',
          amount: 330.00
        }
      })
    }
  }, [])

  const becomeAffiliate = async () => {
    setLoading(true)
    try {
      // Simular processo de se tornar afiliado
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const studentData = JSON.parse(localStorage.getItem('studentUser') || '{}')
      const affiliateCode = `STU${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      
      const newAffiliateData = {
        code: affiliateCode,
        email: studentData.email,
        name: studentData.name,
        joinDate: new Date().toISOString(),
        status: 'active'
      }
      
      localStorage.setItem(`affiliate_${studentData.email}`, JSON.stringify(newAffiliateData))
      
      setAffiliateData({
        isAffiliate: true,
        affiliateCode,
        totalReferrals: 0,
        totalEarnings: 0,
        pendingEarnings: 0,
        currentTier: 'Iniciante',
        commissionRate: 20,
        nextTierRequirement: 6,
        referralLink: `https://escolafotografia.com.br/ref/${affiliateCode}`,
        lastPayment: null
      })
      
      setShowBecomeAffiliate(false)
      toast.success('Parabéns! Você agora é um afiliado!')
    } catch (error) {
      toast.error('Erro ao se tornar afiliado')
    } finally {
      setLoading(false)
    }
  }

  const copyReferralLink = () => {
    navigator.clipboard.writeText(affiliateData.referralLink)
    toast.success('Link copiado para a área de transferência!')
  }

  const shareReferralLink = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Escola de Fotografia - Curso Incrível!',
        text: 'Aprenda fotografia profissional com os melhores instrutores!',
        url: affiliateData.referralLink
      })
    } else {
      copyReferralLink()
    }
  }

  if (!affiliateData.isAffiliate) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-8 rounded-xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Programa de Afiliados</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Ganhe dinheiro indicando nossos cursos para seus amigos e conhecidos!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <DollarSign className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Até 30% de Comissão</h4>
              <p className="text-sm text-gray-600">Por cada venda realizada</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Sem Limite</h4>
              <p className="text-sm text-gray-600">Indique quantas pessoas quiser</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <TrendingUp className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <h4 className="font-semibold text-gray-900">Níveis de Comissão</h4>
              <p className="text-sm text-gray-600">Quanto mais vende, mais ganha</p>
            </div>
          </div>
          
          {!showBecomeAffiliate ? (
            <button
              onClick={() => setShowBecomeAffiliate(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 transform hover:scale-105"
            >
              Quero me tornar Afiliado!
            </button>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-sm max-w-md mx-auto">
              <h4 className="font-semibold text-gray-900 mb-4">Confirmar Participação</h4>
              <p className="text-sm text-gray-600 mb-6">
                Ao se tornar afiliado, você concorda com nossos termos e condições do programa de afiliados.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={becomeAffiliate}
                  disabled={loading}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg font-medium"
                >
                  {loading ? 'Processando...' : 'Confirmar'}
                </button>
                <button
                  onClick={() => setShowBecomeAffiliate(false)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-1">Meu Programa de Afiliados</h3>
            <p className="text-blue-100">Código: {affiliateData.affiliateCode}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-blue-100">Nível Atual</p>
            <p className="text-lg font-bold">{affiliateData.currentTier}</p>
            <p className="text-sm text-blue-100">{affiliateData.commissionRate}% de comissão</p>
          </div>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Indicações</p>
              <p className="text-xl font-bold text-gray-900">{affiliateData.totalReferrals}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Ganho</p>
              <p className="text-xl font-bold text-gray-900">R$ {affiliateData.totalEarnings.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">A Receber</p>
              <p className="text-xl font-bold text-gray-900">R$ {affiliateData.pendingEarnings.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Próximo Nível</p>
              <p className="text-sm font-medium text-gray-900">
                {affiliateData.nextTierRequirement - affiliateData.totalReferrals} indicações
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Link de Indicação */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Seu Link de Indicação</h4>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-gray-50 p-3 rounded-lg border">
            <p className="text-sm text-gray-600 font-mono break-all">
              {affiliateData.referralLink}
            </p>
          </div>
          <button
            onClick={copyReferralLink}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg"
            title="Copiar link"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={shareReferralLink}
            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg"
            title="Compartilhar"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Compartilhe este link e ganhe {affiliateData.commissionRate}% de comissão por cada venda!
        </p>
      </div>

      {/* Progresso para próximo nível */}
      <div className="bg-white p-6 rounded-xl shadow-sm">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Progresso para o Próximo Nível</h4>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Indicações necessárias</span>
            <span className="font-medium">
              {affiliateData.totalReferrals} / {affiliateData.nextTierRequirement}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min((affiliateData.totalReferrals / affiliateData.nextTierRequirement) * 100, 100)}%` 
              }}
            ></div>
          </div>
          <p className="text-sm text-gray-600">
            Faltam apenas {Math.max(affiliateData.nextTierRequirement - affiliateData.totalReferrals, 0)} indicações para o próximo nível!
          </p>
        </div>
      </div>

      {/* Último Pagamento */}
      {affiliateData.lastPayment && (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Último Pagamento</h4>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Data do pagamento</p>
              <p className="font-medium">
                {new Date(affiliateData.lastPayment.date).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Valor pago</p>
              <p className="text-xl font-bold text-green-600">
                R$ {affiliateData.lastPayment.amount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Link para área externa */}
      <div className="bg-blue-50 p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900">Área Completa de Afiliados</h4>
            <p className="text-sm text-gray-600">Acesse relatórios detalhados e mais funcionalidades</p>
          </div>
          <a
            href="/affiliate-login"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
          >
            Acessar
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default StudentAffiliateInfo