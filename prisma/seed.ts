import { PrismaClient, PrismaQuestionType, SubjectName, GradeLevel } from '@prisma/client';
import { elaQuestionsByGrade } from '../src/lib/ela-questions';
import { mathQuestionsByGrade } from '../src/lib/math-questions';

const prisma = new PrismaClient();

// Définir le type QuestionType si nécessaire (identique à celui dans votre app)
enum QuestionType {
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TEXT = 'TEXT',
  FILL_IN_THE_BLANK = 'FILL_IN_THE_BLANK',
  WRITING = 'WRITING',
  IMAGE_CHOICE = 'IMAGE_CHOICE',
  DRAWING = 'DRAWING',
  PATTERN = 'PATTERN',
  MATCHING = 'MATCHING',
  CLOCK = 'CLOCK',
  COMPARISON = 'COMPARISON',
  GRAMMAR = 'GRAMMAR',
  WORD_SORT = 'WORD_SORT',
  FRACTION = 'FRACTION'
}

async function main() {
  console.log('Starting seed process...');

  // Create subjects
  const elaSubject = await prisma.subject.upsert({
    where: { name: SubjectName.ELA },
    update: {},
    create: { name: SubjectName.ELA },
  });

  const mathSubject = await prisma.subject.upsert({
    where: { name: SubjectName.Math },
    update: {},
    create: { name: SubjectName.Math },
  });

  console.log('Subjects created');

  // Create grades
  const gradeLevels = [
    GradeLevel.GRADE_1,
    GradeLevel.GRADE_2,
    GradeLevel.GRADE_3,
    GradeLevel.GRADE_4,
    GradeLevel.GRADE_5,
    GradeLevel.GRADE_6,
    GradeLevel.GRADE_7,
    GradeLevel.GRADE_8,
  ];

  const grades = await Promise.all(
    gradeLevels.map((level) =>
      prisma.grade.upsert({
        where: { level },
        update: {},
        create: { level },
      })
    )
  );

  console.log('Grades created');

  // Seed ELA questions
  for (const [gradeNum, questions] of Object.entries(elaQuestionsByGrade)) {
    const gradeLevel = `GRADE_${gradeNum}` as GradeLevel;
    const grade = grades.find((g) => g.level === gradeLevel);
    
    if (!grade) {
      console.warn(`Grade ${gradeLevel} not found, skipping ELA questions`);
      continue;
    }

    console.log(`Seeding ELA questions for grade ${gradeNum}`);
    
    for (const questionData of questions) {
      await createQuestion(questionData, elaSubject.id, grade.id);
    }
  }

  // Seed Math questions
  for (const [gradeNum, questions] of Object.entries(mathQuestionsByGrade)) {
    const gradeLevel = `GRADE_${gradeNum}` as GradeLevel;
    const grade = grades.find((g) => g.level === gradeLevel);
    
    if (!grade) {
      console.warn(`Grade ${gradeLevel} not found, skipping Math questions`);
      continue;
    }

    console.log(`Seeding Math questions for grade ${gradeNum}`);
    
    for (const questionData of questions) {
      await createQuestion(questionData, mathSubject.id, grade.id);
    }
  }

  console.log('Seed completed successfully');
}

async function createQuestion(questionData: any, subjectId: string, gradeId: string) {
  // Type mapping
  const typeMap: Record<string, PrismaQuestionType> = {
    MULTIPLE_CHOICE: PrismaQuestionType.MULTIPLE_CHOICE,
    TEXT: PrismaQuestionType.TEXT,
    FILL_IN_THE_BLANK: PrismaQuestionType.FILL_IN_THE_BLANK,
    WRITING: PrismaQuestionType.WRITING,
    IMAGE_CHOICE: PrismaQuestionType.IMAGE_CHOICE,
    DRAWING: PrismaQuestionType.DRAWING,
    PATTERN: PrismaQuestionType.PATTERN,
    MATCHING: PrismaQuestionType.MATCHING,
    CLOCK: PrismaQuestionType.CLOCK,
    COMPARISON: PrismaQuestionType.COMPARISON,
    GRAMMAR: PrismaQuestionType.GRAMMAR,
    WORD_SORT: PrismaQuestionType.WORD_SORT,
    FRACTION: PrismaQuestionType.FRACTION,
  };

    // Vérifier si la question existe déjà
  const existingQuestion = await prisma.question.findFirst({
    where: {
      questionText: questionData.question,
      gradeId: gradeId,
      subjectId: subjectId
    },
    include: {
      options: true,
      correctAnswers: true
    }
  });

  // Si la question existe déjà, on la saute
  if (existingQuestion) {
    console.log(`Question déjà existante: "${questionData.question}" - Skipping`);
    return existingQuestion;
  }

  const questionType = typeMap[questionData.type] || PrismaQuestionType.MULTIPLE_CHOICE;

  // Prepare JSON fields
  const blanksJson = questionData.blanks ? JSON.stringify(questionData.blanks) : null;
  const columnsJson = questionData.columns ? JSON.stringify(questionData.columns) : null;

  // Create question
  const question = await prisma.question.create({
    data: {
      questionType,
      questionText: questionData.question,
      passage: questionData.passage || null,
      imageUrl: questionData.image || null,
      category: questionData.category || null,
      blanksJson,
      columnsJson,
      dataAihint: questionData.dataAihint || null,
      isDrawing: questionData.isDrawing || false,
      drawingQuestion: questionData.drawingQuestion || false,
      subjectId,
      gradeId,
    },
  });

  // Create options if they exist
  if (questionData.options && Array.isArray(questionData.options)) {
    await Promise.all(
      questionData.options.map((option: string) =>
        prisma.questionOption.create({
          data: {
            value: option,
            questionId: question.id,
          },
        })
      )
    );
  }

  // Handle correct answers (can be string or array)
  let correctAnswers: any[] = [];
  if (Array.isArray(questionData.correctAnswer)) {
    correctAnswers = questionData.correctAnswer;
  } else if (questionData.correctAnswer !== undefined) {
    correctAnswers = [questionData.correctAnswer];
  }

  // Create correct answers
  if (correctAnswers.length > 0) {
    await Promise.all(
      correctAnswers.map((answer: string, index: number) => {
        // For complex answers (like matching), convert to string if needed
        const answerValue = typeof answer === 'object' ? JSON.stringify(answer) : String(answer);
        return prisma.questionCorrectAnswer.create({
          data: {
            answerValue,
            isPrimary: index === 0,
            questionId: question.id,
          },
        });
      })
    );
  }
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });