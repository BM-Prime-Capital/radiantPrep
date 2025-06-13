// src/app/api/questions/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import type { SubjectName, GradeLevel } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subject = searchParams.get('subject');
  const grade = searchParams.get('grade');

  if (!subject || !grade) {
    return NextResponse.json(
      { error: 'Missing subject or grade parameters' },
      { status: 400 }
    );
  }

  try {
    const dbGradeLevel = `GRADE_${grade}` as GradeLevel;
    const dbSubjectName = subject as SubjectName;

    const questions = await prisma.question.findMany({
      where: {
        subject: { name: dbSubjectName },
        grade: { level: dbGradeLevel },
      },
      include: {
        options: true,
        correctAnswers: {
          orderBy: {
            isPrimary: 'desc',
          },
        },
        subject: true,
        grade: true,
      },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}