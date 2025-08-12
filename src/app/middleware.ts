import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    '/profile/:path*',
    '/assessment/:path*',
    '/api/assessment/:path*',
    // '/child-dashboard/:path*', // décommente si tu veux aussi protéger le dashboard enfant
  ],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasParentSession = Boolean(request.cookies.get('session')?.value);
  const hasChildSession = request.cookies.get('child_auth')?.value === '1';
  const hasSession = hasParentSession || hasChildSession;

  // Protège les API d'assessment
  if (pathname.startsWith('/api/assessment')) {
    if (!hasSession) {
      return new NextResponse(JSON.stringify({ error: 'Session expired' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    return NextResponse.next();
  }

  // Protège les pages
  if ((pathname.startsWith('/assessment') || pathname.startsWith('/profile')) && !hasSession) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
