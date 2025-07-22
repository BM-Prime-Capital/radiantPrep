'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { type Question, type Subject, type Grade, type AssessmentResult, type ChildInformation, type ParentUser } from '@/lib/types';
import { QuestionDisplay } from '@/components/assessment/QuestionDisplay';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, ChevronRight, CheckSquare, BookOpen, Calculator, Trophy, Clock, Loader2 } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import ChildLayout from '@/components/layout/ChildLayout';

export default function AssessmentTakePage() {
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

  if (authLoading || isLoading) {
    return (
      <ChildLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium text-gray-600">Preparing your assessment...</p>
        </div>
      </ChildLayout>
    );
  }

  if (errorLoadingQuestions) {
    return (
      <ChildLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-4">
          <BookOpen className="h-12 w-12 text-red-600" />
          <h3 className="text-2xl font-bold text-gray-800">Assessment Error</h3>
          <p className="text-red-600 mb-6 text-center max-w-md">{errorLoadingQuestions}</p>
          <Button onClick={() => router.push('/assessment/select')} variant="outline" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Back to Selection
          </Button>
        </div>
      </ChildLayout>
    );
  }

  if (questions.length === 0) {
    return (
      <ChildLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 p-4">
          <BookOpen className="h-12 w-12 text-blue-600" />
          <h3 className="text-2xl font-bold text-gray-800">No Questions Available</h3>
          <p className="text-gray-600 mb-6 text-center max-w-md">
            We couldn't find any questions for {subject} Grade {grade}.
          </p>
          <Button onClick={() => router.push('/assessment/select')} className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Choose Another Assessment
          </Button>
        </div>
      </ChildLayout>
    );
  }

  return (
    <ChildLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              {subject === 'ELA' ? (
                <BookOpen className="h-8 w-8 text-blue-600" />
              ) : (
                <Calculator className="h-8 w-8 text-green-600" />
              )}
              <span>{subject} Assessment</span>
            </h1>
            <div className="flex items-center gap-4 mt-3">
              <Badge variant="secondary" className="gap-1.5">
                <Trophy className="h-4 w-4" />
                Grade {grade}
              </Badge>
              <Badge variant="outline" className="gap-1.5">
                <Clock className="h-4 w-4" />
                {currentQuestionIndex + 1}/{questions.length} Questions
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

        <div className="mb-6 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-primary">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progressValue)}% complete
            </span>
          </div>
          <Progress value={progressValue} className="h-2 bg-gray-200" />
        </div>

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

        <div className="flex justify-between items-center mt-8 gap-4">
          <Button onClick={goToPreviousQuestion} disabled={currentQuestionIndex === 0} variant="outline" size="lg" className="gap-2 min-w-[150px]">
            <ChevronLeft className="h-5 w-5" />
            Previous
          </Button>

          {currentQuestionIndex === questions.length - 1 ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white gap-2 min-w-[180px] shadow-lg" disabled={isSubmitting}>
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
                    You've answered {questions.length} questions. Make sure you've reviewed all your answers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-3">
                  <AlertDialogCancel className="mt-0">Review Answers</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSubmitAssessment} className="bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
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
            <Button onClick={goToNextQuestion} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white gap-2 min-w-[150px] shadow-lg">
              Next
              <ChevronRight className="h-5 w-5" />
            </Button>
          )}
        </div>
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