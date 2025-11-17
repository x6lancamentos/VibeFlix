import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { config } from 'dotenv'

// Load environment variables
config()

const prisma = new PrismaClient()

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@vibeflix.com' },
    update: {},
    create: {
      email: 'admin@vibeflix.com',
      password: hashedPassword,
      name: 'Administrador',
      role: UserRole.ADMIN,
    },
  })

  console.log('Admin user created:', admin.email)

  // Create sample student
  const studentPassword = await bcrypt.hash('student123', 10)
  
  const student = await prisma.user.upsert({
    where: { email: 'aluno@vibeflix.com' },
    update: {},
    create: {
      email: 'aluno@vibeflix.com',
      password: studentPassword,
      name: 'Aluno Teste',
      role: UserRole.STUDENT,
    },
  })

  console.log('Student user created:', student.email)

  // Create sample course
  const course = await prisma.course.create({
    data: {
      title: 'Mentoria VibeCoding',
      description: 'Curso completo de programação e desenvolvimento web',
      thumbnail: 'https://via.placeholder.com/300x200',
      previewImage: 'https://via.placeholder.com/1920x1080',
      isActive: true,
    },
  })

  console.log('Sample course created:', course.title)

  // Create enrollment for student
  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course.id,
      isActive: true,
    },
  })

  console.log('Enrollment created')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

