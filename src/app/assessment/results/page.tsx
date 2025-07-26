'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Trophy, BookOpen, Calculator, Star, Award, ChevronRight, TrendingUp } from 'lucide-react';
import { ReportGenerator } from '@/components/assessment/ReportGenerator';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.2, 1],
          }}
          transition={{ 
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut" 
          }}
          className="relative w-20 h-20"
        >
          <Trophy className="w-full h-full text-yellow-400" />
        </motion.div>
        <motion.h3 
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          Loading your results...
        </motion.h3>
      </div>
    );
  }

  const { score, totalQuestions, subject, grade, answers, takenAt } = assessmentResult;
  const percentage = Math.round((score / totalQuestions) * 100);
  const studentName = role === 'CHILD' ? (user as any)?.childName : "Student";
  const takenDate = assessmentResult.takenAt ? new Date(assessmentResult.takenAt) : new Date();
  const subjectIcon = subject === 'ELA' ? <BookOpen className="h-5 w-5" /> : <Calculator className="h-5 w-5" />;

  const performanceLevel = percentage >= 80 ? "excellent" : percentage >= 60 ? "good" : "needs-improvement";

const performanceData = {
  "excellent": {
    message: "Outstanding Performance!",
    description: "You've demonstrated an exceptional understanding of the material.",
    color: "bg-gradient-to-br from-green-500 to-teal-600", // Vert pour le succès
    icon: <Star className="h-8 w-8 text-yellow-300" />,
    badgeColor: "bg-green-100 text-green-800 border-green-200"
  },
  "good": {
    message: "Solid Performance!",
    description: "You're on the right track with a few areas to review.",
    color: "bg-gradient-to-br from-blue-500 to-indigo-600", // Votre bleu principal
    icon: <CheckCircle2 className="h-8 w-8 text-blue-300" />,
    badgeColor: "bg-blue-100 text-blue-800 border-blue-200"
  },
  "needs-improvement": {
    message: "Keep Practicing!",
    description: "Review the material to strengthen your understanding.",
    color: "bg-gradient-to-br from-sky-400 to-blue-500", // Bleu clair plus encourageant
    icon: <Award className="h-8 w-8 text-sky-200" />,
    badgeColor: "bg-sky-100 text-sky-800 border-sky-200"
  }
};

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      {/* Hero Result Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "rounded-2xl p-8 mb-10 text-white",
          "bg-gradient-to-br",
          performanceData[performanceLevel].color,
          "shadow-xl"
        )}
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              {performanceData[performanceLevel].icon}
              <h1 className="text-3xl sm:text-4xl font-bold">
                {performanceData[performanceLevel].message}
              </h1>
            </div>
            <p className="text-lg sm:text-xl opacity-90 mb-6 max-w-2xl">
              {performanceData[performanceLevel].description}
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Badge variant="secondary" className="text-base gap-2 bg-white/20 backdrop-blur-sm border-white/30">
                {subjectIcon}
                {subject} • Grade {grade}
              </Badge>
              <Badge variant="secondary" className="text-base gap-2 bg-white/20 backdrop-blur-sm border-white/30">
                <Trophy className="h-5 w-5" />
                Score: {score}/{totalQuestions} ({percentage}%)
              </Badge>
            </div>
          </div>
          
          <div className="relative w-48 h-48 flex-shrink-0">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="8"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="white"
                strokeWidth="8"
                strokeLinecap="round"
                initial={{ strokeDasharray: '0 283' }}
                animate={{ strokeDasharray: `${283 * percentage / 100} 283` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center flex-col">
              <span className="text-4xl font-bold">{percentage}%</span>
              <span className="text-sm opacity-80">Accuracy</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-10">
        <Button 
          variant="outline" 
          className="border-gray-300 hover:bg-gray-50 gap-2"
          onClick={() => router.push('/assessment/select')}
        >
          <ChevronRight className="h-5 w-5" />
          Take Another Assessment
        </Button>
        
        <ReportGenerator 
          assessmentResult={assessmentResult} 
          studentName={studentName} 
        />
      </div>

      {/* Detailed Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Performance Summary */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Trophy className="text-yellow-500" />
                <span>Performance Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Completion Date</p>
                <p className="text-lg font-medium text-gray-800">
                  {takenDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 text-green-800">
                    <CheckCircle2 className="h-5 w-5" />
                    <p className="text-sm">Correct</p>
                  </div>
                  <p className="text-3xl font-bold mt-2 text-green-600">{score}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 text-red-800">
                    <XCircle className="h-5 w-5" />
                    <p className="text-sm">Incorrect</p>
                  </div>
                  <p className="text-3xl font-bold mt-2 text-red-600">{totalQuestions - score}</p>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-500">Accuracy</p>
                  <p className="text-sm font-medium text-gray-700">
                    {percentage}%
                  </p>
                </div>
                <Progress 
                  value={percentage} 
                  className="h-2 bg-gray-200 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-indigo-600"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Question Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <Card className="h-full shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-2xl">Question Breakdown</CardTitle>
              <CardDescription className="text-gray-600">
                Review your answers and see where you excelled or need improvement.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                <AnimatePresence>
                  {answers.map((answer, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className={cn(
                        "p-5 border shadow-sm mb-3 transition-all hover:shadow-md",
                        answer.isCorrect ? "border-green-200" : "border-red-200"
                      )}>
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-semibold text-gray-800">Question {index + 1}</span>
                              <Badge 
                                variant="outline" 
                                className={cn(
                                  "px-3 py-1 text-sm",
                                  answer.isCorrect 
                                    ? "bg-green-50 text-green-800 border-green-200" 
                                    : "bg-red-50 text-red-800 border-red-200"
                                )}
                              >
                                {answer.isCorrect ? (
                                  <>
                                    <CheckCircle2 className="h-4 w-4 mr-1" />
                                    Correct
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Incorrect
                                  </>
                                )}
                              </Badge>
                            </div>
                            
                            <div className="mt-3 space-y-3">
                              <div>
                                <p className="text-sm text-gray-500 mb-1">Your answer:</p>
                                <p className={cn(
                                  "font-medium p-3 bg-white rounded border",
                                  answer.isCorrect 
                                    ? "border-green-200 text-green-700" 
                                    : "border-red-200 text-red-700"
                                )}>
                                  {Array.isArray(answer.userAnswer) 
                                    ? answer.userAnswer.join(', ') 
                                    : answer.userAnswer || 'No answer provided'}
                                </p>
                              </div>
                              
                              {!answer.isCorrect && answer.correctAnswer && (
                                <div>
                                  <p className="text-sm text-gray-500 mb-1">Correct answer:</p>
                                  <p className="font-medium p-3 bg-white rounded border border-green-200 text-green-700">
                                    {Array.isArray(answer.correctAnswer) 
                                      ? answer.correctAnswer.join(' / ') 
                                      : answer.correctAnswer}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}