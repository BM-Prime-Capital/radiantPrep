
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { AssessmentResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { CheckCircle, XCircle, Award, RotateCcw, Home } from 'lucide-react';

export default function ResultsPage() {
  const { isAuthenticated, isLoading: authLoading, assessmentResult, user, role } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
    if (!authLoading && !assessmentResult) {
      router.replace('/assessment/select');
    }
  }, [isAuthenticated, authLoading, assessmentResult, router]);

  if (authLoading || !assessmentResult) {
    return <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]"><p>Loading results...</p></div>;
  }

  const { score, totalQuestions, subject, grade, answers } = assessmentResult;
  const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
  const studentName = role === 'child' ? (user as any)?.childName : "Student";

  let feedbackMessage = "";
  if (percentage >= 80) {
    feedbackMessage = "Excellent work! You have a strong understanding of the material.";
  } else if (percentage >= 60) {
    feedbackMessage = "Good job! There are a few areas to review for improvement.";
  } else {
    feedbackMessage = "Keep practicing! Reviewing the material will help you improve.";
  }

  return (
    <div className="max-w-4xl mx-auto py-12">
      <Card className="shadow-2xl">
        <CardHeader className="text-center">
          <Award className="h-16 w-16 text-primary mx-auto mb-4" />
          <CardTitle className="text-4xl font-bold text-primary">Assessment Results</CardTitle>
          <CardDescription className="text-lg text-foreground/80">
            Here's how {studentName} performed on the {subject} - Grade {grade} assessment.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="text-center space-y-4 p-6 bg-muted rounded-lg">
            <p className="text-6xl font-bold text-accent">{percentage}%</p>
            <p className="text-2xl text-foreground/90">
              You answered <span className="font-semibold text-primary">{score}</span> out of <span className="font-semibold text-primary">{totalQuestions}</span> questions correctly.
            </p>
            <Progress value={percentage} className="w-full h-4" />
            <p className="text-lg text-foreground/80 mt-2">{feedbackMessage}</p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-4 text-center text-primary">Detailed Breakdown</h3>
            <div className="space-y-4 max-h-[400px] overflow-y-auto p-2 border rounded-md">
              {answers.map((ans, index) => (
                <Card key={index} className={`p-4 ${ans.isCorrect ? 'border-green-500' : 'border-red-500'} bg-card`}>
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-foreground/90">Question {index + 1}</p>
                    {ans.isCorrect ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Your answer: <span className="font-mono text-foreground">{Array.isArray(ans.userAnswer) ? ans.userAnswer.join(', ') : ans.userAnswer}</span></p>
                  {!ans.isCorrect && (
                    <p className="text-sm text-green-600 mt-1">Correct answer: <span className="font-mono">{Array.isArray(ans.correctAnswer) ? ans.correctAnswer.join(' / ') : ans.correctAnswer}</span></p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8">
          <Button asChild size="lg" variant="outline">
            <Link href="/assessment/select">
              <RotateCcw className="mr-2 h-5 w-5" /> Try Another Assessment
            </Link>
          </Button>
          <Button asChild size="lg">
            <Link href="/">
              <Home className="mr-2 h-5 w-5" /> Back to Home
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
