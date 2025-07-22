import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

export type { Achievement, AchievementType } from '@prisma/client';