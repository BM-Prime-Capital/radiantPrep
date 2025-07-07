import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import type { SubjectName, GradeLevel, PrismaQuestionType } from '@prisma/client';
import { getSession } from '@/lib/session';

const prisma = new PrismaClient();

function evaluateInteractiveAnswer(
  type: PrismaQuestionType,
  userAnswerRaw: any,
  correctAnswerRaw: string
): boolean {
  try {
    console.log(`🔍 Évaluation de la question ${type}:`, { userAnswerRaw, correctAnswerRaw });

    // 1. Validation des entrées
    if (!userAnswerRaw || !correctAnswerRaw) {
      console.warn("Données de réponse manquantes");
      return false;
    }

    // 2. Traitement de la réponse utilisateur
    let userAnswer = userAnswerRaw;
    if (typeof userAnswer === 'string') {
      try {
        userAnswer = JSON.parse(userAnswer);
      } catch (err) {
        console.warn("Format de réponse utilisateur invalide:", userAnswerRaw);
        return false;
      }
    }

    // 3. Parsing de la réponse correcte
    let correctAnswer;
    try {
      correctAnswer = JSON.parse(correctAnswerRaw);
      if (typeof correctAnswer === 'string') {
        correctAnswer = JSON.parse(correctAnswer);
      }
    } catch (err) {
      console.warn("Format de réponse correcte invalide:", correctAnswerRaw);
      return false;
    }

    // 4. Validation des types après parsing
    if (!Array.isArray(userAnswer)) {
      console.warn("La réponse utilisateur doit être un tableau");
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
        console.warn("Type de question non supporté:", type);
        return false;
    }
  } catch (err) {
    console.error("Erreur d'évaluation:", err);
    return false;
  }
}

function evaluateDrawingAnswer(user: any[], correct: any): boolean {
  console.log(`🎨 Évaluation DRAWING:`, { user, correct });
  
  // Si correct est un objet avec une propriété circles
  let correctCircles = correct;
  if (correct && typeof correct === 'object' && correct.circles) {
    correctCircles = correct.circles;
  }
  
  if (!Array.isArray(correctCircles)) {
    console.warn("Format de réponse correcte invalide pour DRAWING");
    return false;
  }

  if (user.length !== correctCircles.length) {
    console.log(`Nombre de cercles différent: utilisateur=${user.length}, correct=${correctCircles.length}`);
    return false;
  }

  const positionTolerance = 30; // Augmenté pour plus de flexibilité
  const radiusTolerance = 20;

  return user.every((u, i) => {
    const c = correctCircles[i];
    if (!u || !c) return false;

    const positionMatch =
      Math.abs(u.x - c.x) < positionTolerance &&
      Math.abs(u.y - c.y) < positionTolerance;

    const radiusMatch =
      (u.radius === undefined || c.radius === undefined) ||
      Math.abs(u.radius - c.radius) < radiusTolerance;

    const typeMatch = !c.type || u.type === c.type;

    console.log(`Cercle ${i}: position=${positionMatch}, rayon=${radiusMatch}, type=${typeMatch}`);
    
    return positionMatch && radiusMatch && typeMatch;
  });
}

function evaluateMatchingAnswer(user: any[], correct: any[]): boolean {
  console.log(`🔗 Évaluation MATCHING:`, { user, correct });
  
  if (!Array.isArray(correct)) {
    console.warn("Format de réponse correcte invalide pour MATCHING");
    return false;
  }

  if (user.length !== correct.length) {
    console.log(`Nombre de lignes différent: utilisateur=${user.length}, correct=${correct.length}`);
    return false;
  }

  const tolerance = 30; // Tolérance pour les points des lignes

  return user.every((u, i) => {
    const c = correct[i];
    if (!u?.points || !c?.points) return false;

    // Vérifier que les deux lignes ont au moins 4 points (début et fin)
    if (u.points.length < 4 || c.points.length < 4) return false;

    const match = (
      Math.abs(u.points[0] - c.points[0]) < tolerance &&
      Math.abs(u.points[1] - c.points[1]) < tolerance &&
      Math.abs(u.points[2] - c.points[2]) < tolerance &&
      Math.abs(u.points[3] - c.points[3]) < tolerance
    );

    console.log(`Ligne ${i}: ${match ? 'correcte' : 'incorrecte'}`);
    return match;
  });
}

function evaluatePatternAnswer(user: any[], correct: any[]): boolean {
  console.log(`🔺 Évaluation PATTERN:`, { user, correct });
  
  if (!Array.isArray(correct)) {
    console.warn("Format de réponse correcte invalide pour PATTERN");
    return false;
  }

  if (user.length !== correct.length) {
    console.log(`Nombre de formes différent: utilisateur=${user.length}, correct=${correct.length}`);
    return false;
  }

  const positionTolerance = 25;

  return user.every((u, i) => {
    const c = correct[i];
    if (!u || !c) return false;

    const typeMatch = u.type === c.type;
    const positionMatch = 
      Math.abs(u.x - c.x) < positionTolerance &&
      Math.abs(u.y - c.y) < positionTolerance;

    console.log(`Forme ${i}: type=${typeMatch}, position=${positionMatch}`);
    return typeMatch && positionMatch;
  });
}

export async function POST(request: Request) {
  try {
    const session = await getSession(request);
    if (!session?.userId) {
      return NextResponse.json(
        { error: 'Session expirée. Veuillez vous reconnecter.' },
        {
          status: 401,
          headers: {
            'Set-Cookie': `session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
          },
        }
      );
    }

    // Prolonger la session
    await prisma.session.update({
      where: { id: session.id },
      data: { expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) },
    });

    const { subject, grade, score, totalQuestions, answers, childUserId, parentUserId } = await request.json();

    if (!childUserId && !parentUserId) {
      return NextResponse.json(
        { error: 'childUserId ou parentUserId est requis' },
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
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }

    if (isChildSubmission && user.role !== 'CHILD') {
      return NextResponse.json({ error: 'L\'utilisateur soumis n\'est pas un compte enfant' }, { status: 400 });
    }

    if (!isChildSubmission && user.role !== 'PARENT') {
      return NextResponse.json({ error: 'L\'utilisateur soumis n\'est pas un compte parent' }, { status: 400 });
    }

    const parentId = isChildSubmission ? user.parentId : submittingUserId;

    // Recalcul du score pour les questions interactives
    let recalculatedScore = 0;

    const formattedAnswers = await Promise.all(
      answers.map(async (answer: any) => {
        const question = await prisma.question.findUnique({
          where: { id: answer.questionId },
          include: { correctAnswers: true },
        });

        if (!question) {
          console.warn(`Question ${answer.questionId} non trouvée`);
          return null;
        }

        const correctAnswer = question.correctAnswers[0]?.answerValue ?? "";

        let isCorrect = answer.isCorrect;

        // Réévaluation pour les questions interactives
        if (['DRAWING', 'MATCHING', 'PATTERN'].includes(question.questionType)) {
          isCorrect = evaluateInteractiveAnswer(
            question.questionType, 
            answer.userAnswer, 
            correctAnswer
          );
          console.log(`✅ Question ${answer.questionId} réévaluée: ${isCorrect}`);
        }

        if (isCorrect) {
          recalculatedScore++;
        }

        return {
          questionId: answer.questionId,
          userAnswer: Array.isArray(answer.userAnswer)
            ? JSON.stringify(answer.userAnswer)
            : typeof answer.userAnswer === 'object'
            ? JSON.stringify(answer.userAnswer)
            : answer.userAnswer,
          isCorrect,
        };
      })
    );

    const validAnswers = formattedAnswers.filter(Boolean);

    console.log(`📊 Score final: ${recalculatedScore}/${totalQuestions} (original: ${score})`);

    const assessment = await prisma.assessment.create({
      data: {
        parentUserId: parentId,
        childUserId: isChildSubmission ? submittingUserId : null,
        userRole: isChildSubmission ? 'CHILD' : 'PARENT',
        subjectName: subject,
        gradeLevel: `GRADE_${grade}` as GradeLevel,
        score: recalculatedScore, // Utiliser le score recalculé
        totalQuestions,
        answers: {
          create: validAnswers,
        },
      },
      include: {
        answers: true,
      },
    });

    return NextResponse.json(assessment);
  } catch (error: any) {
    console.error('Erreur lors de la création de l\'évaluation:', error);
    return NextResponse.json(
      { error: error.message || 'Échec de la création de l\'évaluation' },
      { status: 500 }
    );
  }
}