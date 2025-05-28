import type { Question, Subject, Grade } from '@/lib/types';
import { elaQuestionsByGrade } from '@/data/ela-questions';
import { mathQuestionsByGrade } from '@/data/math-questions';

export function getQuestions(subject: Subject, grade: Grade): Question[] {
  if (subject === 'ELA') {
    return elaQuestionsByGrade[grade] || [];
  } else if (subject === 'Math') {
    return mathQuestionsByGrade[grade] || [];
  }
  return [];
}

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
