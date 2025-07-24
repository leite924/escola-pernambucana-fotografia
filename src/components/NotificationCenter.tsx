import { useState, useEffect } from 'react'
import { Bell, Settings, History, Check, X, Clock, Mail, MessageSquare, Calendar, DollarSign, BookOpen } from 'lucide-react'

interface Notification {
  id: string
  type: 'payment' | 'course' | 'assignment' | 'system' | 'marketing'
  title: string
  message: string
  timestamp: Date
  read: boolean
  priority: 'high' | 'medium' | 'low'
  actionUrl?: string
  actionLabel?: string
}

interface NotificationSettings {
  email: boolean
  push: boolean
  sms: boolean
  inApp: boolean
  types: {
    payment: boolean
    course: boolean
    assignment: boolean
    system: boolean
    marketing: boolean
  }
  schedule: {
    startTime: string
    endTime: string
    weekends: boolean
  }
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [settings, setSettings] = useState<NotificationSettings>({
    email: true,
    push: true,
    sms: false,
    inApp: true,
    types: {
      payment: true,
      course: true,
      assignment: true,
      system: true,
      marketing: false
    },
    schedule: {
      startTime: '08:00',
      endTime: '22:00',
      weekends: false
    }
  })
  const [selectedTab, setSelectedTab] = useState<'notifications' | 'settings' | 'history'>('notifications')
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all')

  useEffect(() => {
    // Mock notifications
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'payment',
        title: 'Pagamento Vencendo',
        message: 'Sua mensalidade do curso de Fotografia Digital vence em 3 dias.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
        read: false,
        priority: 'high',
        actionUrl: '/pagamentos',
        actionLabel: 'Pagar Agora'
      },
      {
        id: '2',
        type: 'course',
        title: 'Nova Aula Disponível',
        message: 'A aula "Técnicas de Iluminação Natural" já está disponível no seu curso.',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 horas atrás
        read: false,
        priority: 'medium',
        actionUrl: '/curso/fotografia-digital/aula-5',
        actionLabel: 'Assistir Aula'
      },
      {
        id: '3',
        type: 'assignment',
        title: 'Exercício Prático',
        message: 'Você tem um novo exercício prático: "Composição com Regra dos Terços".',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 dia atrás
        read: true,
        priority: 'medium',
        actionUrl: '/exercicios/composicao-tercos',
        actionLabel: 'Ver Exercício'
      },
      {
        id: '4',
        type: 'system',
        title: 'Manutenção Programada',
        message: 'O sistema estará em manutenção no domingo das 02:00 às 06:00.',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 dias atrás
        read: true,
        priority: 'low'
      },
      {
        id: '5',
        type: 'marketing',
        title: 'Novo Curso Disponível',
        message: 'Confira nosso novo curso: "Fotografia de Produtos para E-commerce".',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
        read: true,
        priority: 'low',
        actionUrl: '/cursos/fotografia-produtos',
        actionLabel: 'Ver Curso'
      }
    ]

    setNotifications(mockNotifications)
  }, [])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'payment': return <DollarSign className="h-4 w-4" />
      case 'course': return <BookOpen className="h-4 w-4" />
      case 'assignment': return <Calendar className="h-4 w-4" />
      case 'system': return <Settings className="h-4 w-4" />
      case 'marketing': return <Mail className="h-4 w-4" />
      default: return <Bell className="h-4 w-4" />
    }
  }

  const getNotificationColor = (type: string, priority: string) => {
    if (priority === 'high') return 'border-red-200 bg-red-50'
    if (type === 'payment') return 'border-orange-200 bg-orange-50'
    if (type === 'course') return 'border-blue-200 bg-blue-50'
    return 'border-gray-200 bg-gray-50'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'unread') return !notif.read
    if (filter === 'high') return notif.priority === 'high'
    return true
  })

  const unreadCount = notifications.filter(n => !n.read).length

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m atrás`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h atrás`
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d atrás`
    }
  }

  const NotificationsView = () => (
    <div className="space-y-4">
      {/* Filtros e Ações */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {[
            { id: 'all', label: 'Todas' },
            { id: 'unread', label: `Não lidas (${unreadCount})` },
            { id: 'high', label: 'Prioridade Alta' }
          ].map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id as any)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                filter === filterOption.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Marcar todas como lidas
          </button>
        )}
      </div>

      {/* Lista de Notificações */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma notificação encontrada</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                notification.read ? 'opacity-75' : ''
              } ${getNotificationColor(notification.type, notification.priority)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <div className={`p-2 rounded-full ${
                    notification.priority === 'high' ? 'bg-red-100' :
                    notification.type === 'payment' ? 'bg-orange-100' :
                    notification.type === 'course' ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{notification.title}</h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(notification.priority)}`}>
                        {notification.priority === 'high' ? 'Alta' :
                         notification.priority === 'medium' ? 'Média' : 'Baixa'}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 text-sm mb-2">{notification.message}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimeAgo(notification.timestamp)}</span>
                      </span>
                      
                      <div className="flex items-center space-x-2">
                        {notification.actionUrl && (
                          <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors">
                            {notification.actionLabel || 'Ver'}
                          </button>
                        )}
                        
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-sm text-gray-600 hover:text-gray-800"
                            title="Marcar como lida"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                        )}
                        
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-sm text-red-600 hover:text-red-800"
                          title="Excluir"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )

  const SettingsView = () => (
    <div className="space-y-6">
      {/* Canais de Notificação */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Canais de Notificação</h3>
        <div className="space-y-4">
          {[
            { key: 'email', label: 'Email', icon: Mail },
            { key: 'push', label: 'Notificações Push', icon: Bell },
            { key: 'sms', label: 'SMS', icon: MessageSquare },
            { key: 'inApp', label: 'Notificações no App', icon: Bell }
          ].map((channel) => (
            <div key={channel.key} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <channel.icon className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">{channel.label}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings[channel.key as keyof NotificationSettings] as boolean}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    [channel.key]: e.target.checked
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Tipos de Notificação */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Tipos de Notificação</h3>
        <div className="space-y-4">
          {[
            { key: 'payment', label: 'Pagamentos e Cobranças', icon: DollarSign },
            { key: 'course', label: 'Atualizações de Cursos', icon: BookOpen },
            { key: 'assignment', label: 'Exercícios e Atividades', icon: Calendar },
            { key: 'system', label: 'Avisos do Sistema', icon: Settings },
            { key: 'marketing', label: 'Promoções e Novidades', icon: Mail }
          ].map((type) => (
            <div key={type.key} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <type.icon className="h-5 w-5 text-gray-600" />
                <span className="font-medium text-gray-900">{type.label}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.types[type.key as keyof typeof settings.types]}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    types: {
                      ...prev.types,
                      [type.key]: e.target.checked
                    }
                  }))}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Horários */}
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Horários de Notificação</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Início</label>
              <input
                type="time"
                value={settings.schedule.startTime}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  schedule: { ...prev.schedule, startTime: e.target.value }
                }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fim</label>
              <input
                type="time"
                value={settings.schedule.endTime}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  schedule: { ...prev.schedule, endTime: e.target.value }
                }))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-900">Receber notificações nos fins de semana</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.schedule.weekends}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  schedule: { ...prev.schedule, weekends: e.target.checked }
                }))}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Salvar Configurações
        </button>
      </div>
    </div>
  )

  const HistoryView = () => (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Estatísticas de Notificações</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{notifications.length}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{notifications.filter(n => n.read).length}</div>
            <div className="text-sm text-gray-600">Lidas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{unreadCount}</div>
            <div className="text-sm text-gray-600">Não Lidas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{notifications.filter(n => n.priority === 'high').length}</div>
            <div className="text-sm text-gray-600">Alta Prioridade</div>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg border">
        <h3 className="text-lg font-semibold mb-4">Histórico Completo</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center space-x-3">
                {getNotificationIcon(notification.type)}
                <div>
                  <div className="font-medium text-sm">{notification.title}</div>
                  <div className="text-xs text-gray-500">
                    {notification.timestamp.toLocaleString('pt-BR')}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(notification.priority)}`}>
                  {notification.priority === 'high' ? 'Alta' :
                   notification.priority === 'medium' ? 'Média' : 'Baixa'}
                </span>
                {notification.read ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Clock className="h-4 w-4 text-orange-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Bell className="h-8 w-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Central de Notificações</h2>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
      </div>

      {/* Navegação */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        {[
          { id: 'notifications', label: 'Notificações', icon: Bell },
          { id: 'settings', label: 'Configurações', icon: Settings },
          { id: 'history', label: 'Histórico', icon: History }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id as any)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
              selectedTab === tab.id
                ? 'bg-white text-blue-600 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      {selectedTab === 'notifications' && <NotificationsView />}
      {selectedTab === 'settings' && <SettingsView />}
      {selectedTab === 'history' && <HistoryView />}
    </div>
  )
}

export default NotificationCenter