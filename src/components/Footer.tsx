import { Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react'
import { Link } from 'react-router-dom'

const logoEpef = 'https://i.imgur.com/dy8pUaw.png';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <Link to="/" className="flex items-center">
                <img 
                  src={logoEpef} 
                  alt="Escola Pernambucana de Fotografia" 
                  className="h-12 w-auto object-contain"
                />
              </Link>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Transforme sua paixão pela fotografia em uma carreira de sucesso. 
              Aprenda com os melhores profissionais do mercado.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Links Rápidos */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/cursos" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Cursos
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors">
                  Sobre Nós
                </a>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-orange-500" />
                <span className="text-gray-300">Rua da Fotografia, 123 - Recife/PE</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-orange-500" />
                <span className="text-gray-300">(81) 9999-9999</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-orange-500" />
                <span className="text-gray-300">contato@fotoescola.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            &copy; 2024 FotoEscola. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer