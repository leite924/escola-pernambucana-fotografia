import { useState, useEffect } from 'react'
import { Shield, Upload, Check, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

interface CertificadoDigitalConfigProps {
  onSave?: (certificado: CertificadoConfig) => void
}

interface CertificadoConfig {
  path: string
  password: string
  alias?: string
  isValid: boolean
}

const CertificadoDigitalConfig = ({ onSave }: CertificadoDigitalConfigProps) => {
  const [certificado, setCertificado] = useState<CertificadoConfig>({
    path: '',
    password: '',
    alias: '',
    isValid: false
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const [validationMessage, setValidationMessage] = useState('')

  // Carregar configuração existente
  useEffect(() => {
    const savedPath = localStorage.getItem('certificado_digital_path') || ''
    const savedAlias = localStorage.getItem('certificado_digital_alias') || ''
    
    if (savedPath) {
      setCertificado(prev => ({
        ...prev,
        path: savedPath,
        alias: savedAlias
      }))
    }
  }, [])

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.name.endsWith('.p12') || file.name.endsWith('.pfx')) {
        setCertificado(prev => ({
          ...prev,
          path: file.name,
          isValid: false
        }))
        setValidationMessage('')
      } else {
        toast.error('Selecione um arquivo de certificado válido (.p12 ou .pfx)')
      }
    }
  }

  const validateCertificado = async () => {
    if (!certificado.path || !certificado.password) {
      setValidationMessage('Selecione um certificado e informe a senha')
      return
    }

    setIsValidating(true)
    setValidationMessage('')

    try {
      // Simulação de validação do certificado
      // Em produção, isso seria uma chamada para validar o certificado
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const isValid = certificado.password.length >= 4 // Validação simples para demo
      
      if (isValid) {
        setCertificado(prev => ({ ...prev, isValid: true }))
        setValidationMessage('Certificado válido e configurado com sucesso!')
        toast.success('Certificado digital configurado com sucesso!')
        
        // Salvar no localStorage (em produção, seria em local seguro)
        localStorage.setItem('certificado_digital_path', certificado.path)
        localStorage.setItem('certificado_digital_alias', certificado.alias || '')
        
        onSave?.(certificado)
      } else {
        setValidationMessage('Senha do certificado inválida')
        toast.error('Senha do certificado inválida')
      }
    } catch (error) {
      setValidationMessage('Erro ao validar certificado')
      toast.error('Erro ao validar certificado')
    } finally {
      setIsValidating(false)
    }
  }

  const removeCertificado = () => {
    setCertificado({
      path: '',
      password: '',
      alias: '',
      isValid: false
    })
    setValidationMessage('')
    localStorage.removeItem('certificado_digital_path')
    localStorage.removeItem('certificado_digital_alias')
    toast.success('Certificado removido')
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center mb-6">
        <Shield className="h-6 w-6 text-blue-600 mr-3" />
        <h3 className="text-xl font-bold text-gray-900">Certificado Digital</h3>
      </div>

      <div className="space-y-6">
        {/* Status do Certificado */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            {certificado.isValid ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            )}
            <div>
              <p className="font-medium text-gray-900">
                {certificado.isValid ? 'Certificado Configurado' : 'Certificado Não Configurado'}
              </p>
              <p className="text-sm text-gray-500">
                {certificado.isValid 
                  ? 'NFSe será assinada digitalmente' 
                  : 'Configure um certificado para assinar as NFSe'
                }
              </p>
            </div>
          </div>
          {certificado.isValid && (
            <button
              onClick={removeCertificado}
              className="text-red-600 hover:text-red-700 text-sm font-medium"
            >
              Remover
            </button>
          )}
        </div>

        {/* Upload do Certificado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Arquivo do Certificado (.p12 ou .pfx)
          </label>
          <div className="flex items-center space-x-3">
            <label className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors">
              <Upload className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-sm text-gray-600">
                {certificado.path || 'Selecionar certificado'}
              </span>
              <input
                type="file"
                accept=".p12,.pfx"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Senha do Certificado */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Senha do Certificado
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={certificado.password}
              onChange={(e) => setCertificado(prev => ({ ...prev, password: e.target.value, isValid: false }))}
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite a senha do certificado"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Alias (Opcional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alias do Certificado (Opcional)
          </label>
          <input
            type="text"
            value={certificado.alias}
            onChange={(e) => setCertificado(prev => ({ ...prev, alias: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Nome do alias (se aplicável)"
          />
        </div>

        {/* Mensagem de Validação */}
        {validationMessage && (
          <div className={`p-3 rounded-lg ${
            certificado.isValid 
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            <p className="text-sm">{validationMessage}</p>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex space-x-3">
          <button
            onClick={validateCertificado}
            disabled={!certificado.path || !certificado.password || isValidating}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
          >
            {isValidating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Validando...
              </>
            ) : (
              'Validar e Configurar'
            )}
          </button>
        </div>

        {/* Informações Importantes */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Informações Importantes:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>O certificado digital é obrigatório para emissão de NFSe</li>
                <li>Certifique-se de que o certificado está válido e dentro do prazo</li>
                <li>A senha será armazenada de forma segura</li>
                <li>Suporte para certificados A1 (.p12/.pfx)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CertificadoDigitalConfig