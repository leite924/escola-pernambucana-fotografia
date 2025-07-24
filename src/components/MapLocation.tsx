import { useState } from 'react'
import { MapPin, ExternalLink, Navigation } from 'lucide-react'

interface MapLocationProps {
  address?: string
  latitude?: number
  longitude?: number
  className?: string
}

const MapLocation = ({ 
  address = "Rua da Fotografia, 123 - Boa Viagem, Recife/PE",
  latitude = -8.1137,
  longitude = -34.9030,
  className = ""
}: MapLocationProps) => {
  const [isLoading, setIsLoading] = useState(true)

  // Encode address for Google Maps URLs
  const encodedAddress = encodeURIComponent(address)
  
  // Google Maps embed URL
  const googleMapsEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dw901SwHSR3g-0&q=${encodedAddress}&zoom=16`
  
  // Google Maps directions URL
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
  
  // Waze URL
  const wazeUrl = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`

  const handleMapLoad = () => {
    setIsLoading(false)
  }

  const handleDirections = (service: 'google' | 'waze') => {
    const url = service === 'google' ? googleMapsDirectionsUrl : wazeUrl
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Map Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5" />
            <h3 className="font-semibold">Nossa Localização</h3>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => handleDirections('google')}
              className="bg-blue-500 hover:bg-blue-400 px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1"
              title="Abrir no Google Maps"
            >
              <Navigation className="h-4 w-4" />
              <span>Google Maps</span>
            </button>
            <button
              onClick={() => handleDirections('waze')}
              className="bg-blue-500 hover:bg-blue-400 px-3 py-1 rounded text-sm transition-colors flex items-center space-x-1"
              title="Abrir no Waze"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Waze</span>
            </button>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="relative h-80">
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center z-10">
            <div className="text-center text-gray-500">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p>Carregando mapa...</p>
            </div>
          </div>
        )}
        
        <iframe
          src={googleMapsEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          onLoad={handleMapLoad}
          className="w-full h-full"
          title="Localização da Escola Pernambucana de Fotografia"
        />
      </div>

      {/* Address Info */}
      <div className="p-4 bg-gray-50">
        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-gray-900">Escola Pernambucana de Fotografia</p>
            <p className="text-gray-600 text-sm">{address}</p>
            <p className="text-gray-500 text-xs mt-1">CEP: 51020-000</p>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">
            <strong>Como chegar:</strong>
          </p>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Próximo ao Shopping Recife</li>
            <li>• Fácil acesso por transporte público</li>
            <li>• Estacionamento disponível</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default MapLocation