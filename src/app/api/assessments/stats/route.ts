// app/api/assessments/stats/route.ts
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
      select: { role: true, id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    let whereClause: any = {};
    if (user.role === 'CHILD') {
      whereClause.childUserId = user.id;
    } else if (user.role === 'PARENT') {
      whereClause.parentUserId = user.id;
    }

    // Récupère les données brutes
    const assessments = await prisma.assessment.findMany({
      where: whereClause,
      select: {
        score: true,
        totalQuestions: true,
        takenAt: true,
      },
      orderBy: {
        takenAt: 'desc',
      },
    });

    // Calcul des statistiques
    const totalAssessments = assessments.length;
    const averageScore = totalAssessments > 0 
      ? Math.round(assessments.reduce((sum, a) => sum + (a.score / a.totalQuestions * 100), 0) / totalAssessments)
      : 0;

    // Calcul de la série actuelle (streak)
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (const assessment of assessments) {
      const takenDate = new Date(assessment.takenAt);
      takenDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((today.getTime() - takenDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === currentStreak) {
        currentStreak++;
      } else if (diffDays > currentStreak) {
        break;
      }
    }

    return NextResponse.json({
      totalAssessments,
      averageScore,
      currentStreak,
      lastAssessmentDate: assessments[0]?.takenAt || null
    });

  } catch (error: any) {
    console.error('Error fetching assessment stats:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to load assessment stats' },
      { status: 500 }
    );
  }
}