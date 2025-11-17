'use client'

import { useRouter } from 'next/navigation'
import { Lock, Play } from 'lucide-react'
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
}

interface CourseCardProps {
  course: Course
  isLocked: boolean
}

export function CourseCard({ course, isLocked }: CourseCardProps) {
  const router = useRouter()

  const handleClick = () => {
    if (!isLocked) {
      router.push(`/courses/${course.id}`)
    }
  }

  return (
    <motion.div
      className="group relative cursor-pointer"
      onClick={handleClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-md bg-gray-900">
        {course.thumbnail ? (
          <img
            src={course.thumbnail}
            alt={course.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
            <Play className="h-12 w-12 text-white/20" />
          </div>
        )}
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
          {!isLocked && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileHover={{ opacity: 1, scale: 1 }}
              className="bg-white/20 backdrop-blur-sm rounded-full p-4"
            >
              <Play className="h-8 w-8 text-white fill-white" />
            </motion.div>
          )}
        </div>

        {/* Lock overlay for locked courses */}
        {isLocked && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-[2px]">
            <div className="text-center">
              <Lock className="h-10 w-10 text-white/80 mx-auto mb-2" />
              <p className="text-xs text-white/60 px-2">Bloqueado</p>
            </div>
          </div>
        )}

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>
      
      {/* Title */}
      <div className="mt-2">
        <h3 className="text-sm font-medium text-white line-clamp-2 group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        <p className="text-xs text-white/60 mt-1">
          {course._count.lessons} aulas
        </p>
      </div>
    </motion.div>
  )
}
