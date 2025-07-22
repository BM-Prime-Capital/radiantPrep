// child-dashboard/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { isChild } from '@/lib/types';
import {
  BookOpen,
  BarChart2,
  Award,
  FileText,
  History,
  Trophy,
  Clock,
  User,
  Settings,
  LogOut,
  ChevronRight,
  Search,
  Menu,
  X,
  PlusCircle,
  Bookmark,
  CheckCircle,
  HelpCircle,
  Calculator,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ChildDashboard = () => {
  const { isAuthenticated, user, role, logout, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSubject, setCurrentSubject] = useState<string | null>(null);
  const [currentGrade, setCurrentGrade] = useState<string | null>(null);
  const [stats, setStats] = useState<any[]>([]);
  const [recentAssessments, setRecentAssessments] = useState<any[]>([]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isChild(user)) {
      setCurrentSubject(user.currentSubject || null);
      setCurrentGrade(`Grade ${user.grade}`);
    }
  }, [user]);

  useEffect(() => {
    async function fetchAssessments() {
      try {
        const res = await fetch('/api/assessments');
        const data = await res.json();

        setRecentAssessments(data || []);

        const total = data.length;
        const avg =
          total > 0
            ? Math.round(
                data.reduce((acc: number, a: any) => acc + a.score, 0) / total
              )
            : 0;

        setStats([
          {
            title: 'Total Assessments',
            value: total,
            icon: FileText,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
          },
          {
            title: 'Avg Score',
            value: `${avg}%`,
            icon: Award,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
          },
          {
            title: 'Current Streak',
            value: '5 days',
            icon: Clock,
            color: 'text-purple-600',
            bgColor: 'bg-purple-100',
          },
        ]);
      } catch (err) {
        console.error('❌ Failed to fetch assessments:', err);
      }
    }

    fetchAssessments();
  }, []);

  const quickActions = [
    {
      label: "Start New Assessment",
      icon: PlusCircle,
      onClick: () => router.push("/assessment/select"),
    },
    {
      label: "View Past Results",
      icon: History,
      onClick: () => router.push("/assessment/results"),
    },
    {
      label: "Bookmarked Questions",
      icon: Bookmark,
      onClick: () => router.push("/bookmarks"),
    },
    {
      label: "Get Help",
      icon: HelpCircle,
      onClick: () => router.push("/help"),
    },
  ];

  if (authLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const navigationItems = [
    { name: "Dashboard", href: "/child-dashboard", icon: BookOpen },
    { name: "Assessments", href: "/assessment/select", icon: FileText },
    { name: "Progress", href: "/progress", icon: BarChart2 },
    { name: "Achievements", href: "/achievements", icon: Trophy, badge: "3" },
  ];

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
            <BookOpen className="text-white h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Radiant Prep</h2>
            <p className="text-xs text-gray-500">Student Dashboard</p>
          </div>
        </div>
        {mobile && (
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <button
              key={item.name}
              onClick={() => router.push(item.href)}
              className={`group w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-primary to-accent text-white shadow-lg transform scale-[1.02]"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center">
                <item.icon
                  className={`h-4 w-4 mr-3 transition-colors ${
                    isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"
                  }`}
                />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className={`inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  isActive ? "bg-white/20 text-white" : "bg-primary-100 text-primary-700"
                }`}>
                  {item.badge}
                </span>
              )}
              {isActive && <ChevronRight className="h-3 w-3 text-white" />}
            </button>
          );
        })}
      </nav>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100/50">
      {/* Sidebar (mobile & desktop) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm"></div>
        </div>
      )}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <Sidebar mobile />
      </div>
      <div className="fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-lg border-r border-gray-200 hidden lg:block">
        <Sidebar />
      </div>

      {/* Content */}
      <div className="lg:ml-72">
      {/* Header with profile/settings/logout */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-200/60 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 flex items-center">
                Student Dashboard
                <div className="ml-3 h-2 w-2 bg-green-400 rounded-full animate-pulse"></div>
              </h1>
              <p className="text-sm text-gray-600 mt-0.5">
                Welcome back, {isChild(user) ? user.childName : 'Student'}!
              </p>
            </div>
          </div>
          {/* <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>
            <Link href="/profile">
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4 mr-1" /> Profile
              </Button>
            </Link>
            <Link href="/settings">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4 mr-1" /> Settings
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </Button>
          </div> */}
          <div className="flex items-center space-x-2">
  <Button variant="ghost" size="sm" className="relative">
    <Bell className="h-4 w-4" />
    <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full"></span>
  </Button>

  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="sm" className="rounded-full p-0 w-9 h-9">
        <Avatar className="h-9 w-9">
          <AvatarImage src={user?.avatarUrl || ''} alt="User Avatar" />
          <AvatarFallback>{user?.childName?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" className="w-48">
      <DropdownMenuLabel>{user?.childName || 'Student'}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <Link href="/profile" className="flex items-center">
          <User className="w-4 h-4 mr-2" /> Profile
        </Link>
      </DropdownMenuItem>
      <DropdownMenuItem asChild>
        <Link href="/settings" className="flex items-center">
          <Settings className="w-4 h-4 mr-2" /> Settings
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
        <LogOut className="w-4 h-4 mr-2" /> Logout
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>

        </div>
      </header>


        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-slideInUp">
              {/* Welcome Banner */}
              <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-6 text-white mb-8">
                <div className="flex flex-col md:flex-row items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Hello, {user.childName || 'Student'}!</h2>
                    <p className="opacity-90">
                      Ready to learn something new today? Let's make progress together!
                    </p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <Button
                      variant="secondary"
                      className="bg-white text-primary hover:bg-gray-100"
                      onClick={() => router.push('/assessment/select')}
                    >
                      Start New Assessment
                    </Button>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">{stat.title}</p>
                            <p className="text-2xl font-bold">{stat.value}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full h-full p-6 flex flex-col items-center justify-center hover:bg-gray-50 hover:border-primary hover:text-primary"
                      onClick={action.onClick}
                    >
                      <action.icon className="h-6 w-6 mb-2" />
                      <span>{action.label}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>

              {/* Current Status */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-500" />
                      Current Subject
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold">
                          {currentSubject || 'Not selected'}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {currentGrade || 'Grade not set'}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => router.push('/profile')}
                      >
                        Change
                      </Button>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500 mb-2">Progress</p>
                      <Progress value={75} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>0%</span>
                        <span>75%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      Recent Achievements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-yellow-100 rounded-full">
                          <Award className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div>
                          <p className="font-medium">Math Master</p>
                          <p className="text-sm text-gray-500">
                            Scored 90%+ on 3 math assessments
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-full">
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Perfect Score</p>
                          <p className="text-sm text-gray-500">
                            100% on ELA assessment
                          </p>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="link"
                      className="mt-4 p-0 text-primary"
                      onClick={() => router.push('/achievements')}
                    >
                      View all achievements
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Assessments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <History className="h-5 w-5 text-gray-700" />
                      Recent Assessments
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => router.push('/assessment/results')}
                    >
                      View All
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentAssessments.map((assessment) => (
                      <div
                        key={assessment.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center space-x-4">
                          <div
                            className={`p-3 rounded-lg ${
                              assessment.subject === 'Math'
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-purple-100 text-purple-600'
                            }`}
                          >
                            {assessment.subject === 'Math' ? (
                              <Calculator className="h-5 w-5" />
                            ) : (
                              <BookOpen className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{assessment.subject} Assessment</p>
                            <p className="text-sm text-gray-500">
                              {new Date(assessment.takenAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <Badge
                          variant={
                            parseInt(assessment.score) > 85
                              ? 'success'
                              : parseInt(assessment.score) > 70
                              ? 'warning'
                              : 'destructive'
                          }
                        >
                          {assessment.score}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChildDashboard;