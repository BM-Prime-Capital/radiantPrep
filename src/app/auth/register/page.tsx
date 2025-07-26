'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import type { Grade } from '@/lib/types';
import Image from 'next/image';

const grades: Grade[] = [1, 2, 3, 4, 5, 6, 7, 8];

const registerSchema = z.object({
  parentFirstName: z.string().min(2, { message: "Enter parent's first name" }),
  parentLastName: z.string().min(2, { message: "Enter parent's last name" }),
  parentEmail: z.string().email({ message: 'Enter a valid email address.' }),
  parentPassword: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  childFirstName: z.string().min(2, { message: "Enter child's first name" }),
  childLastName: z.string().min(2, { message: "Enter child's last name" }),
  childGrade: z.coerce.number().min(1).max(8),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [gradeOpen, setGradeOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      parentFirstName: '',
      parentLastName: '',
      parentEmail: '',
      parentPassword: '',
      childFirstName: '',
      childLastName: '',
      childGrade: 1,
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
        description: `Access code generated for ${data.childFirstName}.`,
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
      {/* Background blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-green-300/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-green-200/20 rounded-full blur-2xl animate-float delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-100/20 rounded-full blur-3xl animate-float delay-2000" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-xl w-full space-y-10 bg-white border border-gray-200 rounded-xl shadow-xl p-10 animate-slideInUp">
          
          {/* Logo + by Radiant Prep */}
          <div className="text-center space-y-4 animate-fadeInUp">
            <div className="flex flex-col items-center space-y-2">
              <Image
                src="/logo-complemetrics.png"
                alt="CompleMetrics Logo"
                width={160}
                height={80}
                className="object-contain drop-shadow-lg brightness-110 transition-transform duration-700 ease-out scale-100 hover:scale-105"
              />
              <div className="flex flex-col sm:flex-row items-center sm:space-x-2 space-y-1 sm:space-y-0">
                <span className="text-sm sm:text-base font-medium text-[#1E9B3B] tracking-wide drop-shadow-sm">
                  by
                </span>
                <Image
                  src="/newlogo.png"
                  alt="Radiant Prep Logo"
                  width={28}
                  height={28}
                  className="h-7 w-auto drop-shadow-md"
                />
                <span className="text-sm sm:text-base font-semibold text-[#1E9B3B] drop-shadow-sm">
                  Radiant Prep
                </span>
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Register Your Child</h2>
            <p className="text-sm text-gray-500">Fill out the form to create an account</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Parent's First Name" {...register('parentFirstName')} className="w-full h-14 px-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E9B3B] focus:border-[#1E9B3B]" />
              <Input placeholder="Parent's Last Name" {...register('parentLastName')} className="w-full h-14 px-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E9B3B] focus:border-[#1E9B3B]" />
            </div>
            <Input placeholder="Parent's Email" type="email" {...register('parentEmail')} className="w-full h-14 px-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E9B3B] focus:border-[#1E9B3B]" />
            <Input placeholder="Password" type="password" {...register('parentPassword')} className="w-full h-14 px-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E9B3B] focus:border-[#1E9B3B]" />
            <div className="grid grid-cols-2 gap-4">
              <Input placeholder="Child's First Name" {...register('childFirstName')} className="w-full h-14 px-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E9B3B] focus:border-[#1E9B3B]" />
              <Input placeholder="Child's Last Name" {...register('childLastName')} className="w-full h-14 px-4 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E9B3B] focus:border-[#1E9B3B]" />
            </div>

            <Select
              onValueChange={(v) => setValue('childGrade', parseInt(v) as Grade)}
              open={gradeOpen}
              onOpenChange={setGradeOpen}
            >
              <SelectTrigger className="h-14 border border-gray-300 rounded-lg text-sm px-4">
                <SelectValue placeholder="Select Grade" />
              </SelectTrigger>
              <SelectContent>
                {grades.map((g) => (
                  <SelectItem key={g} value={String(g)}>
                    Grade {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button type="submit" disabled={isLoading} className="w-full h-14 text-white bg-green-600 hover:bg-green-700">
              {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : success ? 'Success' : 'Register'}
            </Button>
          </form>

          <div className="text-center text-sm text-gray-500 space-x-4">
            <span>Already have an account? <a href="/auth/login" className="text-[#1E9B3B] font-medium hover:underline">Login</a></span>
            <span>|</span>
            <a href="/" className="text-[#1E9B3B] font-medium hover:underline">Back to Home</a>
          </div>
        </div>
      </div>
    </div>
  );
}
