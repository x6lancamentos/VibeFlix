'use client'

import { HeroGeometric } from '@/components/ui/shape-landing-hero'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Play, BookOpen, Users, Award } from 'lucide-react'

export default function LandingPageClient() {
  const router = useRouter()

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay: 0.3 + i * 0.1,
        ease: [0.25, 0.4, 0.25, 1] as const,
      },
    }),
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <HeroGeometric
        badge="VibeFlix"
        title1="Aprenda Programação"
        title2="No Seu Ritmo"
      />

      {/* CTA Buttons */}
      <div className="relative z-20 -mt-32 pb-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            custom={3}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg font-semibold rounded-md"
              onClick={() => router.push('/register')}
            >
              Começar Agora
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 bg-white/5 hover:bg-white/10 text-white px-8 py-6 text-lg font-semibold rounded-md"
              onClick={() => router.push('/login')}
            >
              Entrar
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <section className="py-20 bg-black/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Por que escolher o VibeFlix?
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Uma plataforma completa para seu aprendizado em programação
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Play,
                title: 'Aulas em Vídeo',
                description: 'Acesse aulas de alta qualidade a qualquer momento',
              },
              {
                icon: BookOpen,
                title: 'Conteúdo Completo',
                description: 'Cursos estruturados do básico ao avançado',
              },
              {
                icon: Users,
                title: 'Comunidade',
                description: 'Interaja com outros alunos e mentores',
              },
              {
                icon: Award,
                title: 'Certificados',
                description: 'Receba certificados ao concluir os cursos',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="p-6 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <feature.icon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-white/60">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8">
        <div className="container mx-auto px-4 text-center text-white/60">
          <p>&copy; 2024 VibeFlix. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

