import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { lessonSchema } from '@/lib/validations'
import { getSession } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()
    const lesson = await prisma.lesson.findUnique({
      where: { id: params.id },
      include: {
        course: true,
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!lesson) {
      return NextResponse.json(
        { error: 'Aula não encontrada' },
        { status: 404 }
      )
    }

    // Students can only see published lessons
    if (session?.role === 'STUDENT' && !lesson.isPublished) {
      return NextResponse.json(
        { error: 'Aula não disponível' },
        { status: 403 }
      )
    }

    // If student, include their note
    if (session?.role === 'STUDENT' && session.userId) {
      const note = await prisma.studentNote.findUnique({
        where: {
          userId_lessonId: {
            userId: session.userId,
            lessonId: params.id,
          },
        },
      })

      return NextResponse.json({
        lesson: {
          ...lesson,
          userNote: note || null,
        },
      })
    }

    return NextResponse.json({ lesson })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar aula' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const lesson = await prisma.lesson.update({
      where: { id: params.id },
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

    return NextResponse.json({ lesson })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Aula não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao atualizar aula' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()

    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    await prisma.lesson.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Aula deletada com sucesso' })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Aula não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao deletar aula' },
      { status: 500 }
    )
  }
}

