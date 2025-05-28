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
import { generateSecureAccessCode, type SecureAccessCodeInput } from '@/ai/flows/secure-access-code-generation';
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
  const { loginParent } = useAuth(); // Using loginParent to set auth state after registration
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control, // for Select component
    setValue, // for Select component
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      childGrade: 1 as Grade,
      childSubject: 'ELA' as Subject,
    }
  });

  const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
    setIsLoading(true);
    setGeneratedCode(null);
    try {
      // Simulate parent registration (in real app, use Firebase Auth)
      const parentUser: ParentUser = { email: data.parentEmail };
      
      // Prepare input for GenAI flow
      const accessCodeInput: SecureAccessCodeInput = {
        childName: data.childName,
        grade: data.childGrade,
        subject: data.childSubject,
      };
      
      // Call GenAI flow to generate secure access code
      // This is an async server function, can be called directly if this component is a server component or via server action.
      // For client component, we'd typically wrap this in a server action.
      // For this example, assuming it can be called (or a server action wrapper exists).
      // Let's make a server action for this.
      const result = await generateSecureAccessCodeAction(accessCodeInput);
      const accessCode = result.accessCode;

      if (!accessCode) {
        throw new Error('Failed to generate access code.');
      }
      
      setGeneratedCode(accessCode);

      const childInfo: ChildInformation = {
        childName: data.childName,
        grade: data.childGrade as Grade,
        subject: data.childSubject as Subject,
        accessCode: accessCode,
      };

      // Store childInfo and parentUser (mocked for now, or use context)
      // loginParent(parentUser, childInfo); // This would log in the child for immediate testing
      // For now, just show the code. Parent isn't truly "logged in" yet, but code is shown.

      toast({
        title: 'Registration Successful!',
        description: `Access code for ${data.childName} has been generated.`,
        variant: 'default',
      });
      
      // Optionally, redirect or update UI
      // router.push('/dashboard'); // if a parent dashboard exists

    } catch (error) {
      console.error('Registration failed:', error);
      toast({
        title: 'Registration Failed',
        description: (error as Error).message || 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Server action defined in the same file for simplicity (can be moved to a separate actions.ts file)
  // It needs to be marked with 'use server' if in a separate file or defined at the top-level of a Server Component.
  // Here, we'll just call the imported AI function, assuming it's made available to the client via some mechanism (e.g., it's already a server action or called within one).
  // For this specific case where `generateSecureAccessCode` is 'use server', it can be directly called.
  async function generateSecureAccessCodeAction(input: SecureAccessCodeInput) {
    'use server'; // If this function itself is a server action
    return generateSecureAccessCode(input);
  }

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
