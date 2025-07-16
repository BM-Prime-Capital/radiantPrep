'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Copy, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Grade, Subject } from '@/lib/types';
import Image from 'next/image';
const grades: Grade[] = [1, 2, 3, 4, 5, 6, 7, 8];
const subjects: Subject[] = ['ELA', 'Math'];

const registerSchema = z.object({
  parentEmail: z.string().email({ message: 'Enter a valid email address.' }),
  parentPassword: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  childName: z.string().min(2, { message: "Enter the student's name." }),
  childGrade: z.coerce.number().min(1).max(8),
  childSubject: z.enum(['ELA', 'Math']),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      childGrade: 1,
      childSubject: 'ELA',
    },
  });

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedCode(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Registration failed.');

      const result = await response.json();
      setGeneratedCode(result.child.accessCode);

      toast({
        title: 'Registration successful!',
        description: `Access code generated for ${data.childName}.`,
      });
    } catch (error) {
      toast({
        title: 'Registration failed',
        description: (error as Error).message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode).then(() => {
      toast({ title: 'Code copied!', description: 'Access code copied to clipboard.' });
    }).catch(() => {
      toast({ title: 'Copy failed', description: 'Unable to copy the code.', variant: 'destructive' });
    });
  };

return (
  <div className="min-h-screen bg-gradient-to-b from-[#5299ff]/10 to-white flex items-center justify-center px-4 sm:px-6 relative">
    <div className="absolute inset-0 z-0 opacity-5">
      <svg viewBox="0 0 1200 800" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,100 C150,200 350,0 500,100 C650,200 750,0 900,100 C1050,200 1150,0 1200,100 L1200,800 L0,800 Z" fill="#5299ff"/>
      </svg>
    </div>
    <Button 
      variant="ghost" 
      onClick={() => router.push('/')} 
      className="absolute top-4 left-4 text-[#5299ff] hover:bg-[#5299ff]/10"
    >
      <ChevronLeft className="h-4 w-4 mr-2" />
      Back to Home
    </Button>
    
    {/* Conteneur principal très large */}
    <div className="w-full max-w-5xl p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
      {generatedCode ? (
        <div className="space-y-6">
          <Button
            variant="ghost"
            onClick={() => setGeneratedCode(null)}
            className="flex items-center gap-1 text-sm text-gray-500"
          >
            <ChevronLeft className="h-4 w-4" />
            Return to Registration
          </Button>

          <div className="text-center space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Access Code Generated</h2>
              <p className="text-gray-600">
                Provide this code to <span className="font-semibold text-[#5299ff]">{(registerSchema.parse(control._formValues)).childName}</span> to sign in.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col items-center">
              <p className="text-2xl font-mono tracking-wider text-[#5299ff] font-bold mb-2">
                {generatedCode}
              </p>
              <Button 
                variant="outline" 
                onClick={copyToClipboard} 
                className="flex items-center gap-2 border-[#5299ff] text-[#5299ff] hover:bg-[#5299ff]/10"
              >
                <Copy className="h-4 w-4" />
                Copy Code
              </Button>
            </div>

            <div className="flex flex-col gap-3">
              <Button 
                onClick={() => router.push('/auth/login')} 
                className="w-full bg-[#5299ff] hover:bg-[#3d87ff]"
              >
                Continue to Student Login
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setGeneratedCode(null)} 
                className="w-full border-[#5299ff] text-[#5299ff] hover:bg-[#5299ff]/10"
              >
                Register Another Student
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-3 bg-[#5299ff]/10 rounded-full flex items-center justify-center">
              <Image
                src="/newlogo.png"
                alt="Logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Register Your Child</h1>
            <p className="text-gray-600 mt-2">Fill out the form to create an account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mx-auto w-4/5">
            <div>
              <Label htmlFor="parentEmail" className="text-gray-700">
                Email Address
              </Label>
              <Input
                id="parentEmail"
                type="email"
                {...register('parentEmail')}
                placeholder="example@domain.com"
                className="mt-1 w-full border-gray-300 focus:ring-[#5299ff] focus:border-[#5299ff]"
              />
              {errors.parentEmail && <p className="text-sm text-red-600 mt-1">{errors.parentEmail.message}</p>}
            </div>

            <div>
              <Label htmlFor="parentPassword" className="text-gray-700">
                Password
              </Label>
              <Input
                id="parentPassword"
                type="password"
                {...register('parentPassword')}
                placeholder="At least 6 characters"
                className="mt-1 w-full border-gray-300 focus:ring-[#5299ff] focus:border-[#5299ff]"
              />
              {errors.parentPassword && <p className="text-sm text-red-600 mt-1">{errors.parentPassword.message}</p>}
            </div>

            <div>
              <Label htmlFor="childName" className="text-gray-700">
                Student's Name
              </Label>
              <Input
                id="childName"
                {...register('childName')}
                placeholder="e.g. Emily Smith"
                className="mt-1 w-full border-gray-300 focus:ring-[#5299ff] focus:border-[#5299ff]"
              />
              {errors.childName && <p className="text-sm text-red-600 mt-1">{errors.childName.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <Label htmlFor="childGrade" className="text-gray-700">
                  Grade Level
                </Label>
                <Select
                  onValueChange={(value) => setValue('childGrade', parseInt(value) as Grade)}
                  defaultValue="1"
                >
                  <SelectTrigger className="w-full border-gray-300 focus:ring-[#5299ff]">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem key={grade} value={String(grade)}>
                        Grade {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="childSubject" className="text-gray-700">
                  Subject
                </Label>
                <Select
                  onValueChange={(value) => setValue('childSubject', value as Subject)}
                  defaultValue="ELA"
                >
                  <SelectTrigger className="w-full border-gray-300 focus:ring-[#5299ff]">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 bg-[#5299ff] hover:bg-[#3d87ff]"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Register'}
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-200 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <a 
              href="/auth/login" 
              className="font-medium text-[#5299ff] hover:underline"
            >
              Sign in here
            </a>
          </div>
        </>
      )}
    </div>
  </div>
);
}
