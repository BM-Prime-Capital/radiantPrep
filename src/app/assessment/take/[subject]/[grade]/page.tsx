'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { type Question, type Subject, type Grade, type AssessmentResult, type ChildInformation, type ParentUser, QuestionType } from '@/lib/types';
import { QuestionDisplay } from '@/components/assessment/QuestionDisplay';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, ChevronRight, CheckSquare, BookOpen, Calculator, Trophy, Clock, Loader2, Sparkles } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import ChildLayout from '@/components/layout/ChildLayout';
import { Card, CardContent } from '@/components/ui/card';

const AssessmentHeader = ({
  subject,
  grade,
  childName
}: {
  subject: Subject;
  grade: Grade;
  childName?: string;
}) => {
  const theme = subject === 'ELA' ? 'blue' : 'green';
  
  return (
    <div className="bg-gradient-to-r from-primary to-accent text-white rounded-xl p-6 mb-8 shadow-md">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`p-3 bg-white/20 rounded-lg`}>
            {subject === 'ELA' ? (
              <BookOpen className="h-8 w-8 text-white" />
            ) : (
              <Calculator className="h-8 w-8 text-white" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{subject} Assessment</h1>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant="secondary" className="bg-white/10 hover:bg-white/20 border-0 text-white">
                <Trophy className="h-4 w-4 mr-1" />
                Grade {grade}
              </Badge>
              {childName && (
                <Badge variant="outline" className="bg-white/5 text-white">
                  {childName}
                </Badge>
              )}
            </div>
          </div>
        </div>
        <Sparkles className="h-10 w-10 text-white/80 hidden md:block" />
      </div>
    </div>
  );
};

const ProgressTracker = ({
  currentQuestionIndex,
  questionsLength
}: {
  currentQuestionIndex: number;
  questionsLength: number;
}) => {
  const progressValue = ((currentQuestionIndex + 1) / questionsLength) * 100;
  
  return (
    <Card className="mb-6 shadow-sm">
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-primary">
              Question {currentQuestionIndex + 1} of {questionsLength}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progressValue)}% complete
            </span>
          </div>
          <Progress 
            value={progressValue} 
            className="h-2"
          />
        </div>
      </CardContent>
    </Card>
  );
};

const NavigationControls = ({
  currentQuestionIndex,
  questionsLength,
  onPrevious,
  onNext,
  onSubmit,
  isSubmitting
}: {
  currentQuestionIndex: number;
  questionsLength: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}) => {
  return (
    <div className="flex justify-between items-center mt-8 gap-4">
      <Button
        onClick={onPrevious}
        disabled={currentQuestionIndex === 0}
        variant="outline"
        size="lg"
        className="gap-2 min-w-[150px]"
      >
        <ChevronLeft className="h-5 w-5" />
        Previous
      </Button>

      {currentQuestionIndex === questionsLength - 1 ? (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              size="lg" 
              className="bg-green-600 hover:bg-green-700 text-white gap-2 min-w-[180px] shadow-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  <CheckSquare className="h-5 w-5" />
                  Submit Assessment
                </>
              )}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="rounded-lg max-w-sm">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl">Ready to submit?</AlertDialogTitle>
              <AlertDialogDescription className="text-base">
                You've answered {questionsLength} questions. Make sure you've reviewed all your answers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-3">
              <AlertDialogCancel className="mt-0">Review Answers</AlertDialogCancel>
              <AlertDialogAction 
                onClick={onSubmit} 
                className="bg-green-600 hover:bg-green-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  'Confirm Submission'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <Button 
          onClick={onNext} 
          size="lg" 
          className="bg-primary hover:bg-primary/90 text-white gap-2 min-w-[150px] shadow-lg"
        >
          Next
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

const LoadingState = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
    <Loader2 className="h-12 w-12 animate-spin text-primary" />
    <h3 className="text-xl font-semibold text-gray-700">
      Preparing your assessment...
    </h3>
  </div>
);

const ErrorState = ({ error, onBack }: { error: string; onBack: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-4">
    <Card className="border-red-200 bg-red-50 max-w-md">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="bg-red-100 p-4 rounded-full mb-4">
          <BookOpen className="h-10 w-10 text-red-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Assessment Error</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={onBack} variant="outline" className="gap-2">
          <ChevronLeft className="h-4 w-4" />
          Back to Selection
        </Button>
      </CardContent>
    </Card>
  </div>
);

const NoQuestionsState = ({ subject, grade, onBack }: { subject: Subject; grade: Grade; onBack: () => void }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-4">
    <Card className="border-blue-200 bg-blue-50 max-w-md">
      <CardContent className="p-6 flex flex-col items-center text-center">
        <div className="bg-blue-100 p-4 rounded-full mb-4">
          <BookOpen className="h-10 w-10 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">No Questions Available</h3>
        <p className="text-gray-600 mb-4">
          We couldn't find any questions for {subject} Grade {grade}.
        </p>
        <Button onClick={onBack} className="gap-2">
          <ChevronLeft className="h-4 w-4" />
          Choose Another Assessment
        </Button>
      </CardContent>
    </Card>
  </div>
);

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
          const response = await fetch(`/api/questions?subject=${subject}&grade=${grade}`, { credentials: 'include' });

          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

          const dbQuestions = await response.json();
          const fetchedQuestions = dbQuestions.map((dbQuestion: any) => ({
            id: dbQuestion.id,
            id_prisma: dbQuestion.id,
            type: dbQuestion.questionType,
            question: dbQuestion.questionText,
            passage: dbQuestion.passage ?? undefined,
            image: dbQuestion.imageUrl ?? undefined,
            options: dbQuestion.options.map((opt: any) => opt.value),
            correctAnswer: dbQuestion.correctAnswers.length > 0
              ? dbQuestion.correctAnswers.length > 1 || dbQuestion.questionType === 'FILL_IN_THE_BLANK'
                ? dbQuestion.correctAnswers.map((ca: any) => ca.answerValue)
                : dbQuestion.correctAnswers[0].answerValue
              : undefined,
            category: dbQuestion.category ?? undefined,
            blanks: dbQuestion.blanksJson ? JSON.parse(dbQuestion.blanksJson) : undefined,
            columns: dbQuestion.columnsJson ? JSON.parse(dbQuestion.columnsJson) : undefined,
            dataAihint: dbQuestion.dataAihint ?? undefined,
            isDrawing: dbQuestion.isDrawing ?? undefined,
            drawingQuestion: dbQuestion.drawingQuestion ?? undefined,
          }));

          if (fetchedQuestions.length === 0) {
            toast({ title: 'No Questions', description: 'No questions found for this subject/grade combination.', variant: 'default' });
            setQuestions([]);
          } else {
            setQuestions(fetchedQuestions);
            setAnswers(new Array(fetchedQuestions.length).fill(undefined));
          }
        } catch (err) {
          console.error('Error fetching questions:', err);
          toast({ title: 'Error Loading Assessment', description: 'Could not load questions. Please try again.', variant: 'destructive' });
          setErrorLoadingQuestions('Failed to load questions.');
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
    setAnswers((prev) => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = answer;
      return newAnswers;
    });
  }, [currentQuestionIndex]);

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitAssessment = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      if (!user || !role) throw new Error('User information not available');

      const detailedAnswers = questions.map((question, index) => {
        return {
          questionId: question.id_prisma || question.id,
          userAnswer: Array.isArray(answers[index]) ? answers[index] : answers[index] || '',
          isCorrect: isAnswerCorrect(question, answers[index]),
        };
      });

      const response = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          subject,
          grade,
          score: detailedAnswers.filter((a) => a.isCorrect).length,
          totalQuestions: questions.length,
          answers: detailedAnswers,
          childUserId: role === 'child' ? (user as ChildInformation).id : undefined,
          parentUserId: role === 'parent' ? (user as ParentUser).id : undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save assessment');
      }

      const result = await response.json();
      setAssessmentResult({
        id: result.id,
        score: result.score,
        totalQuestions: questions.length,
        answers: detailedAnswers.map((answer, index) => ({
          ...answer,
          correctAnswer: typeof questions[index].correctAnswer === 'number'
            ? questions[index].correctAnswer.toString()
            : questions[index].correctAnswer || 'N/A',
        })),
        subject,
        grade,
        takenAt: new Date().toISOString(),
      });

      router.push('/assessment/results');
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to save assessment. Please try again.');
      toast({ title: 'Error', description: error.message || 'Could not save assessment results.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progressValue = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (isLoading || authLoading) {
    return (
      <ChildLayout>
        <LoadingState />
      </ChildLayout>
    );
  }

  if (errorLoadingQuestions) {
    return (
      <ChildLayout>
        <ErrorState 
          error={errorLoadingQuestions} 
          onBack={() => router.push('/assessment/select')} 
        />
      </ChildLayout>
    );
  }
  
  if (questions.length === 0 && !isLoading) {
    return (
      <ChildLayout>
        <NoQuestionsState 
          subject={subject}
          grade={grade}
          onBack={() => router.push('/assessment/select')}
        />
      </ChildLayout>
    );
  }

  // const currentQuestion = questions[currentQuestionIndex];
  const childName = role === 'child' ? (user as ChildInformation)?.childName : undefined;

  return (
    <ChildLayout>
      <div className="px-4 py-6">
        <AssessmentHeader
          subject={subject}
          grade={grade}
          childName={childName}
        />

        <ProgressTracker
          currentQuestionIndex={currentQuestionIndex}
          questionsLength={questions.length}
        />

        {/* Question Display */}
        <Card className="shadow-sm mb-6">
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestionIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <QuestionDisplay
                  question={currentQuestion}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={questions.length}
                  onAnswerChange={handleAnswerChange}
                  currentAnswer={answers[currentQuestionIndex]}
                />
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        <NavigationControls
          currentQuestionIndex={currentQuestionIndex}
          questionsLength={questions.length}
          onPrevious={goToPreviousQuestion}
          onNext={goToNextQuestion}
          onSubmit={handleSubmitAssessment}
          isSubmitting={isSubmitting}
        />
      </div>
    </ChildLayout>
  );
}

function isAnswerCorrect(question: Question, userAnswer: string | string[] | undefined): boolean {
  if (!userAnswer || !question.correctAnswer) return false;
  if (typeof question.correctAnswer === 'number') return userAnswer === question.correctAnswer.toString();
  const normalize = (value: string | string[]) => Array.isArray(value) ? value.map((v) => v.trim()) : [value.toString().trim()];
  const correct = normalize(question.correctAnswer);
  const user = normalize(userAnswer);
  if (correct.length !== user.length) return false;
  return correct.every((ca, i) => ca === user[i]);
}