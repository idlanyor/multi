'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Order, Product } from '@prisma/client'
import { ArrowLeft, Upload, CheckCircle, Clock, CreditCard, QrCode } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Image from 'next/image'

interface OrderWithProduct extends Order {
  product: Product
}

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<OrderWithProduct | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchOrder()
  }, [params.id])

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch(`/api/orders/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setOrder(data)
      } else {
        toast.error('Order tidak ditemukan')
        router.push('/dashboard')
      }
    } catch (error) {
      toast.error('Gagal mengambil data order')
      router.push('/dashboard')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 5MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('File harus berupa gambar')
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('orderId', params.id)

      const token = localStorage.getItem('token')
      const response = await fetch('/api/orders/payment-proof', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      if (response.ok) {
        toast.success('Bukti pembayaran berhasil diunggah!')
        fetchOrder() // Refresh order data
      } else {
        const data = await response.json()
        toast.error(data.message || 'Gagal mengunggah bukti pembayaran')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsUploading(false)
    }
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
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Clock size={16} />
      case 'CONFIRMED':
      case 'COMPLETED':
        return <CheckCircle size={16} />
      default:
        return <Clock size={16} />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat order...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Order tidak ditemukan</p>
          <Link href="/dashboard" className="text-blue-600 hover:text-blue-700">
            Kembali ke dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Kembali ke dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Konfirmasi Pembayaran</h1>
          <p className="text-gray-600 mt-2">
            Order ID: {order.id}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Detail Pesanan</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center space-x-1 ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="ml-1">{order.status}</span>
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">{order.product.name}</h3>
                <p className="text-gray-600 text-sm">{order.product.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">RAM:</span>
                  <span className="ml-2 font-medium">{order.product.ram}GB</span>
                </div>
                <div>
                  <span className="text-gray-600">CPU:</span>
                  <span className="ml-2 font-medium">{order.product.cpu}%</span>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Harga per bulan:</span>
                  <span className="font-medium">{formatPrice(order.product.price)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Durasi:</span>
                  <span className="font-medium">{order.duration} bulan</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Total:</span>
                  <span className="text-blue-600">{formatPrice(order.totalPrice)}</span>
                </div>
              </div>

              <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                <p><strong>Tanggal Order:</strong> {new Date(order.createdAt).toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Informasi Pembayaran</h2>

            {order.status === 'PENDING' && (
              <>
                <div className="mb-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-2 text-blue-800 mb-2">
                      <QrCode size={20} />
                      <span className="font-semibold">Pembayaran QRIS</span>
                    </div>
                    <p className="text-blue-700 text-sm">
                      Scan QR code di bawah untuk melakukan pembayaran
                    </p>
                  </div>

                  <div className="text-center mb-4">
                    <div className="inline-block p-4 bg-white border-2 border-gray-200 rounded-lg">
                      <Image
                        src="/qris-demo.svg"
                        alt="QRIS Payment"
                        width={200}
                        height={200}
                        className="mx-auto"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg text-sm">
                    <p className="font-semibold text-gray-900 mb-2">Informasi Transfer:</p>
                    <p className="text-gray-700">Transfer ke: 085123456789 (Dana/OVO/GoPay)</p>
                    <p className="text-gray-700">Nominal: <strong>{formatPrice(order.totalPrice)}</strong></p>
                    <p className="text-gray-500 mt-2">
                      Atau gunakan WhatsApp: 
                      <a 
                        href="https://wa.me/62895395590009"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 ml-1"
                      >
                        wa.me/62895395590009
                      </a>
                    </p>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Upload Bukti Pembayaran</h3>
                  
                  {order.paymentProof ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 text-green-800">
                        <CheckCircle size={20} />
                        <span className="font-semibold">Bukti pembayaran telah diunggah</span>
                      </div>
                      <p className="text-green-700 text-sm mt-1">
                        Menunggu konfirmasi admin. Kami akan memproses dalam 1x24 jam.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <label className="block w-full">
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors">
                          <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                          <p className="text-gray-600 mb-1">
                            {isUploading ? 'Mengunggah...' : 'Klik untuk upload bukti pembayaran'}
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, JPEG (max 5MB)</p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileUpload}
                          disabled={isUploading}
                        />
                      </label>
                    </div>
                  )}
                </div>
              </>
            )}

            {order.status === 'CONFIRMED' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-green-800 mb-2">
                  <CheckCircle size={20} />
                  <span className="font-semibold">Pembayaran Dikonfirmasi</span>
                </div>
                <p className="text-green-700 text-sm">
                  Server Anda sedang dalam proses pembuatan. Informasi akses akan dikirim segera.
                </p>
              </div>
            )}

            {order.status === 'COMPLETED' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 text-blue-800 mb-2">
                  <CheckCircle size={20} />
                  <span className="font-semibold">Server Siap Digunakan</span>
                </div>
                <p className="text-blue-700 text-sm">
                  Server Anda telah berhasil dibuat. Silakan cek email atau dashboard untuk informasi akses.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}