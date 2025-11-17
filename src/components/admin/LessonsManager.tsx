'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Plus, Edit, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'

interface Course {
  id: string
  title: string
}

interface Lesson {
  id: string
  title: string
  description: string | null
  videoUrl: string
  thumbnail: string | null
  order: number
  duration: number | null
  isPublished: boolean
}

interface LessonsManagerProps {
  course: Course
  initialLessons: Lesson[]
}

export function LessonsManager({ course, initialLessons }: LessonsManagerProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnail: '',
    order: 0,
    duration: '',
    isPublished: false,
    courseId: course.id,
  })

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch('/api/lessons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          duration: data.duration ? parseInt(data.duration) : null,
        }),
      })
      if (!res.ok) throw new Error('Erro ao criar aula')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] })
      setShowForm(false)
      resetForm()
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const res = await fetch(`/api/lessons/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          duration: data.duration ? parseInt(data.duration) : null,
        }),
      })
      if (!res.ok) throw new Error('Erro ao atualizar aula')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] })
      setEditingLesson(null)
      resetForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/lessons/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Erro ao deletar aula')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lessons'] })
    },
  })

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      videoUrl: '',
      thumbnail: '',
      order: initialLessons.length,
      duration: '',
      isPublished: false,
      courseId: course.id,
    })
  }

  const handleEdit = (lesson: Lesson) => {
    setEditingLesson(lesson)
    setFormData({
      title: lesson.title,
      description: lesson.description || '',
      videoUrl: lesson.videoUrl,
      thumbnail: lesson.thumbnail || '',
      order: lesson.order,
      duration: lesson.duration?.toString() || '',
      isPublished: lesson.isPublished,
      courseId: course.id,
    })
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingLesson) {
      updateMutation.mutate({ id: editingLesson.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push('/admin/courses')} className="text-white/70 hover:text-white hover:bg-white/10">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold text-primary">
              Aulas - {course.title}
            </h1>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 md:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Aulas</h2>
          <Button 
            onClick={() => { setShowForm(true); setEditingLesson(null); resetForm() }}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Aula
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6 bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">{editingLesson ? 'Editar Aula' : 'Nova Aula'}</CardTitle>
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
                <div className="space-y-2">
                  <Label htmlFor="videoUrl" className="text-white/80">URL do Vídeo (YouTube ou Google Drive) *</Label>
                  <Input
                    id="videoUrl"
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    required
                    placeholder="https://youtube.com/watch?v=... ou https://drive.google.com/..."
                    className="bg-black/20 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thumbnail" className="text-white/80 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Thumbnail URL (Opcional)
                  </Label>
                  <Input
                    id="thumbnail"
                    type="url"
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="https://exemplo.com/thumbnail.jpg"
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="order" className="text-white/80">Ordem</Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                      className="bg-black/20 border-white/10 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration" className="text-white/80">Duração (minutos)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="bg-black/20 border-white/10 text-white"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="isPublished" className="text-white/80">Publicado</Label>
                </div>
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {editingLesson ? 'Atualizar' : 'Criar'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => { setShowForm(false); resetForm(); setEditingLesson(null) }}
                    className="border-white/10 text-white/70 hover:text-white hover:bg-white/10"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {initialLessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <GripVertical className="h-5 w-5 text-white/40" />
                      <CardTitle className="text-white">{lesson.title}</CardTitle>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEdit(lesson)}
                        className="border-white/10 text-white/70 hover:text-white hover:bg-white/10"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (confirm('Tem certeza que deseja deletar esta aula?')) {
                            deleteMutation.mutate(lesson.id)
                          }
                        }}
                        className="border-white/10 text-white/70 hover:text-red-400 hover:bg-red-500/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardDescription className="text-white/60">{lesson.description || 'Sem descrição'}</CardDescription>
                </CardHeader>
                <CardContent>
                  {lesson.thumbnail && (
                    <div className="mb-4">
                      <img
                        src={lesson.thumbnail}
                        alt={lesson.title}
                        className="w-full h-32 object-cover rounded border border-white/10"
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <p className="text-sm text-white/60">
                      Ordem: {lesson.order} | Duração: {lesson.duration ? `${lesson.duration} min` : 'N/A'}
                    </p>
                    <p className="text-sm text-white/60">
                      Status: {lesson.isPublished ? 'Publicado' : 'Rascunho'}
                    </p>
                    <p className="text-sm text-white/60 break-all">
                      URL: {lesson.videoUrl}
                    </p>
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
