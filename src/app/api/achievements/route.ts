import { NextResponse } from 'next/server';
import { PrismaClient, Achievement, AchievementType } from '@prisma/client';
import { getSession } from '@/lib/session';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const session = await getSession(request);
    if (!session?.userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    // 1. Récupère les réalisations de l'utilisateur
    const userAchievements = await prisma.achievement.findMany({
      where: { userId: session.userId },
      orderBy: { unlockedAt: 'desc' },
      take: 5,
      include: { achievementType: true }
    });

    // 2. Formate les données
    const formattedAchievements = userAchievements.map((achievement) => ({
      title: achievement.achievementType.name,
      description: achievement.achievementType.description,
      icon: achievement.achievementType.icon,
      unlockedAt: achievement.unlockedAt
    }));

    // 3. Calcul des réalisations supplémentaires
    const [mathMasterCount, perfectScores] = await Promise.all([
      prisma.assessment.count({
        where: {
          childUserId: session.userId,
          subjectName: 'Math',
          score: { gte: 90 }
        }
      }),
      prisma.assessment.count({
        where: {
          childUserId: session.userId,
          score: 100
        }
      })
    ]);

    // 4. Ajout des réalisations calculées
    const additionalAchievements = [];
    
    if (mathMasterCount >= 3) {
      additionalAchievements.push({
        title: 'Math Master',
        description: 'Scored 90%+ on math assessments',
        icon: 'math',
        count: mathMasterCount
      });
    }

    if (perfectScores > 0) {
      additionalAchievements.push({
        title: 'Perfect Score',
        description: 'Scored 100% on an assessment',
        icon: 'perfect',
        count: perfectScores
      });
    }

    // 5. Combine et retourne les résultats
    const allAchievements = [...additionalAchievements, ...formattedAchievements];
    return NextResponse.json(allAchievements.slice(0, 5));

  } catch (error: unknown) {
    console.error('Error fetching achievements:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to load achievements';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}