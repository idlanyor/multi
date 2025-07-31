import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '@prisma/client'

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10)
}

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}

export const generateToken = (user: Omit<User, 'password'>): string => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.NEXTAUTH_SECRET || 'secret',
    { expiresIn: '7d' }
  )
}

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, process.env.NEXTAUTH_SECRET || 'secret')
  } catch (error) {
    return null
  }
}

export interface AuthUser {
  id: string
  email: string
  username: string
  role: 'USER' | 'ADMIN'
  fullName?: string
}