import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

export default async function AdminDashboardPage() {
  const session = await getSession()

  if (!session || session.role !== 'ADMIN') {
    redirect('/login')
  }

  const stats = await prisma.$transaction([
    prisma.user.count({ where: { role: 'STUDENT' } }),
    prisma.course.count(),
    prisma.lesson.count(),
    prisma.enrollment.count({ where: { isActive: true } }),
  ])

  const [totalStudents, totalCourses, totalLessons, activeEnrollments] = stats

  return (
    <AdminDashboard
      totalStudents={totalStudents}
      totalCourses={totalCourses}
      totalLessons={totalLessons}
      activeEnrollments={activeEnrollments}
    />
  )
}

