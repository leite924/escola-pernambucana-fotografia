import { useState, useEffect } from 'react'
import { Shield, Users, Edit, Trash2, Plus, X, Check, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'

interface AdminUser {
  id: number
  name: string
  email: string
  role: 'super_admin' | 'admin' | 'instructor' | 'financial'
  permissions: string[]
  isActive: boolean
  createdAt: string
  lastLogin?: string
}

interface Permission {
  id: string
  name: string
  description: string
  category: 'courses' | 'students' | 'financial' | 'system'
}

const AdminAccessLevels = () => {
  const [admins, setAdmins] = useState<AdminUser[]>([
    {
      id: 1,
      name: 'Henrique Silva',
      email: 'henrique@fotografia.com',
      role: 'super_admin',
      permissions: ['all'],
      isActive: true,
      createdAt: '2024-01-01',
      lastLogin: '2024-01-15'
    },
    {
      id: 2,
      name: 'Maria Santos',
      email: 'maria@fotografia.com',
      role: 'admin',
      permissions: ['manage_courses', 'manage_students', 'view_reports'],
      isActive: true,
      createdAt: '2024-01-05'
    },
    {
      id: 3,
      name: 'João Instrutor',
      email: 'joao@fotografia.com',
      role: 'instructor',
      permissions: ['view_courses', 'manage_attendance', 'view_students'],
      isActive: true,
      createdAt: '2024-01-10'
    }
  ])
  
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null)
  const [selectedAdmin, setSelectedAdmin] = useState<AdminUser | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'admin' as AdminUser['role'],
    permissions: [] as string[],
    isActive: true
  })

  const permissions: Permission[] = [
    // Cursos
    { id: 'manage_courses', name: 'Gerenciar Cursos', description: 'Criar, editar e excluir cursos', category: 'courses' },
    { id: 'view_courses', name: 'Visualizar Cursos', description: 'Visualizar lista de cursos', category: 'courses' },
    { id: 'manage_content', name: 'Gerenciar Conteúdo', description: 'Adicionar e editar conteúdo dos cursos', category: 'courses' },
    
    // Alunos
    { id: 'manage_students', name: 'Gerenciar Alunos', description: 'Criar, editar e excluir alunos', category: 'students' },
    { id: 'view_students', name: 'Visualizar Alunos', description: 'Visualizar lista de alunos', category: 'students' },
    { id: 'manage_attendance', name: 'Gerenciar Presença', description: 'Marcar presença e faltas', category: 'students' },
    { id: 'issue_certificates', name: 'Emitir Certificados', description: 'Gerar e emitir certificados', category: 'students' },
    
    // Financeiro
    { id: 'manage_payments', name: 'Gerenciar Pagamentos', description: 'Visualizar e gerenciar pagamentos', category: 'financial' },
    { id: 'manage_accounts', name: 'Gerenciar Contas', description: 'Contas a pagar e receber', category: 'financial' },
    { id: 'view_reports', name: 'Visualizar Relatórios', description: 'Acessar relatórios financeiros', category: 'financial' },
    { id: 'manage_nfse', name: 'Gerenciar NFSe', description: 'Emitir e gerenciar notas fiscais', category: 'financial' },
    
    // Sistema
    { id: 'manage_admins', name: 'Gerenciar Administradores', description: 'Criar e gerenciar outros administradores', category: 'system' },
    { id: 'system_settings', name: 'Configurações do Sistema', description: 'Alterar configurações gerais', category: 'system' },
    { id: 'view_logs', name: 'Visualizar Logs', description: 'Acessar logs do sistema', category: 'system' }
  ]

  const rolePermissions = {
    super_admin: ['all'],
    admin: ['manage_courses', 'manage_students', 'manage_attendance', 'view_reports', 'manage_payments'],
    instructor: ['view_courses', 'view_students', 'manage_attendance', 'manage_content'],
    financial: ['manage_payments', 'manage_accounts', 'view_reports', 'manage_nfse']
  }

  const getRoleName = (role: AdminUser['role']) => {
    switch (role) {
      case 'super_admin': return 'Super Administrador'
      case 'admin': return 'Administrador'
      case 'instructor': return 'Instrutor'
      case 'financial': return 'Financeiro'
      default: return role
    }
  }

  const getRoleColor = (role: AdminUser['role']) => {
    switch (role) {
      case 'super_admin': return 'text-purple-600 bg-purple-100'
      case 'admin': return 'text-blue-600 bg-blue-100'
      case 'instructor': return 'text-green-600 bg-green-100'
      case 'financial': return 'text-orange-600 bg-orange-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getCategoryName = (category: Permission['category']) => {
    switch (category) {
      case 'courses': return 'Cursos'
      case 'students': return 'Alunos'
      case 'financial': return 'Financeiro'
      case 'system': return 'Sistema'
      default: return category
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const adminData = {
      ...formData,
      permissions: formData.role === 'super_admin' ? ['all'] : formData.permissions
    }

    if (editingAdmin) {
      setAdmins(prev => prev.map(admin => 
        admin.id === editingAdmin.id 
          ? { ...admin, ...adminData }
          : admin
      ))
      toast.success('Administrador atualizado com sucesso!')
      setEditingAdmin(null)
    } else {
      const newAdmin: AdminUser = {
        id: Date.now(),
        ...adminData,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setAdmins(prev => [...prev, newAdmin])
      toast.success('Administrador adicionado com sucesso!')
    }
    
    setFormData({
      name: '',
      email: '',
      role: 'admin',
      permissions: [],
      isActive: true
    })
    setShowAddForm(false)
  }

  const handleEdit = (admin: AdminUser) => {
    setEditingAdmin(admin)
    setFormData({
      name: admin.name,
      email: admin.email,
      role: admin.role,
      permissions: admin.permissions.filter(p => p !== 'all'),
      isActive: admin.isActive
    })
    setShowAddForm(true)
  }

  const handleDelete = (id: number) => {
    const admin = admins.find(a => a.id === id)
    if (admin?.role === 'super_admin') {
      toast.error('Super administradores não podem ser excluídos')
      return
    }
    
    if (confirm('Tem certeza que deseja excluir este administrador?')) {
      setAdmins(prev => prev.filter(admin => admin.id !== id))
      toast.success('Administrador excluído com sucesso!')
    }
  }

  const handleToggleActive = (id: number) => {
    const admin = admins.find(a => a.id === id)
    if (admin?.role === 'super_admin') {
      toast.error('Super administradores não podem ser desativados')
      return
    }
    
    setAdmins(prev => prev.map(admin => 
      admin.id === id 
        ? { ...admin, isActive: !admin.isActive }
        : admin
    ))
    
    const newStatus = !admins.find(a => a.id === id)?.isActive
    toast.success(`Administrador ${newStatus ? 'ativado' : 'desativado'} com sucesso!`)
  }

  const handleRoleChange = (role: AdminUser['role']) => {
    setFormData(prev => ({
      ...prev,
      role,
      permissions: role === 'super_admin' ? [] : rolePermissions[role] || []
    }))
  }

  const handlePermissionToggle = (permissionId: string) => {
    if (formData.role === 'super_admin') return
    
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(p => p !== permissionId)
        : [...prev.permissions, permissionId]
    }))
  }

  const groupedPermissions = permissions.reduce((acc, permission) => {
    if (!acc[permission.category]) {
      acc[permission.category] = []
    }
    acc[permission.category].push(permission)
    return acc
  }, {} as Record<Permission['category'], Permission[]>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Níveis de Acesso</h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Administrador</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Admins</p>
              <p className="text-2xl font-bold text-blue-600">{admins.length}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ativos</p>
              <p className="text-2xl font-bold text-green-600">
                {admins.filter(a => a.isActive).length}
              </p>
            </div>
            <Check className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Instrutores</p>
              <p className="text-2xl font-bold text-green-600">
                {admins.filter(a => a.role === 'instructor').length}
              </p>
            </div>
            <Shield className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Super Admins</p>
              <p className="text-2xl font-bold text-purple-600">
                {admins.filter(a => a.role === 'super_admin').length}
              </p>
            </div>
            <AlertTriangle className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Admins Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Administrador
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Função
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Criado em
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {admins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                      <div className="text-sm text-gray-500">{admin.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(admin.role)}`}>
                      {getRoleName(admin.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      admin.isActive ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100'
                    }`}>
                      {admin.isActive ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(admin.createdAt).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {admin.lastLogin ? new Date(admin.lastLogin).toLocaleDateString('pt-BR') : 'Nunca'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setSelectedAdmin(admin)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Ver permissões"
                      >
                        <Shield className="h-4 w-4" />
                      </button>
                      {admin.role !== 'super_admin' && (
                        <>
                          <button
                            onClick={() => handleEdit(admin)}
                            className="text-blue-600 hover:text-blue-900"
                            title="Editar"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleToggleActive(admin.id)}
                            className={admin.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}
                            title={admin.isActive ? 'Desativar' : 'Ativar'}
                          >
                            {admin.isActive ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                          </button>
                          <button
                            onClick={() => handleDelete(admin.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Excluir"
                          >
                            <Trash2 className="h-4 w-4" />
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

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  {editingAdmin ? 'Editar Administrador' : 'Novo Administrador'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddForm(false)
                    setEditingAdmin(null)
                    setFormData({
                      name: '',
                      email: '',
                      role: 'admin',
                      permissions: [],
                      isActive: true
                    })
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Função
                  </label>
                  <select
                    required
                    value={formData.role}
                    onChange={(e) => handleRoleChange(e.target.value as AdminUser['role'])}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="admin">Administrador</option>
                    <option value="instructor">Instrutor</option>
                    <option value="financial">Financeiro</option>
                    <option value="super_admin">Super Administrador</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                    Usuário ativo
                  </label>
                </div>

                {formData.role !== 'super_admin' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Permissões
                    </label>
                    <div className="space-y-4">
                      {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => (
                        <div key={category} className="border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium text-gray-900 mb-2">
                            {getCategoryName(category as Permission['category'])}
                          </h4>
                          <div className="space-y-2">
                            {categoryPermissions.map((permission) => (
                              <div key={permission.id} className="flex items-start">
                                <input
                                  type="checkbox"
                                  id={permission.id}
                                  checked={formData.permissions.includes(permission.id)}
                                  onChange={() => handlePermissionToggle(permission.id)}
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                                />
                                <div className="ml-2">
                                  <label htmlFor={permission.id} className="block text-sm font-medium text-gray-900">
                                    {permission.name}
                                  </label>
                                  <p className="text-xs text-gray-500">{permission.description}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {formData.role === 'super_admin' && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 text-purple-600 mr-2" />
                      <p className="text-sm text-purple-800">
                        Super administradores têm acesso total ao sistema.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false)
                      setEditingAdmin(null)
                      setFormData({
                        name: '',
                        email: '',
                        role: 'admin',
                        permissions: [],
                        isActive: true
                      })
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingAdmin ? 'Atualizar' : 'Adicionar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Permissions Modal */}
      {selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Permissões - {selectedAdmin.name}
                </h3>
                <button
                  onClick={() => setSelectedAdmin(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">Função:</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(selectedAdmin.role)}`}>
                    {getRoleName(selectedAdmin.role)}
                  </span>
                </div>

                {selectedAdmin.permissions.includes('all') ? (
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center">
                      <Shield className="h-5 w-5 text-purple-600 mr-2" />
                      <p className="text-sm text-purple-800 font-medium">
                        Acesso total ao sistema
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(groupedPermissions).map(([category, categoryPermissions]) => {
                      const userPermissions = categoryPermissions.filter(p => 
                        selectedAdmin.permissions.includes(p.id)
                      )
                      
                      if (userPermissions.length === 0) return null
                      
                      return (
                        <div key={category} className="border border-gray-200 rounded-lg p-3">
                          <h4 className="font-medium text-gray-900 mb-2">
                            {getCategoryName(category as Permission['category'])}
                          </h4>
                          <div className="space-y-1">
                            {userPermissions.map((permission) => (
                              <div key={permission.id} className="flex items-center">
                                <Check className="h-4 w-4 text-green-600 mr-2" />
                                <span className="text-sm text-gray-900">{permission.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminAccessLevels