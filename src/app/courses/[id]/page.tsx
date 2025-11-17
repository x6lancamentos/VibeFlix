import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CourseView } from '@/components/student/CourseView'

export default async function CoursePage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getSession()

  if (!session || session.role !== 'STUDENT') {
    redirect('/login')
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.userId,
        courseId: params.id,
      },
    },
  })

  if (!enrollment || !enrollment.isActive) {
    redirect('/dashboard')
  }

  const course = await prisma.course.findUnique({
    where: { id: params.id },
    include: {
      lessons: {
        where: { isPublished: true },
        orderBy: { order: 'asc' },
        include: {
          completions: {
            where: { userId: session.userId },
          },
        },
      },
      lessonPlans: {
        orderBy: { order: 'asc' },
      },
    },
  })

  if (!course) {
    redirect('/dashboard')
  }

  return <CourseView course={course} />
}

