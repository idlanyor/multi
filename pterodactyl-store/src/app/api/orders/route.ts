import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: 'Token tidak valid' },
        { status: 401 }
      )
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json(
        { message: 'Token tidak valid' },
        { status: 401 }
      )
    }

    const { productId, duration } = await request.json()

    if (!productId || !duration) {
      return NextResponse.json(
        { message: 'Product ID dan durasi harus diisi' },
        { status: 400 }
      )
    }

    // Validate product exists
    const product = await prisma.product.findUnique({
      where: { id: productId, isActive: true }
    })

    if (!product) {
      return NextResponse.json(
        { message: 'Produk tidak ditemukan' },
        { status: 404 }
      )
    }

    // Calculate total price
    const totalPrice = product.price * duration

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: decoded.id,
        productId,
        duration,
        totalPrice
      },
      include: {
        product: true
      }
    })

    return NextResponse.json({
      message: 'Order berhasil dibuat',
      order
    }, { status: 201 })

  } catch (error) {
    console.error('Create order error:', error)
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}