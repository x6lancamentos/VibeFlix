'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Mail, User, Plus, Edit, Trash2, BookOpen } from 'lucide-react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'

interface Student {
  id: string
  name: string
  email: string
  createdAt: Date
  _count: {
    enrollments: number
  }
}

interface StudentsManagerProps {
  initialStudents: Student[]
}

export function StudentsManager({ initialStudents }: StudentsManagerProps) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState<Student | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  const { data: students = initialStudents } = useQuery<Student[]>({
    queryKey: ['students'],
    queryFn: async () => {
      const res = await fetch('/api/admin/students')
      if (!res.ok) return initialStudents
      const data = await res.json()
      return data.students
    },
    initialData: initialStudents,
  })

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch('/api/admin/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Erro ao criar aluno')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      setShowForm(false)
      resetForm()
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<typeof formData> }) => {
      const res = await fetch(`/api/admin/students/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Erro ao atualizar aluno')
      }
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
      setEditingStudent(null)
      resetForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/admin/students/${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Erro ao deletar aluno')
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] })
    },
  })

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
    })
  }

  const handleEdit = (student: Student) => {
    setEditingStudent(student)
    setFormData({
      name: student.name,
      email: student.email,
      password: '',
    })
    setShowForm(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingStudent) {
      const updateData: any = { name: formData.name, email: formData.email }
      if (formData.password) {
        updateData.password = formData.password
      }
      updateMutation.mutate({ id: editingStudent.id, data: updateData })
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
            <h1 className="text-2xl md:text-3xl font-bold text-primary">Gerenciar Alunos</h1>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 md:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Alunos</h2>
          <Button 
            onClick={() => { setShowForm(true); setEditingStudent(null); resetForm() }}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Aluno
          </Button>
        </div>

        {showForm && (
          <Card className="mb-6 bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">{editingStudent ? 'Editar Aluno' : 'Novo Aluno'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white/80">Nome *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="bg-black/20 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/80">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="bg-black/20 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white/80">
                    Senha {editingStudent ? '(deixe em branco para não alterar)' : '*'}
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingStudent}
                    minLength={6}
                    className="bg-black/20 border-white/10 text-white"
                  />
                </div>
                {(createMutation.error || updateMutation.error) && (
                  <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md">
                    {createMutation.error?.message || updateMutation.error?.message}
                  </div>
                )}
                <div className="flex gap-2">
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {editingStudent ? 'Atualizar' : 'Criar'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => { setShowForm(false); resetForm(); setEditingStudent(null) }}
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
          {students.map((student) => (
            <Card key={student.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <User className="h-5 w-5" />
                  {student.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-white/60">
                  <Mail className="h-4 w-4" />
                  {student.email}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-white/60">
                    Inscrições: {student._count.enrollments}
                  </p>
                  <p className="text-sm text-white/60">
                    Cadastrado em: {new Date(student.createdAt).toLocaleDateString('pt-BR')}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 border-white/10 text-white/70 hover:text-white hover:bg-white/10"
                    onClick={() => router.push(`/admin/enrollments?userId=${student.id}`)}
                  >
                    <BookOpen className="mr-2 h-4 w-4" />
                    Ver Cursos
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleEdit(student)}
                    className="border-white/10 text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      if (confirm('Tem certeza que deseja deletar este aluno?')) {
                        deleteMutation.mutate(student.id)
                      }
                    }}
                    className="border-white/10 text-white/70 hover:text-red-400 hover:bg-red-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
