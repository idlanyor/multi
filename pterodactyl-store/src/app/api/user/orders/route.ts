import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
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

    const orders = await prisma.order.findMany({
      where: { userId: decoded.id },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            ram: true,
            cpu: true,
            emoji: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(orders)

  } catch (error) {
    console.error('Get user orders error:', error)
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}