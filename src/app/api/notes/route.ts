import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { noteSchema } from '@/lib/validations'
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
    const lessonId = searchParams.get('lessonId')

    const where: any = {
      userId: session.userId,
    }

    if (lessonId) {
      where.lessonId = lessonId
    }

    const notes = await prisma.studentNote.findMany({
      where,
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            course: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })

    return NextResponse.json({ notes })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar notas' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = noteSchema.parse(body)

    // Check if note already exists
    const existing = await prisma.studentNote.findUnique({
      where: {
        userId_lessonId: {
          userId: session.userId,
          lessonId: validatedData.lessonId,
        },
      },
    })

    if (existing) {
      // Update existing note
      const note = await prisma.studentNote.update({
        where: {
          userId_lessonId: {
            userId: session.userId,
            lessonId: validatedData.lessonId,
          },
        },
        data: {
          content: validatedData.content,
        },
        include: {
          lesson: {
            select: {
              id: true,
              title: true,
              course: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      })

      return NextResponse.json({ note })
    }

    const note = await prisma.studentNote.create({
      data: {
        ...validatedData,
        userId: session.userId,
      },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            course: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    })

    return NextResponse.json({ note }, { status: 201 })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao salvar nota' },
      { status: 500 }
    )
  }
}

