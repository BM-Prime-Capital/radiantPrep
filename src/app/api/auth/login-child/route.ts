import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  // tu peux lire des infos du body si besoin:
  // const child = await request.json();

  // Cookie minimal pour marquer l'auth enfant (1 semaine)
  (await
        // tu peux lire des infos du body si besoin:
        // const child = await request.json();
        // Cookie minimal pour marquer l'auth enfant (1 semaine)
        cookies()).set('child_auth', '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.json({ ok: true });
}
