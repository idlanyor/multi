import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'
import { writeFile } from 'fs/promises'
import path from 'path'

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

    const formData = await request.formData()
    const file = formData.get('file') as File
    const orderId = formData.get('orderId') as string

    if (!file || !orderId) {
      return NextResponse.json(
        { message: 'File dan order ID harus diisi' },
        { status: 400 }
      )
    }

    // Validate order belongs to user
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        userId: decoded.id,
        status: 'PENDING'
      }
    })

    if (!order) {
      return NextResponse.json(
        { message: 'Order tidak ditemukan atau tidak dapat diupdate' },
        { status: 404 }
      )
    }

    // Validate file
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { message: 'File harus berupa gambar' },
        { status: 400 }
      )
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: 'Ukuran file maksimal 5MB' },
        { status: 400 }
      )
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'payment-proofs')
    
    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const fileName = `${orderId}-${Date.now()}.${fileExtension}`
    const filePath = path.join(uploadsDir, fileName)
    const publicPath = `/uploads/payment-proofs/${fileName}`

    try {
      // Create directory if it doesn't exist
      const { mkdir } = await import('fs/promises')
      await mkdir(uploadsDir, { recursive: true })

      // Write file
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      await writeFile(filePath, buffer)

      // Update order with payment proof
      await prisma.order.update({
        where: { id: orderId },
        data: { paymentProof: publicPath }
      })

      return NextResponse.json({
        message: 'Bukti pembayaran berhasil diunggah',
        filePath: publicPath
      })

    } catch (fileError) {
      console.error('File upload error:', fileError)
      return NextResponse.json(
        { message: 'Gagal menyimpan file' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Payment proof upload error:', error)
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}