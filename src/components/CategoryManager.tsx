import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, ChevronDown, ChevronRight, Folder, FolderOpen } from 'lucide-react'
import { toast } from 'sonner'

interface Category {
  id: number
  name: string
  type: 'payable' | 'receivable'
  subcategories: Subcategory[]
}

interface Subcategory {
  id: number
  name: string
  categoryId: number
}

interface CategoryManagerProps {
  type: 'payable' | 'receivable'
  onCategorySelect?: (categoryId: number, subcategoryId?: number) => void
  selectedCategoryId?: number
  selectedSubcategoryId?: number
  onClose?: () => void
}

const CategoryManager = ({ type, onCategorySelect, selectedCategoryId, selectedSubcategoryId, onClose }: CategoryManagerProps) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set())
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [showAddSubcategory, setShowAddSubcategory] = useState<number | null>(null)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null)
  
  const [categoryForm, setCategoryForm] = useState({ name: '' })
  const [subcategoryForm, setSubcategoryForm] = useState({ name: '', categoryId: 0 })

  // Dados iniciais
  useEffect(() => {
    const initialCategories: Category[] = type === 'payable' ? [
      {
        id: 1,
        name: 'Infraestrutura',
        type: 'payable',
        subcategories: [
          { id: 1, name: 'Aluguel', categoryId: 1 },
          { id: 2, name: 'Energia Elétrica', categoryId: 1 },
          { id: 3, name: 'Internet', categoryId: 1 },
          { id: 4, name: 'Telefone', categoryId: 1 }
        ]
      },
      {
        id: 2,
        name: 'Equipamentos',
        type: 'payable',
        subcategories: [
          { id: 5, name: 'Câmeras', categoryId: 2 },
          { id: 6, name: 'Lentes', categoryId: 2 },
          { id: 7, name: 'Iluminação', categoryId: 2 },
          { id: 8, name: 'Tripés e Suportes', categoryId: 2 }
        ]
      },
      {
        id: 3,
        name: 'Marketing',
        type: 'payable',
        subcategories: [
          { id: 9, name: 'Publicidade Online', categoryId: 3 },
          { id: 10, name: 'Material Gráfico', categoryId: 3 },
          { id: 11, name: 'Eventos', categoryId: 3 }
        ]
      },
      {
        id: 4,
        name: 'Serviços',
        type: 'payable',
        subcategories: [
          { id: 12, name: 'Contabilidade', categoryId: 4 },
          { id: 13, name: 'Limpeza', categoryId: 4 },
          { id: 14, name: 'Manutenção', categoryId: 4 }
        ]
      }
    ] : [
      {
        id: 5,
        name: 'Cursos',
        type: 'receivable',
        subcategories: [
          { id: 15, name: 'Fotografia Básica', categoryId: 5 },
          { id: 16, name: 'Fotografia Avançada', categoryId: 5 },
          { id: 17, name: 'Retrato', categoryId: 5 },
          { id: 18, name: 'Paisagem', categoryId: 5 }
        ]
      },
      {
        id: 6,
        name: 'Workshops',
        type: 'receivable',
        subcategories: [
          { id: 19, name: 'Workshop de Iluminação', categoryId: 6 },
          { id: 20, name: 'Workshop de Edição', categoryId: 6 },
          { id: 21, name: 'Workshop de Composição', categoryId: 6 }
        ]
      },
      {
        id: 7,
        name: 'Serviços',
        type: 'receivable',
        subcategories: [
          { id: 22, name: 'Sessão de Fotos', categoryId: 7 },
          { id: 23, name: 'Edição de Fotos', categoryId: 7 },
          { id: 24, name: 'Consultoria', categoryId: 7 }
        ]
      }
    ]
    
    setCategories(initialCategories)
  }, [type])

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId)
      } else {
        newSet.add(categoryId)
      }
      return newSet
    })
  }

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingCategory) {
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, name: categoryForm.name }
          : cat
      ))
      toast.success('Categoria atualizada com sucesso!')
      setEditingCategory(null)
    } else {
      const newCategory: Category = {
        id: Date.now(),
        name: categoryForm.name,
        type,
        subcategories: []
      }
      setCategories(prev => [...prev, newCategory])
      toast.success('Categoria criada com sucesso!')
    }
    
    setCategoryForm({ name: '' })
    setShowAddCategory(false)
  }

  const handleSubcategorySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingSubcategory) {
      setCategories(prev => prev.map(cat => ({
        ...cat,
        subcategories: cat.subcategories.map(sub => 
          sub.id === editingSubcategory.id 
            ? { ...sub, name: subcategoryForm.name }
            : sub
        )
      })))
      toast.success('Subcategoria atualizada com sucesso!')
      setEditingSubcategory(null)
    } else {
      const newSubcategory: Subcategory = {
        id: Date.now(),
        name: subcategoryForm.name,
        categoryId: subcategoryForm.categoryId
      }
      
      setCategories(prev => prev.map(cat => 
        cat.id === subcategoryForm.categoryId
          ? { ...cat, subcategories: [...cat.subcategories, newSubcategory] }
          : cat
      ))
      toast.success('Subcategoria criada com sucesso!')
    }
    
    setSubcategoryForm({ name: '', categoryId: 0 })
    setShowAddSubcategory(null)
  }

  const handleDeleteCategory = (categoryId: number) => {
    if (confirm('Tem certeza que deseja excluir esta categoria e todas as suas subcategorias?')) {
      setCategories(prev => prev.filter(cat => cat.id !== categoryId))
      toast.success('Categoria excluída com sucesso!')
    }
  }

  const handleDeleteSubcategory = (subcategoryId: number) => {
    if (confirm('Tem certeza que deseja excluir esta subcategoria?')) {
      setCategories(prev => prev.map(cat => ({
        ...cat,
        subcategories: cat.subcategories.filter(sub => sub.id !== subcategoryId)
      })))
      toast.success('Subcategoria excluída com sucesso!')
    }
  }

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category)
    setCategoryForm({ name: category.name })
    setShowAddCategory(true)
  }

  const handleEditSubcategory = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory)
    setSubcategoryForm({ name: subcategory.name, categoryId: subcategory.categoryId })
    setShowAddSubcategory(subcategory.categoryId)
  }

  const handleSelectCategory = (categoryId: number, subcategoryId?: number) => {
    if (onCategorySelect) {
      onCategorySelect(categoryId, subcategoryId)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Categorias - {type === 'payable' ? 'Contas a Pagar' : 'Contas a Receber'}
        </h3>
        <button
          onClick={() => setShowAddCategory(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center space-x-1"
        >
          <Plus className="h-4 w-4" />
          <span>Nova Categoria</span>
        </button>
      </div>

      {/* Lista de Categorias */}
      <div className="space-y-2">
        {categories.map(category => (
          <div key={category.id} className="border border-gray-200 rounded-lg">
            <div className="flex items-center justify-between p-3 bg-gray-50">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => toggleCategory(category.id)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {expandedCategories.has(category.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
                {expandedCategories.has(category.id) ? (
                  <FolderOpen className="h-4 w-4 text-blue-600" />
                ) : (
                  <Folder className="h-4 w-4 text-blue-600" />
                )}
                <button
                  onClick={() => handleSelectCategory(category.id)}
                  className={`font-medium text-left ${
                    selectedCategoryId === category.id && !selectedSubcategoryId
                      ? 'text-blue-600'
                      : 'text-gray-900 hover:text-blue-600'
                  }`}
                >
                  {category.name}
                </button>
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => {
                    setSubcategoryForm({ name: '', categoryId: category.id })
                    setShowAddSubcategory(category.id)
                  }}
                  className="text-green-600 hover:text-green-700 p-1"
                  title="Adicionar Subcategoria"
                >
                  <Plus className="h-3 w-3" />
                </button>
                <button
                  onClick={() => handleEditCategory(category)}
                  className="text-blue-600 hover:text-blue-700 p-1"
                  title="Editar Categoria"
                >
                  <Edit className="h-3 w-3" />
                </button>
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-red-600 hover:text-red-700 p-1"
                  title="Excluir Categoria"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Subcategorias */}
            {expandedCategories.has(category.id) && (
              <div className="border-t border-gray-200">
                {category.subcategories.map(subcategory => (
                  <div key={subcategory.id} className="flex items-center justify-between p-3 pl-10 hover:bg-gray-50">
                    <button
                      onClick={() => handleSelectCategory(category.id, subcategory.id)}
                      className={`text-left ${
                        selectedCategoryId === category.id && selectedSubcategoryId === subcategory.id
                          ? 'text-blue-600 font-medium'
                          : 'text-gray-700 hover:text-blue-600'
                      }`}
                    >
                      {subcategory.name}
                    </button>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => handleEditSubcategory(subcategory)}
                        className="text-blue-600 hover:text-blue-700 p-1"
                        title="Editar Subcategoria"
                      >
                        <Edit className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => handleDeleteSubcategory(subcategory.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                        title="Excluir Subcategoria"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
                
                {/* Formulário de Subcategoria */}
                {showAddSubcategory === category.id && (
                  <div className="p-3 pl-10 border-t border-gray-100 bg-blue-50">
                    <form onSubmit={handleSubcategorySubmit} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={subcategoryForm.name}
                        onChange={(e) => setSubcategoryForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Nome da subcategoria"
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                        required
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-sm"
                      >
                        {editingSubcategory ? 'Atualizar' : 'Adicionar'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddSubcategory(null)
                          setEditingSubcategory(null)
                          setSubcategoryForm({ name: '', categoryId: 0 })
                        }}
                        className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded text-sm"
                      >
                        Cancelar
                      </button>
                    </form>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Formulário de Categoria */}
      {showAddCategory && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <form onSubmit={handleCategorySubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </label>
              <input
                type="text"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ name: e.target.value })}
                placeholder="Nome da categoria"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                autoFocus
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                {editingCategory ? 'Atualizar' : 'Criar'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAddCategory(false)
                  setEditingCategory(null)
                  setCategoryForm({ name: '' })
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default CategoryManager
export { CategoryManager }