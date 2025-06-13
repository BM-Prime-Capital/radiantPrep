
'use client';

import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import type { ChildInformation, Grade, ParentUser, Subject } from '@/lib/types';
import type { SecureAccessCodeInput } from '@/ai/flows/secure-access-code-generation';
import { generateSecureAccessCodeAction } from '@/lib/actions';
import { Loader2, Copy } from 'lucide-react';

const grades: Grade[] = [1, 2, 3, 4, 5, 6, 7, 8];
const subjects: Subject[] = ['ELA', 'Math'];

const registerSchema = z.object({
  parentEmail: z.string().email({ message: 'Invalid email address.' }),
  parentPassword: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
  childName: z.string().min(2, { message: "Child's name is required." }),
  childGrade: z.coerce.number().min(1).max(8),
  childSubject: z.enum(['ELA', 'Math']),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const { toast } = useToast();
  const router = useRouter();
  const { loginParent } = useAuth(); 
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control, 
    setValue, 
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      childGrade: 1 as Grade,
      childSubject: 'ELA' as Subject,
    }
  });

  // const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
  //   setIsLoading(true);
  //   setGeneratedCode(null);
  //   try {
  //     const parentUser: ParentUser = { email: data.parentEmail };
      
  //     const accessCodeInput: SecureAccessCodeInput = {
  //       childName: data.childName,
  //       grade: data.childGrade,
  //       subject: data.childSubject,
  //     };
      
  //     const result = await generateSecureAccessCodeAction(accessCodeInput);
  //     const accessCode = result.accessCode;

  //     if (!accessCode) {
  //       throw new Error('Failed to generate access code.');
  //     }
      
  //     setGeneratedCode(accessCode);

  //     // For demo purposes, we are setting the parent as logged in and also the child
  //     // In a real scenario, parent logs in, registers child, child then logs in with code.
  //     // Here, we will also set the authState as if the child is logged in for easy testing post-registration.
  //     // This helps demonstrate the flow immediately.
  //     const childInfoForAuth: ChildInformation = {
  //       childName: data.childName,
  //       grade: data.childGrade as Grade,
  //       subject: data.childSubject as Subject,
  //       accessCode: accessCode,
  //     };
  //     // loginParent(parentUser, childInfoForAuth); // This line effectively logs in the "child" context.

  //     toast({
  //       title: 'Registration Successful!',
  //       description: `Access code for ${data.childName} has been generated.`,
  //       variant: 'default',
  //     });
      
  //   } catch (error) {
  //     console.error('Registration failed:', error);
  //     toast({
  //       title: 'Registration Failed',
  //       description: (error as Error).message || 'An unexpected error occurred. Please try again.',
  //       variant: 'destructive',
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  
  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
      setIsLoading(true);
      setGeneratedCode(null);
      
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            parentEmail: data.parentEmail,
            parentPassword: data.parentPassword,
            childName: data.childName,
            childGrade: data.childGrade,
            childSubject: data.childSubject,
          }),
        });

        if (!response.ok) {
          throw new Error('Registration failed');
        }

        const result = await response.json();
        setGeneratedCode(result.child.accessCode);

        toast({
          title: 'Registration Successful!',
          description: `Access code for ${data.childName} has been generated.`,
          variant: 'default',
        });
      } catch (error) {
        toast({
          title: 'Registration Failed',
          description: (error as Error).message || 'An unexpected error occurred.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

  const copyToClipboard = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode).then(() => {
        toast({ title: "Code Copied!", description: "Access code copied to clipboard." });
      }).catch(err => {
        toast({ title: "Copy Failed", description: "Could not copy code.", variant: "destructive" });
      });
    }
  };

  return (
    <div className="flex justify-center items-center py-12">
      <Card className="w-full max-w-lg shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-primary">Parent Registration</CardTitle>
          <CardDescription className="text-center text-foreground/80">
            Register yourself and your child to get a unique access code for their assessments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!generatedCode ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="parentEmail">Parent Email</Label>
                <Input id="parentEmail" type="email" {...register('parentEmail')} placeholder="you@example.com" />
                {errors.parentEmail && <p className="text-destructive text-sm mt-1">{errors.parentEmail.message}</p>}
              </div>

              <div>
                <Label htmlFor="parentPassword">Parent Password</Label>
                <Input id="parentPassword" type="password" {...register('parentPassword')} placeholder="••••••••" />
                {errors.parentPassword && <p className="text-destructive text-sm mt-1">{errors.parentPassword.message}</p>}
              </div>

              <hr className="my-6 border-border" />

              <h3 className="text-lg font-semibold text-accent">Child Information</h3>
              
              <div>
                <Label htmlFor="childName">Child's Full Name</Label>
                <Input id="childName" {...register('childName')} placeholder="e.g., Alex Doe" />
                {errors.childName && <p className="text-destructive text-sm mt-1">{errors.childName.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="childGrade">Child's Grade</Label>
                  <Select 
                    onValueChange={(value) => setValue('childGrade', parseInt(value) as Grade, { shouldValidate: true })}
                    defaultValue={String(grades[0])}
                  >
                    <SelectTrigger id="childGrade">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {grades.map((grade) => (
                        <SelectItem key={grade} value={String(grade)}>Grade {grade}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.childGrade && <p className="text-destructive text-sm mt-1">{errors.childGrade.message}</p>}
                </div>

                <div>
                  <Label htmlFor="childSubject">Initial Subject</Label>
                   <Select
                    onValueChange={(value) => setValue('childSubject', value as Subject, { shouldValidate: true })}
                    defaultValue={subjects[0]}
                  >
                    <SelectTrigger id="childSubject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>{subject}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.childSubject && <p className="text-destructive text-sm mt-1">{errors.childSubject.message}</p>}
                </div>
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Register and Generate Code
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <h3 className="text-2xl font-semibold text-green-600">Access Code Generated!</h3>
              <p className="text-foreground/90">
                Please save this access code for your child, <span className="font-semibold">{(registerSchema.parse(control._formValues)).childName}</span>.
                They will use it to log in and take their assessments.
              </p>
              <div className="bg-muted p-4 rounded-md flex items-center justify-center space-x-2">
                <p className="text-3xl font-mono tracking-wider text-primary">{generatedCode}</p>
                <Button variant="ghost" size="icon" onClick={copyToClipboard}>
                  <Copy className="h-5 w-5" />
                  <span className="sr-only">Copy code</span>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                An email with this code would typically be sent to you. For this demo, please copy it.
              </p>
              <Button onClick={() => router.push('/auth/login')} className="w-full mt-4">
                Proceed to Child Login
              </Button>
               <Button variant="link" onClick={() => setGeneratedCode(null)} className="text-sm">
                Register another child
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
