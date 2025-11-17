'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save, BookOpen, MessageSquare, CheckCircle2, Circle } from 'lucide-react'
import { VideoPlayer } from './VideoPlayer'
import { CommentSection } from './CommentSection'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getVideoEmbedUrl } from '@/lib/utils'
import { motion } from 'framer-motion'

interface User {
  id: string
  name: string
  email: string
}

interface Comment {
  id: string
  content: string
  createdAt: Date
  user: User
}

interface Lesson {
  id: string
  title: string
  description: string | null
  videoUrl: string
  course: {
    id: string
    title: string
  }
  comments: Comment[]
}

interface StudentNote {
  id: string
  content: string
}

interface LessonViewProps {
  lesson: Lesson
  userNote: StudentNote | null
  isCompleted: boolean
}

export function LessonView({ lesson, userNote, isCompleted: initialIsCompleted }: LessonViewProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [noteContent, setNoteContent] = useState(userNote?.content || '')
  const [isCompleted, setIsCompleted] = useState(initialIsCompleted)

  const saveNoteMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: lesson.id,
          content,
        }),
      })
      if (!res.ok) throw new Error('Erro ao salvar nota')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })

  const handleSaveNote = () => {
    saveNoteMutation.mutate(noteContent)
  }

  const toggleCompletionMutation = useMutation({
    mutationFn: async (completed: boolean) => {
      const res = await fetch(`/api/lessons/${lesson.id}/complete`, {
        method: completed ? 'POST' : 'DELETE',
      })
      if (!res.ok) throw new Error('Erro ao atualizar conclusão')
      return res.json()
    },
    onSuccess: () => {
      setIsCompleted(!isCompleted)
      queryClient.invalidateQueries({ queryKey: ['lessons'] })
    },
  })

  const handleToggleCompletion = () => {
    toggleCompletionMutation.mutate(!isCompleted)
  }

  const videoEmbedUrl = getVideoEmbedUrl(lesson.videoUrl)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 md:px-8 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push(`/courses/${lesson.course.id}`)}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white/60 truncate">{lesson.course.title}</p>
            <h1 className="text-lg md:text-xl font-semibold truncate">{lesson.title}</h1>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 md:px-8 py-8">
        {/* Video Player */}
        {videoEmbedUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <VideoPlayer embedUrl={videoEmbedUrl} />
          </motion.div>
        )}

        {/* Description and Completion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 flex items-start justify-between gap-4"
        >
          {lesson.description && (
            <p className="text-white/80 text-lg flex-1">{lesson.description}</p>
          )}
          <Button
            onClick={handleToggleCompletion}
            disabled={toggleCompletionMutation.isPending}
            variant={isCompleted ? 'default' : 'outline'}
            className={`${
              isCompleted
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'border-white/20 text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Concluída
              </>
            ) : (
              <>
                <Circle className="mr-2 h-4 w-4" />
                Marcar como Concluída
              </>
            )}
          </Button>
        </motion.div>

        {/* Notes and Comments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Notes Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <CardTitle>Minhas Notas</CardTitle>
                </div>
                <CardDescription className="text-white/60">
                  Anote informações importantes desta aula
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="Digite suas notas aqui..."
                  className="min-h-[200px] bg-black/20 border-white/10 text-white placeholder:text-white/40"
                />
                <Button
                  onClick={handleSaveNote}
                  disabled={saveNoteMutation.isPending}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {saveNoteMutation.isPending ? 'Salvando...' : 'Salvar Nota'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Comments Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <CardTitle>Comentários</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CommentSection lessonId={lesson.id} initialComments={lesson.comments} />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
