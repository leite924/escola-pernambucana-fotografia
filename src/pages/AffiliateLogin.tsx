import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Lock, Mail, ArrowLeft, Users } from 'lucide-react'
import { toast } from 'sonner'
import { useStore } from '../store/useStore'

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres')
})

type LoginForm = z.infer<typeof loginSchema>

const AffiliateLogin = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { setAffiliateUser } = useStore()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    try {
      // Simular login de afiliado
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Criar dados demo se não existirem
      let affiliates = JSON.parse(localStorage.getItem('affiliates') || '[]')
      
      if (affiliates.length === 0) {
        // Criar afiliado demo
        const demoAffiliate = {
          id: 1,
          name: 'Afiliado Demonstração',
          email: 'afiliado@exemplo.com',
          phone: '(11) 99999-9999',
          cpf: '123.456.789-00',
          bank: 'Banco do Brasil',
          agency: '1234-5',
          account: '12345-6',
          pix: 'afiliado@exemplo.com',
          commissionRate: 20,
          status: 'active',
          createdAt: new Date().toISOString()
        }
        
        affiliates = [demoAffiliate]
        localStorage.setItem('affiliates', JSON.stringify(affiliates))
      }
      
      // Verificar credenciais demo
      if (data.email === 'afiliado@exemplo.com' && data.password === 'affiliate123') {
        const affiliate = affiliates.find((a: any) => a.email === data.email)
        
        // Salvar dados do afiliado logado
        setAffiliateUser(affiliate)
        localStorage.setItem('affiliateUser', JSON.stringify(affiliate))
        
        toast.success('Login realizado com sucesso!')
        navigate('/affiliate-dashboard')
        return
      }
      
      // Buscar afiliado no localStorage (em produção seria uma API)
      const affiliate = affiliates.find((a: any) => a.email === data.email)
      
      if (!affiliate) {
        toast.error('Email ou senha incorretos')
        return
      }
      
      // Simular verificação de senha (em produção seria hash)
      if (data.password !== '123456' && data.password !== 'affiliate123') {
        toast.error('Email ou senha incorretos')
        return
      }
      
      // Salvar dados do afiliado logado
      setAffiliateUser(affiliate)
      localStorage.setItem('affiliateUser', JSON.stringify(affiliate))
      
      toast.success('Login realizado com sucesso!')
      navigate('/affiliate-dashboard')
    } catch (error) {
      toast.error('Erro ao fazer login. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Início
          </Link>
          
          <div className="mx-auto h-16 w-16 bg-green-600 rounded-full flex items-center justify-center mb-6">
            <Users className="h-8 w-8 text-white" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Área do Afiliado
          </h2>
          <p className="text-gray-600">
            Acesse sua conta e acompanhe suas comissões
          </p>
        </div>

        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-700">
                  Lembrar de mim
                </label>
              </div>
              <Link
                to="#"
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Novo por aqui?</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/affiliate-register"
                className="w-full bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 py-3 px-4 rounded-lg font-semibold transition-colors inline-block"
              >
                Criar Conta de Afiliado
              </Link>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Ainda não é afiliado?{' '}
            <Link to="/affiliate-register" className="text-green-600 hover:text-green-700 font-medium">
              Saiba como funciona
            </Link>
          </p>
        </div>

        {/* Demo credentials */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">Credenciais de Demonstração:</h4>
          <div className="text-xs text-yellow-700 space-y-1">
            <div><strong>Email:</strong> afiliado@exemplo.com</div>
            <div><strong>Senha:</strong> affiliate123</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AffiliateLogin