'use client';

import ChildLayout from '@/components/layout/ChildLayout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { Subject, Grade, ChildInformation } from '@/lib/types';
import { BookOpen, Calculator, ChevronRight, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { AnimatePresence, motion } from 'framer-motion';
import LoadingSpinner from '@/components/LoadingSpinner';

const subjects: Subject[] = ['ELA', 'Math'];

const SubjectCard = ({
  subject,
  selected,
  onClick,
}: {
  subject: Subject;
  selected: boolean;
  onClick: () => void;
}) => {
  const theme =
    subject === 'ELA'
      ? {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: <BookOpen className="w-10 h-10 text-blue-600" />,
          text: 'text-blue-800',
          highlight: 'bg-blue-100',
        }
      : {
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          icon: <Calculator className="w-10 h-10 text-emerald-600" />,
          text: 'text-emerald-800',
          highlight: 'bg-emerald-100',
        };

  return (
    <motion.div whileHover={{ y: -3 }} className="cursor-pointer" onClick={onClick}>
      <Card
        className={`transition-all h-full border ${theme.border} ${
          selected ? 'ring-2 ring-primary ' + theme.highlight : theme.bg
        }`}
      >
        <CardContent className="p-6 flex flex-col items-center">
          <div className="mb-4 p-3 bg-white rounded-lg border shadow-sm">{theme.icon}</div>
          <h3 className={`text-lg font-semibold text-center ${theme.text} mb-2`}>
            {subject === 'ELA' ? 'English Language Arts' : 'Mathematics'}
          </h3>
          <p className="text-sm text-gray-600 text-center">
            {subject === 'ELA' ? 'Reading & Writing Assessment' : 'Math Skills Evaluation'}
          </p>
          {selected && (
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-3 flex items-center gap-1 text-sm text-primary">
              <CheckCircle className="w-4 h-4" />
              <span>Selected</span>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function AssessmentSelectPage() {
  const { isAuthenticated, user, role, isLoading: authLoading, updateChildInfo } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const childUser = role === 'CHILD' ? (user as ChildInformation) : null;

  const [selectedSubject, setSelectedSubject] = useState<Subject | undefined>(childUser?.subject);
  const [selectedGrade, setSelectedGrade] = useState<Grade | undefined>(childUser?.grade);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || role !== 'CHILD') {
      router.replace('/auth/login');
      return;
    }
    if (childUser) {
      setSelectedGrade(childUser.grade);
      if (!selectedSubject) setSelectedSubject(childUser.subject);
    }
  }, [isAuthenticated, authLoading, router, childUser, role, selectedSubject]);

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
      updateChildInfo({ subject: selectedSubject, currentSubject: selectedSubject, grade: selectedGrade });
    }

    router.push(`/assessment/take/${selectedSubject}/${selectedGrade}`);
  };

  if (authLoading) {
    return (
      <ChildLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <LoadingSpinner size="lg" />
          <h3 className="text-xl font-semibold text-gray-700">Loading Assessment Portal...</h3>
        </div>
      </ChildLayout>
    );
  }

  return (
    <ChildLayout>
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-accent text-white rounded-xl p-6 mb-10 shadow-md">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold mb-1">Welcome, {childUser?.childName}!</h2>
            <p className="text-sm opacity-90">Choose a subject to start your diagnostic assessment.</p>
          </div>
          <Sparkles className="h-10 w-10 text-white/80 hidden md:block" />
        </div>
      </div>

      {/* Toggle Subjects */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Available Subjects</h3>
        <Button onClick={() => setIsExpanded(!isExpanded)} variant="outline" className="border-primary text-primary hover:bg-primary/10">
          {isExpanded ? 'Hide Subjects' : 'Show Subjects'}
          <ChevronRight className={`ml-2 h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
        </Button>
      </div>

      {/* Subject Cards + Grade Info (About section removed) */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 gap-6 mb-10"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {subjects.map((subject) => (
                  <SubjectCard
                    key={subject}
                    subject={subject}
                    selected={selectedSubject === subject}
                    onClick={() => setSelectedSubject(subject)}
                  />
                ))}
              </div>

              <div className="p-4 bg-white border rounded-lg shadow-sm text-center">
                <p className="text-gray-700">
                  <span className="font-medium">Grade Level:</span>{' '}
                  <span className="text-primary font-semibold">
                    {selectedGrade ? `Grade ${selectedGrade}` : 'Not specified'}
                  </span>
                </p>
                <p className="text-sm text-gray-500 mt-1">The assessment will adapt to your grade level.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Start Button */}
      <div className="flex justify-center mb-8">
        <Button
          onClick={handleStartAssessment}
          disabled={!selectedSubject}
          size="lg"
          className={`px-8 text-white ${
            selectedSubject ? 'bg-primary hover:bg-primary/90' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {selectedSubject ? 'Start Assessment' : 'Select a Subject'}
        </Button>
      </div>
    </ChildLayout>
  );
}
