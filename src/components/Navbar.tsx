import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ShoppingCart } from 'lucide-react'
import { cn } from '../lib/utils'
import { useStore } from '../store/useStore'
const logoEpef = 'https://i.imgur.com/dy8pUaw.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const location = useLocation()
  const { getCartItemsCount } = useStore()

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
            
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemsCount()}
                </span>
              )}
            </button>
            
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

          {/* Mobile menu button and cart */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Cart Button Mobile */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemsCount()}
                </span>
              )}
            </button>
            
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
      
      {/* Shopping Cart Sidebar */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsCartOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Carrinho de Compras</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto">
                <ShoppingCartContent onClose={() => setIsCartOpen(false)} />
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

// Componente interno para o conteúdo do carrinho
const ShoppingCartContent = ({ onClose }: { onClose: () => void }) => {
  const { cartItems, removeFromCart, updateCartQuantity, getCartTotal, clearCart } = useStore()

  if (cartItems.length === 0) {
    return (
      <div className="p-4 text-center">
        <ShoppingCart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500">Seu carrinho está vazio</p>
        <Link
          to="/cursos"
          onClick={onClose}
          className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Ver Cursos
        </Link>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="space-y-4">
        {cartItems.map((item) => (
           <div key={item.classSchedule.id} className="flex items-center space-x-3 border-b pb-4">
             <img
               src={item.course.image}
               alt={item.course.title}
               className="w-16 h-16 object-cover rounded"
             />
             <div className="flex-1">
               <h3 className="font-medium text-sm">{item.course.title}</h3>
               <p className="text-xs text-gray-500 mb-1">
                 Turma: {item.classSchedule.shift} - {item.classSchedule.schedule}
               </p>
               <p className="text-blue-600 font-semibold">
                 R$ {item.course.price.toFixed(2).replace('.', ',')}
               </p>
               <div className="flex items-center space-x-2 mt-2">
                 <button
                   onClick={() => updateCartQuantity(item.classSchedule.id, Math.max(0, item.quantity - 1))}
                   className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
                 >
                   -
                 </button>
                 <span className="w-8 text-center">{item.quantity}</span>
                 <button
                   onClick={() => updateCartQuantity(item.classSchedule.id, item.quantity + 1)}
                   className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100"
                 >
                   +
                 </button>
                 <button
                   onClick={() => removeFromCart(item.classSchedule.id)}
                   className="ml-2 text-red-500 hover:text-red-700"
                 >
                   <X className="h-4 w-4" />
                 </button>
               </div>
             </div>
           </div>
         ))}
      </div>
      
      <div className="mt-6 border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">Total:</span>
          <span className="font-bold text-lg text-blue-600">
            R$ {getCartTotal().toFixed(2).replace('.', ',')}
          </span>
        </div>
        
        <div className="space-y-2">
          <Link
            to="/checkout"
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors text-center block"
          >
            Finalizar Compra
          </Link>
          <button
            onClick={clearCart}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            Limpar Carrinho
          </button>
        </div>
      </div>
    </div>
  )
}

export default Navbar