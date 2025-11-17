import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CoursesManager } from '@/components/admin/CoursesManager'

export default async function AdminCoursesPage() {
  const session = await getSession()

  if (!session || session.role !== 'ADMIN') {
    redirect('/login')
  }

  const courses = await prisma.course.findMany({
    include: {
      _count: {
        select: {
          lessons: true,
          enrollments: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return <CoursesManager initialCourses={courses} />
}

