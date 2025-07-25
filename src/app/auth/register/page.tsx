'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ChevronDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
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
  const [gradeOpen, setGradeOpen] = useState(false);
  const [subjectOpen, setSubjectOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
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

      setSuccess(true);

      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
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

  return (
    <div className="min-h-screen bg-white relative">
      {/* Background animated blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-green-300/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-green-200/20 rounded-full blur-2xl animate-float delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-100/20 rounded-full blur-3xl animate-float delay-2000" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-xl w-full space-y-10 bg-white border border-gray-200 rounded-xl shadow-xl p-10 animate-slideInUp">
          <div className="text-center space-y-4 animate-slideInRight">
            <div className="flex justify-center">
              <div className="relative h-24 w-24 animate-float">
                <div className="absolute inset-0 rounded-full bg-green-400/30 blur-2xl animate-pulse scale-[1.6] z-0" />
                <div className="relative z-10 h-full w-full rounded-full bg-gradient-to-br from-green-600 to-green-700 shadow-lg p-2 hover:scale-105 transition-all duration-500">
                  <div className="bg-white rounded-full h-full w-full flex items-center justify-center overflow-hidden">
                    <Image src="/logo-complemetrics.png" alt="Logo" width={56} height={56} className="object-contain" />
                  </div>
                </div>
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Register Your Child</h2>
            <p className="text-sm text-gray-500">Fill out the form to create an account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Input type="email" className="w-full h-14 pl-10 pr-12 text-sm text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E9B3B] focus:border-[#1E9B3B] transition-colors" placeholder="Parent Email" {...register('parentEmail')} />
              {errors.parentEmail && <p className="text-xs text-red-500 mt-1">{errors.parentEmail.message}</p>}
            </div>
            <div>
              <Input type="password" className="w-full h-14 pl-10 pr-12 text-sm text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E9B3B] focus:border-[#1E9B3B] transition-colors" placeholder="Parent Password" {...register('parentPassword')} />
              {errors.parentPassword && <p className="text-xs text-red-500 mt-1">{errors.parentPassword.message}</p>}
            </div>
            <div>
              <Input type="text" className="w-full h-14 pl-10 pr-12 text-sm text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E9B3B] focus:border-[#1E9B3B] transition-colors" placeholder="Child Name" {...register('childName')} />
              {errors.childName && <p className="text-xs text-red-500 mt-1">{errors.childName.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Select
                onValueChange={(v) => setValue('childGrade', parseInt(v) as Grade)}
                defaultValue="1"
                open={gradeOpen}
                onOpenChange={setGradeOpen}
              >
                <SelectTrigger className="h-14 border border-gray-300 rounded-lg text-sm px-4 flex justify-between items-center focus:ring-2 focus:ring-[#1E9B3B] focus:border-[#1E9B3B] transition-colors">
                  <SelectValue placeholder="Grade" />
                  <ChevronDown className={`w-4 h-4 opacity-50 transform transition-transform duration-200 ${gradeOpen ? 'rotate-180' : ''}`} />
                </SelectTrigger>
                <SelectContent className="animate-in fade-in slide-in-from-top-1 duration-150">
                  {grades.map((g) => (
                    <SelectItem key={g} value={String(g)} className="text-sm py-3 text-center hover:bg-green-50 cursor-pointer">
                      Grade {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                onValueChange={(v) => setValue('childSubject', v as Subject)}
                defaultValue="ELA"
                open={subjectOpen}
                onOpenChange={setSubjectOpen}
              >
                <SelectTrigger className="h-14 border border-gray-300 rounded-lg text-sm px-4 flex justify-between items-center focus:ring-2 focus:ring-[#1E9B3B] focus:border-[#1E9B3B] transition-colors">
                  <SelectValue placeholder="Subject" />
                  <ChevronDown className={`w-4 h-4 opacity-50 transform transition-transform duration-200 ${subjectOpen ? 'rotate-180' : ''}`} />
                </SelectTrigger>
                <SelectContent className="animate-in fade-in slide-in-from-top-1 duration-150">
                  {subjects.map((s) => (
                    <SelectItem key={s} value={s} className="text-sm py-3 text-center hover:bg-green-50 cursor-pointer">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 text-lg font-semibold text-white rounded-lg shadow-md bg-gradient-to-br from-[#1E9B3B] to-green-700 hover:brightness-110 active:scale-95 transition-all duration-300 ease-out"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : success ? (
                <span className="flex items-center gap-2">
                  <span className="text-xl">✔</span> Success
                </span>
              ) : (
                'Register'
              )}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-500 space-x-4">
            <span>
              Already have an account?{' '}
              <a href="/auth/login" className="text-[#1E9B3B] font-medium hover:underline">Login</a>
            </span>
            <span>|</span>
            <a href="/" className="text-[#1E9B3B] font-medium hover:underline">Back to Home</a>
          </div>

          <div className="pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Radiant Prep. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
