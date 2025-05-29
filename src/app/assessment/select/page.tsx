
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { Subject, Grade, ChildInformation } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Calculator, ChevronRight } from 'lucide-react';

const grades: Grade[] = [1, 2, 3, 4, 5, 6, 7, 8];
const subjects: Subject[] = ['ELA', 'Math'];

export default function SelectAssessmentPage() {
  const { isAuthenticated, user, role, isLoading: authLoading, updateChildInfo } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const childUser = role === 'child' ? (user as ChildInformation) : null;

  const [selectedSubject, setSelectedSubject] = useState<Subject | undefined>(childUser?.subject);
  const [selectedGrade, setSelectedGrade] = useState<Grade | undefined>(childUser?.grade);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
    if (childUser) {
        setSelectedSubject(childUser.subject);
        setSelectedGrade(childUser.grade);
    }
  }, [isAuthenticated, authLoading, router, childUser]);

  const handleStartAssessment = () => {
    if (selectedSubject && selectedGrade) {
      if (childUser && (childUser.subject !== selectedSubject || childUser.grade !== selectedGrade)) {
        updateChildInfo({ subject: selectedSubject, grade: selectedGrade });
      }
      router.push(`/assessment/take/${selectedSubject}/${selectedGrade}`);
    } else {
      toast({
        title: 'Selection Incomplete',
        description: 'Please select both a subject and a grade.',
        variant: 'destructive',
      });
    }
  };

  if (authLoading || !isAuthenticated || role !== 'child') {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <p>Loading...</p>
      </div>
    );
  }
  
  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-primary">Select Your Assessment</CardTitle>
          <CardDescription className="text-center text-foreground/80">
            Hello, {childUser?.childName}! Choose the subject and grade level for your diagnostic test.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="space-y-4">
            <div>
              <Label htmlFor="subject" className="text-lg font-medium">Subject</Label>
              <Select
                value={selectedSubject}
                onValueChange={(value) => setSelectedSubject(value as Subject)}
              >
                <SelectTrigger id="subject" className="w-full text-base py-6">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject} className="text-base py-3">
                      <div className="flex items-center">
                        {subject === 'ELA' ? <BookOpen className="mr-2 h-5 w-5 text-blue-500" /> : <Calculator className="mr-2 h-5 w-5 text-green-500" />}
                        {subject}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="grade" className="text-lg font-medium">Grade Level</Label>
              <Select
                value={selectedGrade ? String(selectedGrade) : undefined}
                onValueChange={(value) => setSelectedGrade(parseInt(value) as Grade)}
              >
                <SelectTrigger id="grade" className="w-full text-base py-6">
                  <SelectValue placeholder="Select a grade level" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((grade) => (
                    <SelectItem key={grade} value={String(grade)} className="text-base py-3">
                      Grade {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleStartAssessment}
            className="w-full text-lg py-7 bg-accent hover:bg-accent/90 text-accent-foreground"
            disabled={!selectedSubject || !selectedGrade}
          >
            Start Assessment
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
