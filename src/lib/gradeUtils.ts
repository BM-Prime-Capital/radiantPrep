import type { Grade } from '@/lib/types';

export function dbGradeToAppGrade(dbGrade: string): Grade {
  const gradeMap: Record<string, Grade> = {
    'GRADE_1': 1,
    'GRADE_2': 2,
    'GRADE_3': 3,
    'GRADE_4': 4,
    'GRADE_5': 5,
    'GRADE_6': 6,
    'GRADE_7': 7,
    'GRADE_8': 8
  };

  if (!(dbGrade in gradeMap)) {
    throw new Error(`Invalid database grade format: ${dbGrade}`);
  }

  return gradeMap[dbGrade];
}

export function appGradeToDbGrade(grade: Grade): string {
  return `GRADE_${grade}`;
}