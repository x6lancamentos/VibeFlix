import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { noteSchema } from '@/lib/validations'
import { getSession } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Verify note belongs to user
    const note = await prisma.studentNote.findUnique({
      where: { id: params.id },
    })

    if (!note) {
      return NextResponse.json(
        { error: 'Nota não encontrada' },
        { status: 404 }
      )
    }

    if (note.userId !== session.userId) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    const updatedNote = await prisma.studentNote.update({
      where: { id: params.id },
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

    return NextResponse.json({ note: updatedNote })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Nota não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao atualizar nota' },
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

    if (!session) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }

    // Verify note belongs to user
    const note = await prisma.studentNote.findUnique({
      where: { id: params.id },
    })

    if (!note) {
      return NextResponse.json(
        { error: 'Nota não encontrada' },
        { status: 404 }
      )
    }

    if (note.userId !== session.userId) {
      return NextResponse.json(
        { error: 'Acesso negado' },
        { status: 403 }
      )
    }

    await prisma.studentNote.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: 'Nota deletada com sucesso' })
  } catch (error: any) {
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Nota não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao deletar nota' },
      { status: 500 }
    )
  }
}

