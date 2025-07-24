import { useState } from 'react'
import { ShoppingCart as CartIcon, X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react'
import { useStore } from '../store/useStore'
import { toast } from 'sonner'

interface ShoppingCartProps {
  isOpen: boolean
  onClose: () => void
  onCheckout: () => void
}

const ShoppingCart = ({ isOpen, onClose, onCheckout }: ShoppingCartProps) => {
  const {
    cartItems,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount
  } = useStore()

  const handleQuantityChange = (courseId: number, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(courseId)
      toast.success('Curso removido do carrinho')
    } else {
      updateCartQuantity(courseId, newQuantity)
    }
  }

  const handleRemoveItem = (courseId: number, courseName: string) => {
    removeFromCart(courseId)
    toast.success(`${courseName} removido do carrinho`)
  }

  const handleClearCart = () => {
    clearCart()
    toast.success('Carrinho limpo')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div className="flex items-center space-x-2">
              <CartIcon className="h-6 w-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Carrinho ({getCartItemsCount()})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {cartItems.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <CartIcon className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Seu carrinho está vazio
                </h3>
                <p className="text-gray-500 mb-6">
                  Adicione alguns cursos para começar
                </p>
                <button
                  onClick={onClose}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Continuar Comprando
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start space-x-4">
                      <img
                        src={item.course.image}
                        alt={item.course.title}
                        className="h-16 w-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {item.course.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.course.instructor}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-semibold text-blue-600">
                            {formatPrice(item.course.price)}
                          </span>
                          <button
                            onClick={() => handleRemoveItem(item.courseId, item.course.title)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(item.courseId, item.quantity - 1)}
                          className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.courseId, item.quantity + 1)}
                          className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        Subtotal: {formatPrice(item.course.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
                
                {/* Clear Cart Button */}
                <button
                  onClick={handleClearCart}
                  className="w-full text-center text-sm text-red-500 hover:text-red-700 py-2"
                >
                  Limpar Carrinho
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-medium text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatPrice(getCartTotal())}
                </span>
              </div>
              
              <button
                onClick={onCheckout}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <span>Finalizar Compra</span>
                <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ShoppingCart