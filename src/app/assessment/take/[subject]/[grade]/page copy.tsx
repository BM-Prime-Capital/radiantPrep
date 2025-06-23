'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { Question, Subject, Grade, AssessmentResult, ChildInformation, ParentUser } from '@/lib/types';
import { QuestionDisplay } from '@/components/assessment/QuestionDisplay';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, ChevronRight, CheckSquare } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';


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

  const isAnswerCorrect = (question: Question, userAnswer: string | string[] | undefined) => {
    if (userAnswer === undefined || question.correctAnswer === undefined) {
      return false;
    }

    const correctAnswer = question.correctAnswer;

    if (Array.isArray(correctAnswer)) {
      if (Array.isArray(userAnswer)) {
        return userAnswer.length === correctAnswer.length && 
               userAnswer.every((ua, i) => ua?.trim().toLowerCase() === correctAnswer[i]?.trim().toLowerCase());
      }
      return correctAnswer.some(ca => userAnswer.toString().trim().toLowerCase() === ca?.trim().toLowerCase());
    }
    
    return userAnswer.toString().trim().toLowerCase() === correctAnswer.toString().trim().toLowerCase();
  };

  const handleSubmitAssessment = async () => {
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
        const userAnswer = answers[index];
        const correct = isAnswerCorrect(question, userAnswer);
        
        return {
          questionId: question.id_prisma || question.id,
          userAnswer: userAnswer || "",
          isCorrect: correct,
        };
      });

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
    } catch (error: any) {
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
      
    }
  };

  const progressValue = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  if (isLoading || authLoading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"><p>Loading assessment...</p></div>;
  }

  if (errorLoadingQuestions) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)]">
        <p className="text-destructive mb-4">{errorLoadingQuestions}</p>
        <Button onClick={() => router.push('/assessment/select')}>Back to Selection</Button>
      </div>
    );
  }
  
  if (questions.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)]">
        <p className="mb-4">No questions available for this assessment configuration.</p>
        <Button onClick={() => router.push('/assessment/select')}>Choose Another Assessment</Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-3xl mx-auto py-8">
      {submitError && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {submitError}
        </div>
      )}
      
      <Card className="mb-8 shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl text-center text-primary">
            {subject} Assessment - Grade {grade}
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Student: {role === 'child' ? (user as any)?.childName : "Preview Mode"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progressValue} className="w-full mb-6 h-3" />
          <QuestionDisplay
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            onAnswerChange={handleAnswerChange}
            currentAnswer={answers[currentQuestionIndex]}
          />
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mt-8">
        <Button
          onClick={goToPreviousQuestion}
          disabled={currentQuestionIndex === 0}
          variant="outline"
          size="lg"
        >
          <ChevronLeft className="mr-2 h-5 w-5" /> Previous
        </Button>
        {currentQuestionIndex === questions.length - 1 ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                <CheckSquare className="mr-2 h-5 w-5" /> Submit Assessment
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure you want to submit?</AlertDialogTitle>
                <AlertDialogDescription>
                  Once submitted, you cannot change your answers. Please review your answers before submitting.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Review Answers</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmitAssessment} className="bg-green-600 hover:bg-green-700">
                  Yes, Submit Now
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <Button onClick={goToNextQuestion} size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Next <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
}