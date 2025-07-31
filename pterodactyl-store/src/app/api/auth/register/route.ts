import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, username, password, fullName, phoneNumber, whatsapp } = await request.json()

    if (!email || !username || !password) {
      return NextResponse.json(
        { message: 'Email, username, dan password harus diisi' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password minimal 6 karakter' },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingEmail = await prisma.user.findUnique({
      where: { email }
    })

    if (existingEmail) {
      return NextResponse.json(
        { message: 'Email sudah terdaftar' },
        { status: 409 }
      )
    }

    // Check if username already exists
    const existingUsername = await prisma.user.findUnique({
      where: { username }
    })

    if (existingUsername) {
      return NextResponse.json(
        { message: 'Username sudah digunakan' },
        { status: 409 }
      )
    }

    const hashedPassword = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        fullName: fullName || null,
        phoneNumber: phoneNumber || null,
        whatsapp: whatsapp || null
      }
    })

    return NextResponse.json({
      message: 'Registrasi berhasil',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName
      }
    }, { status: 201 })

  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}