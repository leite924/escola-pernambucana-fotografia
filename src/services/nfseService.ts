// Serviço de emissão de NFSe para Recife

interface CertificadoDigital {
  path: string
  password: string
  alias?: string
}

interface NFSeData {
  // Dados do prestador
  prestador: {
    cnpj: string
    inscricaoMunicipal: string
    razaoSocial: string
    nomeFantasia?: string
    endereco: {
      logradouro: string
      numero: string
      complemento?: string
      bairro: string
      cidade: string
      uf: string
      cep: string
    }
    contato: {
      telefone?: string
      email: string
    }
  }
  
  // Dados do tomador
  tomador: {
    cpfCnpj: string
    razaoSocial: string
    endereco?: {
      logradouro: string
      numero: string
      complemento?: string
      bairro: string
      cidade: string
      uf: string
      cep: string
    }
    contato?: {
      telefone?: string
      email: string
    }
  }
  
  // Dados do serviço
  servico: {
    itemListaServico: string // Código do serviço conforme lista municipal
    codigoCnae?: string
    discriminacao: string
    valorServicos: number
    valorDeducoes?: number
    valorPis?: number
    valorCofins?: number
    valorInss?: number
    valorIr?: number
    valorCsll?: number
    issRetido: boolean
    valorIss?: number
    aliquota?: number
    descontoIncondicionado?: number
    descontoCondicionado?: number
  }
  
  // Dados adicionais
  competencia: string // YYYY-MM
  regimeEspecialTributacao?: number
  optanteSimplesNacional: boolean
  incentivadorCultural: boolean
  
  // Certificado digital (opcional - se não informado, usa o configurado no ambiente)
  certificadoDigital?: CertificadoDigital
}

interface NFSeResponse {
  numero: string
  codigoVerificacao: string
  dataEmissao: string
  link: string
  xml: string
  pdf: string
}

class NFSeService {
  private baseURL: string
  private apiKey: string
  private environment: 'sandbox' | 'production'
  private certificadoDigital: CertificadoDigital | null

  constructor() {
    this.environment = import.meta.env.PROD ? 'production' : 'sandbox'
    
    // Usando Focus NFe como provedor (suporta Recife)
    this.baseURL = this.environment === 'production'
      ? 'https://api.focusnfe.com.br'
      : 'https://homologacao.focusnfe.com.br'
    
    // Token da API (deve ser configurado nas variáveis de ambiente)
    this.apiKey = import.meta.env.VITE_FOCUS_NFE_TOKEN || 'demo_token'
    
    // Configuração do certificado digital
    this.certificadoDigital = this.loadCertificadoDigital()
  }
  
  private loadCertificadoDigital(): CertificadoDigital | null {
    const path = import.meta.env.VITE_CERTIFICADO_DIGITAL_PATH
    const password = import.meta.env.VITE_CERTIFICADO_DIGITAL_PASSWORD
    const alias = import.meta.env.VITE_CERTIFICADO_DIGITAL_ALIAS
    
    if (path && password) {
      return { path, password, alias }
    }
    
    return null
  }

  private async makeRequest(endpoint: string, method: 'GET' | 'POST' | 'DELETE' = 'GET', data?: any) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${btoa(this.apiKey + ':')}`
      },
      body: data ? JSON.stringify(data) : undefined
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Erro na emissão da NFSe: ${error}`)
    }

    return response.json()
  }

  // Emitir NFSe
  async emitirNFSe(nfseData: NFSeData): Promise<NFSeResponse> {
    const payload = this.formatNFSePayload(nfseData)
    
    try {
      const response = await this.makeRequest('/v2/nfse', 'POST', payload)
      
      return {
        numero: response.numero,
        codigoVerificacao: response.codigo_verificacao,
        dataEmissao: response.data_emissao,
        link: response.url,
        xml: response.caminho_xml_nota_fiscal,
        pdf: response.caminho_danfe
      }
    } catch (error) {
      console.error('Erro ao emitir NFSe:', error)
      throw error
    }
  }

  // Consultar NFSe
  async consultarNFSe(numero: string) {
    return this.makeRequest(`/v2/nfse/${numero}`)
  }

  // Cancelar NFSe
  async cancelarNFSe(numero: string, motivo: string) {
    const data = { justificativa: motivo }
    return this.makeRequest(`/v2/nfse/${numero}`, 'DELETE', data)
  }

  // Baixar PDF da NFSe
  async baixarPDF(numero: string): Promise<Blob> {
    const response = await fetch(`${this.baseURL}/v2/nfse/${numero}.pdf`, {
      headers: {
        'Authorization': `Basic ${btoa(this.apiKey + ':')}`
      }
    })

    if (!response.ok) {
      throw new Error('Erro ao baixar PDF da NFSe')
    }

    return response.blob()
  }

  // Formatar payload para a API
  private formatNFSePayload(nfseData: NFSeData) {
    const certificado = nfseData.certificadoDigital || this.certificadoDigital
    
    const payload: any = {
      // Dados do prestador
      prestador: {
        cnpj: nfseData.prestador.cnpj,
        inscricao_municipal: nfseData.prestador.inscricaoMunicipal,
        codigo_municipio: '2611606', // Código do IBGE para Recife
      },
      
      // Dados do tomador
      tomador: {
        cpf_cnpj: nfseData.tomador.cpfCnpj,
        razao_social: nfseData.tomador.razaoSocial,
        email: nfseData.tomador.contato?.email,
        endereco: nfseData.tomador.endereco ? {
          logradouro: nfseData.tomador.endereco.logradouro,
          numero: nfseData.tomador.endereco.numero,
          complemento: nfseData.tomador.endereco.complemento,
          bairro: nfseData.tomador.endereco.bairro,
          codigo_municipio: '2611606', // Recife
          uf: nfseData.tomador.endereco.uf,
          cep: nfseData.tomador.endereco.cep
        } : undefined
      },
      
      // Dados do serviço
      servicos: [{
        item_lista_servico: nfseData.servico.itemListaServico,
        codigo_cnae: nfseData.servico.codigoCnae,
        discriminacao: nfseData.servico.discriminacao,
        codigo_municipio: '2611606', // Recife
        valor_servicos: nfseData.servico.valorServicos,
        valor_deducoes: nfseData.servico.valorDeducoes || 0,
        valor_pis: nfseData.servico.valorPis || 0,
        valor_cofins: nfseData.servico.valorCofins || 0,
        valor_inss: nfseData.servico.valorInss || 0,
        valor_ir: nfseData.servico.valorIr || 0,
        valor_csll: nfseData.servico.valorCsll || 0,
        iss_retido: nfseData.servico.issRetido,
        valor_iss: nfseData.servico.valorIss,
        aliquota: nfseData.servico.aliquota,
        desconto_incondicionado: nfseData.servico.descontoIncondicionado || 0,
        desconto_condicionado: nfseData.servico.descontoCondicionado || 0
      }],
      
      // Dados adicionais
      competencia: nfseData.competencia,
      regime_especial_tributacao: nfseData.regimeEspecialTributacao,
      optante_simples_nacional: nfseData.optanteSimplesNacional,
      incentivador_cultural: nfseData.incentivadorCultural
    }
    
    // Adicionar certificado digital se disponível
    if (certificado) {
      payload.certificado_digital = {
        arquivo: certificado.path,
        senha: certificado.password
      }
      
      if (certificado.alias) {
        payload.certificado_digital.alias = certificado.alias
      }
    }
    
    return payload
  }

  // Gerar NFSe para curso de fotografia
  async gerarNFSeCurso(dadosAluno: any, dadosCurso: any, valorPago: number) {
    const nfseData: NFSeData = {
      prestador: {
        cnpj: '12.345.678/0001-90', // CNPJ da escola (configurar)
        inscricaoMunicipal: '123456', // Inscrição municipal (configurar)
        razaoSocial: 'Escola de Fotografia Recife Ltda',
        nomeFantasia: 'FotoEscola Recife',
        endereco: {
          logradouro: 'Rua da Fotografia',
          numero: '123',
          bairro: 'Boa Viagem',
          cidade: 'Recife',
          uf: 'PE',
          cep: '51020-000'
        },
        contato: {
          email: 'contato@fotoescolarecife.com.br'
        }
      },
      
      tomador: {
        cpfCnpj: dadosAluno.cpf,
        razaoSocial: dadosAluno.nome,
        contato: {
          email: dadosAluno.email
        }
      },
      
      servico: {
        itemListaServico: '8.01', // Ensino regular pré-escolar, fundamental, médio e superior
        discriminacao: `Curso de ${dadosCurso.titulo} - Escola de Fotografia`,
        valorServicos: valorPago,
        issRetido: false,
        aliquota: 5.0 // 5% de ISS para serviços educacionais em Recife
      },
      
      competencia: new Date().toISOString().slice(0, 7), // YYYY-MM atual
      optanteSimplesNacional: true,
      incentivadorCultural: false
    }

    return this.emitirNFSe(nfseData)
  }
}

export const nfseService = new NFSeService()
export type { NFSeData, NFSeResponse, CertificadoDigital }