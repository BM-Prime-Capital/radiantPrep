import { PrismaClient } from '@prisma/client';
import { parse } from 'cookie';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();

export async function getSession(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) return null;
    
    const cookies = parse(cookieHeader);
    const sessionId = cookies.session;
    if (!sessionId) return null;

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true }
    });

    if (!session) return null;

    // Add 5-minute buffer for clock skew
    const now = new Date();
    const expiresAt = new Date(session.expiresAt);
    const bufferTime = 5 * 60 * 1000; // 5 minutes
    
    if (now > new Date(expiresAt.getTime() + bufferTime)) {
      // Auto-delete expired session
      await deleteSession(sessionId);
      return null;
    }

    return session;
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}

// src/lib/session.ts
import { PrismaClientInitializationError } from '@prisma/client/runtime/library';

export async function getServerSession() {
  try {
    const cookieStore = cookies();
    const sessionId = (await cookieStore).get('session')?.value;
    
    if (!sessionId) return null;

    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: { user: true }
    });

    if (!session) return null;

    const now = new Date();
    const expiresAt = new Date(session.expiresAt);
    const bufferTime = 5 * 60 * 1000;

    if (now > new Date(expiresAt.getTime() + bufferTime)) {
      await deleteSession(sessionId);
      return null;
    }

    return session;

  } catch (error) {
    if (error instanceof PrismaClientInitializationError) {
      console.error('❌ Prisma database connection failed:', error.message);
    } else {
      console.error('❌ Session error:', error);
    }
    return null;
  }
}


export async function createSession(userId: string) {
  return prisma.session.create({
    data: {
      userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 1 week
    },
  });
}

export async function deleteSession(sessionId: string) {
  return prisma.session.delete({
    where: { id: sessionId },
  });
}

export async function refreshSession(sessionId: string) {
  return prisma.session.update({
    where: { id: sessionId },
    data: { expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) },
  });
}