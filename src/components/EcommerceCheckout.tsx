import { useState, useEffect } from 'react'
import { CreditCard, Smartphone, FileText, Loader2, CheckCircle, AlertCircle, ShoppingCart, Plus, X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { useStore } from '../store/useStore'
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
  addressNumber: z.string().min(1, 'Número obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro obrigatório'),
  city: z.string().min(2, 'Cidade obrigatória'),
  state: z.string().min(2, 'Estado obrigatório'),
  
  // Dados do cartão (condicionais)
  cardNumber: z.string().optional(),
  cardName: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
  
  // Termos
  acceptTerms: z.boolean().refine(val => val === true, 'Você deve aceitar os termos'),
  acceptNFSe: z.boolean().refine(val => val === true, 'Você deve aceitar a emissão da NFSe')
})

type CheckoutForm = z.infer<typeof checkoutSchema>

interface EcommerceCheckoutProps {
  onSuccess: (paymentData: any) => void
  onCancel: () => void
}

const EcommerceCheckout = ({ onSuccess, onCancel }: EcommerceCheckoutProps) => {
  const {
    cartItems,
    getCartTotal,
    getCartItemsCount,
    orderBumps,
    selectedOrderBumps,
    addOrderBump,
    removeOrderBump,
    getOrderBumpsForCart,
    getOrderBumpsTotal,
    clearCart
  } = useStore()

  const [paymentMethod, setPaymentMethod] = useState<'CREDIT_CARD' | 'PIX' | 'BOLETO'>('CREDIT_CARD')
  const [loading, setLoading] = useState(false)
  const [pixQrCode, setPixQrCode] = useState<string | null>(null)
  const [boletoUrl, setBoletoUrl] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'error'>('pending')
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [paymentId, setPaymentId] = useState<string | null>(null)
  const [showOrderBumps, setShowOrderBumps] = useState(true)

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema)
  })

  const availableOrderBumps = getOrderBumpsForCart()
  const cartTotal = getCartTotal()
  const orderBumpsTotal = getOrderBumpsTotal()
  const finalTotal = cartTotal + orderBumpsTotal

  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error('Carrinho vazio')
      onCancel()
    }
  }, [cartItems, onCancel])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{4})(\d)/, '$1 $2')
      .replace(/(\d{4})(\d)/, '$1 $2')
      .replace(/(\d{4})(\d)/, '$1 $2')
      .replace(/(\d{4})\d+?$/, '$1')
  }

  const handleOrderBumpToggle = (orderBumpId: string) => {
    if (selectedOrderBumps.includes(orderBumpId)) {
      removeOrderBump(orderBumpId)
      toast.success('Oferta removida')
    } else {
      addOrderBump(orderBumpId)
      toast.success('Oferta adicionada!')
    }
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
          phone: data.phone,
          cpfCnpj: data.cpf,
          postalCode: data.cep,
          address: data.address,
          addressNumber: data.addressNumber,
          complement: data.complement,
          province: data.neighborhood,
          city: data.city,
          state: data.state,
          country: 'Brasil'
        }
        customer = await asaasService.createCustomer(customerData)
      }
      
      setCustomerId(customer.id)

      // 2. Criar descrição do pedido
      const courseNames = cartItems.map(item => `${item.course.title} (${item.quantity}x)`).join(', ')
      const orderBumpNames = selectedOrderBumps.map(bumpId => {
        const bump = orderBumps.find(b => b.id === bumpId)
        return bump ? bump.title : ''
      }).filter(Boolean).join(', ')
      
      const description = `Cursos: ${courseNames}${orderBumpNames ? ` + Extras: ${orderBumpNames}` : ''}`

      // 3. Criar cobrança
      const paymentData: AsaasPayment = {
        customer: customer.id,
        billingType: paymentMethod,
        value: finalTotal,
        dueDate: new Date().toISOString().split('T')[0],
        description,
        externalReference: `CART_${Date.now()}`
      }

      const payment = await asaasService.createPayment(paymentData)
      setPaymentId(payment.id)

      // 4. Processar pagamento baseado no método
      if (paymentMethod === 'CREDIT_CARD') {
        await processCardPayment(payment.id, data)
      } else if (paymentMethod === 'PIX') {
        const pixData = await asaasService.generatePixQrCode(payment.id)
        setPixQrCode(pixData.qrCode.payload)
        toast.success('QR Code PIX gerado! Escaneie para pagar.')
      } else if (paymentMethod === 'BOLETO') {
        setBoletoUrl(payment.bankSlipUrl)
        toast.success('Boleto gerado! Clique para baixar.')
      }

      setPaymentStatus('success')
      
      // 5. Emitir NFSe se aceito
      if (data.acceptNFSe) {
        try {
          await nfseService.gerarNFSeCurso(
            {
              nome: data.name,
              cpf: data.cpf,
              email: data.email
            },
            {
              titulo: description
            },
            finalTotal
          )
        } catch (error) {
          console.error('Erro ao emitir NFSe:', error)
        }
      }

    } catch (error: any) {
      console.error('Erro no checkout:', error)
      setPaymentStatus('error')
      toast.error(error.message || 'Erro ao processar pagamento')
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
      cpfCnpj: data.cpf,
      postalCode: data.cep,
      addressNumber: data.addressNumber,
      phone: data.phone
    }

    const result = await asaasService.processCardPayment(paymentId, creditCard, creditCardHolderInfo)
    
    if (result.status === 'CONFIRMED') {
      toast.success('Pagamento aprovado!')
      clearCart()
      onSuccess({
        paymentId,
        customerId,
        cartItems,
        selectedOrderBumps,
        total: finalTotal
      })
    } else {
      throw new Error('Pagamento não foi aprovado')
    }
  }

  // Tela de sucesso
  if (paymentStatus === 'success' && (pixQrCode || boletoUrl)) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Pedido Criado!</h2>
          <p className="text-gray-600">
            {paymentMethod === 'PIX' ? 'Escaneie o QR Code para pagar' : 'Baixe o boleto para pagamento'}
          </p>
        </div>

        {pixQrCode && (
          <div className="mb-6">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200 text-center">
              <div className="bg-gray-100 p-4 rounded text-xs font-mono break-all">
                {pixQrCode}
              </div>
            </div>
          </div>
        )}

        {boletoUrl && (
          <div className="mb-6">
            <a
              href={boletoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
            >
              <FileText className="h-5 w-5" />
              <span>Baixar Boleto</span>
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
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Resumo do Pedido */}
        <div className="p-6 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Resumo do Pedido</h2>
          
          {/* Itens do Carrinho */}
          <div className="space-y-4 mb-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 bg-white p-4 rounded-lg">
                <img
                  src={item.course.image}
                  alt={item.course.title}
                  className="h-16 w-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.course.title}</h3>
                  <p className="text-sm text-gray-500">{item.course.instructor}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-600">Qtd: {item.quantity}</span>
                    <span className="font-semibold text-blue-600">
                      {formatPrice(item.course.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Bumps */}
          {availableOrderBumps.length > 0 && showOrderBumps && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Ofertas Especiais</h3>
                <button
                  onClick={() => setShowOrderBumps(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                {availableOrderBumps.map((bump) => {
                  const isSelected = selectedOrderBumps.includes(bump.id)
                  return (
                    <div
                      key={bump.id}
                      className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 bg-white hover:border-blue-300'
                      }`}
                      onClick={() => handleOrderBumpToggle(bump.id)}
                    >
                      <div className="flex items-start space-x-4">
                        <img
                          src={bump.image}
                          alt={bump.title}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 className="font-semibold text-gray-900">{bump.title}</h4>
                            {isSelected && <CheckCircle className="h-5 w-5 text-green-500" />}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{bump.description}</p>
                          <div className="flex items-center space-x-2">
                            <span className="text-lg font-bold text-green-600">
                              {formatPrice(bump.discountPrice)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(bump.originalPrice)}
                            </span>
                            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                              {Math.round((1 - bump.discountPrice / bump.originalPrice) * 100)}% OFF
                            </span>
                          </div>
                          <ul className="text-xs text-gray-600 mt-2 space-y-1">
                            {bump.features.map((feature, index) => (
                              <li key={index} className="flex items-center space-x-1">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Total */}
          <div className="border-t pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({getCartItemsCount()} itens):</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              {orderBumpsTotal > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Ofertas especiais:</span>
                  <span>{formatPrice(orderBumpsTotal)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>Total:</span>
                <span className="text-blue-600">{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Formulário de Checkout */}
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Dados para Pagamento</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Método de Pagamento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Método de Pagamento</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CREDIT_CARD')}
                  className={`p-3 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                    paymentMethod === 'CREDIT_CARD'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard className="h-6 w-6" />
                  <span className="text-xs font-medium">Cartão</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('PIX')}
                  className={`p-3 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                    paymentMethod === 'PIX'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Smartphone className="h-6 w-6" />
                  <span className="text-xs font-medium">PIX</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('BOLETO')}
                  className={`p-3 border-2 rounded-lg flex flex-col items-center space-y-2 transition-colors ${
                    paymentMethod === 'BOLETO'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <FileText className="h-6 w-6" />
                  <span className="text-xs font-medium">Boleto</span>
                </button>
              </div>
            </div>

            {/* Dados Pessoais */}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                <input
                  {...register('cpf')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.cpf && <p className="text-red-500 text-sm mt-1">{errors.cpf.message}</p>}
              </div>
            </div>

            {/* Endereço */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">CEP</label>
                <input
                  {...register('cep')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.cep && <p className="text-red-500 text-sm mt-1">{errors.cep.message}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Número</label>
                <input
                  {...register('addressNumber')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.addressNumber && <p className="text-red-500 text-sm mt-1">{errors.addressNumber.message}</p>}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Endereço</label>
                <input
                  {...register('address')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
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
            </div>

            {/* Dados do Cartão (se cartão selecionado) */}
            {paymentMethod === 'CREDIT_CARD' && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Dados do Cartão</h3>
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
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      onChange={(e) => {
                        const formatted = formatCardNumber(e.target.value)
                        setValue('cardNumber', formatted)
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Validade</label>
                    <input
                      {...register('cardExpiry')}
                      type="text"
                      placeholder="MM/AA"
                      maxLength={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.cardExpiry && <p className="text-red-500 text-sm mt-1">{errors.cardExpiry.message}</p>}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                    <input
                      {...register('cardCvv')}
                      type="text"
                      placeholder="000"
                      maxLength={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors.cardCvv && <p className="text-red-500 text-sm mt-1">{errors.cardCvv.message}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Termos */}
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <input
                  {...register('acceptTerms')}
                  type="checkbox"
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
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
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700">
                  Aceito a emissão da Nota Fiscal de Serviço Eletrônica (NFSe)
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
                Voltar
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
                    {paymentMethod === 'CREDIT_CARD' ? 'Pagar' : 
                     paymentMethod === 'PIX' ? 'Gerar PIX' : 'Gerar Boleto'} {formatPrice(finalTotal)}
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EcommerceCheckout