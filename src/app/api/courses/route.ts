import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { courseSchema } from '@/lib/validations'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    const { searchParams } = new URL(request.url)
    const includeLessons = searchParams.get('includeLessons') === 'true'

    const courses = await prisma.course.findMany({
      include: {
        lessons: includeLessons
          ? {
              where: { isPublished: true },
              orderBy: { order: 'asc' },
            }
          : false,
        _count: {
          select: {
            lessons: true,
            enrollments: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    // If student, include enrollment status
    if (session?.role === 'STUDENT' && session.userId) {
      const enrollments = await prisma.enrollment.findMany({
        where: { userId: session.userId },
      })

      const coursesWithEnrollment = courses.map((course) => {
        const enrollment = enrollments.find((e) => e.courseId === course.id)
        return {
          ...course,
          enrollment: enrollment
            ? {
                isActive: enrollment.isActive,
                enrolledAt: enrollment.enrolledAt,
              }
            : null,
        }
      })

      return NextResponse.json({ courses: coursesWithEnrollment })
    }

    return NextResponse.json({ courses })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar cursos' },
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
    const validatedData = courseSchema.parse(body)

    const course = await prisma.course.create({
      data: validatedData,
    })

    return NextResponse.json({ course }, { status: 201 })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Erro ao criar curso' },
      { status: 500 }
    )
  }
}

