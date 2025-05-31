
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { Question, Subject, Grade, AssessmentResult } from '@/lib/types';
import { getQuestions } from '@/lib/questions';
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
          const fetchedQuestions = await getQuestions(subject, grade);
          if (fetchedQuestions.length === 0) {
            toast({ title: "No Questions", description: "No questions found for this subject/grade combination.", variant: "default" });
            // Potentially redirect or show a message, for now, we allow staying on the page with no questions.
            // router.push('/assessment/select');
            setQuestions([]);
          } else {
            setQuestions(fetchedQuestions);
            setAnswers(new Array(fetchedQuestions.length).fill(undefined));
          }
        } catch (err) {
          console.error("Error fetching questions:", err);
          toast({ title: "Error Loading Assessment", description: "Could not load questions. Please try again.", variant: "destructive" });
          setErrorLoadingQuestions("Failed to load questions.");
          setQuestions([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false); // No subject/grade, nothing to load
      }
    }

    if (!authLoading) {
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
      setCurrentQuestionIndex(prevIndex => prevIndex - 1); // Corrected to prevIndex - 1
    }
  };

  const handleSubmitAssessment = () => {
    let score = 0;
    const detailedAnswers = questions.map((q, index) => {
      const userAnswer = answers[index];
      let isCorrect = false;
      
      // Ensure q.correctAnswer is defined before using it
      const questionCorrectAnswer = q.correctAnswer;

      if (userAnswer !== undefined && questionCorrectAnswer !== undefined) {
        if (Array.isArray(questionCorrectAnswer)) {
          // If correct answer is an array (e.g. for FILL_IN_THE_BLANK)
          if (Array.isArray(userAnswer)) {
            // User answer is also an array (e.g. for multiple inputs)
            // This needs careful comparison logic, e.g., all elements match in order
            isCorrect = userAnswer.length === questionCorrectAnswer.length && 
                        userAnswer.every((ua, i) => ua?.trim().toLowerCase() === questionCorrectAnswer[i]?.trim().toLowerCase());
          } else {
            // User answer is a single string, check if it's one of the correct answers
            isCorrect = questionCorrectAnswer.some(ca => userAnswer.toString().trim().toLowerCase() === ca?.trim().toLowerCase());
          }
        } else {
           // Correct answer is a single string
           isCorrect = userAnswer.toString().trim().toLowerCase() === questionCorrectAnswer.toString().trim().toLowerCase();
        }
      }

      if (isCorrect) {
        score++;
      }
      return { questionId: q.id_prisma || q.id, userAnswer: userAnswer || "Not Answered", correctAnswer: questionCorrectAnswer || "N/A", isCorrect };
    });

    const result: AssessmentResult = {
      score,
      totalQuestions: questions.length,
      answers: detailedAnswers,
      subject,
      grade
    };
    
    setAssessmentResult(result);
    router.push('/assessment/results');
  };
  
  const progressValue = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  if (isLoading || authLoading) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"><p>Loading assessment...</p></div>;
  }

  if (errorLoadingQuestions) {
    return <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)]">
      <p className="text-destructive mb-4">{errorLoadingQuestions}</p>
      <Button onClick={() => router.push('/assessment/select')}>Back to Selection</Button>
    </div>;
  }
  
  if (questions.length === 0 && !isLoading) {
    return <div className="flex flex-col justify-center items-center min-h-[calc(100vh-10rem)]">
      <p className="mb-4">No questions available for this assessment configuration.</p>
      <Button onClick={() => router.push('/assessment/select')}>Choose Another Assessment</Button>
      </div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="max-w-3xl mx-auto py-8">
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
