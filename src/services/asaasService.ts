// Serviço de integração com Asaas para pagamentos

interface AsaasCustomer {
  name: string
  email: string
  phone: string
  mobilePhone?: string
  cpfCnpj: string
  postalCode?: string
  address?: string
  addressNumber?: string
  complement?: string
  province?: string
  city?: string
  state?: string
  country?: string
}

interface AsaasPayment {
  customer: string
  billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX' | 'UNDEFINED'
  value: number
  dueDate: string
  description: string
  externalReference?: string
  installmentCount?: number
  installmentValue?: number
  discount?: {
    value: number
    dueDateLimitDays: number
  }
  interest?: {
    value: number
  }
  fine?: {
    value: number
  }
  postalService?: boolean
}

interface AsaasCreditCard {
  holderName: string
  number: string
  expiryMonth: string
  expiryYear: string
  ccv: string
}

interface AsaasCreditCardHolderInfo {
  name: string
  email: string
  cpfCnpj: string
  postalCode: string
  addressNumber: string
  addressComplement?: string
  phone: string
  mobilePhone?: string
}

class AsaasService {
  private baseURL: string
  private apiKey: string

  constructor() {
    // Use sandbox para desenvolvimento
    this.baseURL = import.meta.env.PROD 
      ? 'https://www.asaas.com/api/v3'
      : 'https://sandbox.asaas.com/api/v3'
    
    // Chave da API (deve ser configurada nas variáveis de ambiente)
    this.apiKey = import.meta.env.VITE_ASAAS_API_KEY || 'aact_YTU5YTE0M2M2N2I4MTliNzk0YTI5N2U5MzdjNWZmNDQ6OjAwMDAwMDAwMDAwMDAwNzI2NzM6OiRhYWRkOmY3NjQwYzc5LWY4YjctNGI4Ni1hZDI4LWY4YzYzZTZkMzE4Nw=='
  }

  private async makeRequest(endpoint: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET', data?: any) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'access_token': this.apiKey
      },
      body: data ? JSON.stringify(data) : undefined
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.errors?.[0]?.description || 'Erro na requisição')
    }

    return response.json()
  }

  // Criar cliente
  async createCustomer(customerData: AsaasCustomer) {
    return this.makeRequest('/customers', 'POST', customerData)
  }

  // Buscar cliente por email
  async getCustomerByEmail(email: string) {
    const response = await this.makeRequest(`/customers?email=${email}`)
    return response.data?.[0] || null
  }

  // Criar cobrança
  async createPayment(paymentData: AsaasPayment) {
    return this.makeRequest('/payments', 'POST', paymentData)
  }

  // Processar pagamento com cartão de crédito
  async processCardPayment(
    paymentId: string, 
    creditCard: AsaasCreditCard, 
    creditCardHolderInfo: AsaasCreditCardHolderInfo
  ) {
    const data = {
      creditCard,
      creditCardHolderInfo
    }
    
    return this.makeRequest(`/payments/${paymentId}/payWithCreditCard`, 'POST', data)
  }

  // Gerar PIX
  async generatePixQrCode(paymentId: string) {
    return this.makeRequest(`/payments/${paymentId}/pixQrCode`)
  }

  // Consultar status do pagamento
  async getPaymentStatus(paymentId: string) {
    return this.makeRequest(`/payments/${paymentId}`)
  }

  // Listar pagamentos
  async getPayments(customerId?: string, status?: string) {
    let query = ''
    if (customerId) query += `customer=${customerId}&`
    if (status) query += `status=${status}&`
    
    return this.makeRequest(`/payments?${query}`)
  }

  // Cancelar cobrança
  async cancelPayment(paymentId: string) {
    return this.makeRequest(`/payments/${paymentId}`, 'DELETE')
  }

  // Webhook para receber notificações
  async handleWebhook(webhookData: any) {
    // Processar webhook do Asaas
    console.log('Webhook recebido:', webhookData)
    
    switch (webhookData.event) {
      case 'PAYMENT_RECEIVED':
        // Pagamento confirmado
        await this.handlePaymentReceived(webhookData.payment)
        break
      case 'PAYMENT_OVERDUE':
        // Pagamento vencido
        await this.handlePaymentOverdue(webhookData.payment)
        break
      case 'PAYMENT_DELETED':
        // Pagamento cancelado
        await this.handlePaymentDeleted(webhookData.payment)
        break
    }
  }

  private async handlePaymentReceived(payment: any) {
    // Lógica para quando o pagamento é confirmado
    console.log('Pagamento confirmado:', payment.id)
    // Aqui você pode:
    // - Liberar acesso ao curso
    // - Enviar email de confirmação
    // - Emitir nota fiscal
  }

  private async handlePaymentOverdue(payment: any) {
    // Lógica para pagamento vencido
    console.log('Pagamento vencido:', payment.id)
  }

  private async handlePaymentDeleted(payment: any) {
    // Lógica para pagamento cancelado
    console.log('Pagamento cancelado:', payment.id)
  }
}

export const asaasService = new AsaasService()
export type { AsaasCustomer, AsaasPayment, AsaasCreditCard, AsaasCreditCardHolderInfo }