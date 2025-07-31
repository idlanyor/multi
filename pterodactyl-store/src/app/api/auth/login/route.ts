import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { comparePassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email dan password harus diisi' },
        { status: 400 }
      )
    }

    // Find user by email or username
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { username: email }
        ],
        isActive: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Email/username atau password salah' },
        { status: 401 }
      )
    }

    const isPasswordValid = await comparePassword(password, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: 'Email/username atau password salah' },
        { status: 401 }
      )
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      fullName: user.fullName,
      phoneNumber: user.phoneNumber,
      whatsapp: user.whatsapp,
      isActive: user.isActive,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    })

    return NextResponse.json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        fullName: user.fullName
      }
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: 'Terjadi kesalahan server' },
      { status: 500 }
    )
  }
}