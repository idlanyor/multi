'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Product } from '@prisma/client'
import { ArrowLeft, ShoppingCart, Cpu, HardDrive, Calendar } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function OrderPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [duration, setDuration] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isOrdering, setIsOrdering] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchProduct()
  }, [params.id])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data)
      } else {
        toast.error('Produk tidak ditemukan')
        router.push('/')
      }
    } catch (error) {
      toast.error('Gagal mengambil data produk')
      router.push('/')
    } finally {
      setIsLoading(false)
    }
  }

  const handleOrder = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      toast.error('Silakan login terlebih dahulu')
      router.push('/login')
      return
    }

    setIsOrdering(true)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: product?.id,
          duration
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Order berhasil dibuat!')
        router.push(`/order/confirmation/${data.order.id}`)
      } else {
        toast.error(data.message || 'Gagal membuat order')
      }
    } catch (error) {
      toast.error('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setIsOrdering(false)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'NODEJS':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'VPS':
        return 'bg-orange-50 border-orange-200 text-orange-800'
      case 'PYTHON':
        return 'bg-blue-50 border-blue-200 text-blue-800'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat produk...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Produk tidak ditemukan</p>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Kembali ke beranda
          </Link>
        </div>
      </div>
    )
  }

  const totalPrice = product.price * duration

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Kembali ke beranda
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Pesan Hosting</h1>
          <p className="text-gray-600 mt-2">
            Lengkapi pesanan Anda untuk melanjutkan ke pembayaran
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Details */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(product.category)}`}>
                {product.category}
              </span>
              <span className="text-2xl">{product.emoji}</span>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {product.name}
            </h2>
            
            <p className="text-gray-600 mb-6">
              {product.description}
            </p>

            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <HardDrive size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{product.ram}GB RAM</p>
                  <p className="text-sm text-gray-600">Memory untuk aplikasi Anda</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Cpu size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{product.cpu}% CPU</p>
                  <p className="text-sm text-gray-600">Daya komputasi server</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-lg font-semibold text-gray-900">
                {formatPrice(product.price)}<span className="text-gray-600 text-base font-normal">/bulan</span>
              </p>
            </div>
          </div>

          {/* Order Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Detail Pesanan</h3>

            <div className="space-y-6">
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                  Durasi Hosting
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <select
                    id="duration"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  >
                    {[1, 2, 3, 6, 12].map((months) => (
                      <option key={months} value={months}>
                        {months} Bulan
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Harga per bulan:</span>
                    <span className="font-medium">{formatPrice(product.price)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Durasi:</span>
                    <span className="font-medium">{duration} bulan</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2">
                    <span>Total:</span>
                    <span className="text-blue-600">{formatPrice(totalPrice)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleOrder}
                disabled={isOrdering}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <ShoppingCart size={20} />
                <span>{isOrdering ? 'Memproses...' : 'Buat Pesanan'}</span>
              </button>

              <p className="text-xs text-gray-500 text-center">
                Dengan memesan, Anda menyetujui terms dan conditions kami. 
                Pembayaran akan dikonfirmasi manual oleh admin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}