import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

export const courseSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  thumbnail: z.string().url().optional().or(z.literal('')),
  previewImage: z.string().url().optional().or(z.literal('')),
  isActive: z.boolean().default(true),
})

export const lessonSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  videoUrl: z.string().url('URL do vídeo inválida'),
  thumbnail: z.string().url().optional().or(z.literal('')),
  order: z.number().int().min(0).default(0),
  duration: z.number().int().positive().optional(),
  isPublished: z.boolean().default(false),
  courseId: z.string().min(1, 'Curso é obrigatório'),
})

export const noteSchema = z.object({
  content: z.string().min(1, 'Conteúdo da nota é obrigatório'),
  lessonId: z.string().min(1, 'Aula é obrigatória'),
})

export const commentSchema = z.object({
  content: z.string().min(1, 'Conteúdo do comentário é obrigatório'),
  lessonId: z.string().min(1, 'Aula é obrigatória'),
})

export const lessonPlanSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  scheduledDate: z.string().datetime().optional().or(z.literal('')),
  order: z.number().int().min(0).default(0),
  courseId: z.string().min(1, 'Curso é obrigatório'),
})

export const enrollmentSchema = z.object({
  userId: z.string().min(1, 'Usuário é obrigatório'),
  courseId: z.string().min(1, 'Curso é obrigatório'),
  isActive: z.boolean().default(false),
})

