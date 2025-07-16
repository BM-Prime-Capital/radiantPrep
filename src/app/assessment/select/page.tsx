'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { Subject, Grade, ChildInformation } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Calculator, ChevronRight, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '@/components/LoadingSpinner';

const subjects: Subject[] = ['ELA', 'Math'];

const SubjectCard = ({ 
  subject, 
  selected, 
  onClick 
}: { 
  subject: Subject; 
  selected: boolean; 
  onClick: () => void 
}) => {
  const theme = subject === 'ELA' ? {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: <BookOpen className="w-10 h-10 text-blue-600" />,
    text: 'text-blue-800',
    highlight: 'bg-blue-100'
  } : {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: <Calculator className="w-10 h-10 text-green-600" />,
    text: 'text-green-800',
    highlight: 'bg-green-100'
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`cursor-pointer transition-all ${selected ? 'ring-2 ring-blue-500' : ''}`}
      onClick={onClick}
    >
      <Card className={`${theme.bg} border ${theme.border} rounded-lg h-full transition-colors ${selected ? theme.highlight : ''}`}>
        <CardContent className="p-6 flex flex-col items-center">
          <div className="mb-4 p-3 bg-white rounded-lg border">
            {theme.icon}
          </div>
          <h3 className={`text-lg font-semibold text-center ${theme.text} mb-2`}>
            {subject === 'ELA' ? 'English Language Arts' : 'Mathematics'}
          </h3>
          <p className="text-sm text-gray-600 text-center">
            {subject === 'ELA' ? 'Reading & Writing Assessment' : 'Math Skills Evaluation'}
          </p>
          
          {selected && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mt-3 flex items-center gap-1 text-sm text-blue-600"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Selected</span>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function SelectAssessmentPage() {
  const { isAuthenticated, user, role, isLoading: authLoading, updateChildInfo } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const childUser = role === 'child' ? (user as ChildInformation) : null;
  const [selectedSubject, setSelectedSubject] = useState<Subject | undefined>();
  const [selectedGrade, setSelectedGrade] = useState<Grade | undefined>(() => childUser?.grade);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || role !== 'child') router.replace('/auth/login');
    if (childUser) {
      setSelectedGrade(childUser.grade);
    }
  }, [isAuthenticated, authLoading, router, childUser, role]);

  const handleStartAssessment = () => {
    if (!selectedSubject || !selectedGrade) {
      toast({
        title: 'Selection Required',
        description: 'Please select a subject to begin your assessment',
        variant: 'destructive',
      });
      return;
    }

    if (childUser && childUser.subject !== selectedSubject) {
      Promise.resolve(updateChildInfo({ subject: selectedSubject, grade: selectedGrade }))
        .then(() => {
          router.push(`/assessment/take/${selectedSubject}/${selectedGrade}`);
        })
        .catch((error) => {
          console.error('Update error:', error);
          toast({
            title: 'Error',
            description: 'Failed to update subject preference',
            variant: 'destructive',
          });
        });
    } else {
      router.push(`/assessment/take/${selectedSubject}/${selectedGrade}`);
    }
  };

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <LoadingSpinner size="lg" />
        <h3 className="text-xl font-semibold text-gray-700">
          Loading Assessment Portal...
        </h3>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <div className="container mx-auto px-4 w-full max-w-3xl">
        {/* Header */}
        <header className="pb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-3">
            Diagnostic Assessments
          </h1>
          <p className="text-gray-600">
            Select a subject to begin your evaluation, {childUser?.childName}
          </p>
        </header>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {/* Subject Selection */}
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <Button 
                onClick={() => setIsExpanded(!isExpanded)}
                variant="outline"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                {isExpanded ? 'Hide Subjects' : 'View Available Subjects'}
                <ChevronRight className={`ml-2 h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              </Button>
            </div>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {subjects.map((subject) => (
                      <SubjectCard
                        key={subject}
                        subject={subject}
                        selected={selectedSubject === subject}
                        onClick={() => setSelectedSubject(subject)}
                      />
                    ))}
                  </div>

                  {/* Grade Information */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-center gap-2 text-gray-700">
                      <span className="font-medium">Grade Level:</span>
                      <span className="font-semibold text-blue-600">
                        {selectedGrade ? `Grade ${selectedGrade}` : 'Grade not specified'}
                      </span>
                    </div>
                    <p className="text-center text-sm text-gray-500 mt-1">
                      The assessment will adapt to your grade level
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Start Button */}
            <div className="flex justify-center">
              <Button
                onClick={handleStartAssessment}
                disabled={!selectedSubject}
                size="lg"
                className={`px-8 ${selectedSubject ? 
                  'bg-blue-600 hover:bg-blue-700 text-white' : 
                  'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
              >
                {selectedSubject ? 'Begin Assessment' : 'Select a Subject'}
              </Button>
            </div>
          </div>

          {/* Assessment Information */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              About These Assessments
            </h3>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Designed to evaluate your current skill level</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Helps personalize your learning path</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span>Typically takes 20-30 minutes per subject</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}