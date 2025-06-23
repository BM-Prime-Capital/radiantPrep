'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { User, Pencil, Lock, BookOpen, GraduationCap, Mail, ChevronRight, Shield, BadgeCheck } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { ChildInformation, ParentUser } from '@/lib/types';
import { useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

function isChild(user: ParentUser | ChildInformation | null): user is ChildInformation {
  return (user as ChildInformation)?.childName !== undefined;
}

function isParent(user: ParentUser | ChildInformation | null): user is ParentUser {
  return (user as ParentUser)?.email !== undefined;
}

export default function ProfilePage() {
  const { user, role, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl bg-gradient-to-b from-indigo-50/30 to-white">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Section */}
        <div className="md:w-1/3 space-y-6">
          <Card className="border-0 bg-gradient-to-br from-indigo-600 to-indigo-400 text-white shadow-xl">
            <CardHeader className="items-center pb-4">
              <Avatar className="h-32 w-32 mb-4 border-4 border-white/30 shadow-lg">
                <AvatarImage src="/avatars/default.png" />
                <AvatarFallback className="bg-white/20 text-white text-3xl font-bold">
                  {isChild(user) 
                    ? user.childName?.charAt(0).toUpperCase() 
                    : isParent(user) 
                      ? user.email?.charAt(0).toUpperCase()
                      : 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="text-center space-y-2">
                <CardTitle className="text-2xl font-bold tracking-tight">
                  {isChild(user) ? user.childName : isParent(user) ? user.email : 'User'}
                </CardTitle>
                <div className="flex justify-center">
                  <Badge variant="secondary" className="flex items-center gap-1 py-1.5 px-3 bg-white/15 hover:bg-white/25 backdrop-blur-sm">
                    {role === 'child' ? (
                      <>
                        <GraduationCap className="h-4 w-4" />
                        <span className="font-medium text-yellow-500">Student</span>
                      </>
                    ) : (
                      <>
                        <Shield className="h-4 w-4" />
                        <span className="font-medium">Parent</span>
                      </>
                    )}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 bg-white/10 hover:bg-white/20 text-white hover:text-white border-white/30 hover:border-white/40 transition-all"
                onClick={() => router.push('/profile/update')}
              >
                <Pencil className="h-4 w-4" />
                <span className="font-medium">Edit Profile</span>
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-2 bg-white/10 hover:bg-white/20 text-white hover:text-white border-white/30 hover:border-white/40 transition-all"
                onClick={() => router.push('/profile/change-password')}
              >
                <Lock className="h-4 w-4" />
                <span className="font-medium">Change Password</span>
              </Button>
            </CardContent>
          </Card>

          {/* Account Status Card */}
          <Card className="border-0 bg-gradient-to-br from-violet-600 to-violet-500 text-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2 font-semibold">
                <BadgeCheck className="h-5 w-5" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <div className="p-1.5 rounded-full bg-white/20">
                  <BadgeCheck className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium">Active</p>
                  <p className="text-sm text-white/90">Your account is active</p>
                </div>
              </div>
              <Separator className="bg-white/30" />
              <Button 
                variant="outline" 
                className="w-full bg-white/10 hover:bg-white/20 text-white hover:text-white border-white/30 hover:border-white/40 transition-all font-medium"
                onClick={() => {
                  logout();
                  router.push('/');
                }}
              >
                Sign Out
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Information Section */}
        <div className="md:w-2/3 space-y-6">
          {/* Personal Information Card */}
          <Card className="border-0 bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-indigo-800 font-semibold">
                <User className="h-5 w-5 text-indigo-600" />
                Personal Information
              </CardTitle>
              <CardDescription className="text-indigo-600/90">
                {role === 'child' ? 'Student details' : 'Parent account information'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isChild(user) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-indigo-600/90">Full Name</h3>
                    <p className="text-lg font-semibold text-indigo-900">{user.childName}</p>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-indigo-600/90">Access Code</h3>
                    <p className="text-lg font-mono font-semibold bg-indigo-50 text-indigo-900 p-2 rounded-md inline-block">
                      {user.accessCode}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-indigo-600/90">Grade Level</h3>
                    <p className="text-lg font-semibold text-indigo-900">
                      {user.grade ? String(user.grade).replace('GRADE_', 'Grade ') : 'Not specified'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-indigo-600/90">Current Subject</h3>
                    <p className="text-lg font-semibold text-indigo-900">{user.subject || 'Not specified'}</p>
                  </div>
                </div>
              )}

              {isParent(user) && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-indigo-600/90">Email</h3>
                    <p className="text-lg font-semibold text-indigo-900">{user.email}</p>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-indigo-600/90">Account Type</h3>
                    <p className="text-lg font-semibold text-indigo-900">Parent Account</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg text-indigo-800 font-semibold">Quick Actions</CardTitle>
              <CardDescription className="text-indigo-600/90">
                {role === 'child' ? 'Learning shortcuts' : 'Manage your family accounts'}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isChild(user) && (
                <>
                  <Button asChild variant="outline" className="h-auto py-4 px-4 hover:bg-indigo-50 border-indigo-200 bg-white transition-all">
                    <Link href="/child-dashboard" className="flex items-center justify-start gap-4">
                      <div className="p-2 rounded-lg bg-indigo-100">
                        <BookOpen className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-indigo-900">Learning Dashboard</div>
                        <div className="text-sm text-indigo-600/90">View your progress</div>
                      </div>
                      <ChevronRight className="h-5 w-5 ml-auto text-indigo-400" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto py-4 px-4 hover:bg-indigo-50 border-indigo-200 bg-white transition-all">
                    <Link href="/assessment/select" className="flex items-center justify-start gap-4">
                      <div className="p-2 rounded-lg bg-indigo-100">
                        <GraduationCap className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-indigo-900">New Assessment</div>
                        <div className="text-sm text-indigo-600/90">Take a test</div>
                      </div>
                      <ChevronRight className="h-5 w-5 ml-auto text-indigo-400" />
                    </Link>
                  </Button>
                </>
              )}

              {isParent(user) && (
                <>
                  <Button asChild variant="outline" className="h-auto py-4 px-4 hover:bg-indigo-50 border-indigo-200 bg-white transition-all">
                    <Link href="/parent-dashboard" className="flex items-center justify-start gap-4">
                      <div className="p-2 rounded-lg bg-indigo-100">
                        <BookOpen className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-indigo-900">Children Management</div>
                        <div className="text-sm text-indigo-600/90">View all accounts</div>
                      </div>
                      <ChevronRight className="h-5 w-5 ml-auto text-indigo-400" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto py-4 px-4 hover:bg-indigo-50 border-indigo-200 bg-white transition-all">
                    <Link href="/children/new" className="flex items-center justify-start gap-4">
                      <div className="p-2 rounded-lg bg-indigo-100">
                        <Mail className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="text-left">
                        <div className="font-semibold text-indigo-900">Add New Child</div>
                        <div className="text-sm text-indigo-600/90">Register student</div>
                      </div>
                      <ChevronRight className="h-5 w-5 ml-auto text-indigo-400" />
                    </Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}