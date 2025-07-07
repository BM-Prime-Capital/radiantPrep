// src/components/assessment/StudyCoach.tsx
'use client';

import { useState, useEffect } from 'react';
import type { AssessmentResult, AssessmentResultAnswer, Grade, Subject } from '@/lib/types';
import { BookOpen, Calculator, Lightbulb, Target, Clock, TrendingUp, BarChart2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface StudyCoachProps {
  assessmentResult: AssessmentResult;
  studentName: string;
}

export function StudyCoach({ assessmentResult, studentName }: StudyCoachProps) {
  const [activeTab, setActiveTab] = useState<'analysis' | 'plan' | 'resources'>('analysis');
  const [isLoading, setIsLoading] = useState(true);
  const [studyPlan, setStudyPlan] = useState<StudyPlan>({
    focusAreas: [],
    weeklySchedule: [],
    resources: []
  });

  useEffect(() => {
    // Simulate AI analysis
    const timer = setTimeout(() => {
      generateStudyPlan();
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [assessmentResult]);

  const generateStudyPlan = () => {
    const percentage = Math.round((assessmentResult.score / assessmentResult.totalQuestions) * 100);
    const incorrectAnswers = assessmentResult.answers.filter(answer => !answer.isCorrect);
    
    // Analyze weak areas
    const weakAreas = analyzeWeakAreas(incorrectAnswers);
    
    // Generate personalized study plan
    const generatedPlan: StudyPlan = {
      focusAreas: weakAreas,
      weeklySchedule: generateWeeklySchedule(weakAreas, percentage),
      resources: getRecommendedResources(assessmentResult.subject, assessmentResult.grade, weakAreas)
    };
    
    setStudyPlan(generatedPlan);
  };

  const analyzeWeakAreas = (incorrectAnswers: AssessmentResultAnswer[]) => {
    // This would be more sophisticated in a real implementation
    const areas: FocusArea[] = [];
    
    // Group by question type/category
    const categoryMap = new Map<string, number>();
    
    incorrectAnswers.forEach(answer => {
      // This would use actual question data in a real implementation
      const category = "General Concept"; // Placeholder
      categoryMap.set(category, (categoryMap.get(category) || 0) + 1);
    });
    
    // Convert to focus areas
    categoryMap.forEach((count, category) => {
      areas.push({
        name: category,
        priority: count / incorrectAnswers.length * 100,
        description: getAreaDescription(category, assessmentResult.subject)
      });
    });
    
    // Sort by priority
    return areas.sort((a, b) => b.priority - a.priority);
  };

  const getAreaDescription = (area: string, subject: Subject) => {
    // Placeholder - would be more detailed in real implementation
    if (subject === 'Math') {
      return `Practice ${area} problems to build confidence and accuracy.`;
    } else {
      return `Review ${area} concepts and practice application.`;
    }
  };

  const generateWeeklySchedule = (areas: FocusArea[], percentage: number) => {
    const schedule: StudySession[] = [];
    const totalHours = percentage < 60 ? 5 : percentage < 80 ? 3 : 2;
    
    areas.slice(0, 3).forEach((area, index) => {
      const hours = Math.max(1, Math.round(totalHours * (area.priority / 100)));
      
      schedule.push({
        day: index === 0 ? 'Monday' : index === 1 ? 'Wednesday' : 'Friday',
        duration: `${hours} hour${hours > 1 ? 's' : ''}`,
        focus: area.name,
        activities: getSessionActivities(area.name, assessmentResult.subject, assessmentResult.grade)
      });
    });
    
    return schedule;
  };

  const getSessionActivities = (area: string, subject: Subject, grade: Grade) => {
    // Placeholder activities
    if (subject === 'Math') {
      return [
        `Watch instructional video on ${area}`,
        `Complete 10 practice problems`,
        `Review mistakes with tutor/parent`
      ];
    } else {
      return [
        `Read passage about ${area}`,
        `Answer comprehension questions`,
        `Write short summary`
      ];
    }
  };

  const getRecommendedResources = (subject: Subject, grade: Grade, areas: FocusArea[]) => {
    // Placeholder resources - would be more extensive in real implementation
    return areas.slice(0, 3).map(area => ({
      title: `${subject} Grade ${grade} - ${area.name}`,
      type: 'Video Lesson' as const,
      url: '#',
      description: `Interactive lesson covering ${area.name} concepts`
    }));
  };

  const getPerformanceFeedback = () => {
    const percentage = Math.round((assessmentResult.score / assessmentResult.totalQuestions) * 100);
    
    if (percentage >= 80) {
      return {
        message: "Excellent Work!",
        description: `${studentName} has demonstrated a strong understanding of ${assessmentResult.subject} concepts. The focus should be on maintaining skills and tackling more challenging material.`,
        color: "bg-emerald-100 text-emerald-800",
        icon: <TrendingUp className="h-6 w-6" />
      };
    } else if (percentage >= 60) {
      return {
        message: "Good Progress!",
        description: `${studentName} is on the right track but has some areas to strengthen. With focused practice, they can improve their understanding.`,
        color: "bg-blue-100 text-blue-800",
        icon: <BarChart2 className="h-6 w-6" />
      };
    } else {
      return {
        message: "Let's Improve!",
        description: `${studentName} needs additional support in ${assessmentResult.subject}. Targeted practice in weak areas will help build confidence and skills.`,
        color: "bg-amber-100 text-amber-800",
        icon: <Target className="h-6 w-6" />
      };
    }
  };

  const feedback = getPerformanceFeedback();

  return (
    <div className="mt-12 max-w-6xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <Lightbulb className="text-yellow-500" />
        <span>Study Coach</span>
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-1"
        >
          <Card className="h-full shadow-sm border-0 bg-gradient-to-br from-gray-50 to-white">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-3">
                {feedback.icon}
                <span>Performance Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className={feedback.color + " p-4 rounded-lg"}>
                  <h3 className="font-bold text-lg">{feedback.message}</h3>
                  <p className="text-sm mt-2">{feedback.description}</p>
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Overall Score</span>
                    <span className="text-sm font-bold">
                      {Math.round((assessmentResult.score / assessmentResult.totalQuestions) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={Math.round((assessmentResult.score / assessmentResult.totalQuestions) * 100)} 
                    className="h-2"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                    <p className="text-xs text-green-800">Correct</p>
                    <p className="text-xl font-bold text-green-600">{assessmentResult.score}</p>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg border border-red-100">
                    <p className="text-xs text-red-800">Incorrect</p>
                    <p className="text-xl font-bold text-red-600">{assessmentResult.totalQuestions - assessmentResult.score}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="shadow-sm border-0">
            <CardHeader className="border-b">
              <div className="flex space-x-4">
                <Button 
                  variant={activeTab === 'analysis' ? 'default' : 'ghost'} 
                  onClick={() => setActiveTab('analysis')}
                  className="gap-2"
                >
                  <Target className="h-4 w-4" />
                  Analysis
                </Button>
                <Button 
                  variant={activeTab === 'plan' ? 'default' : 'ghost'} 
                  onClick={() => setActiveTab('plan')}
                  className="gap-2"
                >
                  <Clock className="h-4 w-4" />
                  Study Plan
                </Button>
                <Button 
                  variant={activeTab === 'resources' ? 'default' : 'ghost'} 
                  onClick={() => setActiveTab('resources')}
                  className="gap-2"
                >
                  <BookOpen className="h-4 w-4" />
                  Resources
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-6">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                  <p>Analyzing your results...</p>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'analysis' && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-bold">Focus Areas</h3>
                        <div className="space-y-4">
                          {studyPlan.focusAreas.map((area, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{area.name}</h4>
                                  <p className="text-sm text-muted-foreground mt-1">{area.description}</p>
                                </div>
                                <Badge variant="outline" className="ml-2">
                                  Priority: {Math.round(area.priority)}%
                                </Badge>
                              </div>
                              <Progress 
                                value={area.priority} 
                                className="h-2 mt-3"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 'plan' && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-bold">Personalized Study Plan</h3>
                        <div className="space-y-4">
                          {studyPlan.weeklySchedule.map((session, index) => (
                            <div key={index} className="border rounded-lg p-4">
                              <div className="flex justify-between items-center">
                                <h4 className="font-medium">{session.day}</h4>
                                <Badge variant="outline">{session.duration}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">Focus: {session.focus}</p>
                              <ul className="mt-3 space-y-2">
                                {session.activities.map((activity, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="text-xs mt-1">•</span>
                                    <span className="text-sm">{activity}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {activeTab === 'resources' && (
                      <div className="space-y-6">
                        <h3 className="text-xl font-bold">Recommended Resources</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {studyPlan.resources.map((resource, index) => (
                            <Card key={index} className="hover:shadow-md transition-shadow">
                              <CardHeader className="pb-3">
                                <CardTitle className="text-lg">{resource.title}</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <p className="text-sm text-muted-foreground">{resource.description}</p>
                              </CardContent>
                              <CardFooter>
                                <Button variant="outline" size="sm" className="w-full">
                                  Access Resource
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

// Types
interface FocusArea {
  name: string;
  priority: number;
  description: string;
}

interface StudySession {
  day: string;
  duration: string;
  focus: string;
  activities: string[];
}

interface StudyResource {
  title: string;
  type: 'Video Lesson' | 'Practice Worksheet' | 'Interactive Game' | 'Reading Material';
  url: string;
  description: string;
}

interface StudyPlan {
  focusAreas: FocusArea[];
  weeklySchedule: StudySession[];
  resources: StudyResource[];
}