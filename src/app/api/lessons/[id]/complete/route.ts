import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession()

    if (!session || session.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    // Check if lesson exists and is published
    const lesson = await prisma.lesson.findUnique({
      where: { id: params.id },
    })

    if (!lesson || !lesson.isPublished) {
      return NextResponse.json(
        { error: 'Aula não encontrada ou não disponível' },
        { status: 404 }
      )
    }

    // Check if user is enrolled in the course
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: session.userId,
        courseId: lesson.courseId,
        isActive: true,
      },
    })

    if (!enrollment) {
      return NextResponse.json(
        { error: 'Você não está inscrito neste curso' },
        { status: 403 }
      )
    }

    // Create or update completion
    const completion = await prisma.lessonCompletion.upsert({
      where: {
        userId_lessonId: {
          userId: session.userId,
          lessonId: params.id,
        },
      },
      update: {
        completedAt: new Date(),
      },
      create: {
        userId: session.userId,
        lessonId: params.id,
      },
    })

    return NextResponse.json({ completion })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Aula já marcada como concluída' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao marcar aula como concluída' },
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

    if (!session || session.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    await prisma.lessonCompletion.delete({
      where: {
        userId_lessonId: {
          userId: session.userId,
          lessonId: params.id,
        },
      },
    })

    return NextResponse.json({ message: 'Conclusão removida' })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Conclusão não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao remover conclusão' },
      { status: 500 }
    )
  }
}

