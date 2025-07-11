'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { type Question, type Subject, type Grade, type AssessmentResult, type ChildInformation, type ParentUser, QuestionType } from '@/lib/types';
import { QuestionDisplay } from '@/components/assessment/QuestionDisplay';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, ChevronRight, CheckSquare, BookOpen, Calculator, Trophy, Clock, Award } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

export default function AssessmentPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated, user, role, isLoading: authLoading, setAssessmentResult } = useAuth();
  const { toast } = useToast();

  const subject = params.subject as Subject;
  const grade = parseInt(params.grade as string) as Grade;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(string | string[] | undefined)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorLoadingQuestions, setErrorLoadingQuestions] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

   useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/auth/login');
      return;
    }

    async function fetchQuestions() {
      if (subject && grade) {
        try {
          setIsLoading(true);
          setErrorLoadingQuestions(null);
          const response = await fetch(
            `/api/questions?subject=${subject}&grade=${grade}`,
            {
              credentials: 'include' // Add this line
            }
          );
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const dbQuestions = await response.json();
          
          const fetchedQuestions = dbQuestions.map((dbQuestion: any) => {
            let appCorrectAnswer: string | string[] | undefined;
            
            if (dbQuestion.correctAnswers.length > 0) {
              if (dbQuestion.questionType === 'FILL_IN_THE_BLANK' || 
                  dbQuestion.correctAnswers.length > 1) {
                appCorrectAnswer = dbQuestion.correctAnswers.map((ca: any) => ca.answerValue);
              } else {
                appCorrectAnswer = dbQuestion.correctAnswers[0].answerValue;
              }
            }

            return {
              id: dbQuestion.id,
              id_prisma: dbQuestion.id,
              type: dbQuestion.questionType,
              question: dbQuestion.questionText,
              passage: dbQuestion.passage ?? undefined,
              image: dbQuestion.imageUrl ?? undefined,
              options: dbQuestion.options.map((opt: any) => opt.value),
              correctAnswer: appCorrectAnswer,
              category: dbQuestion.category ?? undefined,
              blanks: dbQuestion.blanksJson ? JSON.parse(dbQuestion.blanksJson) : undefined,
              columns: dbQuestion.columnsJson ? JSON.parse(dbQuestion.columnsJson) : undefined,
              dataAihint: dbQuestion.dataAihint ?? undefined,
              isDrawing: dbQuestion.isDrawing ?? undefined,
              drawingQuestion: dbQuestion.drawingQuestion ?? undefined,
            };
          });

          if (fetchedQuestions.length === 0) {
            toast({
              title: "No Questions",
              description: "No questions found for this subject/grade combination.",
              variant: "default"
            });
            setQuestions([]);
          } else {
            setQuestions(fetchedQuestions);
            setAnswers(new Array(fetchedQuestions.length).fill(undefined));
          }
        } catch (err) {
          console.error("Error fetching questions:", err);
          toast({
            title: "Error Loading Assessment",
            description: "Could not load questions. Please try again.",
            variant: "destructive"
          });
          setErrorLoadingQuestions("Failed to load questions.");
          setQuestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    }

    if (!authLoading && isAuthenticated) {
      fetchQuestions();
    }
  }, [subject, grade, isAuthenticated, authLoading, router, toast, role]);

  const handleAnswerChange = useCallback((answer: string | string[]) => {
    setAnswers(prevAnswers => {
      const newAnswers = [...prevAnswers];
      newAnswers[currentQuestionIndex] = answer;
      return newAnswers;
    });
    console.log(`🧠 Answer saved for Q${currentQuestionIndex}:`, answer);

  }, [currentQuestionIndex]);
  
  

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prevIndex => prevIndex - 1);
    }
  };

// const isAnswerCorrect = (question: Question, userAnswer: string | string[] | undefined) => {
//   if (question.type === 'DRAWING') {
//     if (!userAnswer || !Array.isArray(userAnswer)) return false;

//     try {
//       const parsed = JSON.parse(question.correctAnswer as string);
//       const correctCircles = parsed.circles ?? [];
//       const tolerance = 20; // pixels

//       if (correctCircles.length !== userAnswer.length) return false;

//       return correctCircles.every((correctCircle: any, i: number) => {
//         const userCircle = userAnswer[i] as any;
//         return (
//           Math.abs(correctCircle.x - userCircle.x) <= tolerance &&
//           Math.abs(correctCircle.y - userCircle.y) <= tolerance &&
//           Math.abs(correctCircle.radius - userCircle.radius) <= tolerance &&
//           correctCircle.type === userCircle.type
//         );
//       });
//     } catch (err) {
//       console.error("Correct answer parse error:", err);
//       return false;
//     }
//   }

//   // Fallback for all other types
//   if (userAnswer === undefined || question.correctAnswer === undefined) return false;

//   const normalize = (value: string | string[]): string[] => {
//     if (Array.isArray(value)) {
//       return value.map(v => (v || '').toString().trim().toLowerCase());
//     }
//     return [(value || '').toString().trim().toLowerCase()];
//   };

//   const correctAnswers = normalize(question.correctAnswer);
//   const userAnswers = normalize(userAnswer);

//   if (correctAnswers.length !== userAnswers.length) return false;

//   return correctAnswers.every((ca, i) => ca === userAnswers[i]);
// };


const isAnswerCorrect = (question: Question, userAnswer: string | string[] | undefined) => {
  // Handle undefined cases
  if (userAnswer === undefined || question.correctAnswer === undefined) return false;

  // Special handling for DRAWING type questions
  if (question.type === 'DRAWING') {
    if (!Array.isArray(userAnswer)) return false;

    try {
      const parsed = JSON.parse(question.correctAnswer as string);
      const correctCircles = parsed.circles ?? [];
      const tolerance = 20; // pixels

      if (correctCircles.length !== userAnswer.length) return false;

      return correctCircles.every((correctCircle: any, i: number) => {
        const userCircle = userAnswer[i] as any;
        return (
          Math.abs(correctCircle.x - userCircle.x) <= tolerance &&
          Math.abs(correctCircle.y - userCircle.y) <= tolerance &&
          Math.abs(correctCircle.radius - userCircle.radius) <= tolerance &&
          correctCircle.type === userCircle.type
        );
      });
    } catch (err) {
      console.error("Correct answer parse error:", err);
      return false;
    }
  }

  // Special handling for FILL_IN_THE_BLANK questions
  if (question.type === QuestionType.FILL_IN_THE_BLANK) {
    // Ensure both are arrays
    if (!Array.isArray(userAnswer)) {
      // If userAnswer is a string, split it into array
      const userAnswers = typeof userAnswer === 'string' 
        ? userAnswer.split(',').map(a => a.trim())
        : [userAnswer?.toString() || ''];
      return isAnswerCorrect(question, userAnswers);
    }

    if (!Array.isArray(question.correctAnswer)) {
      return false;
    }

    // Compare each answer positionally
    return question.correctAnswer.every((correctAns, index) => {
      const userAns = userAnswer[index] || '';
      return correctAns.toString().trim().toLowerCase() === userAns.toString().trim().toLowerCase();
    });
  }

  // Normalize answers for all other question types
  const normalize = (value: string | string[]): string[] => {
    if (Array.isArray(value)) {
      return value.map(v => (v || '').toString().trim().toLowerCase());
    }
    return [(value || '').toString().trim().toLowerCase()];
  };

  const correctAnswers = normalize(question.correctAnswer);
  const userAnswers = normalize(userAnswer);

  // For non-array answers, compare directly
  if (!Array.isArray(question.correctAnswer)) {
    return correctAnswers[0] === userAnswers[0];
  }

  // For array answers, compare length and content
  if (correctAnswers.length !== userAnswers.length) return false;

  return correctAnswers.every((ca, i) => ca === userAnswers[i]);
};


const handleSubmitAssessment = async () => {
    setIsSubmitting(true); // Add this line
    setSubmitError(null);
  try {
    if (!user || !role) {
      throw new Error('User information not available');
    }

    // For child users, ensure we have their ID
    if (role === 'child') {
      if (!user || typeof user !== 'object' || !('id' in user)) {
        throw new Error('Invalid child user data');
      }
    }

    const sessionCheck = await fetch('/api/auth/check-session', {
      credentials: 'include'
    });

    if (!sessionCheck.ok) {
      throw new Error('Session validation failed');
    }

    // Calculate score and prepare answers
    const detailedAnswers = questions.map((question, index) => {
      const userAnswer = answers[index] ?? ""; // Provide default empty string if undefined

      // Ensure userAnswer is treated as a string or array of strings
      const normalizedUserAnswer = Array.isArray(userAnswer)
  ? userAnswer.map(a => typeof a === 'string' ? a.trim().toLowerCase() : a)
  : typeof userAnswer === 'string' ? userAnswer.trim().toLowerCase() : userAnswer;


      const correct = isAnswerCorrect(question, userAnswer);

      return {
        questionId: question.id_prisma || question.id,
        userAnswer: normalizedUserAnswer,
        isCorrect: correct,
      };
    });

    console.log("📦 Submitting answers:", detailedAnswers);


    const score = detailedAnswers.filter(answer => answer.isCorrect).length;

    // Prepare submission data - now ensures childUserId is always provided for children
    const submissionData = {
      subject,
      grade,
      score,
      totalQuestions: questions.length,
      answers: detailedAnswers,
      childUserId: role === 'child' ? (user as ChildInformation).id : undefined,
      parentUserId: role === 'parent' ? (user as ParentUser).id : undefined
    };

    // Submit to API
    const response = await fetch('/api/assessments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(submissionData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Session expired. Please login again.');
      }
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to save assessment');
    }

    const assessmentData = await response.json();

    // Set result and redirect
    const result: AssessmentResult = {
      id: assessmentData.id,
      score,
      totalQuestions: questions.length,
      answers: detailedAnswers.map((answer, index) => ({
        ...answer,
        correctAnswer: questions[index].correctAnswer || "N/A",
      })),
      subject,
      grade,
      takenAt: new Date().toISOString(),
    };

    setAssessmentResult(result);
    router.push('/assessment/results');
  } 
  catch (error: any) {
    setSubmitError(error.message || 'Failed to save assessment. Please try again.');
    console.error('Assessment submission error:', error);
    toast({
      title: "Error",
      description: error.message || "Could not save assessment results.",
      variant: "destructive",
    });
    if (error.message.includes('Session') || error.message.includes('expired')) {
      // Clear client-side auth state
      localStorage.removeItem('authState');
      // Force a hard refresh to clear any cached state
      window.location.href = `/auth/login?returnUrl=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
  } finally {
    setIsSubmitting(false); // Add this line
  }
};

  const progressValue = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  if (isLoading || authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] gap-4">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="relative w-16 h-16"
        >
          <BookOpen className="w-full h-full text-blue-600" />
        </motion.div>
        <p className="text-lg font-medium text-gray-600">Preparing your assessment...</p>
      </div>
    );
  }

  if (errorLoadingQuestions) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] gap-6 p-4">
        <div className="bg-red-100 p-6 rounded-full">
          <BookOpen className="h-12 w-12 text-red-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">Assessment Error</h3>
        <p className="text-red-600 mb-6 text-center max-w-md">{errorLoadingQuestions}</p>
        <Button 
          onClick={() => router.push('/assessment/select')} 
          className="gap-2"
          variant="outline"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Selection
        </Button>
      </div>
    );
  }
  
  if (questions.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] gap-6 p-4">
        <div className="bg-blue-100 p-6 rounded-full">
          <BookOpen className="h-12 w-12 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-800">No Questions Available</h3>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          We couldn't find any questions for {subject} Grade {grade}.
        </p>
        <Button 
          onClick={() => router.push('/assessment/select')} 
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Choose Another Assessment
        </Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const subjectIcon = subject === 'ELA' ? <BookOpen className="h-5 w-5" /> : <Calculator className="h-5 w-5" />;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {submitError && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200 flex items-start gap-3"
        >
          <div className="mt-0.5">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <p className="font-medium">Submission Error</p>
            <p className="text-sm">{submitError}</p>
          </div>
        </motion.div>
      )}
      
      {/* Assessment Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              {subjectIcon}
              <span>{subject} Assessment</span>
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="secondary" className="gap-1">
                <Trophy className="h-4 w-4 text-yellow-500" />
                Grade {grade}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Clock className="h-4 w-4 text-blue-500" />
                Question {currentQuestionIndex + 1} of {questions.length}
              </Badge>
            </div>
          </div>
          {role === 'child' && (
            <div className="text-right">
              <p className="text-sm text-gray-500">Student</p>
              <p className="font-medium">{(user as ChildInformation)?.childName}</p>
            </div>
          )}
        </div>

        <Progress 
          value={progressValue} 
          className="w-full h-3 bg-gray-100 [&>div]:bg-gradient-to-r [&>div]:from-blue-600 [&>div]:to-indigo-600"
        />
      </motion.div>

      {/* Question Display */}
      <motion.div
        key={currentQuestionIndex}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <QuestionDisplay
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          onAnswerChange={handleAnswerChange}
          currentAnswer={answers[currentQuestionIndex]}
        />
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-8 gap-4">
        <motion.div whileHover={{ scale: 1.03 }}>
          <Button
            onClick={goToPreviousQuestion}
            disabled={currentQuestionIndex === 0}
            variant="outline"
            size="lg"
            className="gap-2 min-w-[150px]"
          >
            <ChevronLeft className="h-5 w-5" />
            Previous
          </Button>
        </motion.div>
        
        {currentQuestionIndex === questions.length - 1 ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <motion.div whileHover={{ scale: 1.03 }}>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white gap-2 min-w-[180px] shadow-lg"
                  disabled={isSubmitting} // Add disabled state
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckSquare className="h-5 w-5" />
                      Submit Assessment
                    </>
                  )}
                </Button>
              </motion.div>
            </AlertDialogTrigger>
            <AlertDialogContent className="rounded-lg max-w-sm">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-xl">Ready to submit?</AlertDialogTitle>
                <AlertDialogDescription className="text-base">
                  You've answered {questions.length} questions. Make sure you've reviewed all your answers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="gap-3">
                <AlertDialogCancel className="mt-0">Review Answers</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleSubmitAssessment} 
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  disabled={isSubmitting} // Add disabled state
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Confirm Submission'
                  )}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <motion.div whileHover={{ scale: 1.03 }}>
            <Button 
              onClick={goToNextQuestion} 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white gap-2 min-w-[150px] shadow-lg"
            >
              Next
              <ChevronRight className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}