import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { cn } from '../lib/utils'
const logoEpef = 'https://i.imgur.com/dy8pUaw.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'Início', href: '/' },
    { name: 'Cursos', href: '/cursos' },
    { name: 'Galeria', href: '/galeria' },
    { name: 'Contato', href: '/contato' },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between h-20 py-2">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src={logoEpef} 
                alt="Escola Pernambucana de Fotografia" 
                className="h-14 w-auto object-contain mt-2"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive(item.href)
                    ? 'text-gray-700 bg-gray-100'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                )}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/aluno/login"
              className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors mr-2"
            >
              Área do Aluno
            </Link>
            <Link
              to="/admin/login"
              className="bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              Admin
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'block px-3 py-2 rounded-md text-base font-medium transition-colors',
                  isActive(item.href)
                    ? 'text-gray-700 bg-gray-100'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Link
              to="/aluno/login"
              className="block bg-gray-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition-colors mb-2"
              onClick={() => setIsOpen(false)}
            >
              Área do Aluno
            </Link>
            <Link
              to="/admin/login"
              className="block bg-gray-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Admin
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar