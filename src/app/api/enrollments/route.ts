import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { enrollmentSchema } from '@/lib/validations'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const courseId = searchParams.get('courseId')

    const where: any = {}

    // Students can only see their own enrollments
    if (session.role === 'STUDENT') {
      where.userId = session.userId
    } else if (userId) {
      where.userId = userId
    }

    if (courseId) {
      where.courseId = courseId
    }

    const enrollments = await prisma.enrollment.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    })

    return NextResponse.json({ enrollments })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar inscrições' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const validatedData = enrollmentSchema.parse(body)

    // Check if enrollment already exists
    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: validatedData.userId,
          courseId: validatedData.courseId,
        },
      },
    })

    if (existing) {
      // Update existing enrollment
      const enrollment = await prisma.enrollment.update({
        where: {
          userId_courseId: {
            userId: validatedData.userId,
            courseId: validatedData.courseId,
          },
        },
        data: {
          isActive: validatedData.isActive,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          course: {
            select: {
              id: true,
              title: true,
              thumbnail: true,
            },
          },
        },
      })

      return NextResponse.json({ enrollment })
    }

    const enrollment = await prisma.enrollment.create({
      data: validatedData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            thumbnail: true,
          },
        },
      },
    })

    return NextResponse.json({ enrollment }, { status: 201 })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao criar inscrição' },
      { status: 500 }
    )
  }
}

