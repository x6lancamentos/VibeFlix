'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Plus, Edit, Trash2, Image as ImageIcon } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'

interface Course {
  id: string
  title: string
  description: string | null
  thumbnail: string | null
  previewImage: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
  _count: {
    lessons: number
    enrollments: number
  }
}

interface CoursesManagerProps {
  initialCourses: Course[]
}

export function CoursesManager({ initialCourses }: CoursesManagerProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    previewImage: '',
    isActive: true,
  })

  const { data: courses = initialCourses } = useQuery<Course[]>({
    queryKey: ['courses'],
    initialData: initialCourses,
  })

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Erro ao criar curso')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      setShowForm(false)
      resetForm()
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const res = await fetch(`/api/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error('Erro ao atualizar curso')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
      setEditingCourse(null)
      resetForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/courses/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Erro ao deletar curso')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] })
    },
  })

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      thumbnail: '',
      previewImage: '',
      isActive: true,
    })
  }

  const handleEdit = (course: Course) => {
    setEditingCourse(course)
    setFormData({
      title: course.title,
      description: course.description || '',
      thumbnail: course.thumbnail || '',
      previewImage: course.previewImage || '',
      isActive: course.isActive,
    })
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingCourse) {
      updateMutation.mutate({ id: editingCourse.id, data: formData })
    } else {
      createMutation.mutate(formData)
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
            <h1 className="text-2xl md:text-3xl font-bold text-primary">Gerenciar Cursos</h1>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 md:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Cursos</h2>
          <Button 
            onClick={() => { setShowForm(true); setEditingCourse(null); resetForm() }}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Curso
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6 bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">{editingCourse ? 'Editar Curso' : 'Novo Curso'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white/80">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="bg-black/20 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-white/80">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-black/20 border-white/10 text-white"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="thumbnail" className="text-white/80 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Thumbnail URL (Card)
                    </Label>
                    <Input
                      id="thumbnail"
                      type="url"
                      value={formData.thumbnail}
                      onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                      placeholder="https://exemplo.com/imagem.jpg"
                      className="bg-black/20 border-white/10 text-white"
                    />
                    {formData.thumbnail && (
                      <div className="mt-2">
                        <img
                          src={formData.thumbnail}
                          alt="Preview thumbnail"
                          className="w-full h-32 object-cover rounded border border-white/10"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="previewImage" className="text-white/80 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Banner URL (Preview)
                    </Label>
                    <Input
                      id="previewImage"
                      type="url"
                      value={formData.previewImage}
                      onChange={(e) => setFormData({ ...formData, previewImage: e.target.value })}
                      placeholder="https://exemplo.com/banner.jpg"
                      className="bg-black/20 border-white/10 text-white"
                    />
                    {formData.previewImage && (
                      <div className="mt-2">
                        <img
                          src={formData.previewImage}
                          alt="Preview banner"
                          className="w-full h-32 object-cover rounded border border-white/10"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="isActive" className="text-white/80">Ativo</Label>
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {editingCourse ? 'Atualizar' : 'Criar'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => { setShowForm(false); resetForm(); setEditingCourse(null) }}
                    className="border-white/10 text-white/70 hover:text-white hover:bg-white/10"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors overflow-hidden">
                {course.thumbnail && (
                  <div className="relative h-48 w-full overflow-hidden">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-white">{course.title}</CardTitle>
                  <CardDescription className="text-white/60">{course.description || 'Sem descrição'}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-white/60">
                      Aulas: {course._count.lessons}
                    </p>
                    <p className="text-sm text-white/60">
                      Inscrições: {course._count.enrollments}
                    </p>
                    <p className="text-sm text-white/60">
                      Status: {course.isActive ? 'Ativo' : 'Inativo'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/admin/courses/${course.id}/lessons`)}
                      className="flex-1 border-white/10 text-white/70 hover:text-white hover:bg-white/10"
                    >
                      Gerenciar Aulas
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEdit(course)}
                      className="border-white/10 text-white/70 hover:text-white hover:bg-white/10"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (confirm('Tem certeza que deseja deletar este curso?')) {
                          deleteMutation.mutate(course.id)
                        }
                      }}
                      className="border-white/10 text-white/70 hover:text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}
