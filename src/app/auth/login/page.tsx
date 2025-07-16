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

        setTimeout(() => router.push('/child-dashboard'), 100);
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
    <div className="min-h-screen bg-gradient-to-b from-[#5299ff]/10 to-white flex items-center justify-center px-4 relative">
      <Button 
        variant="ghost" 
        onClick={() => router.push('/')} 
        className="absolute top-4 left-4 text-[#5299ff] hover:bg-[#5299ff]/10"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Back to Home
      </Button>
      
      <div className="w-full max-w-md p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto mb-4 bg-[#5299ff]/10 rounded-full flex items-center justify-center">
            <Image
              src="/newlogo.png"
              alt="BrightPrep Logo"
              width={60}
              height={60}
              className=""
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Enter your access code to continue</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Access Code
            </label>
            <Input
              {...register('accessCode')}
              type="text"
              placeholder="Your access code"
              className="h-12 text-center text-lg font-medium border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5299ff] focus:border-[#5299ff]"
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
            className="w-full h-12 text-base font-semibold bg-[#5299ff] hover:bg-[#3d87ff] text-white rounded-lg shadow-md transition"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              'Log In'
            )}
          </Button>
        </form>

        {/* Help Section */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Need help?{' '}
          <a
            href="/contact"
            className="text-[#5299ff] hover:text-[#3d87ff] font-medium"
          >
            Contact support
          </a>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} BrightPrep. All rights reserved.
        </div>
      </div>
    </div>
  );
}