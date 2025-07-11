import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { CheckCircle, Edit3, Users, BookOpen, ArrowRight, BarChart3, Shield, BookText, Calculator, ClipboardList } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const session = await getServerSession();
  
  if (session?.user?.role === 'CHILD') redirect('/child-dashboard');
  if (session?.user?.role === 'PARENT') redirect('/parent-dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/20 to-white">
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 text-center overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="absolute inset-0 opacity-10 bg-[url('/images/grid-pattern.svg')] bg-cover"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Effective Learning <span className="text-yellow-300">Program</span> for Kids
            </h1>
            
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed animate-delay-100">
              Engaging assessments that help teachers understand each student's unique learning needs.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 animate-delay-200">
              <Button 
                size="lg" 
                asChild 
                className="px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <Link href="/auth/login">
                  Student Login <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild 
                className="px-8 py-4 border-white text-blue-800 hover:bg-white/20 hover:text-white shadow-md transition-all duration-300 hover:-translate-y-1"
              >
                <Link href="/auth/register">
                  Parent Sign Up <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - How It Works */}
      <section className="container mx-auto px-6 max-w-7xl py-20">
        <div className="text-center mb-20">
          <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium mb-4 shadow-sm">
            Our Learning Approach
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            How <span className="text-blue-600">RadiantPrep</span> Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A structured program that makes learning engaging for students and insightful for educators
          </p>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-28 relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-100 via-purple-200 to-green-100 -translate-y-1/2 -z-10"></div>

          {[
            {
              icon: <BookOpen className="w-8 h-8 text-white" />,
              title: "Interactive Assessments",
              description: "Engaging exercises with clear objectives",
              gradient: "from-blue-400 via-blue-500 to-blue-600",
              ring: "ring-blue-300/40"
            },
            {
              icon: <BarChart3 className="w-8 h-8 text-white" />,
              title: "Progress Tracking",
              description: "Detailed dashboards show learning growth",
              gradient: "from-purple-400 via-purple-500 to-purple-600",
              ring: "ring-purple-300/40"
            },
            {
              icon: <Users className="w-8 h-8 text-white" />,
              title: "Practical Insights",
              description: "Actionable recommendations for improvement",
              gradient: "from-green-400 via-green-500 to-green-600",
              ring: "ring-green-300/40"
            }
          ].map((step, index) => (
            <div
              key={index}
              className={`relative p-8 rounded-3xl shadow-2xl bg-white hover:translate-y-[-4px] transition-transform duration-300 border border-gray-100`}
            >
              <div className="absolute -top-5 -right-5 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-lg font-bold text-gray-600 z-10">
                {index + 1}
              </div>

              <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br ${step.gradient} shadow-lg flex items-center justify-center ring-4 ${step.ring} transition-transform group-hover:scale-110`}>
                {step.icon}
              </div>

              <h3 className="text-xl font-semibold text-center text-gray-800 mb-3">{step.title}</h3>
              <p className="text-center text-gray-600">{step.description}</p>

              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <span
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i === index % 3 ? 'bg-blue-500' : 'bg-gray-300'
                    } opacity-70 transition-opacity`}
                  ></span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Dual Pathway Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-20">
          {/* Student */}
          <div className="group relative bg-gradient-to-br from-blue-50 to-white rounded-3xl border border-blue-100 shadow-2xl hover:shadow-3xl transition-all overflow-hidden">
            <div className="absolute inset-0 opacity-30 group-hover:opacity-50 bg-gradient-to-br from-blue-100 to-blue-200 transition-opacity"></div>
            <div className="relative z-10 p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 flex items-center justify-center bg-white rounded-full shadow-inner ring-4 ring-blue-300/30">
                <Users className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">For Students</h3>
                <p className="text-gray-700 mb-3">Enjoy gamified lessons, instant feedback, and clear goals to guide your learning.</p>
                <ul className="list-disc text-sm text-gray-600 pl-5 space-y-1">
                  <li>Interactive assessments</li>
                  <li>Personalized progress tracking</li>
                  <li>Skill mastery challenges</li>
                </ul>
                <Button
                  asChild
                  className="mt-6 bg-blue-600 hover:bg-blue-700 text-white shadow-md group-hover:-translate-y-1 transition"
                >
                  <Link href="/auth/login">Access Student Dashboard</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Parent */}
          <div className="group relative bg-gradient-to-br from-purple-50 to-white rounded-3xl border border-purple-100 shadow-2xl hover:shadow-3xl transition-all overflow-hidden">
            <div className="absolute inset-0 opacity-30 group-hover:opacity-50 bg-gradient-to-br from-purple-100 to-purple-200 transition-opacity"></div>
            <div className="relative z-10 p-8 flex flex-col md:flex-row items-center gap-6">
              <div className="w-24 h-24 flex items-center justify-center bg-white rounded-full shadow-inner ring-4 ring-purple-300/30">
                <Edit3 className="w-10 h-10 text-purple-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">For Parents</h3>
                <p className="text-gray-700 mb-3">Track your child’s academic journey with real-time data and meaningful insights.</p>
                <ul className="list-disc text-sm text-gray-600 pl-5 space-y-1">
                  <li>Daily performance updates</li>
                  <li>Actionable learning reports</li>
                  <li>Parental engagement tools</li>
                </ul>
                <Button
                  asChild
                  className="mt-6 bg-purple-600 hover:bg-purple-700 text-white shadow-md group-hover:-translate-y-1 transition"
                >
                  <Link href="/auth/register">Enroll Your Child</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Enhance Learning?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
            Join schools using our platform to make assessments meaningful and effective.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              asChild 
              size="lg"
              className="px-8 py-4 bg-yellow-400 hover:bg-yellow-500 text-blue-800 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <Link href="/auth/register">Get Started for Free</Link>
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              asChild 
              className="px-8 py-4 border-white text-blue-800 hover:bg-white/10 hover:text-white shadow-md transition-all hover:-translate-y-1"
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}