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
  text: string;
  isCorrect?: boolean; 
}

export interface MatchingColumn {
  title: string;
  items: string[];
}

export interface Question {
  id: number | string; // Changed to allow string for Prisma CUIDs, or number if mapped
  id_prisma?: string; // Explicitly store Prisma's CUID if needed alongside a numeric ID
  type: QuestionType;
  question: string;
  passage?: string;
  image?: string; 
  options?: string[]; 
  correctAnswer?: string | string[]; 
  category?: string; 
  blanks?: string[]; 
  columns?: MatchingColumn[]; 
  isDrawing?: boolean; 
  drawingQuestion?: boolean;
  dataAihint?: string; // Added from static data, used in QuestionDisplay
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
}

export interface ParentUser {
  email: string;
  id: string;
  // other parent details if needed
}

export type UserRole = 'parent' | 'child' | null;

export interface AuthState {
  isAuthenticated: boolean;
  user: ParentUser | ChildInformation | null;
  role: UserRole;
  isLoading: boolean;
}

export interface AssessmentResultAnswer {
  questionId: number | string; // Allow string for Prisma CUIDs
  userAnswer: string | string[]; 
  correctAnswer: string | string[] | undefined; // Made undefined possible as per usage
  isCorrect: boolean;
}

