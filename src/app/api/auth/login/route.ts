import { NextRequest, NextResponse } from 'next/server'
import { login } from '@/lib/auth'
import { loginSchema } from '@/lib/validations'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = loginSchema.parse(body)

    const result = await login(validatedData.email, validatedData.password)

    if (!result) {
      return NextResponse.json(
        { error: 'Email ou senha inválidos' },
        { status: 401 }
      )
    }

    const cookieStore = await cookies()
    cookieStore.set({
      name: 'session',
      value: result.token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    const { password, ...userWithoutPassword } = result.user

    return NextResponse.json({
      user: userWithoutPassword,
    })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao fazer login' },
      { status: 500 }
    )
  }
}

