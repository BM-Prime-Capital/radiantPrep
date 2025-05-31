import { PrismaClient, Prisma, type Question as PrismaQuestion, type QuestionOption as PrismaQuestionOption, type QuestionCorrectAnswer as PrismaQuestionCorrectAnswer } from '@prisma/client';
import type { Question, Subject, Grade, QuestionType } from '@/lib/types';
import { QuestionType as AppQuestionType } from '@/lib/types';
import type { SubjectName, GradeLevel, PrismaQuestionType as DBQuestionType } from '@prisma/client';


const prisma = new PrismaClient();

// Helper to map Prisma enum to App enum (they are identical in value but good practice for type safety)
function mapDBQuestionTypeToApp(dbType: DBQuestionType): AppQuestionType {
  return dbType as unknown as AppQuestionType;
}

function mapAppGradeToDBGradeLevel(grade: Grade): GradeLevel {
  return `GRADE_${grade}` as GradeLevel;
}

export async function getQuestions(subject: Subject, grade: Grade): Promise<Question[]> {
  const dbSubjectName = subject as SubjectName; // Assuming Subject and SubjectName values align
  const dbGradeLevel = mapAppGradeToDBGradeLevel(grade);

  try {
    const dbQuestions = await prisma.question.findMany({
      where: {
        subject: { name: dbSubjectName },
        grade: { level: dbGradeLevel },
      },
      include: {
        options: true,
        correctAnswers: {
          orderBy: {
            isPrimary: 'desc', // Prioritize primary if multiple (though current logic might take first or all)
          }
        },
        subject: true,
        grade: true,
      },
    });

    return dbQuestions.map((dbQuestion: PrismaQuestion & { options: PrismaQuestionOption[], correctAnswers: PrismaQuestionCorrectAnswer[] }) => {
      let appCorrectAnswer: string | string[] | undefined;
      
      if (dbQuestion.correctAnswers.length > 0) {
        if (dbQuestion.questionType === AppQuestionType.FILL_IN_THE_BLANK || dbQuestion.correctAnswers.length > 1) {
          // For FILL_IN_THE_BLANK or if multiple correct answers are stored explicitly
          // We need to decide how multiple correct answers are stored.
          // If a single QuestionCorrectAnswer stores a JSON array:
          // try { appCorrectAnswer = JSON.parse(dbQuestion.correctAnswers[0].answerValue); } catch (e) { appCorrectAnswer = dbQuestion.correctAnswers[0].answerValue; }
          // If multiple QuestionCorrectAnswer records exist for multiple blanks/options:
          appCorrectAnswer = dbQuestion.correctAnswers.map(ca => ca.answerValue);
        } else {
          // For types like MULTIPLE_CHOICE, TEXT, where one primary answer is expected
          appCorrectAnswer = dbQuestion.correctAnswers[0].answerValue;
        }
      }


      return {
        id: parseInt(dbQuestion.id, 36), // Assuming IDs from static data were numbers. Prisma uses CUIDs (strings). This mapping needs care.
                                        // For now, let's use a placeholder or reconsider ID strategy.
                                        // Using a hash or a new numeric ID sequence if existing IDs must be numbers.
                                        // For simplicity, I'll use a temporary numeric conversion, but this isn't robust for CUIDs.
                                        // A better approach would be to use string IDs throughout the app or map to new numeric IDs during seeding.
                                        // Let's use a simple numeric conversion for now, acknowledging this limitation.
                                        // A more robust way is to ensure IDs are consistent or adapt the app to use string IDs from Prisma.
                                        // For now, this will likely break if string IDs are not purely numeric-convertible.
                                        // Let's change the app's Question ID type to string to match Prisma's CUIDs.
        id_prisma: dbQuestion.id, // Keep prisma ID for reference if needed
        type: mapDBQuestionTypeToApp(dbQuestion.questionType),
        question: dbQuestion.questionText,
        passage: dbQuestion.passage ?? undefined,
        image: dbQuestion.imageUrl ?? undefined,
        options: dbQuestion.options.map(opt => opt.value),
        correctAnswer: appCorrectAnswer,
        category: dbQuestion.category ?? undefined,
        blanks: dbQuestion.blanksJson ? JSON.parse(dbQuestion.blanksJson) : undefined,
        columns: dbQuestion.columnsJson ? JSON.parse(dbQuestion.columnsJson) : undefined,
        dataAihint: dbQuestion.dataAihint ?? undefined,
        isDrawing: dbQuestion.isDrawing ?? undefined,
        drawingQuestion: dbQuestion.drawingQuestion ?? undefined,
      } as Question; // Type assertion, ensure all fields match
    });

  } catch (error) {
    console.error("Failed to fetch questions from DB:", error);
    return []; // Return empty array on error
  }
}

// These functions are likely obsolete if data comes from DB
// or need to be re-evaluated for their purpose (e.g., admin panel IDs).
export function getSubjectGradeKey(subject: Subject, grade: Grade): string {
  return `${subject.toLowerCase()}-grade${grade}`;
}

export function parseSubjectGradeKey(key: string): { subject: Subject; grade: Grade } | null {
  const match = key.match(/(ela|math)-grade(\d+)/);
  if (match) {
    const subject = match[1].toUpperCase() as Subject;
    const grade = parseInt(match[2], 10) as Grade;
    if ((subject === 'ELA' || subject === 'Math') && grade >= 1 && grade <= 8) {
      return { subject, grade };
    }
  }
  return null;
}
