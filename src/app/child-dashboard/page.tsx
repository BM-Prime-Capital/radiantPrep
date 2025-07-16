import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BookOpen, BarChart2, Award, ChevronRight, ArrowRight, FileText, History, Target, Calendar, Star, Bookmark, Zap, Clock, CheckCircle } from "lucide-react";
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
    take: 3,
  });

  // Mock data
  const focusSubject = session.user.currentSubject || "Mathematics";
  const weeklyGoal = { completed: 3, total: 5 };
  const streak = 7;
  const recommendedResources = [
    { title: "Algebra Basics", type: "Video lesson", duration: "12 min" },
    { title: "Geometry Quiz", type: "Practice", questions: "15 questions" }
  ];

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    }>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Hero Welcome Section */}
        <div className="mb-10 p-6 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">Welcome back, {session.user.childName}!</h1>
              <p className="opacity-90">Ready for today's learning adventure?</p>
            </div>
            <div className="flex items-center gap-3 bg-white/20 px-4 py-2 rounded-full">
              <Zap className="h-5 w-5 text-yellow-300" />
              <span className="font-medium">{streak}-day streak</span>
            </div>
          </div>
        </div>

        {/* Focus Subject with Progress */}
        <div className="mb-8 p-6 bg-white rounded-xl shadow-md border border-gray-200">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-indigo-100 rounded-xl">
                  <Target className="h-6 w-6 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Current Focus: {focusSubject}</h2>
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Mastery Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button asChild className="bg-indigo-600 hover:bg-indigo-700">
                  <Link href="/assessment/select">Continue Learning</Link>
                </Button>
                <Button asChild variant="outline" className="border-indigo-300 text-indigo-600 hover:bg-indigo-50">
                  <Link href="/assessment/select">Practice Now</Link>
                </Button>
              </div>
            </div>

            <div className="md:w-px md:h-auto h-px w-full bg-gray-200"></div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Today's Tasks</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="p-2 bg-white rounded-lg border border-blue-200">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">Complete Algebra lesson</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <Clock className="h-4 w-4" /> 30 min remaining
                    </p>
                  </div>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Start</Button>
                </div>

                <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="p-2 bg-white rounded-lg border border-green-200">
                    <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">Weekly Practice Quiz</h3>
                    <p className="text-sm text-gray-500">15 questions</p>
                  </div>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">Begin</Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {/* Weekly Goal */}
          <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-indigo-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-purple-800">
                <CheckCircle className="h-4 w-4" />
                Weekly Goal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {weeklyGoal.completed}<span className="text-lg text-gray-500">/{weeklyGoal.total}</span>
                  </p>
                  <p className="text-sm text-gray-600">lessons completed</p>
                </div>
                <div className="relative w-16 h-16">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E9D5FF"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#8B5CF6"
                      strokeWidth="3"
                      strokeDasharray={`${(weeklyGoal.completed/weeklyGoal.total)*100}, 100`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-purple-600">
                      {Math.round((weeklyGoal.completed/weeklyGoal.total)*100)}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Assessments */}
          <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-blue-800">
                <FileText className="h-4 w-4" />
                Assessments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{totalAssessments}</p>
                  <p className="text-sm text-gray-600">completed tests</p>
                </div>
                <div className="text-blue-500">
                  <BarChart2 className="h-8 w-8" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-50 to-orange-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-amber-800">
                <Award className="h-4 w-4" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">5</p>
                  <p className="text-sm text-gray-600">badges earned</p>
                </div>
                <div className="flex">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-6 h-6 rounded-full bg-amber-100 border-2 border-white -ml-2 flex items-center justify-center">
                      <Star className="h-3 w-3 text-amber-500 fill-current" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button asChild className="h-28 flex flex-col items-center justify-center gap-3 bg-blue-50 hover:bg-blue-100 border border-blue-200">
              <Link href="/assessment/select">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <span className="font-medium text-blue-800">Learn</span>
              </Link>
            </Button>
            <Button asChild className="h-28 flex flex-col items-center justify-center gap-3 bg-green-50 hover:bg-green-100 border border-green-200">
              <Link href="/assessment/select">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FileText className="h-6 w-6 text-green-600" />
                </div>
                <span className="font-medium text-green-800">Practice</span>
              </Link>
            </Button>
            <Button asChild className="h-28 flex flex-col items-center justify-center gap-3 bg-purple-50 hover:bg-purple-100 border border-purple-200">
              <Link href="/assessments">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <BarChart2 className="h-6 w-6 text-purple-600" />
                </div>
                <span className="font-medium text-purple-800">Assess</span>
              </Link>
            </Button>
            <Button asChild className="h-28 flex flex-col items-center justify-center gap-3 bg-amber-50 hover:bg-amber-100 border border-amber-200">
              <Link href="/bookmarks">
                <div className="p-3 bg-amber-100 rounded-lg">
                  <Bookmark className="h-6 w-6 text-amber-600" />
                </div>
                <span className="font-medium text-amber-800">Bookmarks</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Recent Activity & Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-blue-50 rounded-t-lg border-b border-blue-100">
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-blue-800">
                <History className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {recentActivities.length === 0 ? (
                <div className="p-6 text-center text-gray-400">
                  <p>No recent activity yet</p>
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {recentActivities.map((activity) => (
                    <li key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${
                          activity.score/activity.totalQuestions >= 0.7 ? 
                          'bg-green-100 text-green-600' : 
                          'bg-blue-100 text-blue-600'
                        }`}>
                          {activity.score/activity.totalQuestions >= 0.7 ? (
                            <Award className="h-5 w-5" />
                          ) : (
                            <FileText className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{activity.subjectName}</p>
                          <p className="text-sm text-gray-500">
                            Scored {activity.score}/{activity.totalQuestions}
                          </p>
                        </div>
                        <div className="text-sm text-gray-400">
                          {new Date(activity.takenAt).toLocaleDateString()}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* Recommended Resources */}
          <Card className="border-0 shadow-sm">
            <CardHeader className="bg-purple-50 rounded-t-lg border-b border-purple-100">
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-purple-800">
                <BookOpen className="h-5 w-5" />
                Recommended For You
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-gray-100">
                {recommendedResources.map((resource, index) => (
                  <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-indigo-100 rounded-lg">
                        {resource.type === "Video lesson" ? (
                          <BookOpen className="h-5 w-5 text-indigo-600" />
                        ) : (
                          <FileText className="h-5 w-5 text-indigo-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{resource.title}</p>
                        <p className="text-sm text-gray-500 mb-2">
                          {resource.type} • {resource.duration || resource.questions}
                        </p>
                        <Button variant="link" className="p-0 h-auto text-indigo-600 hover:text-indigo-700">
                          {resource.type === "Video lesson" ? "Watch now" : "Start now"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Suspense>
  );
}