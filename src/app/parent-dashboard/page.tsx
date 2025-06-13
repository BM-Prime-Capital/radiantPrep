import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen, BarChart2, PlusCircle } from "lucide-react";
import Link from "next/link";
import { getServerSession, getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function ParentDashboard() {
  const session = await getServerSession();
  
  if (!session?.user) {
    redirect('/auth/login');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome back, {session.user.email}!</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              Manage Children
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">View and manage your children's accounts.</p>
            <Button asChild className="w-full">
              <Link href="/children">View Children</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-green-500" />
              Add New Child
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Register a new child account.</p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/children/new">Register Child</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="hover:shadow-lg transition-shadow mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-purple-500" />
            Recent Assessments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Placeholder for recent assessments */}
          <div className="text-center py-8 text-gray-500">
            No recent assessments to display
          </div>
        </CardContent>
      </Card>

      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-orange-500" />
            Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Placeholder for progress charts */}
          <div className="text-center py-8 text-gray-500">
            Progress charts will appear here
          </div>
        </CardContent>
      </Card>
    </div>
  );
}