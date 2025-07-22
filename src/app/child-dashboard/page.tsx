'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { Assessment, isChild } from '@/lib/types';
import { ChevronLeft, LucideIcon } from 'lucide-react';
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
  // const [stats, setStats] = useState<any[]>([]);
  // const [recentAssessments, setRecentAssessments] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [assessmentsPerPage] = useState(5);

  const [recentAssessments, setRecentAssessments] = useState<Assessment[]>([]);
  const [stats, setStats] = useState<{
    title: string;
    value: string | number;
    icon: LucideIcon;
    color: string;
    bgColor: string;
  }[]>([]);

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
  async function fetchDashboardData() {
    try {
      // Récupère les évaluations et les stats
      const [assessmentsRes, statsRes] = await Promise.all([
        fetch('/api/assessments'),
        fetch('/api/assessments/stats')
      ]);

      if (!assessmentsRes.ok || !statsRes.ok) {
        throw new Error('Failed to fetch data');
      }

      const [assessments, statsData] = await Promise.all([
        assessmentsRes.json(),
        statsRes.json()
      ]);

      setRecentAssessments(assessments);

      // Formatage des statistiques
      setStats([
        {
          title: 'Total Assessments',
          value: statsData.totalAssessments,
          icon: FileText,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
        },
        {
          title: 'Avg Score',
          value: `${statsData.averageScore}%`,
          icon: Award,
          color: 'text-green-600',
          bgColor: 'bg-green-100',
        },
        {
          title: 'Current Streak',
          value: `${statsData.currentStreak} days`,
          icon: Clock,
          color: 'text-purple-600',
          bgColor: 'bg-purple-100',
        },
      ]);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      // Vous pourriez ajouter un état pour gérer les erreurs ici
    }
  }

  fetchDashboardData();
}, []);

  // Calculate current assessments for pagination
  const indexOfLastAssessment = currentPage * assessmentsPerPage;
  const indexOfFirstAssessment = indexOfLastAssessment - assessmentsPerPage;
  const currentAssessments = recentAssessments.slice(indexOfFirstAssessment, indexOfLastAssessment);
  const totalPages = Math.ceil(recentAssessments.length / assessmentsPerPage);

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

      {/* Header de la Sidebar */}
      <div className="flex items-center justify-between p-5 bg-white border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-6 bg-gray-50 rounded-lg flex items-center justify-center">
            <img 
              src="/newlogo.png" 
              alt="Logo" 
              className="w-5 h-5 object-contain"
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Radiant Prep</h2>
            {/* <p className="text-xs text-gray-500">Student Portal</p> */}
          </div>
        </div>
        {mobile && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
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
        {/* Header principal */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
          <div className="px-5 sm:px-6 h-14 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSidebarOpen(true)} 
                className="lg:hidden text-gray-500 hover:bg-gray-100"
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              {/* Nouvelle version unifiée */}
              <div className="flex items-center">
                <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center mr-2">
                  <BarChart2 className="h-4 w-4 text-primary" />
                </div>
                <h1 className="text-base font-medium text-gray-800">Student Dashboard</h1>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-500 hover:bg-gray-100 relative"
              >
                <Bell className="h-[18px] w-[18px]" />
                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-red-400 rounded-full border border-white"></span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-full p-0 w-9 h-9 hover:bg-gray-100"
                  >
                    <Avatar className="h-8 w-8 border border-gray-200">
                      <AvatarImage src={user?.avatarUrl || ''} />
                      <AvatarFallback className="bg-primary text-white">
                        {user?.childName?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56 rounded-md shadow-lg border border-gray-200">
                  <DropdownMenuLabel className="font-normal py-2">
                    <div className="flex flex-col">
                      <span className="font-medium">{user?.childName || 'Student'}</span>
                      <span className="text-xs text-gray-500">Student Account</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center w-full px-2 py-2 text-sm rounded-sm hover:bg-gray-100">
                      <User className="w-4 h-4 mr-2 text-gray-600" /> 
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center w-full px-2 py-2 text-sm rounded-sm hover:bg-gray-100">
                      <Settings className="w-4 h-4 mr-2 text-gray-600" /> 
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={logout} 
                    className="text-red-500 px-2 py-2 text-sm rounded-sm hover:bg-red-50 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 mr-2" /> 
                    Logout
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
                    <motion.div 
                      key={currentPage}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      {currentAssessments.length > 0 ? (
                        currentAssessments.map((assessment) => (
                          <div
                            key={assessment.id}
                            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center space-x-4">
                              <div className={`p-3 rounded-lg ${
                                assessment.subjectName === 'Math' 
                                  ? 'bg-blue-100 text-blue-600' 
                                  : 'bg-purple-100 text-purple-600'
                              }`}>
                                {assessment.subjectName === 'Math' ? (
                                  <Calculator className="h-5 w-5" />
                                ) : (
                                  <BookOpen className="h-5 w-5" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium">
                                  {assessment.subjectName} - Grade {assessment.gradeLevel.split('_')[1]}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {new Date(assessment.takenAt).toLocaleDateString('fr-FR', {
                                    day: 'numeric',
                                    month: 'short',
                                    year: 'numeric'
                                  })}
                                </p>
                              </div>
                            </div>
                            <Badge variant={
                              Math.round(assessment.score / assessment.totalQuestions * 100) > 85
                                ? 'success'
                                : Math.round(assessment.score / assessment.totalQuestions * 100) > 70
                                ? 'warning'
                                : 'destructive'
                            }>
                              {Math.round(assessment.score / assessment.totalQuestions * 100)}%
                            </Badge>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No assessments found
                        </div>
                      )}
                    </motion.div>

                    {/* Pagination Controls */}
                    {recentAssessments.length > assessmentsPerPage && (
                      <div className="flex items-center justify-center gap-4 mt-6">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="gap-1"
                        >
                          <ChevronLeft className="h-4 w-4" />
                          Previous
                        </Button>
                        <div className="flex items-center gap-2">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                              key={page}
                              variant={page === currentPage ? "default" : "outline"}
                              size="sm"
                              className="w-10 h-10 p-0"
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </Button>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="gap-1"
                        >
                          Next
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
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