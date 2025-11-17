import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { StudentDashboard } from '@/components/student/StudentDashboard'

export default async function DashboardPage() {
  const session = await getSession()

  if (!session || session.role !== 'STUDENT') {
    redirect('/login')
  }

  const enrollments = await prisma.enrollment.findMany({
    where: {
      userId: session.userId,
      isActive: true,
    },
    include: {
      course: {
        include: {
          lessons: {
            where: { isPublished: true },
            orderBy: { order: 'asc' },
            take: 5,
          },
          _count: {
            select: {
              lessons: true,
            },
          },
        },
      },
    },
  })

  const allCourses = await prisma.course.findMany({
    include: {
      _count: {
        select: {
          lessons: true,
        },
      },
    },
  })

  return <StudentDashboard enrollments={enrollments} allCourses={allCourses} />
}

