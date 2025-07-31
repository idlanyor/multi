'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Server, ShoppingCart, Settings, LogOut, Eye, Calendar, Cpu, HardDrive } from 'lucide-react'
import toast from 'react-hot-toast'

interface User {
  id: string
  email: string
  username: string
  fullName?: string
  role: string
}

interface Order {
  id: string
  status: string
  totalPrice: number
  duration: number
  createdAt: string
  product: {
    id: string
    name: string
    description: string
    ram: number
    cpu: number
    emoji: string
  }
}

interface ServerData {
  id: string
  name: string
  status: string
  expiresAt: string
  order: {
    product: {
      name: string
      ram: number
      cpu: number
    }
  }
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [servers, setServers] = useState<ServerData[]>([])
  const [activeTab, setActiveTab] = useState('overview')
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        
        // Fetch user orders and servers
        await Promise.all([
          fetchOrders(token),
          fetchServers(token)
        ])
      } else {
        localStorage.removeItem('token')
        router.push('/login')
      }
    } catch (error) {
      console.error('Auth check error:', error)
      localStorage.removeItem('token')
      router.push('/login')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchOrders = async (token: string) => {
    try {
      const response = await fetch('/api/user/orders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error('Fetch orders error:', error)
    }
  }

  const fetchServers = async (token: string) => {
    try {
      const response = await fetch('/api/user/servers', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (response.ok) {
        const data = await response.json()
        setServers(data)
      }
    } catch (error) {
      console.error('Fetch servers error:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    toast.success('Logout berhasil')
    router.push('/')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'EXPIRED':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900">Antidonasi Store</span>
            </Link>

            <div className="flex items-center space-x-4">
              <span className="text-gray-700">
                Welcome, {user?.fullName || user?.username}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <User className="text-white" size={24} />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">{user?.fullName || user?.username}</h2>
                <p className="text-gray-600 text-sm">{user?.email}</p>
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                  user?.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {user?.role}
                </span>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'overview' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ShoppingCart size={18} />
                  <span>Overview</span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'orders' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <ShoppingCart size={18} />
                  <span>Orders</span>
                </button>
                <button
                  onClick={() => setActiveTab('servers')}
                  className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'servers' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Server size={18} />
                  <span>Servers</span>
                </button>
                <Link
                  href="/profile"
                  className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Settings size={18} />
                  <span>Profile</span>
                </Link>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Dashboard Overview</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-800 font-semibold">Total Orders</p>
                          <p className="text-2xl font-bold text-blue-900">{orders.length}</p>
                        </div>
                        <ShoppingCart className="text-blue-600" size={32} />
                      </div>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-800 font-semibold">Active Servers</p>
                          <p className="text-2xl font-bold text-green-900">
                            {servers.filter(s => s.status === 'ACTIVE').length}
                          </p>
                        </div>
                        <Server className="text-green-600" size={32} />
                      </div>
                    </div>

                    <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-800 font-semibold">Total Spent</p>
                          <p className="text-2xl font-bold text-purple-900">
                            {formatPrice(orders.reduce((sum, order) => sum + order.totalPrice, 0))}
                          </p>
                        </div>
                        <Calendar className="text-purple-600" size={32} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Orders</h3>
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg mb-3">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{order.product.emoji}</span>
                        <div>
                          <p className="font-semibold text-gray-900">{order.product.name}</p>
                          <p className="text-sm text-gray-600">{formatPrice(order.totalPrice)}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <p className="text-gray-500 text-center py-8">Belum ada order</p>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900">Order History</h3>
                  <Link
                    href="/#products"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    New Order
                  </Link>
                </div>

                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{order.product.emoji}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900">{order.product.name}</h4>
                            <p className="text-sm text-gray-600">{order.product.description}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Total:</span>
                          <span className="ml-2 font-medium">{formatPrice(order.totalPrice)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Duration:</span>
                          <span className="ml-2 font-medium">{order.duration} bulan</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Date:</span>
                          <span className="ml-2 font-medium">
                            {new Date(order.createdAt).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                        <div className="flex justify-end">
                          <Link
                            href={`/order/confirmation/${order.id}`}
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                          >
                            <Eye size={16} />
                            <span>View</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                  {orders.length === 0 && (
                    <div className="text-center py-12">
                      <ShoppingCart className="mx-auto text-gray-400 mb-4" size={48} />
                      <p className="text-gray-500 mb-4">Belum ada order</p>
                      <Link
                        href="/#products"
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Buat Order Pertama
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'servers' && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">My Servers</h3>

                <div className="space-y-4">
                  {servers.map((server) => (
                    <div key={server.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{server.name}</h4>
                          <p className="text-sm text-gray-600">{server.order.product.name}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(server.status)}`}>
                          {server.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <HardDrive size={16} className="text-blue-600" />
                          <span>{server.order.product.ram}GB RAM</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Cpu size={16} className="text-purple-600" />
                          <span>{server.order.product.cpu}% CPU</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Expires:</span>
                          <span className="ml-2 font-medium">
                            {new Date(server.expiresAt).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                      </div>

                      {server.status === 'ACTIVE' && (
                        <div className="mt-4 pt-4 border-t">
                          <Link
                            href={`/server/${server.id}`}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                          >
                            Manage Server
                          </Link>
                        </div>
                      )}
                    </div>
                  ))}
                  {servers.length === 0 && (
                    <div className="text-center py-12">
                      <Server className="mx-auto text-gray-400 mb-4" size={48} />
                      <p className="text-gray-500 mb-4">Belum ada server</p>
                      <p className="text-gray-400 text-sm">
                        Server akan muncul setelah order dikonfirmasi admin
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}