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

export interface QuestionOption {
  text: string;
  isCorrect?: boolean; // For multiple choice, if needed directly here
}

export interface MatchingColumn {
  title: string;
  items: string[];
}

export interface Question {
  id: number;
  type: QuestionType;
  question: string;
  passage?: string;
  image?: string; // URL for an image related to the question
  options?: string[]; // For MULTIPLE_CHOICE, IMAGE_CHOICE
  correctAnswer?: string | string[]; // Single answer or array for multiple correct (e.g., text, fill-in-blank)
  category?: string; // E.g., "Reading Comprehension"
  
  // Specific to QuestionType.FILL_IN_THE_BLANK or FILL_IN
  blanks?: string[]; // Array of placeholder texts for blanks, e.g., ["A duck can fly with his wi__gs."]
                      // The actual answer would be in correctAnswer as an array.

  // Specific to QuestionType.MATCHING or WORD_SORT
  columns?: MatchingColumn[]; // For matching questions

  // Specific to QuestionType.DRAWING or PATTERN (might be used to describe the task if no image)
  isDrawing?: boolean; 
  drawingQuestion?: boolean; // from math data

  // Specific to QuestionType.COMPARISON for Math
  comparisonValues?: string[];
}

export interface ChildInformation {
  childName: string;
  grade: Grade;
  subject: Subject;
  accessCode: string;
}

export interface ParentUser {
  email: string;
  // other parent details if needed
}

export type UserRole = 'parent' | 'child' | null;

export interface AuthState {
  isAuthenticated: boolean;
  user: ParentUser | ChildInformation | null;
  role: UserRole;
  isLoading: boolean;
}

export interface AssessmentResult {
  score: number;
  totalQuestions: number;
  answers: { questionId: number; userAnswer: string | string[]; correctAnswer: string | string[]; isCorrect: boolean }[];
  subject: Subject;
  grade: Grade;
}
