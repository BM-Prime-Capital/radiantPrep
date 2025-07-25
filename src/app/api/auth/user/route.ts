// api/auth/user/route.ts
import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';

export async function GET(request: Request) {
  const session = await getSession(request);
  
  if (!session || !session.user) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  return NextResponse.json(session.user);
}