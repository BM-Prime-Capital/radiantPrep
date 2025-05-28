'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { ChildInformation } from '@/lib/types';
import { Loader2 } from 'lucide-react';

const loginSchema = z.object({
  accessCode: z.string().min(6, { message: 'Access code must be at least 6 characters.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Mock function to validate access code and get child info
// In a real app, this would be an API call to your backend/database
async function validateAccessCode(code: string): Promise<ChildInformation | null> {
  // For demo: Check if there's a recently registered child in localStorage
  // This is NOT secure and only for demonstration of the flow.
  try {
    const storedAuthState = localStorage.getItem('authState');
    if (storedAuthState) {
      const parsedState = JSON.parse(storedAuthState);
      if (parsedState.role === 'child' && parsedState.user?.accessCode === code) {
        return parsedState.user as ChildInformation;
      }
      // A more robust mock might involve checking a specific localStorage key set during registration.
      // For this simple scaffold, we will assume if parent registered, the code is "known".
      // Or, we could hardcode a demo child.
    }
  } catch (e) { /* ignore */ }

  // Fallback to a hardcoded demo user if no localStorage match or for general testing
  if (code === 'DEMO123') {
    return {
      childName: 'Demo User',
      grade: 4, // Default grade
      subject: 'ELA', // Default subject
      accessCode: code,
    };
  }
  return null;
}

export default function LoginPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { loginChild } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setIsLoading(true);
    try {
      const childInfo = await validateAccessCode(data.accessCode);

      if (childInfo) {
        loginChild(childInfo);
        toast({
          title: 'Login Successful!',
          description: `Welcome, ${childInfo.childName}!`,
        });
        router.push('/assessment/select');
      } else {
        toast({
          title: 'Login Failed',
          description: 'Invalid access code. Please check and try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-primary">Child Login</CardTitle>
          <CardDescription className="text-center text-foreground/80">
            Enter the access code provided by your parent to start your assessment.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="accessCode">Access Code</Label>
              <Input
                id="accessCode"
                type="text"
                {...register('accessCode')}
                placeholder="e.g., AB12CD34"
                className="text-lg text-center tracking-widest"
              />
              {errors.accessCode && <p className="text-destructive text-sm mt-1">{errors.accessCode.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Login
            </Button>
          </form>
           <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an access code? Ask your parent to <a href="/auth/register" className="font-medium text-primary hover:underline">register</a>.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
