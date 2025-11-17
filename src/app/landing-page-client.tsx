'use client'

import { HeroGeometric } from '@/components/ui/shape-landing-hero'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Brain, Code, UserCircle, Users, Sparkles, Layers, MessageCircle, Network, CheckCircle2 } from 'lucide-react'

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

  const technologies = [
    'Next.js', 'React', 'TypeScript', 'Node.js', 'PostgreSQL',
    'OpenAI API', 'Claude API', 'Tailwind CSS', 'Prisma', 'Docker',
    'Cursor', 'Windsurf', 'TRAE', 'GitHub', 'Vercel', 'Supabase'
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <HeroGeometric
        badge="Vibe Coding"
        title1="Desenvolva com IA"
        title2="Domine o Futuro do Código"
      />

      {/* Hero Content */}
      <div className="relative z-20 -mt-32 pb-20">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            custom={2}
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            className="max-w-3xl mx-auto mb-12"
          >
            <p className="text-white/70 text-lg md:text-xl lg:text-2xl leading-relaxed mb-4 font-light">
              Aprenda programação moderna usando inteligência artificial.
            </p>
            <p className="text-white/60 text-base md:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto">
              Mentorias práticas, projetos reais e uma comunidade que evolui junto com você.
            </p>
          </motion.div>
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
              Explorar Cursos
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
              Por que escolher o Vibe Coding?
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Desenvolvimento moderno, aprendizado prático e suporte de verdade
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Brain,
                title: 'Código com Inteligência Artificial',
                description: 'Aprenda a usar ferramentas de IA para acelerar seu desenvolvimento e criar soluções inovadoras',
              },
              {
                icon: Code,
                title: 'Projetos Reais, Resultados Reais',
                description: 'Construa portfólio com projetos práticos que demonstram suas habilidades no mercado',
              },
              {
                icon: UserCircle,
                title: 'Suporte Quando Você Precisa',
                description: 'Acompanhamento direto com mentores experientes para evoluir no seu ritmo',
              },
              {
                icon: Users,
                title: 'Aprenda Junto com Outros',
                description: 'Conecte-se com desenvolvedores, compartilhe conhecimento e cresça em comunidade',
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

      {/* Technologies Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Tecnologias que Você Vai Dominar
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Stack moderna, ferramentas de IA e frameworks que o mercado está buscando
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap justify-center gap-4"
          >
            {technologies.map((tech, index) => (
              <motion.div
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all"
              >
                <span className="text-white font-medium">{tech}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Social Proof Section */}
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
              Junte-se a Desenvolvedores que Estão Evoluindo
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Centenas de alunos já transformaram suas carreiras aprendendo desenvolvimento moderno com IA
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                stat: '500+',
                label: 'Alunos Ativos',
                icon: Users,
              },
              {
                stat: '50+',
                label: 'Projetos Concluídos',
                icon: Code,
              },
              {
                stat: '98%',
                label: 'Satisfação',
                icon: CheckCircle2,
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                className="text-center p-8 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
              >
                <item.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <div className="text-5xl font-bold text-primary mb-2">{item.stat}</div>
                <div className="text-white/60 text-lg">{item.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-b from-black/50 to-black">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Pronto para Transformar Sua Carreira?
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
              Comece hoje mesmo e faça parte da nova geração de desenvolvedores que dominam IA
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
                Já tenho uma conta
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 bg-black">
        <div className="container mx-auto px-4 text-center text-white/60">
          <p>&copy; 2024 VibeFlix. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}

