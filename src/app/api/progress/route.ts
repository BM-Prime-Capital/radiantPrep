import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@/lib/session';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const session = await getSession(request);
    if (!session?.userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: { currentSubject: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calcul de la progression pour la matière actuelle
    const subjectAssessments = await prisma.assessment.findMany({
      where: {
        childUserId: session.userId,
        subjectName: user.currentSubject || undefined
      },
      select: { score: true, totalQuestions: true }
    });

    const subjectProgress = subjectAssessments.length > 0
      ? Math.round(subjectAssessments.reduce((sum, a) => sum + (a.score / a.totalQuestions * 100), 0) / subjectAssessments.length)
      : 0;

    // Calcul de la progression globale
    const allAssessments = await prisma.assessment.findMany({
      where: { childUserId: session.userId },
      select: { score: true, totalQuestions: true }
    });

    const overallProgress = allAssessments.length > 0
      ? Math.round(allAssessments.reduce((sum, a) => sum + (a.score / a.totalQuestions * 100), 0) / allAssessments.length)
      : 0;

    return NextResponse.json({
      subjectProgress,
      overallProgress
    });

  } catch (error: any) {
    console.error('Error fetching progress data:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to load progress data' },
      { status: 500 }
    );
  }
}