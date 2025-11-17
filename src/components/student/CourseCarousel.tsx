'use client'

import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CourseCard } from './CourseCard'
import { motion, AnimatePresence } from 'framer-motion'

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

interface CourseCarouselProps {
  courses: Course[]
}

export function CourseCarousel({ courses }: CourseCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400
      const newScrollLeft = scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount)
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      })

      // Update arrow visibility after scroll
      setTimeout(() => {
        if (scrollRef.current) {
          setShowLeftArrow(scrollRef.current.scrollLeft > 0)
          setShowRightArrow(
            scrollRef.current.scrollLeft <
            scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 10
          )
        }
      }, 300)
    }
  }

  const handleScroll = () => {
    if (scrollRef.current) {
      setShowLeftArrow(scrollRef.current.scrollLeft > 0)
      setShowRightArrow(
        scrollRef.current.scrollLeft <
        scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 10
      )
    }
  }

  if (courses.length === 0) return null

  return (
    <div className="relative group">
      <AnimatePresence>
        {showLeftArrow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute left-0 top-0 bottom-0 z-10 flex items-center"
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-full w-12 bg-gradient-to-r from-black via-black/80 to-transparent hover:bg-black/80 rounded-none"
              onClick={() => scroll('left')}
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-4 px-2"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {courses.map((course) => (
          <div key={course.id} className="flex-shrink-0 w-48 md:w-56 lg:w-64">
            <CourseCard course={course} isLocked={false} />
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showRightArrow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute right-0 top-0 bottom-0 z-10 flex items-center"
          >
            <Button
              variant="ghost"
              size="icon"
              className="h-full w-12 bg-gradient-to-l from-black via-black/80 to-transparent hover:bg-black/80 rounded-none"
              onClick={() => scroll('right')}
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
