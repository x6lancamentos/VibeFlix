import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { StudentsManager } from '@/components/admin/StudentsManager'

export default async function AdminStudentsPage() {
  const session = await getSession()

  if (!session || session.role !== 'ADMIN') {
    redirect('/login')
  }

  const students = await prisma.user.findMany({
    where: { role: 'STUDENT' },
    include: {
      _count: {
        select: {
          enrollments: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return <StudentsManager initialStudents={students} />
}

