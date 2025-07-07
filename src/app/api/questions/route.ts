// src/app/api/questions/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import type { SubjectName, GradeLevel } from '@prisma/client';

const prisma = new PrismaClient();

// Fonction de normalisation des réponses
const normalizeAnswer = (value: string): string => {
  return value.trim().toLowerCase();
};

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

    // Normaliser les réponses correctes et options
    const normalizedQuestions = questions.map(question => ({
      ...question,
      options: question.options.map(option => ({
        ...option,
        value: normalizeAnswer(option.value)
      })),
      correctAnswers: question.correctAnswers.map(answer => ({
        ...answer,
        answerValue: normalizeAnswer(answer.answerValue)
      }))
    }));

    console.log('Normalized Questions:', normalizedQuestions);

    return NextResponse.json(normalizedQuestions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    );
  }
}