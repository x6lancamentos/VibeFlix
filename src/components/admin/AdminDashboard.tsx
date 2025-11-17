'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LogOut, Users, BookOpen, PlayCircle, UserCheck, Settings } from 'lucide-react'
import { motion } from 'framer-motion'

interface AdminDashboardProps {
  totalStudents: number
  totalCourses: number
  totalLessons: number
  activeEnrollments: number
}

export function AdminDashboard({
  totalStudents,
  totalCourses,
  totalLessons,
  activeEnrollments,
}: AdminDashboardProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const stats = [
    {
      title: 'Total de Alunos',
      value: totalStudents,
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      route: '/admin/students',
    },
    {
      title: 'Total de Cursos',
      value: totalCourses,
      icon: BookOpen,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      route: '/admin/courses',
    },
    {
      title: 'Total de Aulas',
      value: totalLessons,
      icon: PlayCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-500/10',
      route: '/admin/courses',
    },
    {
      title: 'Inscrições Ativas',
      value: activeEnrollments,
      icon: UserCheck,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      route: '/admin/enrollments',
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-primary">VibeFlix Admin</h1>
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/admin/courses')}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              Cursos
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => router.push('/admin/students')}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              Alunos
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => router.push('/admin/enrollments')}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              Inscrições
            </Button>
            <Button 
              variant="ghost" 
              onClick={handleLogout}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 md:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Dashboard</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card
                  className={`bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer transition-all ${stat.bgColor}`}
                  onClick={() => router.push(stat.route)}
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white/70">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => router.push('/admin/courses')}
                  className="w-full bg-primary hover:bg-primary/90 text-white h-auto py-4 flex flex-col items-center gap-2"
                >
                  <BookOpen className="h-6 w-6" />
                  <span>Gerenciar Cursos</span>
                </Button>
                <Button
                  onClick={() => router.push('/admin/students')}
                  variant="outline"
                  className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white h-auto py-4 flex flex-col items-center gap-2"
                >
                  <Users className="h-6 w-6" />
                  <span>Gerenciar Alunos</span>
                </Button>
                <Button
                  onClick={() => router.push('/admin/enrollments')}
                  variant="outline"
                  className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10 hover:text-white h-auto py-4 flex flex-col items-center gap-2"
                >
                  <UserCheck className="h-6 w-6" />
                  <span>Gerenciar Inscrições</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  )
}
