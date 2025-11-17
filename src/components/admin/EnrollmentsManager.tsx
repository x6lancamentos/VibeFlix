'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ArrowLeft, CheckCircle, XCircle, User, BookOpen } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'

interface Enrollment {
  id: string
  userId: string
  courseId: string
  isActive: boolean
  enrolledAt: Date
  user: {
    id: string
    name: string
    email: string
  }
  course: {
    id: string
    title: string
    thumbnail: string | null
  }
}

interface User {
  id: string
  name: string
  email: string
}

interface Course {
  id: string
  title: string
}

interface EnrollmentsManagerProps {
  initialEnrollments: Enrollment[]
  users: User[]
  courses: Course[]
}

export function EnrollmentsManager({
  initialEnrollments,
  users,
  courses,
}: EnrollmentsManagerProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [selectedUserId, setSelectedUserId] = useState('')
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [isActive, setIsActive] = useState(false)

  const updateMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await fetch(`/api/enrollments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive }),
      })
      if (!res.ok) throw new Error('Erro ao atualizar inscrição')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
    },
  })

  const createMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectedUserId,
          courseId: selectedCourseId,
          isActive,
        }),
      })
      if (!res.ok) throw new Error('Erro ao criar inscrição')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enrollments'] })
      setSelectedUserId('')
      setSelectedCourseId('')
      setIsActive(false)
    },
  })

  const handleCreate = () => {
    if (selectedUserId && selectedCourseId) {
      createMutation.mutate()
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push('/admin/dashboard')} className="text-white/70 hover:text-white hover:bg-white/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold text-primary">Gerenciar Inscrições</h1>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 md:px-8 py-8">
        <Card className="mb-6 bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Nova Inscrição</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="user" className="text-white/80">Aluno</Label>
                <select
                  id="user"
                  className="flex h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                >
                  <option value="">Selecione um aluno</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id} className="bg-black">
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="course" className="text-white/80">Curso</Label>
                <select
                  id="course"
                  className="flex h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white"
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                >
                  <option value="">Selecione um curso</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id} className="bg-black">
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="isActive" className="text-white/80">Status</Label>
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded"
                  />
                  <Label htmlFor="isActive" className="cursor-pointer text-white/80">
                    Ativo
                  </Label>
                </div>
              </div>
            </div>
            <Button
              className="mt-4 bg-primary hover:bg-primary/90"
              onClick={handleCreate}
              disabled={!selectedUserId || !selectedCourseId || createMutation.isPending}
            >
              Criar Inscrição
            </Button>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-6">Inscrições</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {initialEnrollments.map((enrollment, index) => (
            <motion.div
              key={enrollment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                {enrollment.course.thumbnail && (
                  <div className="relative h-32 w-full overflow-hidden">
                    <img
                      src={enrollment.course.thumbnail}
                      alt={enrollment.course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-white">{enrollment.course.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-white/60">
                    <User className="h-4 w-4" />
                    {enrollment.user.name}
                  </CardDescription>
                  <CardDescription className="text-white/60">
                    {enrollment.user.email}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-white/60 flex items-center gap-2">
                      {enrollment.isActive ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Ativo</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-red-500" />
                          <span>Inativo</span>
                        </>
                      )}
                    </p>
                    <p className="text-sm text-white/60">
                      Inscrito em: {new Date(enrollment.enrolledAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-white/10 text-white/70 hover:text-white hover:bg-white/10"
                    onClick={() => {
                      updateMutation.mutate({
                        id: enrollment.id,
                        isActive: !enrollment.isActive,
                      })
                    }}
                    disabled={updateMutation.isPending}
                  >
                    {enrollment.isActive ? 'Desativar' : 'Ativar'}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}
