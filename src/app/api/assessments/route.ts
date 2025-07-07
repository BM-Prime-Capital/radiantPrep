import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import type { SubjectName, GradeLevel, PrismaQuestionType } from '@prisma/client';
import { getSession } from '@/lib/session';

const prisma = new PrismaClient();

function evaluateInteractiveAnswer(
  type: PrismaQuestionType,
  userAnswerRaw: string,
  correctAnswerRaw: string
): boolean {
  try {
    // 1. Validation des entrées
    if (!userAnswerRaw || !correctAnswerRaw) {
      console.warn("Missing answer data");
      return false;
    }

    // 2. Parsing de la réponse utilisateur
    let userAnswer;
    try {
      userAnswer = JSON.parse(userAnswerRaw);
      // Cas où la réponse serait une chaîne JSON encodée doublement
      if (typeof userAnswer === 'string') {
        userAnswer = JSON.parse(userAnswer);
      }
    } catch (err) {
      console.warn("Invalid user answer format:", userAnswerRaw);
      return false;
    }

    // 3. Parsing de la réponse correcte
    let correctAnswer;
    try {
      correctAnswer = JSON.parse(correctAnswerRaw);
      // Cas où la correction serait une chaîne JSON encodée doublement
      if (typeof correctAnswer === 'string') {
        correctAnswer = JSON.parse(correctAnswer);
      }
    } catch (err) {
      console.warn("Invalid correct answer format:", correctAnswerRaw);
      return false;
    }

    // 4. Validation des types après parsing
    if (!Array.isArray(userAnswer) || !Array.isArray(correctAnswer)) {
      console.warn("Answers should be arrays");
      return false;
    }

    // 5. Évaluation selon le type de question
    switch (type) {
      case 'DRAWING':
        return evaluateDrawingAnswer(userAnswer, correctAnswer);
      case 'MATCHING':
        return evaluateMatchingAnswer(userAnswer, correctAnswer);
      case 'PATTERN':
        return evaluatePatternAnswer(userAnswer, correctAnswer);
      default:
        console.warn("Unsupported question type:", type);
        return false;
    }
  } catch (err) {
    console.error("Evaluation error:", err);
    return false;
  }
}


function evaluateDrawingAnswer(user: any[], correct: any[]): boolean {
  if (user.length !== correct.length) return false;

  return user.every((u, i) => {
    const c = correct[i];
    if (!u || !c) return false;

    // Tolérance de 20px pour la position et 15px pour le rayon
    const positionTolerance = 20;
    const radiusTolerance = 15;

    const positionMatch =
      Math.abs(u.x - c.x) < positionTolerance &&
      Math.abs(u.y - c.y) < positionTolerance;

    const radiusMatch =
      (u.radius === undefined || c.radius === undefined)
        ? true
        : Math.abs(u.radius - c.radius) < radiusTolerance;

    return positionMatch && radiusMatch;
  });
}

function evaluateMatchingAnswer(user: any[], correct: any[]): boolean {
  if (user.length !== correct.length) return false;

  return user.every((u, i) => {
    const c = correct[i];
    if (!u?.points || !c?.points) return false;

    // Tolérance de 20px pour les points des lignes
    const tolerance = 20;
    return (
      Math.abs(u.points[0] - c.points[0]) < tolerance &&
      Math.abs(u.points[1] - c.points[1]) < tolerance &&
      Math.abs(u.points[2] - c.points[2]) < tolerance &&
      Math.abs(u.points[3] - c.points[3]) < tolerance
    );
  });
}

function evaluatePatternAnswer(user: any[], correct: any[]): boolean {
  if (user.length !== correct.length) return false;

  return user.every((u, i) => {
    const c = correct[i];
    return u?.type === c?.type;
  });
}

export async function POST(request: Request) {
  try {
    const session = await getSession(request);
    if (!session?.userId) {
      return NextResponse.json(
        { error: 'Session expired. Please login again.' },
        {
          status: 401,
          headers: {
            'Set-Cookie': `session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
          },
        }
      );
    }

    await prisma.session.update({
      where: { id: session.id },
      data: { expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) },
    });

    const { subject, grade, score, totalQuestions, answers, childUserId, parentUserId } = await request.json();

    if (!childUserId && !parentUserId) {
      return NextResponse.json(
        { error: 'Either childUserId or parentUserId is required' },
        { status: 400 }
      );
    }

    const isChildSubmission = !!childUserId;
    const submittingUserId = isChildSubmission ? childUserId : parentUserId;

    const user = await prisma.user.findUnique({
      where: { id: submittingUserId },
      select: { role: true, parentId: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (isChildSubmission && user.role !== 'CHILD') {
      return NextResponse.json({ error: 'Submitted user is not a child account' }, { status: 400 });
    }

    if (!isChildSubmission && user.role !== 'PARENT') {
      return NextResponse.json({ error: 'Submitted user is not a parent account' }, { status: 400 });
    }

    const parentId = isChildSubmission ? user.parentId : submittingUserId;

    const formattedAnswers = await Promise.all(
      answers.map(async (answer: any) => {
        const question = await prisma.question.findUnique({
          where: { id: answer.questionId },
          include: { correctAnswers: true },
        });

        if (!question) return null;

        const correctAnswer = question.correctAnswers[0]?.answerValue ?? "";

        const isCorrect = ['DRAWING', 'MATCHING', 'PATTERN'].includes(question.questionType)
          ? evaluateInteractiveAnswer(question.questionType, JSON.stringify(answer.userAnswer), correctAnswer)
          : answer.isCorrect;

        console.log(`Evaluating question ${answer.questionId}:`, {
          type: question.questionType,
          userAnswer: answer.userAnswer,
          correctAnswer,
          isCorrect,
        });

        return {
          questionId: answer.questionId,
          userAnswer: Array.isArray(answer.userAnswer)
            ? JSON.stringify(answer.userAnswer)
            : answer.userAnswer,
          isCorrect,
        };
      })
    );

    const assessment = await prisma.assessment.create({
      data: {
        parentUserId: parentId,
        childUserId: isChildSubmission ? submittingUserId : null,
        userRole: isChildSubmission ? 'CHILD' : 'PARENT',
        subjectName: subject,
        gradeLevel: `GRADE_${grade}` as GradeLevel,
        score,
        totalQuestions,
        answers: {
          create: formattedAnswers.filter(Boolean),
        },
      },
      include: {
        answers: true,
      },
    });

    return NextResponse.json(assessment);
  } catch (error: any) {
    console.error('Error creating assessment:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create assessment' },
      { status: 500 }
    );
  }
}
