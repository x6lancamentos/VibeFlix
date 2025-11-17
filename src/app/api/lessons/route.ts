import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { lessonSchema } from '@/lib/validations'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    const { searchParams } = new URL(request.url)
    const courseId = searchParams.get('courseId')

    const where: any = {}
    if (courseId) {
      where.courseId = courseId
    }

    // Students only see published lessons
    if (session?.role === 'STUDENT') {
      where.isPublished = true
    }

    const lessons = await prisma.lesson.findMany({
      where,
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json({ lessons })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar aulas' },
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
    const validatedData = lessonSchema.parse(body)

    const lesson = await prisma.lesson.create({
      data: validatedData,
      include: {
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    return NextResponse.json({ lesson }, { status: 201 })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao criar aula' },
      { status: 500 }
    )
  }
}

