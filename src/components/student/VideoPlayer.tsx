'use client'

import { motion } from 'framer-motion'

interface VideoPlayerProps {
  embedUrl: string
}

export function VideoPlayer({ embedUrl }: VideoPlayerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full aspect-video bg-black rounded-lg overflow-hidden shadow-2xl"
    >
      <iframe
        src={embedUrl}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Video player"
      />
    </motion.div>
  )
}
