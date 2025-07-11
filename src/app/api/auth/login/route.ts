import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { createSession, getSession } from '@/lib/session';

const prisma = new PrismaClient();

// Helper function for consistent cookie settings
const setSessionCookie = (response: NextResponse, sessionId: string) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const domain = isProduction ? '.radiant-prep.vercel.app' : undefined;

  response.cookies.set('session', sessionId, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax', // Consistent across environments
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
    domain: domain,
  });

  return response;
};

export async function POST(request: Request) {
  try {
    const { email, password, accessCode } = await request.json();

    // Parent login with email/password
    if (email && password) {
      const user = await prisma.user.findUnique({
        where: { email, role: 'PARENT' }
      });

      if (!user || !user.passwordHash) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Invalid credentials' },
          { status: 401 }
        );
      }

      // Create session
      const session = await createSession(user.id);

      const response = NextResponse.json({
        id: user.id,
        email: user.email,
        role: user.role
      });

      return setSessionCookie(response, session.id);
    }

    // Child login with access code
    if (accessCode) {
        const user = await prisma.user.findUnique({
            where: { accessCode, role: 'CHILD' }
        });

        if (!user) {
            return NextResponse.json(
            { error: 'Invalid access code' },
            { status: 401 }
            );
        }

        if (!user.id) {
            console.error('Child user found but missing ID:', user);
            return NextResponse.json(
            { error: 'Account configuration error' },
            { status: 500 }
            );
        }

      // Create session
      const session = await createSession(user.id);

      const response = NextResponse.json({
        id: user.id,
        childName: user.childName,
        grade: user.grade,
        currentSubject: user.currentSubject,
        accessCode: user.accessCode,
        role: user.role
      });

      return setSessionCookie(response, session.id);
    }

    return NextResponse.json(
      { error: 'Missing credentials' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Add session validation endpoint
export async function GET(request: Request) {
  try {
    const session = await getSession(request);
    
    if (!session) {
      return NextResponse.json(
        { valid: false },
        { status: 401 }
      );
    }

    return NextResponse.json({
      valid: true,
      userId: session.userId,
      role: session.user?.role
    });
  } catch (error) {
    console.error('Session validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}