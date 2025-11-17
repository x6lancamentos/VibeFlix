import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import LandingPageClient from './landing-page-client'

export default async function Home() {
  const session = await getSession()

  if (!session) {
    return <LandingPageClient />
  }

  if (session.role === 'ADMIN') {
    redirect('/admin/dashboard')
  }

  redirect('/dashboard')
}
