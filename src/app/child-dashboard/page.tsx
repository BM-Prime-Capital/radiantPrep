import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, BarChart2, Award, ChevronRight, ArrowRight, FileText, History } from "lucide-react";
import Link from "next/link";
import { getServerSession } from '@/lib/session';
import { redirect } from "next/navigation";
import { Suspense } from 'react';
import { PrismaClient } from '@prisma/client';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export default async function ChildDashboard() {
  const session = await getServerSession();

  if (!session?.user) {
    redirect('/auth/login');
  }

  const totalAssessments = await prisma.assessment.count({
    where: {
      childUserId: session.user.id,
    }
  });

  const completedAssessments = await prisma.assessment.aggregate({
    where: {
      childUserId: session.user.id,
    },
    _sum: {
      score: true,
      totalQuestions: true,
    }
  });

  const score = completedAssessments._sum?.score || 0;
  const total = completedAssessments._sum?.totalQuestions || 0;
  const progress = total > 0 ? Math.round((score / total) * 100) : 0;

  const recentActivities = await prisma.assessment.findMany({
    where: { childUserId: session.user.id },
    orderBy: { takenAt: 'desc' },
    take: 5,
  });

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-50">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {session.user.childName}
            </span>!
          </h1>
          <p className="text-lg text-gray-600">Ready to learn something new today?</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Current Subject Card */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-blue-800">
                  Current Subject
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900 mb-3">
                {session.user.currentSubject || 'Not set'}
              </p>
              <Button variant="link" className="p-0 text-blue-600 hover:text-blue-700 group">
                View details <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardContent>
          </Card>

          {/* Grade Card */}
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200 rounded-xl hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <Award className="h-6 w-6 text-amber-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-amber-800">
                  Your Grade
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-gray-900 mb-3">
                {session.user.grade?.replace('GRADE_', 'Grade ') || 'Not set'}
              </p>
              <Button variant="link" className="p-0 text-amber-600 hover:text-amber-700 group">
                See progress <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl hover:shadow-lg transition-all">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <BarChart2 className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-lg font-semibold text-green-800">
                  Your Progress
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-3">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2.5 rounded-full" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="text-2xl font-bold text-gray-900">{progress}%</span>
              </div>
              <Button variant="link" className="p-0 text-green-600 hover:text-green-700 group">
                View reports <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {/* Assessment Card */}
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <FileText className="h-6 w-6 text-indigo-600" />
                <CardTitle className="text-xl font-semibold text-indigo-900">
                  Start New Assessment
                </CardTitle>
              </div>
              <CardDescription className="text-gray-600">
                Take a diagnostic test to measure your skills and get personalized recommendations.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                <Link href="/assessment/select" className="flex items-center justify-center gap-2">
                  Begin Assessment <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Results Card */}
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl hover:shadow-lg transition-all">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <History className="h-6 w-6 text-blue-600" />
                <CardTitle className="text-xl font-semibold text-blue-900">
                  View Past Results
                </CardTitle>
              </div>
              <CardDescription className="text-gray-600">
                Review your previous assessment results and track your learning progress.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-50">
                <Link href="/assessment/results" className="flex items-center justify-center gap-2">
                  View History <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-gray-700" />
            Recent Activity
          </h2>
          <Card className="border border-gray-200 rounded-xl bg-gray-50">
            <CardContent className="p-8">
              {recentActivities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <BarChart2 className="h-10 w-10 mb-4" />
                  <p>Your recent activities will appear here</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {recentActivities.map(activity => (
                    <li key={activity.id} className="flex justify-between text-sm text-gray-700">
                      <span>{activity.subjectName}</span>
                      <span>{new Date(activity.takenAt).toLocaleDateString()}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Suspense>
  );
}
