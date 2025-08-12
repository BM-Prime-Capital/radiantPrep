'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import ChildLayout from '@/components/layout/ChildLayout';
import { useAuth } from '@/contexts/AuthContext';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

import {
  User,
  Pencil,
  Lock,
  BookOpen,
  GraduationCap,
  Mail,
  ChevronRight,
  Shield,
  BadgeCheck,
} from 'lucide-react';

import type { ChildInformation, ParentUser } from '@/lib/types';

function isChild(user: ParentUser | ChildInformation | null): user is ChildInformation {
  return !!user && (user as ChildInformation).childName !== undefined;
}
function isParent(user: ParentUser | ChildInformation | null): user is ParentUser {
  return !!user && (user as ParentUser).email !== undefined;
}

export default function ProfilePage() {
  const { isAuthenticated, isLoading: authLoading, user, role, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.replace('/auth/login');
  }, [authLoading, isAuthenticated, router]);

  if (authLoading) {
    return (
      <ChildLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      </ChildLayout>
    );
  }
  if (!user) return null;

  return (
    <ChildLayout>
      <div className="px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile */}
            <div className="md:w-1/3 space-y-6">
              <Card className="border-0 bg-gradient-to-br from-primary to-accent text-white shadow-xl">
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
                      <Badge className="flex items-center gap-1 py-1.5 px-3 bg-white/15 hover:bg-white/25 text-white backdrop-blur-sm">
                        {role === 'CHILD' ? (
                          <>
                            <GraduationCap className="h-4 w-4" />
                            <span className="font-medium">Student</span>
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
                    className="w-full justify-start gap-2 bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/40"
                    onClick={() => router.push('/profile/update')}
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="font-medium">Edit Profile</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-2 bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/40"
                    onClick={() => router.push('/profile/change-password')}
                  >
                    <Lock className="h-4 w-4" />
                    <span className="font-medium">Change Password</span>
                  </Button>
                </CardContent>
              </Card>

              {/* Account Status */}
              <Card className="border-0 bg-gradient-to-br from-primary to-accent text-white shadow-xl">
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
                    className="w-full bg-white/10 hover:bg-white/20 text-white border-white/30 hover:border-white/40 font-medium"
                    onClick={() => logout()}
                  >
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Info + Actions */}
            <div className="md:w-2/3 space-y-6">
              <Card className="border border-green-100 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-green-800 font-semibold">
                    <User className="h-5 w-5 text-primary" />
                    Personal Information
                  </CardTitle>
                  <CardDescription className="text-green-700/80">
                    {role === 'CHILD' ? 'Student details' : 'Parent account information'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isChild(user) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-green-700/80">Full Name</h3>
                        <p className="text-lg font-semibold text-green-900">{user.childName}</p>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-green-700/80">Access Code</h3>
                        <p className="text-lg font-mono font-semibold bg-green-50 text-green-900 p-2 rounded-md inline-block">
                          {user.accessCode}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-green-700/80">Grade Level</h3>
                        <p className="text-lg font-semibold text-green-900">
                          {user.grade ? String(user.grade).replace('GRADE_', 'Grade ') : 'Not specified'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-green-700/80">Current Subject</h3>
                        <p className="text-lg font-semibold text-green-900">{user.subject || 'Not specified'}</p>
                      </div>
                    </div>
                  )}

                  {isParent(user) && (
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-green-700/80">Email</h3>
                        <p className="text-lg font-semibold text-green-900">{user.email}</p>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium text-green-700/80">Account Type</h3>
                        <p className="text-lg font-semibold text-green-900">Parent Account</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border border-green-100 bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg text-green-800 font-semibold">Quick Actions</CardTitle>
                  <CardDescription className="text-green-700/80">
                    {role === 'CHILD' ? 'Learning shortcuts' : 'Manage your family accounts'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {isChild(user) && (
                    <>
                      <Button
                        asChild
                        variant="outline"
                        className="h-auto py-4 px-4 hover:bg-green-50 border-green-200 bg-white"
                      >
                        <Link href="/child-dashboard" className="flex items-center justify-start gap-4">
                          <div className="p-2 rounded-lg bg-green-100">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-green-900">Learning Dashboard</div>
                            <div className="text-sm text-green-700/80">View your progress</div>
                          </div>
                          <ChevronRight className="h-5 w-5 ml-auto text-green-400" />
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="h-auto py-4 px-4 hover:bg-green-50 border-green-200 bg-white"
                      >
                        <Link href="/assessment/select" className="flex items-center justify-start gap-4">
                          <div className="p-2 rounded-lg bg-green-100">
                            <GraduationCap className="h-5 w-5 text-primary" />
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-green-900">New Assessment</div>
                            <div className="text-sm text-green-700/80">Take a test</div>
                          </div>
                          <ChevronRight className="h-5 w-5 ml-auto text-green-400" />
                        </Link>
                      </Button>
                    </>
                  )}

                  {isParent(user) && (
                    <>
                      <Button
                        asChild
                        variant="outline"
                        className="h-auto py-4 px-4 hover:bg-green-50 border-green-200 bg-white"
                      >
                        <Link href="/parent-dashboard" className="flex items-center justify-start gap-4">
                          <div className="p-2 rounded-lg bg-green-100">
                            <BookOpen className="h-5 w-5 text-primary" />
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-green-900">Children Management</div>
                            <div className="text-sm text-green-700/80">View all accounts</div>
                          </div>
                          <ChevronRight className="h-5 w-5 ml-auto text-green-400" />
                        </Link>
                      </Button>
                      <Button
                        asChild
                        variant="outline"
                        className="h-auto py-4 px-4 hover:bg-green-50 border-green-200 bg-white"
                      >
                        <Link href="/children/new" className="flex items-center justify-start gap-4">
                          <div className="p-2 rounded-lg bg-green-100">
                            <Mail className="h-5 w-5 text-primary" />
                          </div>
                          <div className="text-left">
                            <div className="font-semibold text-green-900">Add New Child</div>
                            <div className="text-sm text-green-700/80">Register student</div>
                          </div>
                          <ChevronRight className="h-5 w-5 ml-auto text-green-400" />
                        </Link>
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </ChildLayout>
  );
}
