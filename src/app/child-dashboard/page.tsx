import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, BarChart2, Award } from "lucide-react";
import Link from "next/link";
import { getServerSession, getSession } from '@/lib/session';
import { redirect } from "next/navigation";

export default async function ChildDashboard() {
  const session = await getServerSession();
  
  if (!session?.user) {
    redirect('/auth/login');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome back, {session.user.childName}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              Current Subject
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{session.user.currentSubject || 'Not set'}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              Your Grade
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{session.user.grade?.replace('GRADE_', 'Grade ') || 'Not set'}</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-green-500" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">View Reports</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              Start New Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Take a diagnostic test to measure your skills.</p>
            <Button asChild className="w-full">
              <Link href="/assessment/select">Begin Assessment</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-green-500" />
              View Past Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Review your previous assessment results.</p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/assessment/results">View History</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}