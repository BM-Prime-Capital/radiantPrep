'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { Subject, Grade, ChildInformation } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Calculator, ChevronRight, Sparkles, Rocket, Trophy, Star, Gem, Award, Zap, BrainCircuit } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import Confetti from 'react-dom-confetti';

const subjects: Subject[] = ['ELA', 'Math'];

const SubjectCard = ({ subject, selected, onClick }: { subject: Subject; selected: boolean; onClick: () => void }) => {
  const theme = subject === 'ELA' ? {
    bg: 'from-blue-100 to-blue-50',
    border: 'border-blue-200',
    icon: <BookOpen className="w-12 h-12 text-blue-600" />,
    text: 'text-blue-800',
    hover: 'hover:shadow-blue-200'
  } : {
    bg: 'from-green-100 to-green-50',
    border: 'border-green-200',
    icon: <Calculator className="w-12 h-12 text-green-600" />,
    text: 'text-green-800',
    hover: 'hover:shadow-green-200'
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
      className={`cursor-pointer ${selected ? 'ring-4 ring-yellow-400' : ''}`}
      onClick={onClick}
    >
      <Card className={`bg-gradient-to-br ${theme.bg} border ${theme.border} rounded-xl ${theme.hover} transition-all h-full`}>
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <div className="mb-4 p-3 bg-white rounded-full shadow-sm">
            {theme.icon}
          </div>
          <h3 className={`text-xl font-bold text-center ${theme.text} mb-2`}>
            {subject === 'ELA' ? 'Literary Galaxy' : 'Math Universe'}
          </h3>
          <p className="text-sm text-gray-600 text-center">
            {subject === 'ELA' ? 'Master language arts' : 'Conquer numbers'}
          </p>
          
          {selected && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mt-4 flex items-center gap-2 bg-yellow-400/20 px-3 py-1 rounded-full border border-yellow-400/30"
            >
              <Zap className="w-4 h-4 text-yellow-500 animate-pulse" />
              <span className="text-xs font-bold text-yellow-600">SELECTED</span>
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
  const containerRef = useRef<HTMLDivElement>(null);

  const childUser = role === 'child' ? (user as ChildInformation) : null;
  // const [selectedSubject, setSelectedSubject] = useState<Subject | undefined>(() => childUser?.subject);
  const [selectedSubject, setSelectedSubject] = useState<Subject | undefined>();
  const [selectedGrade, setSelectedGrade] = useState<Grade | undefined>(() => childUser?.grade);
  const [isExploring, setIsExploring] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated || role !== 'child') router.replace('/auth/login');
    if (childUser) {
      // setSelectedSubject(childUser.subject);
      setSelectedGrade(childUser.grade); // Mise à jour explicite du grade
    }
  }, [isAuthenticated, authLoading, router, childUser, role]);

  useEffect(() => {
    if (selectedSubject) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [selectedSubject]);

  const handleStartAssessment = () => {
    console.log('Selected Subject:', selectedSubject);
    console.log('Selected Grade:', selectedGrade);
    
    if (!selectedSubject || !selectedGrade) {
      toast({
        title: 'Path Not Chosen',
        description: 'Please select a subject to begin your assessment!',
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
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 bg-gradient-to-b from-blue-50 to-white">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            repeat: Infinity,
            duration: 1.5,
            ease: "easeInOut" 
          }}
          className="relative w-24 h-24"
        >
          <BrainCircuit className="w-full h-full text-purple-600" />
        </motion.div>
        <motion.h3 
          className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          Preparing Your Learning Portal...
        </motion.h3>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
      <div className="container mx-auto px-4 py-8 w-full">
        {/* Header */}
        <motion.header 
          className="pb-8 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600"
            whileHover={{ scale: 1.02 }}
          >
            Knowledge Adventure
          </motion.h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Ready for an exciting challenge, <span className="font-semibold text-blue-600">{childUser?.childName}</span>?
          </p>
        </motion.header>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          {/* Subject Selection */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <div className="flex justify-center mb-8">
              <Button 
                onClick={() => setIsExploring(!isExploring)}
                size="lg"
                className="px-8 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
              >
                <Sparkles className="mr-3 h-5 w-5 text-yellow-300" />
                {isExploring ? 'Hide Options' : 'Choose Your Subject'}
                <ChevronRight className={`ml-3 h-5 w-5 transition-transform ${isExploring ? 'rotate-90' : ''}`} />
              </Button>
            </div>

            <AnimatePresence>
              {isExploring && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                    {subjects.map((subject) => (
                      <SubjectCard
                        key={subject}
                        subject={subject}
                        selected={selectedSubject === subject}
                        onClick={() => setSelectedSubject(subject)}
                      />
                    ))}
                  </div>

                  {/* Grade Display */}
                  <Card className="mb-10 border border-gray-200 bg-white">
                    <CardContent className="p-6 text-center">
                      <div className="flex items-center justify-center gap-3 mb-4">
                        <Trophy className="h-6 w-6 text-yellow-500" />
                        <h3 className="text-xl font-medium text-gray-800">
                          Your Current Level: Grade {selectedGrade}
                        </h3>
                      </div>
                      <p className="text-gray-600">
                        Perfectly tailored challenges for your skills
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Start Button */}
            <div className="flex justify-center">
              <div className="relative">
                <Confetti active={showConfetti} config={{ elementCount: 100, spread: 70 }} />
                <Button
                  onClick={handleStartAssessment}
                  disabled={!selectedSubject}
                  size="lg"
                  className={`px-12 py-6 text-lg ${selectedSubject ? 
                    'bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-gray-900 shadow-lg hover:shadow-yellow-400/40' : 
                    'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
                >
                  <Rocket className="mr-3 h-5 w-5" />
                  { 'Launch Assessment'}
                  {/* {selectedSubject ? 'Launch Assessment' : 'Select a Subject'} */}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}