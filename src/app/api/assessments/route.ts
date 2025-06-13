import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import type { SubjectName, GradeLevel } from '@prisma/client';
import { getSession } from '@/lib/session';

const prisma = new PrismaClient();
export async function POST(request: Request) {
  try {
    const session = await getSession(request);
    if (!session?.userId) {
      return NextResponse.json(
        { error: 'Session expired. Please login again.' },
        { status: 401, headers: { 'Set-Cookie': `session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT` } }
      );
    }

    // Refresh session
    await prisma.session.update({
      where: { id: session.id },
      data: { expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) }
    });

    const { subject, grade, score, totalQuestions, answers, childUserId, parentUserId } = await request.json();

    // Validate required fields - now accepts either child or parent
    if (!childUserId && !parentUserId) {
      return NextResponse.json(
        { error: 'Either childUserId or parentUserId is required' },
        { status: 400 }
      );
    }

    // Determine if this is a child or parent submission
    const isChildSubmission = !!childUserId;
    const submittingUserId = isChildSubmission ? childUserId : parentUserId;

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: submittingUserId },
      select: { role: true, parentId: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Validate role matches submission type
    if (isChildSubmission && user.role !== 'CHILD') {
      return NextResponse.json(
        { error: 'Submitted user is not a child account' },
        { status: 400 }
      );
    }

    if (!isChildSubmission && user.role !== 'PARENT') {
      return NextResponse.json(
        { error: 'Submitted user is not a parent account' },
        { status: 400 }
      );
    }

    // For child submissions, verify parent exists
    const parentId = isChildSubmission ? user.parentId : submittingUserId;

    // Create assessment
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
          create: answers.map((answer: any) => ({
            questionId: answer.questionId,
            userAnswer: Array.isArray(answer.userAnswer) 
              ? JSON.stringify(answer.userAnswer) 
              : answer.userAnswer,
            isCorrect: answer.isCorrect,
          })),
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