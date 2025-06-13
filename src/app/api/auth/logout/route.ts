import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { deleteSession } from '@/lib/session';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session')?.value;

    // Supprimer la session en base de données si elle existe
    if (sessionId) {
      await deleteSession(sessionId);
    }

    // Créer la réponse et supprimer le cookie
    const response = NextResponse.json(
      { success: true, message: 'Logout successful' },
      { status: 200 }
    );

    // Suppression plus robuste du cookie
    response.cookies.set({
      name: 'session',
      value: '',
      expires: new Date(0), // Date dans le passé
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Logout failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}