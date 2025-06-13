import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from '@/lib/session'

export const config = {
  matcher: [
    '/assessment/:path*',
    '/api/assessment/:path*'
  ]
}

export async function middleware(request: NextRequest) {
  // Vérifie la session pour les routes protégées
  const session = await getSession(request)
  const pathname = request.nextUrl.pathname

  // Redirige vers login si pas de session
  if (!session && pathname.startsWith('/assessment')) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Vérifie les API routes
  if (pathname.startsWith('/api/assessment') && !session) {
    return new NextResponse(
      JSON.stringify({ error: 'Session expired' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return NextResponse.next()
}