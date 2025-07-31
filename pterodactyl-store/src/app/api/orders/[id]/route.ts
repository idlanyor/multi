import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const order = await prisma.order.findFirst({
      where: {
        id: params.id,
        userId: decoded.id // Only allow users to see their own orders
      },
      include: {
        product: true,
        user: {
          select: {
            id: true,
            email: true,
            username: true,
            fullName: true
          }
        }
      }
    })

    if (!order) {
      return NextResponse.json(
        { message: 'Order tidak ditemukan' },
        { status: 404 }
      )
    }

    return NextResponse.json(order)

  } catch (error) {
    console.error('Get order error:', error)
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}