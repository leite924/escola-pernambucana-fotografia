import { useState, useEffect } from 'react'
import { 
  Award, Download, Eye, Calendar, CheckCircle, 
  FileText, Share2, Printer, ExternalLink,
  Star, Trophy, Medal
} from 'lucide-react'
import { useStore } from '../store/useStore'
import { toast } from 'sonner'

interface Certificate {
  id: string
  courseTitle: string
  studentName: string
  completionDate: string
  issueDate: string
  certificateNumber: string
  instructor: string
  courseDuration: string
  grade: string
  attendancePercentage: number
  status: 'issued' | 'pending' | 'revoked'
  downloadUrl: string
  verificationUrl: string
  skills: string[]
}

const StudentCertificates = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const { user, students } = useStore()

  useEffect(() => {
    // Get current student
    const currentStudent = students.find(s => s.email === user?.email)
    
    // Mock certificates data
    const mockCertificates: Certificate[] = []
    
    // Add certificate if student has one
    if (currentStudent?.certificateNumber) {
      mockCertificates.push({
        id: '1',
        courseTitle: currentStudent.course,
        studentName: currentStudent.name,
        completionDate: currentStudent.certificateIssuedDate || '2024-02-15',
        issueDate: currentStudent.certificateIssuedDate || '2024-02-15',
        certificateNumber: currentStudent.certificateNumber,
        instructor: 'Carlos Silva',
        courseDuration: '8 semanas',
        grade: 'A',
        attendancePercentage: currentStudent.attendancePercentage || 85,
        status: 'issued',
        downloadUrl: '#',
        verificationUrl: `https://escola-fotografia.com/verify/${currentStudent.certificateNumber}`,
        skills: [
          'Fundamentos da Fotografia Digital',
          'Composição e Enquadramento',
          'Técnicas de Iluminação',
          'Pós-produção Básica'
        ]
      })
    }
    
    // Add a pending certificate for demonstration
    if (currentStudent?.status === 'Ativo' && (currentStudent?.attendancePercentage || 0) >= 60) {
      mockCertificates.push({
        id: '2',
        courseTitle: 'Fotografia de Retrato Profissional',
        studentName: currentStudent.name,
        completionDate: '',
        issueDate: '',
        certificateNumber: '',
        instructor: 'Ana Costa',
        courseDuration: '10 semanas',
        grade: '',
        attendancePercentage: currentStudent.attendancePercentage || 65,
        status: 'pending',
        downloadUrl: '',
        verificationUrl: '',
        skills: [
          'Técnicas de Retrato',
          'Iluminação de Estúdio',
          'Direção de Modelos',
          'Pós-produção Avançada'
        ]
      })
    }
    
    setCertificates(mockCertificates)
  }, [user, students])

  const handleDownload = (certificate: Certificate) => {
    if (certificate.status !== 'issued') {
      toast.error('Certificado ainda não está disponível para download')
      return
    }
    
    // Simulate download
    toast.success('Download do certificado iniciado!')
    console.log('Downloading certificate:', certificate.certificateNumber)
  }

  const handleShare = (certificate: Certificate) => {
    if (certificate.status !== 'issued') {
      toast.error('Certificado ainda não está disponível para compartilhamento')
      return
    }
    
    // Copy verification URL to clipboard
    navigator.clipboard.writeText(certificate.verificationUrl)
    toast.success('Link de verificação copiado para a área de transferência!')
  }

  const handlePreview = (certificate: Certificate) => {
    if (certificate.status !== 'issued') {
      toast.error('Certificado ainda não está disponível para visualização')
      return
    }
    
    setSelectedCertificate(certificate)
    setShowPreview(true)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'issued':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Emitido
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Calendar className="h-3 w-3 mr-1" />
            Pendente
          </span>
        )
      case 'revoked':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Revogado
          </span>
        )
      default:
        return null
    }
  }

  const renderCertificatePreview = () => {
    if (!selectedCertificate) return null

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Visualização do Certificado</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            {/* Certificate Design */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-4 border-blue-200 rounded-lg p-8 text-center">
              <div className="mb-6">
                <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-800 mb-2">CERTIFICADO DE CONCLUSÃO</h1>
                <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto"></div>
              </div>
              
              <div className="mb-8">
                <p className="text-lg text-gray-600 mb-4">Certificamos que</p>
                <h2 className="text-4xl font-bold text-blue-800 mb-4">{selectedCertificate.studentName}</h2>
                <p className="text-lg text-gray-600 mb-2">concluiu com êxito o curso de</p>
                <h3 className="text-2xl font-semibold text-purple-700 mb-6">{selectedCertificate.courseTitle}</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Data de Conclusão</p>
                  <p className="font-semibold text-gray-800">
                    {new Date(selectedCertificate.completionDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Carga Horária</p>
                  <p className="font-semibold text-gray-800">{selectedCertificate.courseDuration}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">Conceito</p>
                  <p className="font-semibold text-gray-800">{selectedCertificate.grade}</p>
                </div>
              </div>
              
              <div className="mb-8">
                <p className="text-sm text-gray-500 mb-2">Competências Desenvolvidas:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {selectedCertificate.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-end">
                <div className="text-left">
                  <div className="border-t border-gray-400 pt-2">
                    <p className="text-sm font-semibold text-gray-700">{selectedCertificate.instructor}</p>
                    <p className="text-xs text-gray-500">Instrutor</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <Medal className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Escola de Fotografia</p>
                </div>
                
                <div className="text-right">
                  <p className="text-xs text-gray-500 mb-1">Certificado Nº</p>
                  <p className="text-sm font-mono text-gray-700">{selectedCertificate.certificateNumber}</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4 mt-6">
              <button
                onClick={() => handleDownload(selectedCertificate)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Baixar PDF
              </button>
              <button
                onClick={() => handleShare(selectedCertificate)}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (certificates.length === 0) {
    return (
      <div className="text-center py-12">
        <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum certificado disponível</h3>
        <p className="text-gray-600 mb-4">
          Complete seus cursos com pelo menos 75% de presença para receber seus certificados.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
          <h4 className="font-medium text-blue-800 mb-2">Como obter seu certificado:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Mantenha pelo menos 75% de presença</li>
            <li>• Complete todos os módulos do curso</li>
            <li>• Realize as atividades práticas</li>
            <li>• Passe na avaliação final</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Meus Certificados</h1>
            <p className="text-gray-600 mt-1">
              Visualize e baixe seus certificados de conclusão
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <span className="text-2xl font-bold text-gray-900">{certificates.filter(c => c.status === 'issued').length}</span>
          </div>
        </div>
      </div>

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {certificates.map((certificate) => (
          <div key={certificate.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    certificate.status === 'issued' 
                      ? 'bg-green-100' 
                      : certificate.status === 'pending'
                        ? 'bg-yellow-100'
                        : 'bg-red-100'
                  }`}>
                    <Award className={`h-6 w-6 ${
                      certificate.status === 'issued'
                        ? 'text-green-600'
                        : certificate.status === 'pending'
                          ? 'text-yellow-600'
                          : 'text-red-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{certificate.courseTitle}</h3>
                    <p className="text-sm text-gray-600">Instrutor: {certificate.instructor}</p>
                  </div>
                </div>
                {getStatusBadge(certificate.status)}
              </div>
              
              {certificate.status === 'issued' && (
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <p className="text-gray-500">Data de Conclusão</p>
                    <p className="font-medium">
                      {new Date(certificate.completionDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Certificado Nº</p>
                    <p className="font-mono text-xs">{certificate.certificateNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Conceito</p>
                    <p className="font-medium">{certificate.grade}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Presença</p>
                    <p className="font-medium">{certificate.attendancePercentage}%</p>
                  </div>
                </div>
              )}
              
              {certificate.status === 'pending' && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Progresso para certificação</span>
                    <span className="font-medium">{certificate.attendancePercentage}% / 75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${Math.min(certificate.attendancePercentage / 75 * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {certificate.attendancePercentage >= 75 
                      ? 'Aguardando conclusão do curso'
                      : `Faltam ${75 - certificate.attendancePercentage}% de presença`
                    }
                  </p>
                </div>
              )}
              
              {/* Skills */}
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-2">Competências:</p>
                <div className="flex flex-wrap gap-1">
                  {certificate.skills.slice(0, 3).map((skill, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                    >
                      {skill}
                    </span>
                  ))}
                  {certificate.skills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      +{certificate.skills.length - 3} mais
                    </span>
                  )}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex space-x-2">
                <button
                  onClick={() => handlePreview(certificate)}
                  disabled={certificate.status !== 'issued'}
                  className={`flex items-center px-3 py-2 text-sm rounded-lg ${
                    certificate.status === 'issued'
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Visualizar
                </button>
                
                <button
                  onClick={() => handleDownload(certificate)}
                  disabled={certificate.status !== 'issued'}
                  className={`flex items-center px-3 py-2 text-sm rounded-lg ${
                    certificate.status === 'issued'
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Baixar
                </button>
                
                <button
                  onClick={() => handleShare(certificate)}
                  disabled={certificate.status !== 'issued'}
                  className={`flex items-center px-3 py-2 text-sm rounded-lg ${
                    certificate.status === 'issued'
                      ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Share2 className="h-4 w-4 mr-1" />
                  Compartilhar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Certificate Preview Modal */}
      {showPreview && renderCertificatePreview()}
    </div>
  )
}

export default StudentCertificates