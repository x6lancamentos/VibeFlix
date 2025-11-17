import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

const secretKey = process.env.JWT_SECRET || 'default-secret-key-change-in-production'
const key = new TextEncoder().encode(secretKey)

export interface JWTPayload {
  userId: string
  email: string
  role: 'ADMIN' | 'STUDENT'
}

export async function encrypt(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key)
}

export async function decrypt(input: string): Promise<JWTPayload> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  })
  return payload as JWTPayload
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return null
  }

  const isValid = await bcrypt.compare(password, user.password)

  if (!isValid) {
    return null
  }

  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  }

  const token = await encrypt(payload)

  return { user, token }
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value

  if (!session) {
    return null
  }

  try {
    return await decrypt(session)
  } catch {
    return null
  }
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value

  if (!session) {
    return null
  }

  try {
    const payload = await decrypt(session)
    payload.exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60 // 7 days
    const res = NextResponse.next()
    res.cookies.set({
      name: 'session',
      value: await encrypt(payload),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    })
    return res
  } catch {
    return null
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

