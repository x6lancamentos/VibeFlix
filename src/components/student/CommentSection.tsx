'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { Trash2, User } from 'lucide-react'
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

interface CommentSectionProps {
  lessonId: string
  initialComments: Comment[]
}

export function CommentSection({ lessonId, initialComments }: CommentSectionProps) {
  const queryClient = useQueryClient()
  const [commentContent, setCommentContent] = useState('')

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const res = await fetch('/api/auth/me')
      if (!res.ok) return null
      const data = await res.json()
      return data.user
    },
  })

  const createMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId,
          content,
        }),
      })
      if (!res.ok) throw new Error('Erro ao criar comentário')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', lessonId] })
      setCommentContent('')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/comments/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Erro ao deletar comentário')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', lessonId] })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (commentContent.trim()) {
      createMutation.mutate(commentContent)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3">
        <Textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder="Deixe um comentário..."
          className="min-h-[100px] bg-black/20 border-white/10 text-white placeholder:text-white/40 focus:border-primary"
        />
        <Button
          type="submit"
          disabled={createMutation.isPending || !commentContent.trim()}
          className="w-full bg-primary hover:bg-primary/90"
        >
          {createMutation.isPending ? 'Enviando...' : 'Comentar'}
        </Button>
      </form>

      <div className="space-y-4 mt-6 max-h-[400px] overflow-y-auto">
        {initialComments.length === 0 ? (
          <p className="text-white/40 text-center py-8">Nenhum comentário ainda. Seja o primeiro!</p>
        ) : (
          initialComments.map((comment, index) => (
            <motion.div
              key={comment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="border-b border-white/10 pb-4 last:border-0"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <span className="font-semibold text-white text-sm">{comment.user.name}</span>
                      <span className="text-xs text-white/40 ml-2">
                        {new Date(comment.createdAt).toLocaleDateString('pt-BR', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-white/80 leading-relaxed pl-10">{comment.content}</p>
                </div>
                {currentUser && currentUser.id === comment.user.id && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (confirm('Tem certeza que deseja deletar este comentário?')) {
                        deleteMutation.mutate(comment.id)
                      }
                    }}
                    className="text-white/40 hover:text-red-400 hover:bg-red-500/10 flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
