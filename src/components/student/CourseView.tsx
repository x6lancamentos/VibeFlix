'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, PlayCircle, Calendar, Clock, CheckCircle2 } from 'lucide-react'
import { motion } from 'framer-motion'

interface Lesson {
  id: string
  title: string
  description: string | null
  order: number
  duration: number | null
  completions?: Array<{ id: string }>
}

interface LessonPlan {
  id: string
  title: string
  description: string | null
  scheduledDate: Date | null
  order: number
}

interface Course {
  id: string
  title: string
  description: string | null
  previewImage: string | null
  lessons: Lesson[]
  lessonPlans: LessonPlan[]
}

interface CourseViewProps {
  course: Course
}

export function CourseView({ course }: CourseViewProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Banner */}
      {course.previewImage && (
        <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${course.previewImage})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent" />
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{course.title}</h1>
              {course.description && (
                <p className="text-lg md:text-xl text-white/80 max-w-2xl">
                  {course.description}
                </p>
              )}
            </motion.div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-4 md:px-8 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="text-white/70 hover:text-white hover:bg-white/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>
          {!course.previewImage && (
            <h1 className="text-xl md:text-2xl font-bold">{course.title}</h1>
          )}
        </div>
      </nav>

      <main className="container mx-auto px-4 md:px-8 py-8">
        {!course.previewImage && course.description && (
          <p className="text-white/60 mb-8 text-lg">{course.description}</p>
        )}

        {course.lessons.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">Aulas</h2>
            <div className="space-y-2">
              {course.lessons.map((lesson, index) => {
                const isCompleted = lesson.completions && lesson.completions.length > 0
                return (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Card
                      className="bg-white/5 border-white/10 hover:bg-white/10 cursor-pointer transition-all group"
                      onClick={() => router.push(`/courses/${course.id}/lessons/${lesson.id}`)}
                    >
                      <CardContent className="p-4 md:p-6 flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                            isCompleted 
                              ? 'bg-green-600/20 group-hover:bg-green-600/30' 
                              : 'bg-primary/20 group-hover:bg-primary'
                          }`}>
                            {isCompleted ? (
                              <CheckCircle2 className="h-6 w-6 text-green-500" />
                            ) : (
                              <PlayCircle className="h-6 w-6 text-primary" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm text-white/40">Aula {lesson.order}</span>
                              {lesson.duration && (
                                <>
                                  <span className="text-white/40">•</span>
                                  <div className="flex items-center gap-1 text-sm text-white/40">
                                    <Clock className="h-3 w-3" />
                                    <span>{lesson.duration} min</span>
                                  </div>
                                </>
                              )}
                              {isCompleted && (
                                <>
                                  <span className="text-white/40">•</span>
                                  <span className="text-xs text-green-500 font-medium">Concluída</span>
                                </>
                              )}
                            </div>
                            <h3 className="font-semibold text-white group-hover:text-primary transition-colors">
                              {lesson.title}
                            </h3>
                            {lesson.description && (
                              <p className="text-sm text-white/60 line-clamp-1 mt-1">
                                {lesson.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </section>
        )}

        {course.lessonPlans.length > 0 && (
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">
              Próximas Aulas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {course.lessonPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-3 mb-3">
                        <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-white mb-1">{plan.title}</h3>
                          {plan.description && (
                            <p className="text-sm text-white/60">{plan.description}</p>
                          )}
                        </div>
                      </div>
                      {plan.scheduledDate && (
                        <p className="text-xs text-white/40">
                          {new Date(plan.scheduledDate).toLocaleDateString('pt-BR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
