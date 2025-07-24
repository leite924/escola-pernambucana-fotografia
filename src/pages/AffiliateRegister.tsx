import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Mail, Phone, MapPin, Eye, EyeOff, DollarSign, Users, TrendingUp, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

const affiliateSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().min(2, 'Estado é obrigatório'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, 'Você deve aceitar os termos')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não coincidem",
  path: ["confirmPassword"],
})

type AffiliateForm = z.infer<typeof affiliateSchema>

const AffiliateRegister = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<AffiliateForm>({
    resolver: zodResolver(affiliateSchema)
  })

  const onSubmit = async (data: AffiliateForm) => {
    setLoading(true)
    try {
      // Simular cadastro de afiliado
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Salvar dados do afiliado no localStorage (em produção seria uma API)
      const affiliateData = {
        id: Date.now(),
        name: data.name,
        email: data.email,
        phone: data.phone,
        city: data.city,
        state: data.state,
        registeredAt: new Date().toISOString(),
        status: 'active',
        commissionRate: 20, // 20% padrão
        totalEarnings: 0,
        totalReferrals: 0
      }
      
      const existingAffiliates = JSON.parse(localStorage.getItem('affiliates') || '[]')
      existingAffiliates.push(affiliateData)
      localStorage.setItem('affiliates', JSON.stringify(existingAffiliates))
      
      toast.success('Cadastro realizado com sucesso! Bem-vindo ao programa de afiliados!')
      navigate('/affiliate-login')
    } catch (error) {
      toast.error('Erro ao realizar cadastro. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Início
          </Link>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Informações do Programa */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Torne-se Nosso
                <span className="block text-green-600">Parceiro Afiliado</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Junte-se ao nosso programa de afiliados e comece a ganhar dinheiro indicando 
                nossos cursos de fotografia para sua rede de contatos.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-green-600 mb-1">Até 30%</div>
                <div className="text-sm text-gray-600">de Comissão</div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <Users className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-green-600 mb-1">500+</div>
                <div className="text-sm text-gray-600">Afiliados Ativos</div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm text-center">
                <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-green-600 mb-1">R$ 2.5k</div>
                <div className="text-sm text-gray-600">Média Mensal</div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Como Funciona?</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <div className="font-medium text-gray-900">Cadastre-se Gratuitamente</div>
                    <div className="text-sm text-gray-600">Preencha o formulário e crie sua conta</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <div className="font-medium text-gray-900">Receba seu Link Único</div>
                    <div className="text-sm text-gray-600">Use para divulgar nossos cursos</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <div className="font-medium text-gray-900">Ganhe Comissões</div>
                    <div className="text-sm text-gray-600">Receba até 30% por cada venda</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário de Cadastro */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Criar Conta de Afiliado</h2>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...register('name')}
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Seu nome completo"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="seu@email.com"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    {...register('phone')}
                    type="tel"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="(11) 99999-9999"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cidade
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      {...register('city')}
                      type="text"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Sua cidade"
                    />
                  </div>
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    {...register('state')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Selecione</option>
                    <option value="PE">Pernambuco</option>
                    <option value="SP">São Paulo</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="BA">Bahia</option>
                    <option value="PR">Paraná</option>
                    <option value="RS">Rio Grande do Sul</option>
                    <option value="SC">Santa Catarina</option>
                    <option value="GO">Goiás</option>
                    <option value="DF">Distrito Federal</option>
                  </select>
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12"
                    placeholder="Sua senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12"
                    placeholder="Confirme sua senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="flex items-start gap-3">
                <input
                  {...register('acceptTerms')}
                  type="checkbox"
                  className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <div className="text-sm text-gray-600">
                  Eu aceito os{' '}
                  <Link to="/termos" className="text-green-600 hover:text-green-700 font-medium">
                    Termos de Uso
                  </Link>{' '}
                  e{' '}
                  <Link to="/privacidade" className="text-green-600 hover:text-green-700 font-medium">
                    Política de Privacidade
                  </Link>
                </div>
              </div>
              {errors.acceptTerms && (
                <p className="text-sm text-red-600">{errors.acceptTerms.message}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
              >
                {loading ? 'Criando Conta...' : 'Criar Conta de Afiliado'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Já tem uma conta?{' '}
                <Link to="/affiliate-login" className="text-green-600 hover:text-green-700 font-medium">
                  Fazer Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AffiliateRegister