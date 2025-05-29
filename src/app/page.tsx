import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Edit3, ShieldCheck, Users, BookOpen, BarChart3 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-12rem)] py-12">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-bold tracking-tight text-primary sm:text-6xl lg:text-7xl">
          Welcome to Radiant Test Prep
        </h1>
        <p className="mt-8 text-lg leading-8 text-foreground/80 max-w-3xl mx-auto sm:text-xl">
          Our diagnostic testing program helps identify academic strengths and areas for growth with tailored assessments in ELA and Math.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mb-16">
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-semibold text-accent">
              <Users className="mr-3 h-7 w-7" /> For Students
            </CardTitle>
            <CardDescription className="text-base">
              Take assessments, discover your strengths, and find areas to improve.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2 text-foreground/90">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                <span>Personalized diagnostic tests in ELA and Math.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                <span>Easy access using a secure code provided by your parent.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                <span>Understand your learning profile better.</span>
              </li>
            </ul>
            <Button asChild className="mt-6 w-full bg-accent hover:bg-accent/90 text-accent-foreground py-6 text-lg">
              <Link href="/auth/login">Child Login</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
          <CardHeader>
            <CardTitle className="flex items-center text-2xl font-semibold text-primary">
              <Edit3 className="mr-3 h-7 w-7" /> For Parents & Educators
            </CardTitle>
            <CardDescription className="text-base">
              Register your child, get insights into their performance, and support their learning.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="space-y-2 text-foreground/90">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 shrink-0" />
                <span>Simple registration process for your child.</span>
              </li>
              <li className="flex items-start">
                <ShieldCheck className="h-5 w-5 text-blue-500 mr-2 mt-0.5 shrink-0" />
                <span>Receive a unique, secure access code for your child.</span>
              </li>
              <li className="flex items-start">
                <BarChart3 className="h-5 w-5 text-orange-500 mr-2 mt-0.5 shrink-0" />
                <span>Track progress and identify key learning areas.</span>
              </li>
            </ul>
            <Button asChild className="mt-6 w-full py-6 text-lg">
              <Link href="/auth/register">Parent Registration</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <section className="w-full max-w-5xl text-center mt-12">
        <h2 className="text-4xl font-semibold text-primary mb-8">Our Subjects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="bg-card p-8 rounded-xl shadow-lg">
            <Image src="https://placehold.co/600x400.png" alt="ELA Assessment" width={600} height={400} className="rounded-lg mb-6" data-ai-hint="books library" />
            <h3 className="text-2xl font-medium text-accent mb-3">English Language Arts (ELA)</h3>
            <p className="text-base text-foreground/80">Evaluate reading comprehension, vocabulary, and writing skills essential for academic success.</p>
          </div>
          <div className="bg-card p-8 rounded-xl shadow-lg">
            <Image src="https://placehold.co/600x400.png" alt="Math Assessment" width={600} height={400} className="rounded-lg mb-6" data-ai-hint="math equations" />
            <h3 className="text-2xl font-medium text-accent mb-3">Mathematics</h3>
            <p className="text-base text-foreground/80">Assess numerical fluency, problem-solving abilities, and core mathematical concepts.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
