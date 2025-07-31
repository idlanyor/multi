'use client'

import Link from 'next/link'
import { Product } from '@prisma/client'
import { ShoppingCart, Cpu, HardDrive } from 'lucide-react'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getCategoryColor(product.category)}`}>
          {product.category}
        </span>
        <span className="text-2xl">{product.emoji}</span>
      </div>

      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {product.name}
      </h3>
      
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
        {product.description}
      </p>

      <div className="space-y-3 mb-6">
        <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
          <HardDrive size={16} className="text-blue-600 dark:text-blue-400" />
          <span className="text-sm">{product.ram}GB RAM</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
          <Cpu size={16} className="text-purple-600 dark:text-purple-400" />
          <span className="text-sm">{product.cpu}% CPU</span>
        </div>
      </div>

      <div className="border-t pt-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatPrice(product.price)}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-sm">/bulan</span>
          </div>
        </div>

        <Link
          href={`/order/${product.id}`}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <ShoppingCart size={18} />
          <span>Pesan Sekarang</span>
        </Link>
      </div>
    </div>
  )
}