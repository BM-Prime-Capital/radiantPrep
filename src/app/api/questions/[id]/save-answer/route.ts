// app/api/questions/[id]/save-answer/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(
  req: Request,
  context: { params: Promise<Record<string, string>> }
) {
  try {
    // Await the params to get the actual values
    const params = await context.params;
    const { id: questionId } = params;

    const body = await req.json();
    const { answerValue } = body;

    if (!answerValue) {
      return NextResponse.json(
        { error: 'answerValue is required' },
        { status: 400 }
      );
    }

    await prisma.questionCorrectAnswer.deleteMany({
      where: { questionId }
    });

    const newAnswer = await prisma.questionCorrectAnswer.create({
      data: {
        questionId,
        answerValue: JSON.stringify(answerValue),
        isPrimary: true
      }
    });

    return NextResponse.json({ success: true, data: newAnswer });

  } catch (error: any) {
    console.error('Failed to save correct answer:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
