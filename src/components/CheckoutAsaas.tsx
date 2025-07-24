import { useState, useEffect } from 'react'
import { CreditCard, Smartphone, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { asaasService, type AsaasCustomer, type AsaasPayment, type AsaasCreditCard, type AsaasCreditCardHolderInfo } from '../services/asaasService'
import { nfseService } from '../services/nfseService'

const checkoutSchema = z.object({
  // Dados pessoais
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
  cpf: z.string().min(11, 'CPF inválido'),
  
  // Endereço
  cep: z.string().min(8, 'CEP inválido'),
  address: z.string().min(5, 'Endereço obrigatório'),
  number: z.string().min(1, 'Número obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro obrigatório'),
  city: z.string().min(2, 'Cidade obrigatória'),
  state: z.string().length(2, 'Estado deve ter 2 caracteres'),
  
  // Dados do cartão (quando aplicável)
  cardName: z.string().optional(),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
  
  // Termos
  acceptTerms: z.boolean().refine(val => val === true, 'Você deve aceitar os termos'),
  acceptNFSe: z.boolean().refine(val => val === true, 'Você deve aceitar a emissão da NFSe')
})

type CheckoutForm = z.infer<typeof checkoutSchema>

interface CheckoutAsaasProps {
  course: {
    id: number
    title: string
    price: number
    description: string
  }
  onSuccess: (paymentData: any) => void
  onCancel: () => void
}

const CheckoutAsaas = ({ course, onSuccess, onCancel }: CheckoutAsaasProps) => {
  const [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'PIX' | 'BOLETO'>('CREDIT_CARD')
  const [loading, setLoading] = useState(false)
  const [pixQrCode, setPixQrCode] = useState<string | null>(null)
  const [boletoUrl, setBoletoUrl] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'error'>('pending')
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [paymentId, setPaymentId] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema)
  })

  const watchCep = watch('cep')

  // Buscar endereço pelo CEP
  useEffect(() => {
    if (watchCep && watchCep.length === 8) {
      fetchAddressByCep(watchCep)
    }
  }, [watchCep])

  const fetchAddressByCep = async (cep: string) => {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()
      
      if (!data.erro) {
        setValue('address', data.logradouro)
        setValue('neighborhood', data.bairro)
        setValue('city', data.localidade)
        setValue('state', data.uf)
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error)
    }
  }

  const formatCpf = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1')
  }

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1')
  }

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{4})(\d)/, '$1 $2')
      .replace(/(\d{4})(\d)/, '$1 $2')
      .replace(/(\d{4})(\d)/, '$1 $2')
      .replace(/(\d{4})\d+?$/, '$1')
  }

  const onSubmit = async (data: CheckoutForm) => {
    setLoading(true)
    setPaymentStatus('processing')

    try {
      // 1. Criar ou buscar cliente
      let customer = await asaasService.getCustomerByEmail(data.email)
      
      if (!customer) {
        const customerData: AsaasCustomer = {
          name: data.name,
          email: data.email,
          phone: data.phone.replace(/\D/g, ''),
          cpfCnpj: data.cpf.replace(/\D/g, ''),
          postalCode: data.cep.replace(/\D/g, ''),
          address: data.address,
          addressNumber: data.number,
          complement: data.complement,
          province: data.neighborhood,
          city: data.city,
          state: data.state,
          country: 'Brasil'
        }
        
        customer = await asaasService.createCustomer(customerData)
      }
      
      setCustomerId(customer.id)

      // 2. Criar cobrança
      const paymentData: AsaasPayment = {
        customer: customer.id,
        billingType: paymentMethod,
        value: course.price,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 dias
        description: `Curso: ${course.title}`,
        externalReference: `curso_${course.id}_${Date.now()}`
      }

      const payment = await asaasService.createPayment(paymentData)
      setPaymentId(payment.id)

      // 3. Processar pagamento conforme método escolhido
      if (paymentMethod === 'CREDIT_CARD') {
        await processCardPayment(payment.id, data)
      } else if (paymentMethod === 'PIX') {
        const pixData = await asaasService.generatePixQrCode(payment.id)
        setPixQrCode(pixData.qrCode.payload)
        toast.success('QR Code PIX gerado! Escaneie para pagar.')
      } else if (paymentMethod === 'BOLETO') {
        setBoletoUrl(payment.bankSlipUrl)
        toast.success('Boleto gerado! Clique para visualizar.')
      }

      setPaymentStatus('success')
      
    } catch (error: any) {
      console.error('Erro no checkout:', error)
      toast.error(error.message || 'Erro ao processar pagamento')
      setPaymentStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const processCardPayment = async (paymentId: string, data: CheckoutForm) => {
    if (!data.cardNumber || !data.cardName || !data.cardExpiry || !data.cardCvv) {
      throw new Error('Dados do cartão incompletos')
    }

    const [month, year] = data.cardExpiry.split('/')
    
    const creditCard: AsaasCreditCard = {
      holderName: data.cardName,
      number: data.cardNumber.replace(/\s/g, ''),
      expiryMonth: month,
      expiryYear: `20${year}`,
      ccv: data.cardCvv
    }

    const creditCardHolderInfo: AsaasCreditCardHolderInfo = {
      name: data.name,
      email: data.email,
      cpfCnpj: data.cpf.replace(/\D/g, ''),
      postalCode: data.cep.replace(/\D/g, ''),
      addressNumber: data.number,
      addressComplement: data.complement,
      phone: data.phone.replace(/\D/g, '')
    }

    const result = await asaasService.processCardPayment(paymentId, creditCard, creditCardHolderInfo)
    
    if (result.status === 'CONFIRMED') {
      // Pagamento aprovado - emitir NFSe
      await emitirNFSe(data)
      toast.success('Pagamento aprovado! NFSe será emitida.')
      onSuccess(result)
    } else {
      throw new Error('Pagamento não foi aprovado')
    }
  }

  const emitirNFSe = async (data: CheckoutForm) => {
    try {
      const dadosAluno = {
        nome: data.name,
        email: data.email,
        cpf: data.cpf.replace(/\D/g, '')
      }

      const nfse = await nfseService.gerarNFSeCurso(dadosAluno, course, course.price)
      toast.success('NFSe emitida com sucesso!')
      
      // Enviar por email ou disponibilizar para download
      console.log('NFSe emitida:', nfse)
      
    } catch (error) {
      console.error('Erro ao emitir NFSe:', error)
      toast.error('Erro ao emitir nota fiscal. Entre em contato conosco.')
    }
  }

  if (paymentStatus === 'success' && (pixQrCode || boletoUrl)) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {paymentMethod === 'PIX' ? 'PIX Gerado!' : 'Boleto Gerado!'}
          </h3>
          <p className="text-gray-600">
            {paymentMethod === 'PIX' 
              ? 'Escaneie o QR Code abaixo para efetuar o pagamento'
              : 'Clique no botão abaixo para visualizar o boleto'
            }
          </p>
        </div>

        {pixQrCode && (
          <div className="text-center mb-6">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200 inline-block">
              <img 
                src={`data:image/png;base64,${pixQrCode}`} 
                alt="QR Code PIX" 
                className="w-48 h-48"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Ou copie e cole o código PIX
            </p>
          </div>
        )}

        {boletoUrl && (
          <div className="text-center mb-6">
            <a 
              href={boletoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold inline-flex items-center space-x-2"
            >
              <FileText className="h-5 w-5" />
              <span>Visualizar Boleto</span>
            </a>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            Voltar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Finalizar Compra</h2>
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900">{course.title}</h3>
          <p className="text-blue-700 text-sm">{course.description}</p>
          <p className="text-2xl font-bold text-blue-900 mt-2">
            R$ {course.price.toFixed(2).replace('.', ',')}
          </p>
        </div>
      </div>

      {/* Método de Pagamento */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Método de Pagamento</h3>
        <div className="grid grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => setPaymentMethod('CREDIT_CARD')}
            className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${
              paymentMethod === 'CREDIT_CARD'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <CreditCard className="h-6 w-6" />
            <span className="text-sm font-medium">Cartão</span>
          </button>
          
          <button
            type="button"
            onClick={() => setPaymentMethod('PIX')}
            className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${
              paymentMethod === 'PIX'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <Smartphone className="h-6 w-6" />
            <span className="text-sm font-medium">PIX</span>
          </button>
          
          <button
            type="button"
            onClick={() => setPaymentMethod('BOLETO')}
            className={`p-4 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${
              paymentMethod === 'BOLETO'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <FileText className="h-6 w-6" />
            <span className="text-sm font-medium">Boleto</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Dados Pessoais */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados Pessoais</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
              <input
                {...register('name')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
              <input
                {...register('phone')}
                type="tel"
                onChange={(e) => {
                  const formatted = formatPhone(e.target.value)
                  setValue('phone', formatted)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="(11) 99999-9999"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
              <input
                {...register('cpf')}
                type="text"
                onChange={(e) => {
                  const formatted = formatCpf(e.target.value)
                  setValue('cpf', formatted)
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="000.000.000-00"
              />
              {errors.cpf && <p className="text-red-500 text-sm mt-1">{errors.cpf.message}</p>}
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Endereço</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
              <input
                {...register('cep')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="00000-000"
              />
              {errors.cep && <p className="text-red-500 text-sm mt-1">{errors.cep.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
              <input
                {...register('address')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
              <input
                {...register('number')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.number && <p className="text-red-500 text-sm mt-1">{errors.number.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Complemento</label>
              <input
                {...register('complement')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bairro</label>
              <input
                {...register('neighborhood')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.neighborhood && <p className="text-red-500 text-sm mt-1">{errors.neighborhood.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cidade</label>
              <input
                {...register('city')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <input
                {...register('state')}
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="PE"
              />
              {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
            </div>
          </div>
        </div>

        {/* Dados do Cartão */}
        {paymentMethod === 'CREDIT_CARD' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados do Cartão</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome no Cartão</label>
                <input
                  {...register('cardName')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.cardName && <p className="text-red-500 text-sm mt-1">{errors.cardName.message}</p>}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Número do Cartão</label>
                <input
                  {...register('cardNumber')}
                  type="text"
                  onChange={(e) => {
                    const formatted = formatCardNumber(e.target.value)
                    setValue('cardNumber', formatted)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0000 0000 0000 0000"
                />
                {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Validade</label>
                <input
                  {...register('cardExpiry')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="MM/AA"
                />
                {errors.cardExpiry && <p className="text-red-500 text-sm mt-1">{errors.cardExpiry.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                <input
                  {...register('cardCvv')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="000"
                />
                {errors.cardCvv && <p className="text-red-500 text-sm mt-1">{errors.cardCvv.message}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Termos */}
        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <input
              {...register('acceptTerms')}
              type="checkbox"
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="text-sm text-gray-700">
              Aceito os <a href="#" className="text-blue-600 hover:underline">termos de uso</a> e 
              <a href="#" className="text-blue-600 hover:underline"> política de privacidade</a>
            </label>
          </div>
          {errors.acceptTerms && <p className="text-red-500 text-sm">{errors.acceptTerms.message}</p>}
          
          <div className="flex items-start space-x-2">
            <input
              {...register('acceptNFSe')}
              type="checkbox"
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label className="text-sm text-gray-700">
              Autorizo a emissão da Nota Fiscal de Serviço Eletrônica (NFSe) conforme legislação municipal de Recife
            </label>
          </div>
          {errors.acceptNFSe && <p className="text-red-500 text-sm">{errors.acceptNFSe.message}</p>}
        </div>

        {/* Botões */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 px-4 rounded-lg font-semibold transition-colors"
          >
            Cancelar
          </button>
          
          <button
            type="submit"
            disabled={loading || paymentStatus === 'processing'}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Processando...</span>
              </>
            ) : (
              <span>
                {paymentMethod === 'CREDIT_CARD' ? 'Pagar com Cartão' :
                 paymentMethod === 'PIX' ? 'Gerar PIX' : 'Gerar Boleto'}
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CheckoutAsaas