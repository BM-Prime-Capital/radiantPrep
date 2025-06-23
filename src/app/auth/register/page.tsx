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
    <div className="min-h-screen flex items-center justify-center px-4 relative">
       <Button variant="ghost" onClick={() => router.push('/')} className="absolute top-4 left-4">
          <ChevronLeft className="h-4 w-4" />
          Home
        </Button>
      <div className="w-full max-w-2xl p-10 bg-white shadow-2xl rounded-3xl border border-gray-100">
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
                <h2 className="text-3xl font-bold text-gray-900">Access Code Generated</h2>
                <p className="text-gray-600">
                  Provide this code to <span className="font-semibold text-indigo-600">{(registerSchema.parse(control._formValues)).childName}</span> to sign in.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col items-center">
                <p className="text-3xl font-mono tracking-wider text-indigo-600 font-bold mb-2">
                  {generatedCode}
                </p>
                <Button variant="outline" onClick={copyToClipboard} className="flex items-center gap-2">
                  <Copy className="h-4 w-4" />
                  Copy Code
                </Button>
              </div>

              <div className="flex flex-col gap-3">
                <Button onClick={() => router.push('/auth/login')} className="w-full py-5 text-lg">
                  Continue to Student Login
                </Button>
                <Button variant="outline" onClick={() => setGeneratedCode(null)} className="w-full">
                  Register Another Student
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-10">
              <h1 className="text-4xl font-extrabold text-gray-900">Register Your Child</h1>
              <p className="text-lg text-gray-600 mt-1">Fill out the form to create an account and receive an access code.</p>
            </div>

           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Parent Email */}
              <div>
                <label htmlFor="parentEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <Input
                  id="parentEmail"
                  type="email"
                  {...register('parentEmail')}
                  placeholder="example@domain.com"
                  className="h-12 text-center text-lg font-medium border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                {errors.parentEmail && <p className="text-sm text-red-600 mt-2">{errors.parentEmail.message}</p>}
              </div>

              {/* Parent Password */}
              <div>
                <label htmlFor="parentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Input
                  id="parentPassword"
                  type="password"
                  {...register('parentPassword')}
                  placeholder="At least 6 characters"
                  className="h-12 text-center text-lg font-medium border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                {errors.parentPassword && <p className="text-sm text-red-600 mt-2">{errors.parentPassword.message}</p>}
              </div>

              {/* Child Name */}
              <div>
                <label htmlFor="childName" className="block text-sm font-medium text-gray-700 mb-1">
                  Student's Full Name
                </label>
                <Input
                  id="childName"
                  {...register('childName')}
                  placeholder="e.g. Emily Smith"
                  className="h-12 text-center text-lg font-medium border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
                {errors.childName && <p className="text-sm text-red-600 mt-2">{errors.childName.message}</p>}
              </div>

              {/* Grade and Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="childGrade" className="block text-sm font-medium text-gray-700 mb-1">
                    Grade Level
                  </label>
                  <Select
                    onValueChange={(value) =>
                      setValue('childGrade', parseInt(value) as Grade, { shouldValidate: true })
                    }
                    defaultValue={String(grades[0])}
                  >
                    <SelectTrigger
                      id="childGrade"
                      className="h-12 text-center text-lg font-medium border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <SelectValue placeholder="Choose a grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map((grade) => (
                        <SelectItem key={grade} value={String(grade)} className="py-2">
                          Grade {grade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.childGrade && <p className="text-sm text-red-600 mt-2">{errors.childGrade.message}</p>}
                </div>

                <div>
                  <label htmlFor="childSubject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <Select
                    onValueChange={(value) => setValue('childSubject', value as Subject, { shouldValidate: true })}
                    defaultValue={subjects[0]}
                  >
                    <SelectTrigger
                      id="childSubject"
                      className="h-12 text-center text-lg font-medium border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <SelectValue placeholder="Choose a subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject} className="py-2">
                          {subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.childSubject && <p className="text-sm text-red-600 mt-2">{errors.childSubject.message}</p>}
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Register & Generate Access Code'}
              </Button>
            </form>


            <div className="mt-6 text-center text-sm text-gray-500">
              Already have an account?{' '}
              <a href="/auth/login" className="font-medium text-indigo-600 hover:underline">
                Sign in here
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
