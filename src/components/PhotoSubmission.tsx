import { useState } from 'react'
import { Upload, Camera, X } from 'lucide-react'
import { toast } from 'sonner'
import { useStore } from '../store/useStore'

interface SubmissionFormData {
  title: string
  description: string
  category: string
  tags: string
  camera?: string
  aperture?: string
  shutter?: string
  iso?: string
  focal?: string
}

interface PhotoSubmissionProps {
  isOpen: boolean
  onClose: () => void
  studentCourse: string
}

const PhotoSubmission = ({ isOpen, onClose, studentCourse }: PhotoSubmissionProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [submissionData, setSubmissionData] = useState<SubmissionFormData>({
    title: '',
    description: '',
    category: 'portrait',
    tags: '',
    camera: '',
    aperture: '',
    shutter: '',
    iso: '',
    focal: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useStore()

  const categories = [
    { value: 'portrait', label: 'Retrato' },
    { value: 'landscape', label: 'Paisagem' },
    { value: 'street', label: 'Street Photography' },
    { value: 'macro', label: 'Macro' },
    { value: 'wedding', label: 'Casamento' },
    { value: 'fashion', label: 'Moda' },
    { value: 'product', label: 'Produto' },
    { value: 'architecture', label: 'Arquitetura' },
    { value: 'nature', label: 'Natureza' },
    { value: 'event', label: 'Eventos' }
  ]

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('Arquivo muito grande. Máximo 10MB.')
        return
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione apenas arquivos de imagem.')
        return
      }
      
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSubmission = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedFile) {
      toast.error('Por favor, selecione uma imagem.')
      return
    }
    
    if (!submissionData.title || !submissionData.description) {
      toast.error('Por favor, preencha título e descrição.')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Simular upload - em produção seria uma chamada real para API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Aqui seria feita a submissão real para a API
      const submissionPayload = {
        ...submissionData,
        studentName: user?.name || 'Aluno',
        studentEmail: user?.email,
        course: studentCourse,
        file: selectedFile,
        submissionDate: new Date().toISOString(),
        status: 'pending'
      }
      
      console.log('Submissão enviada:', submissionPayload)
      
      // Reset form
      setSubmissionData({
        title: '',
        description: '',
        category: 'portrait',
        tags: '',
        camera: '',
        aperture: '',
        shutter: '',
        iso: '',
        focal: ''
      })
      setSelectedFile(null)
      setPreviewUrl(null)
      onClose()
      
      toast.success('Foto enviada com sucesso! Aguarde aprovação para aparecer na galeria.')
    } catch (error) {
      toast.error('Erro ao enviar foto. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setSubmissionData({
      title: '',
      description: '',
      category: 'portrait',
      tags: '',
      camera: '',
      aperture: '',
      shutter: '',
      iso: '',
      focal: ''
    })
    setSelectedFile(null)
    setPreviewUrl(null)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Enviar Foto para Galeria</h2>
              <p className="text-sm text-gray-600 mt-1">Curso: {studentCourse}</p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <form onSubmit={handleSubmission} className="space-y-6">
            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Selecionar Imagem *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors relative">
                {previewUrl ? (
                  <div className="space-y-4">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-h-48 mx-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null)
                        setPreviewUrl(null)
                      }}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Remover imagem
                    </button>
                  </div>
                ) : (
                  <div>
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Clique para selecionar ou arraste uma imagem</p>
                    <p className="text-sm text-gray-500">PNG, JPG até 10MB</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
            </div>
            
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título *
                </label>
                <input
                  type="text"
                  value={submissionData.title}
                  onChange={(e) => setSubmissionData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Título da sua foto"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria *
                </label>
                <select
                  value={submissionData.category}
                  onChange={(e) => setSubmissionData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descrição *
              </label>
              <textarea
                value={submissionData.description}
                onChange={(e) => setSubmissionData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Descreva sua foto, técnicas utilizadas, inspiração..."
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                value={submissionData.tags}
                onChange={(e) => setSubmissionData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="retrato, luz-natural, golden-hour (separadas por vírgula)"
              />
            </div>
            
            {/* Camera Settings */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações da Câmera (Opcional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Câmera
                  </label>
                  <input
                    type="text"
                    value={submissionData.camera}
                    onChange={(e) => setSubmissionData(prev => ({ ...prev, camera: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Canon EOS R6, Sony A7 III..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Abertura
                  </label>
                  <input
                    type="text"
                    value={submissionData.aperture}
                    onChange={(e) => setSubmissionData(prev => ({ ...prev, aperture: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="2.8, 5.6, 8..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Velocidade
                  </label>
                  <input
                    type="text"
                    value={submissionData.shutter}
                    onChange={(e) => setSubmissionData(prev => ({ ...prev, shutter: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1/250s, 1/60s, 2s..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ISO
                  </label>
                  <input
                    type="text"
                    value={submissionData.iso}
                    onChange={(e) => setSubmissionData(prev => ({ ...prev, iso: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="100, 400, 800..."
                  />
                </div>
              </div>
            </div>
            
            {/* Submit Buttons */}
            <div className="flex space-x-4 pt-6">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Enviando...</span>
                  </>
                ) : (
                  <>
                    <Camera className="h-4 w-4" />
                    <span>Enviar Foto</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default PhotoSubmission