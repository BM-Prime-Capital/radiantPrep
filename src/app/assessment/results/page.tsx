'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Trophy, BookOpen, Calculator, Star, Award } from 'lucide-react';
import { ReportGenerator } from '@/components/assessment/ReportGenerator';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

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
  const studentName = role === 'child' ? (user as any)?.childName : "Student";
  const takenDate = assessmentResult.takenAt ? new Date(assessmentResult.takenAt) : new Date();
  const subjectIcon = subject === 'ELA' ? <BookOpen className="h-5 w-5" /> : <Calculator className="h-5 w-5" />;

  const performanceLevel = percentage >= 80 ? "excellent" : percentage >= 60 ? "good" : "needs-improvement";

  const performanceData = {
    "excellent": {
      message: "Outstanding Performance!",
      description: "You've demonstrated an exceptional understanding of the material.",
      color: "from-emerald-400 to-teal-600",
      icon: <Star className="h-8 w-8 text-yellow-400" />
    },
    "good": {
      message: "Solid Performance!",
      description: "You're on the right track with a few areas to review.",
      color: "from-blue-400 to-indigo-600",
      icon: <CheckCircle2 className="h-8 w-8 text-blue-400" />
    },
    "needs-improvement": {
      message: "Keep Practicing!",
      description: "Review the material to strengthen your understanding.",
      color: "from-amber-400 to-orange-600",
      icon: <Award className="h-8 w-8 text-amber-400" />
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
      {/* Hero Result Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "rounded-3xl p-8 mb-10 text-white",
          "bg-gradient-to-br",
          performanceData[performanceLevel].color,
          "shadow-lg"
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
              <Badge variant="secondary" className="text-base gap-2 bg-white/20 backdrop-blur-sm">
                {subjectIcon}
                {subject} • Grade {grade}
              </Badge>
              <Badge variant="secondary" className="text-base gap-2 bg-white/20 backdrop-blur-sm">
                <Trophy className="h-5 w-5" />
                Score: {score}/{totalQuestions} ({percentage}%)
              </Badge>
            </div>
          </div>
          
          <div className="relative w-48 h-48 flex-shrink-0">
            {/* Circular progress */}
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
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold">{percentage}%</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Detailed Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Performance Summary */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full shadow-sm border-0 bg-gradient-to-br from-gray-50 to-white">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Trophy className="text-yellow-500" />
                <span>Performance Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground">Completion Date</p>
                  <p className="text-lg font-medium">
                    {takenDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <p className="text-sm text-green-800">Correct</p>
                    <p className="text-3xl font-bold text-green-600">{score}</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                    <p className="text-sm text-red-800">Incorrect</p>
                    <p className="text-3xl font-bold text-red-600">{totalQuestions - score}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Accuracy</p>
                  <Progress 
                    value={percentage} 
                    className="h-3 [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-indigo-600"
                  />
                  <p className="text-right mt-1 text-sm font-medium text-muted-foreground">
                    {percentage}%
                  </p>
                </div>
              </div>
              <ReportGenerator 
            assessmentResult={assessmentResult} 
            studentName={studentName} 
          />
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
          <Card className="h-full shadow-sm border-0">
            <CardHeader>
              <CardTitle className="text-2xl">Question Breakdown</CardTitle>
              <CardDescription>
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
                        "p-5 border-0 shadow-sm mb-3 transition-all hover:shadow-md",
                        answer.isCorrect ? "bg-green-50" : "bg-red-50"
                      )}>
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="font-semibold text-lg">Q{index + 1}</span>
                              {answer.isCorrect ? (
                                <Badge variant="outline" className="border-green-300 text-green-700 bg-green-100">
                                  <CheckCircle2 className="h-4 w-4 mr-1" />
                                  Correct
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="border-red-300 text-red-700 bg-red-100">
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Incorrect
                                </Badge>
                              )}
                            </div>
                            
                            <div className="mt-2">
                              <p className="text-sm text-muted-foreground">Your answer:</p>
                              <p className={cn(
                                "font-medium mt-1 p-2 bg-white rounded border",
                                answer.isCorrect ? "border-green-200" : "border-red-200"
                              )}>
                                {Array.isArray(answer.userAnswer) 
                                  ? answer.userAnswer.join(', ') 
                                  : answer.userAnswer || 'No answer provided'}
                              </p>
                            </div>
                            
                            {!answer.isCorrect && answer.correctAnswer && (
                              <div className="mt-3">
                                <p className="text-sm text-muted-foreground">Correct answer:</p>
                                <p className="font-medium mt-1 p-2 bg-white rounded border border-green-200 text-green-700">
                                  {Array.isArray(answer.correctAnswer) 
                                    ? answer.correctAnswer.join(' / ') 
                                    : answer.correctAnswer}
                                </p>
                              </div>
                            )}
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
      {/* <StudyCoach assessmentResult={assessmentResult} studentName={studentName} /> */}
      {/* <AITutor assessmentResult={assessmentResult} studentName={studentName} /> */}
      {/* <AIAgent 
        assessmentResult={assessmentResult || undefined}
        isOpen={isAIOpen}
        onToggle={() => setIsAIOpen(!isAIOpen)}
      /> */}
    </div>
  );
}