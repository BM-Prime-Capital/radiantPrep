// src/app/api/auth/check-session/route.ts
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

// Empêche toute mise en cache côté Next
export const revalidate = 0;
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const session = await getSession(request);

  if (!session) {
    // Toujours 200 pour permettre un .json() propre côté client
    return NextResponse.json({ valid: false }, { status: 200 });
  }

  // getSession(...) inclut déjà { user: true } d'après ton code
  const user = session.user ?? null;

  // Adapte selon ton modèle (ex: user.role en DB, sinon null)
  const role = (user as any)?.role ?? null;

  return NextResponse.json(
    {
      valid: true,
      user,
      role,          // <- utile pour ton AuthContext (PARENT/CHILD)
      // optionnel: expiresAt: session.expiresAt
    },
    { status: 200 }
  );
}
