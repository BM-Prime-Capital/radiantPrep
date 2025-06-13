// Create a new API endpoint at /api/auth/check-session/route.ts
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET(request: Request) {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json(
      { valid: false },
      { status: 401 }
    );
  }
  return NextResponse.json({ valid: true, userId: session.userId });
}