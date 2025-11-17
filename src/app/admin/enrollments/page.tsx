import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { EnrollmentsManager } from '@/components/admin/EnrollmentsManager'

export default async function AdminEnrollmentsPage({
  searchParams,
}: {
  searchParams: { userId?: string; courseId?: string }
}) {
  const session = await getSession()

  if (!session || session.role !== 'ADMIN') {
    redirect('/login')
  }

  const where: any = {}
  if (searchParams.userId) {
    where.userId = searchParams.userId
  }
  if (searchParams.courseId) {
    where.courseId = searchParams.courseId
  }

  const enrollments = await prisma.enrollment.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      course: {
        select: {
          id: true,
          title: true,
          thumbnail: true,
        },
      },
    },
    orderBy: { enrolledAt: 'desc' },
  })

  const users = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    select: { id: true, name: true, email: true },
  })

  const courses = await prisma.course.findMany({
    select: { id: true, title: true },
  })

  return (
    <EnrollmentsManager
      initialEnrollments={enrollments}
      users={users}
      courses={courses}
    />
  )
}

