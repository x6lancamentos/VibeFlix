'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut, Search, Bell } from 'lucide-react'
import { CourseCarousel } from './CourseCarousel'
import { CourseCard } from './CourseCard'
import { motion } from 'framer-motion'

interface Course {
  id: string
  title: string
  description: string | null
  thumbnail: string | null
  previewImage: string | null
  isActive: boolean
  _count: {
    lessons: number
  }
  lessons?: Array<{
    id: string
    title: string
  }>
}

interface Enrollment {
  id: string
  courseId: string
  isActive: boolean
  course: Course
}

interface StudentDashboardProps {
  enrollments: Enrollment[]
  allCourses: Course[]
}

export function StudentDashboard({ enrollments, allCourses }: StudentDashboardProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const enrolledCourseIds = new Set(enrollments.map((e) => e.course.id))
  const availableCourses = allCourses.filter((c) => !enrolledCourseIds.has(c.id))
  const activeCourses = enrollments.filter((e) => e.isActive).map((e) => e.course)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Netflix-style Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-black via-black/80 to-transparent transition-all">
        <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-2xl md:text-3xl font-bold text-primary cursor-pointer" onClick={() => router.push('/dashboard')}>
              VibeFlix
            </h1>
            <div className="hidden md:flex items-center gap-6">
              <button className="text-white/70 hover:text-white transition-colors">Início</button>
              <button className="text-white/70 hover:text-white transition-colors">Cursos</button>
              <button className="text-white/70 hover:text-white transition-colors">Minha Lista</button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Search className="h-5 w-5 text-white/70 hover:text-white cursor-pointer transition-colors" />
            <Bell className="h-5 w-5 text-white/70 hover:text-white cursor-pointer transition-colors" />
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              Sair
            </Button>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        {/* Hero Section - Continue Watching */}
        {activeCourses.length > 0 && (
          <section className="relative mb-12">
            <div className="container mx-auto px-4 md:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white">
                  Continue Assistindo
                </h2>
                <CourseCarousel courses={activeCourses} />
              </motion.div>
            </div>
          </section>
        )}

        {/* My Courses */}
        {activeCourses.length > 0 && (
          <section className="mb-12">
            <div className="container mx-auto px-4 md:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white">
                  Meus Cursos
                </h2>
                <CourseCarousel courses={activeCourses} />
              </motion.div>
            </div>
          </section>
        )}

        {/* Available Courses */}
        {availableCourses.length > 0 && (
          <section className="mb-12">
            <div className="container mx-auto px-4 md:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-xl md:text-2xl font-semibold mb-4 text-white">
                  Descobrir Cursos
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {availableCourses.map((course) => (
                    <CourseCard key={course.id} course={course} isLocked={true} />
                  ))}
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Empty State */}
        {activeCourses.length === 0 && availableCourses.length === 0 && (
          <div className="container mx-auto px-4 md:px-8 py-20 text-center">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white">
              Nenhum curso disponível
            </h2>
            <p className="text-white/60 mb-8">
              Entre em contato com o administrador para ter acesso aos cursos.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
