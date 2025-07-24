import { useState, useEffect } from 'react'
import { Award, Download, Eye, Calendar, Users, CheckCircle, XCircle, FileText, Search, Filter } from 'lucide-react'
import { toast } from 'sonner'

interface Student {
  id: number
  name: string
  email: string
  course: string
  enrollmentDate: string
  totalClasses: number
  attendedClasses: number
  attendancePercentage: number
  certificateEligible: boolean
  certificateIssued: boolean
  certificateIssuedDate?: string
  certificateNumber?: string
}

interface Certificate {
  id: number
  studentId: number
  studentName: string
  course: string
  completionDate: string
  certificateNumber: string
  attendancePercentage: number
  issuedDate: string
  downloadCount: number
}

const CertificateSystem = () => {
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: 'João Silva',
      email: 'joao@email.com',
      course: 'Fotografia Digital Básica',
      enrollmentDate: '2024-01-01',
      totalClasses: 20,
      attendedClasses: 18,
      attendancePercentage: 90,
      certificateEligible: true,
      certificateIssued: true,
      certificateIssuedDate: '2024-01-15',
      certificateNumber: 'CERT-2024-001'
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria@email.com',
      course: 'Fotografia Avançada',
      enrollmentDate: '2024-01-05',
      totalClasses: 24,
      attendedClasses: 20,
      attendancePercentage: 83.3,
      certificateEligible: true,
      certificateIssued: false
    },
    {
      id: 3,
      name: 'Pedro Costa',
      email: 'pedro@email.com',
      course: 'Fotografia de Retrato',
      enrollmentDate: '2024-01-10',
      totalClasses: 16,
      attendedClasses: 10,
      attendancePercentage: 62.5,
      certificateEligible: false,
      certificateIssued: false
    },
    {
      id: 4,
      name: 'Ana Oliveira',
      email: 'ana@email.com',
      course: 'Edição e Pós-produção',
      enrollmentDate: '2024-01-12',
      totalClasses: 18,
      attendedClasses: 14,
      attendancePercentage: 77.8,
      certificateEligible: true,
      certificateIssued: false
    }
  ])
  
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: 1,
      studentId: 1,
      studentName: 'João Silva',
      course: 'Fotografia Digital Básica',
      completionDate: '2024-01-15',
      certificateNumber: 'CERT-2024-001',
      attendancePercentage: 90,
      issuedDate: '2024-01-15',
      downloadCount: 3
    }
  ])
  
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [courseFilter, setCourseFilter] = useState<string>('all')
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [showCertificatePreview, setShowCertificatePreview] = useState(false)

  const courses = [
    'Fotografia Digital Básica',
    'Fotografia Avançada',
    'Fotografia de Retrato',
    'Fotografia de Paisagem',
    'Edição e Pós-produção'
  ]

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.course.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'eligible' && student.certificateEligible) ||
                         (statusFilter === 'issued' && student.certificateIssued) ||
                         (statusFilter === 'not_eligible' && !student.certificateEligible)
    
    const matchesCourse = courseFilter === 'all' || student.course === courseFilter
    
    return matchesSearch && matchesStatus && matchesCourse
  })

  const eligibleStudents = students.filter(s => s.certificateEligible && !s.certificateIssued).length
  const issuedCertificates = students.filter(s => s.certificateIssued).length
  const totalStudents = students.length
  const averageAttendance = students.reduce((sum, s) => sum + s.attendancePercentage, 0) / students.length

  const generateCertificateNumber = () => {
    const year = new Date().getFullYear()
    const nextNumber = certificates.length + 1
    return `CERT-${year}-${nextNumber.toString().padStart(3, '0')}`
  }

  const issueCertificate = (student: Student) => {
    if (!student.certificateEligible) {
      toast.error('Aluno não elegível para certificado (menos de 75% de presença)')
      return
    }
    
    if (student.certificateIssued) {
      toast.error('Certificado já foi emitido para este aluno')
      return
    }

    const certificateNumber = generateCertificateNumber()
    const issuedDate = new Date().toISOString().split('T')[0]
    
    // Atualizar dados do aluno
    setStudents(prev => prev.map(s => 
      s.id === student.id 
        ? { 
            ...s, 
            certificateIssued: true, 
            certificateIssuedDate: issuedDate,
            certificateNumber 
          }
        : s
    ))
    
    // Criar registro do certificado
    const newCertificate: Certificate = {
      id: Date.now(),
      studentId: student.id,
      studentName: student.name,
      course: student.course,
      completionDate: issuedDate,
      certificateNumber,
      attendancePercentage: student.attendancePercentage,
      issuedDate,
      downloadCount: 0
    }
    
    setCertificates(prev => [...prev, newCertificate])
    toast.success(`Certificado emitido com sucesso! Número: ${certificateNumber}`)
  }

  const downloadCertificate = (student: Student) => {
    if (!student.certificateIssued) {
      toast.error('Certificado não foi emitido ainda')
      return
    }
    
    // Incrementar contador de downloads
    setCertificates(prev => prev.map(cert => 
      cert.studentId === student.id 
        ? { ...cert, downloadCount: cert.downloadCount + 1 }
        : cert
    ))
    
    // Simular download do PDF
    const link = document.createElement('a')
    link.href = `data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PAovVGl0bGUgKENlcnRpZmljYWRvIGRlIENvbmNsdXPDo28pCi9Qcm9kdWNlciAoRm90b2dyYWZpYSBEaWdpdGFsKQovQ3JlYXRvciAoU2lzdGVtYSBkZSBDZXJ0aWZpY2Fkb3MpCj4+CmVuZG9iago=`
    link.download = `certificado-${student.certificateNumber}-${student.name.replace(/\s+/g, '-').toLowerCase()}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast.success('Certificado baixado com sucesso!')
  }

  const previewCertificate = (student: Student) => {
    setSelectedStudent(student)
    setShowCertificatePreview(true)
  }

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 75) return 'text-green-600 bg-green-100'
    if (percentage >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getStatusColor = (student: Student) => {
    if (student.certificateIssued) return 'text-green-600 bg-green-100'
    if (student.certificateEligible) return 'text-blue-600 bg-blue-100'
    return 'text-red-600 bg-red-100'
  }

  const getStatusText = (student: Student) => {
    if (student.certificateIssued) return 'Emitido'
    if (student.certificateEligible) return 'Elegível'
    return 'Não Elegível'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Sistema de Certificados</h2>
        <div className="text-sm text-gray-600">
          Critério: 75% de presença mínima
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Alunos</p>
              <p className="text-2xl font-bold text-blue-600">{totalStudents}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Elegíveis</p>
              <p className="text-2xl font-bold text-green-600">{eligibleStudents}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Certificados Emitidos</p>
              <p className="text-2xl font-bold text-purple-600">{issuedCertificates}</p>
            </div>
            <Award className="h-8 w-8 text-purple-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Presença Média</p>
              <p className="text-2xl font-bold text-orange-600">{averageAttendance.toFixed(1)}%</p>
            </div>
            <Calendar className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Buscar por aluno, email ou curso..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos os Status</option>
              <option value="eligible">Elegíveis</option>
              <option value="issued">Certificados Emitidos</option>
              <option value="not_eligible">Não Elegíveis</option>
            </select>
            
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todos os Cursos</option>
              {courses.map(course => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aluno
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Curso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Presença
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Certificado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{student.name}</div>
                      <div className="text-sm text-gray-500">{student.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.course}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {student.attendedClasses}/{student.totalClasses} aulas
                    </div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAttendanceColor(student.attendancePercentage)}`}>
                      {student.attendancePercentage.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(student)}`}>
                      {getStatusText(student)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.certificateIssued ? (
                      <div>
                        <div className="font-medium">{student.certificateNumber}</div>
                        <div className="text-xs text-gray-500">
                          Emitido em {student.certificateIssuedDate ? new Date(student.certificateIssuedDate).toLocaleDateString('pt-BR') : ''}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      {student.certificateEligible && !student.certificateIssued && (
                        <button
                          onClick={() => issueCertificate(student)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Emitir certificado"
                        >
                          <Award className="h-4 w-4" />
                        </button>
                      )}
                      {student.certificateIssued && (
                        <>
                          <button
                            onClick={() => previewCertificate(student)}
                            className="text-green-600 hover:text-green-900"
                            title="Visualizar certificado"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => downloadCertificate(student)}
                            className="text-purple-600 hover:text-purple-900"
                            title="Baixar certificado"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Certificate Preview Modal */}
      {showCertificatePreview && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Visualização do Certificado
                </h3>
                <button
                  onClick={() => {
                    setShowCertificatePreview(false)
                    setSelectedStudent(null)
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              {/* Certificate Design */}
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-8 border-blue-600 rounded-lg p-12 text-center">
                <div className="mb-8">
                  <h1 className="text-4xl font-bold text-blue-800 mb-2">CERTIFICADO</h1>
                  <h2 className="text-2xl font-semibold text-blue-600">DE CONCLUSÃO</h2>
                </div>
                
                <div className="mb-8">
                  <p className="text-lg text-gray-700 mb-4">
                    Certificamos que
                  </p>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4 border-b-2 border-blue-300 pb-2 inline-block">
                    {selectedStudent.name}
                  </h3>
                  <p className="text-lg text-gray-700 mb-2">
                    concluiu com êxito o curso de
                  </p>
                  <h4 className="text-2xl font-semibold text-blue-700 mb-4">
                    {selectedStudent.course}
                  </h4>
                </div>
                
                <div className="mb-8 grid grid-cols-2 gap-8 text-sm text-gray-600">
                  <div>
                    <p><strong>Presença:</strong> {selectedStudent.attendancePercentage.toFixed(1)}%</p>
                    <p><strong>Aulas Frequentadas:</strong> {selectedStudent.attendedClasses}/{selectedStudent.totalClasses}</p>
                  </div>
                  <div>
                    <p><strong>Data de Conclusão:</strong> {selectedStudent.certificateIssuedDate ? new Date(selectedStudent.certificateIssuedDate).toLocaleDateString('pt-BR') : ''}</p>
                    <p><strong>Certificado Nº:</strong> {selectedStudent.certificateNumber}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-end">
                  <div className="text-left">
                    <div className="border-t-2 border-gray-400 pt-2 w-48">
                      <p className="text-sm text-gray-600">Escola de Fotografia Digital</p>
                      <p className="text-xs text-gray-500">Direção Acadêmica</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Award className="h-16 w-16 text-yellow-500 mx-auto mb-2" />
                    <p className="text-xs text-gray-500">Selo de Autenticidade</p>
                  </div>
                  
                  <div className="text-right">
                    <div className="border-t-2 border-gray-400 pt-2 w-48">
                      <p className="text-sm text-gray-600">Recife, PE</p>
                      <p className="text-xs text-gray-500">{new Date().toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4 mt-6">
                <button
                  onClick={() => downloadCertificate(selectedStudent)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Baixar PDF</span>
                </button>
                <button
                  onClick={() => {
                    setShowCertificatePreview(false)
                    setSelectedStudent(null)
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CertificateSystem