export enum QuestionType {
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  TEXT = "TEXT", // Single line text input
  FILL_IN_THE_BLANK = "FILL_IN_THE_BLANK", // One or more blanks to fill
  WRITING = "WRITING", // Longer text input, like an essay
  IMAGE_CHOICE = "IMAGE_CHOICE", // Multiple choice with a primary image
  
  // More complex types - may need simplified rendering
  DRAWING = "DRAWING", // User needs to draw - placeholder for now
  PATTERN = "PATTERN", // User needs to complete a pattern - placeholder for now
  MATCHING = "MATCHING", // User needs to match items - placeholder for now
  CLOCK = "CLOCK", // User needs to read/set time - placeholder for now
  COMPARISON = "COMPARISON", // User needs to compare values (e.g., >, <, =) - placeholder for now
  GRAMMAR = "GRAMMAR", // Correcting sentences, etc. - can be TEXT or FILL_IN_THE_BLANK
  WORD_SORT = "WORD_SORT", // Sorting words into categories - placeholder for now
  FRACTION = "FRACTION" // Questions involving fractions - placeholder for now
}

export type Subject = "ELA" | "Math";
export type Grade = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface QuestionOption { // This type seems unused if options are string[] in Question
  image?: string;
  text: string;
  isCorrect?: boolean; 
}

export interface MatchingColumn {
  title: string;
  items: string[];
}
export interface Question {
  id: number | string;
  id_prisma?: string;
  type: QuestionType;
  question: string;
  passage?: string;
  image?: string;
  options?: (string | QuestionOption)[];
  correctAnswer?: string | number | string[];
  category?: string;
  blanks?: string[];
  columns?: MatchingColumn[];
  isDrawing?: boolean;
  drawingQuestion?: boolean;
  dataAihint?: string;
}

// Avec un type guard pour vérifier le format
export function isQuestionOptionObject(option: any): option is QuestionOption {
  return typeof option === 'object' && 'text' in option;
}

export type AssessmentResult = {
  id?: string;
  score: number;
  totalQuestions: number;
  answers: AssessmentResultAnswer[];
  subject: Subject;
  grade: Grade;
  takenAt?: string;
};

export interface AssessmentResultAnswer {
  questionId: number | string;
  userAnswer: string | string[];
  correctAnswer: string | string[] | number | undefined; // Ajout de number
  isCorrect: boolean;
}


export interface CanvasSize {
  width: number;
  height: number;
}


export interface ChildInformation {
  childName: string;
  grade: Grade;
  subject: Subject;
  accessCode: string;
  id: string;
  currentSubject?: Subject;
  avatarUrl?: string;
}

export interface ParentUser {
  email: string;
  id: string;
  avatarUrl?: string; 
}

export type UserRole = 'parent' | 'child' | null;

export interface AuthState {
  isAuthenticated: boolean;
  user: ParentUser | ChildInformation | null;
  role: UserRole;
  isLoading: boolean;
}


export function isChild(user: ParentUser | ChildInformation | null): user is ChildInformation {
  return !!user && 'childName' in user && 'grade' in user && 'subject' in user;
}


export interface Assessment {
  id: string;
  subjectName: string;
  gradeLevel: string;
  score: number;
  totalQuestions: number;
  takenAt: string;
  childUser?: {
    childName: string;
    grade: string;
    currentSubject?: string;
  };
}

export interface AssessmentStats {
  totalAssessments: number;
  averageScore: number;
  currentStreak: number;
  lastAssessmentDate: string | null;
}



