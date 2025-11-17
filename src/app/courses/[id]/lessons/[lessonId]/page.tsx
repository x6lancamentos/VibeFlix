import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { LessonView } from '@/components/student/LessonView'

export default async function LessonPage({
  params,
}: {
  params: { id: string; lessonId: string }
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

  const lesson = await prisma.lesson.findUnique({
    where: { id: params.lessonId },
    include: {
      course: {
        select: {
          id: true,
          title: true,
        },
      },
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

  if (!lesson || !lesson.isPublished) {
    redirect(`/courses/${params.id}`)
  }

  const note = await prisma.studentNote.findUnique({
    where: {
      userId_lessonId: {
        userId: session.userId,
        lessonId: params.lessonId,
      },
    },
  })

  const completion = await prisma.lessonCompletion.findUnique({
    where: {
      userId_lessonId: {
        userId: session.userId,
        lessonId: params.lessonId,
      },
    },
  })

  return <LessonView lesson={lesson} userNote={note} isCompleted={!!completion} />
}

