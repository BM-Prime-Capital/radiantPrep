'use client';

import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { dbGradeToAppGrade } from '@/lib/gradeUtils';

const loginSchema = z.object({
  accessCode: z.string().min(6, { message: 'Access code must be at least 6 characters long.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { loginChild } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
  //   setIsLoading(true);
  //   try {
  //     const response = await fetch('/api/auth/login', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ accessCode: data.accessCode }),
  //       credentials: 'include',
  //     });

  //     if (!response.ok) throw new Error('Login failed.');
  //     const childInfo = await response.json();

  //     if (childInfo.role === 'CHILD') {
  //       loginChild({
  //         id: childInfo.id,
  //         childName: childInfo.childName,
  //         grade: dbGradeToAppGrade(childInfo.grade),
  //         subject: childInfo.currentSubject,
  //         accessCode: childInfo.accessCode,
  //       });

  //       toast({
  //         title: 'Login successful!',
  //         description: `Welcome back, ${childInfo.childName}.`,
  //       });

  //       // router.push('/assessment/select');
  //       setTimeout(() => router.push('/assessment/select'), 100);
  //     } else {
  //       throw new Error('Invalid user role');
  //     }
  //   } catch {
  //     toast({
  //       title: 'Login failed',
  //       description: 'Invalid access code. Please double-check and try again.',
  //       variant: 'destructive',
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
  setIsLoading(true);
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ accessCode: data.accessCode }),
      credentials: 'include',
    });

    if (!response.ok) throw new Error('Login failed.');
    const childInfo = await response.json();

    if (childInfo.role === 'CHILD') {
      loginChild({
        id: childInfo.id,
        childName: childInfo.childName,
        grade: dbGradeToAppGrade(childInfo.grade),
        subject: childInfo.currentSubject,
        accessCode: childInfo.accessCode,
      });

      toast({
        title: 'Login successful!',
        description: `Welcome back, ${childInfo.childName}.`,
      });

      // Modification ici - Redirection vers la racine
      window.location.href = '/'; // Utilisez window.location pour un rechargement complet
    } else {
      throw new Error('Invalid user role');
    }
  } catch {
    toast({
      title: 'Login failed',
      description: 'Invalid access code. Please double-check and try again.',
      variant: 'destructive',
    });
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen  flex items-center justify-center px-4 relative">
      
        <Button variant="ghost" onClick={() => router.push('/')} className="absolute top-4 left-4">
          <ChevronLeft className="h-4 w-4" />
          Home
        </Button>
      <div className="w-full max-w-2xl p-10 bg-white shadow-2xl rounded-3xl border border-gray-100">
        {/* Header */}
        <div className="text-center mb-10">
          <Image
            src="/newlogo.png"
            alt="Radiant Prep Logo"
            width={90}
            height={90}
            className="mx-auto mb-4"
          />
          <h1 className="text-4xl font-extrabold text-gray-900">Radiant Prep</h1>
          <p className="text-lg text-gray-600 mt-1">Personalized Learning Platform</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Access Code
            </label>
            <Input
              {...register('accessCode')}
              type="text"
              placeholder="e.g. DEM0123"
              className="h-12 text-center text-lg font-medium border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            {errors.accessCode && (
              <p className="mt-2 text-sm text-red-600">
                {errors.accessCode.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Log In'
            )}
          </Button>
        </form>

        {/* Link to Request Access */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an access code?{' '}
          <a
            href="/auth/register"
            className="text-indigo-600 hover:text-indigo-500 font-medium underline"
          >
            Request Access
          </a>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Radiant Test Prep. All rights reserved.
        </div>
      </div>
    </div>
  );
}
