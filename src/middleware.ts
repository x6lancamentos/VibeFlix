import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decrypt } from './lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname === '/' ||
    pathname.startsWith('/(landing)')
  ) {
    return NextResponse.next()
  }

  // API routes - check auth
  if (pathname.startsWith('/api')) {
    // Public API routes
    if (pathname.startsWith('/api/auth/login') || pathname.startsWith('/api/auth/register')) {
      return NextResponse.next()
    }

    const session = request.cookies.get('session')?.value

    if (!session) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    try {
      const payload = await decrypt(session)

      // Check admin routes
      if (pathname.startsWith('/api/admin') && payload.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
      }

      // Add user info to request headers
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', payload.userId)
      requestHeaders.set('x-user-role', payload.role)

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    } catch {
      return NextResponse.json({ error: 'Sessão inválida' }, { status: 401 })
    }
  }

  // Protected pages
  const session = request.cookies.get('session')?.value

  if (!session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    const payload = await decrypt(session)

    // Admin routes
    if (pathname.startsWith('/admin') && payload.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Student routes - redirect admin away
    if ((pathname.startsWith('/dashboard') || pathname.startsWith('/courses')) && payload.role === 'ADMIN') {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }

    return NextResponse.next()
  } catch {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

