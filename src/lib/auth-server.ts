import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { encrypt, type SessionPayload } from './auth'

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  })

  if (!user) {
    return null
  }

  const isValid = await bcrypt.compare(password, user.password)

  if (!isValid) {
    return null
  }

  const payload: SessionPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  }

  const token = await encrypt(payload)

  return { user, token }
}


