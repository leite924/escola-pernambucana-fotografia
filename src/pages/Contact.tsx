import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react'
import MapLocation from '../components/MapLocation'

const contactSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  subject: z.string().min(5, 'Assunto deve ter pelo menos 5 caracteres'),
  message: z.string().min(20, 'Mensagem deve ter pelo menos 20 caracteres')
})

type ContactForm = z.infer<typeof contactSchema>

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactForm>({
    resolver: zodResolver(contactSchema)
  })

  const onSubmit = async (data: ContactForm) => {
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    console.log('Contact form data:', data)
    toast.success('Mensagem enviada com sucesso! Entraremos em contato em breve.')
    reset()
    setIsSubmitting(false)
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Endereço',
      details: ['Rua da Fotografia, 123', 'Boa Viagem, Recife/PE', 'CEP: 51020-000']
    },
    {
      icon: Phone,
      title: 'Telefone',
      details: ['(81) 9999-9999', '(81) 3333-3333', 'WhatsApp: (81) 9999-9999']
    },
    {
      icon: Mail,
      title: 'Email',
      details: ['contato@fotoescola.com', 'cursos@fotoescola.com', 'suporte@fotoescola.com']
    },
    {
      icon: Clock,
      title: 'Horário de Funcionamento',
      details: ['Segunda a Sexta: 8h às 18h', 'Sábado: 8h às 14h', 'Domingo: Fechado']
    }
  ]

  const faqs = [
    {
      question: 'Preciso ter experiência prévia em fotografia?',
      answer: 'Não! Nossos cursos são desenvolvidos para atender desde iniciantes até fotógrafos experientes. Temos módulos específicos para cada nível.'
    },
    {
      question: 'Que equipamentos preciso ter?',
      answer: 'Para a maioria dos cursos, você precisará de uma câmera digital (DSLR ou mirrorless). Fornecemos uma lista detalhada de equipamentos recomendados após a inscrição.'
    },
    {
      question: 'Os cursos são presenciais ou online?',
      answer: 'Oferecemos ambas as modalidades. Nossos cursos presenciais acontecem em nosso estúdio profissional, e os online incluem aulas ao vivo e gravadas.'
    },
    {
      question: 'Vocês oferecem certificado?',
      answer: 'Sim! Todos os nossos cursos incluem certificado de conclusão reconhecido pelo mercado, mediante aprovação nas atividades práticas.'
    },
    {
      question: 'Posso parcelar o pagamento?',
      answer: 'Sim, oferecemos parcelamento em até 12x no cartão de crédito, além de descontos especiais para pagamento à vista.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Entre em Contato
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tem dúvidas sobre nossos cursos? Nossa equipe está pronta para ajudar você a escolher o melhor caminho para sua carreira na fotografia.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Envie sua Mensagem
              </h2>
              <p className="text-gray-600">
                Preencha o formulário abaixo e entraremos em contato em até 24 horas.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    {...register('name')}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Seu nome completo"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="seu@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone *
                  </label>
                  <input
                    {...register('phone')}
                    type="tel"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="(81) 99999-9999"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assunto *
                  </label>
                  <input
                    {...register('subject')}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Assunto da sua mensagem"
                  />
                  {errors.subject && (
                    <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensagem *
                </label>
                <textarea
                  {...register('message')}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Conte-nos como podemos ajudar você..."
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-6 rounded-lg font-semibold transition-colors inline-flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Enviar Mensagem
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Contact Details */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Informações de Contato
              </h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const IconComponent = info.icon
                  return (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{info.title}</h3>
                        {info.details.map((detail, detailIndex) => (
                          <p key={detailIndex} className="text-gray-600">{detail}</p>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Quick Contact */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-8">
              <h3 className="text-xl font-bold mb-4">Precisa de Ajuda Imediata?</h3>
              <p className="mb-6">
                Nossa equipe está disponível para atendimento via WhatsApp durante o horário comercial.
              </p>
              <a
                href="https://wa.me/5581999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Falar no WhatsApp
              </a>
            </div>

            {/* Map */}
            <MapLocation 
              address="Rua da Fotografia, 123 - Boa Viagem, Recife/PE"
              latitude={-8.1137}
              longitude={-34.9030}
            />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-xl text-gray-600">
              Encontre respostas para as dúvidas mais comuns sobre nossos cursos
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg">
            <div className="divide-y divide-gray-200">
              {faqs.map((faq, index) => (
                <div key={index} className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-orange-500 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ainda tem dúvidas?
          </h2>
          <p className="text-lg mb-6">
            Agende uma conversa gratuita com nossos especialistas e descubra qual curso é ideal para você.
          </p>
          <a
            href="tel:+5581999999999"
            className="bg-white text-orange-500 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            <Phone className="h-5 w-5 mr-2" />
            Ligar Agora
          </a>
        </div>
      </div>
    </div>
  )
}

export default Contact