import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { LessonsManager } from '@/components/admin/LessonsManager'

export default async function AdminLessonsPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getSession()

  if (!session || session.role !== 'ADMIN') {
    redirect('/login')
  }

  const course = await prisma.course.findUnique({
    where: { id: params.id },
  })

  if (!course) {
    redirect('/admin/courses')
  }

  const lessons = await prisma.lesson.findMany({
    where: { courseId: params.id },
    orderBy: { order: 'asc' },
  })

  return <LessonsManager course={course} initialLessons={lessons} />
}

