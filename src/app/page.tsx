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
            <div className="inline-block mb-6 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium shadow-sm">
              Trusted by 500+ elementary schools
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6 leading-tight">
              Fun Learning <span className="text-yellow-300">Adventures</span> for Kids
            </h1>
            
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed animate-delay-100">
              Game-like assessments that help teachers understand each student's unique learning path.
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
        {/* <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/10 backdrop-blur-sm"></div> */}
      </section>

      {/* Features Section - How It Works */}
      {/* Features Section - How It Works */}
<section className="container mx-auto px-6 max-w-7xl py-16 md:py-24">
  <div className="text-center mb-16">
    <span className="inline-block px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium mb-4 shadow-sm">
      Our Learning Adventure
    </span>
    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
      How <span className="text-blue-600">LearnAdventure</span> Works
    </h2>
    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
      A magical journey that makes assessments fun for kids and insightful for adults
    </p>
  </div>

  {/* Animated Steps */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 relative">
    {/* Decorative elements */}
    <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 -translate-y-1/2 -z-10"></div>
    
    {[
      {
        icon: <BookOpen className="w-10 h-10 text-blue-600" />,
        title: "Playful Assessments",
        description: "Game-like tests with friendly characters",
        color: "bg-blue-100",
        accent: "from-blue-400 to-blue-500"
      },
      {
        icon: <BarChart3 className="w-10 h-10 text-purple-600" />,
        title: "Instant Feedback",
        description: "Colorful dashboards show progress",
        color: "bg-purple-100",
        accent: "from-purple-400 to-purple-500"
      },
      {
        icon: <Users className="w-10 h-10 text-green-600" />,
        title: "Actionable Insights",
        description: "Practical tips for teachers & parents",
        color: "bg-green-100",
        accent: "from-green-400 to-green-500"
      }
    ].map((step, index) => (
      <div 
        key={index}
        className={`relative p-8 rounded-2xl ${step.color} shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden`}
      >
        {/* Animated background effect */}
        <div className={`absolute inset-0 bg-gradient-to-br ${step.accent} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
        
        {/* Number badge */}
        <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center text-2xl font-bold text-gray-700">
          {index + 1}
        </div>
        
        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
          {step.icon}
        </div>
        <h3 className="text-xl font-bold text-center mb-3 text-gray-800 group-hover:text-gray-900 transition-colors">
          {step.title}
        </h3>
        <p className="text-gray-600 text-center">{step.description}</p>
        
        {/* Animated dots */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {[...Array(3)].map((_, i) => (
            <span 
              key={i}
              className={`w-2 h-2 rounded-full ${i === index % 3 ? 'bg-blue-500' : 'bg-gray-300'} opacity-70 group-hover:opacity-100 transition-all`}
            ></span>
          ))}
        </div>
      </div>
    ))}
  </div>

  {/* Dual Pathway Cards */}
  <div className="flex flex-col lg:flex-row gap-8 items-stretch">
    {/* Student Pathway */}
    <div className="flex-1 relative group overflow-hidden rounded-3xl bg-white shadow-2xl hover:shadow-3xl transition-all duration-500 border-2 border-blue-100 hover:border-blue-200 hover:-translate-y-2">
      <div className="absolute inset-0 bg-[url('/images/student-dots.svg')] opacity-5 group-hover:opacity-10 transition-opacity"></div>
      <div className="relative p-8 h-full flex flex-col">
        <div className="flex items-start gap-5 mb-6">
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg">
            <Users className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Student Adventure</h3>
            <p className="text-gray-600 mt-2">
              Where learning feels like playtime!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[
            {
              icon: <BookOpen className="h-6 w-6" />,
              title: "Game Mode",
              description: "Earn stars and unlock rewards",
              color: "bg-blue-50 border-blue-100"
            },
            {
              icon: <BarChart3 className="h-6 w-6" />,
              title: "Progress Map",
              description: "Track your learning journey",
              color: "bg-blue-50 border-blue-100"
            },
            {
              icon: <Shield className="h-6 w-6" />,
              title: "Superpowers",
              description: "Build your knowledge skills",
              color: "bg-blue-50 border-blue-100"
            },
            {
              icon: <CheckCircle className="h-6 w-6" />,
              title: "Daily Challenges",
              description: "Fun quick activities",
              color: "bg-blue-50 border-blue-100"
            }
          ].map((feature, i) => (
            <div 
              key={i}
              className={`p-4 rounded-lg border ${feature.color} hover:bg-white transition-colors`}
            >
              <div className="text-blue-600 mb-2">
                {feature.icon}
              </div>
              <h4 className="font-semibold text-gray-800">{feature.title}</h4>
              <p className="text-gray-600 text-sm mt-1">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-gray-100">
          <Button 
            asChild 
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-6 text-lg group shadow-lg hover:shadow-xl"
          >
            <Link href="/auth/login">
              <span className="flex items-center justify-center">
                Start Your Adventure 
                <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </div>

    {/* Parent Companion */}
    <div className="flex-1 relative group overflow-hidden rounded-3xl bg-white shadow-2xl hover:shadow-3xl transition-all duration-500 border-2 border-purple-100 hover:border-purple-200 hover:-translate-y-2">
      <div className="absolute inset-0 bg-[url('/images/parent-lines.svg')] opacity-5 group-hover:opacity-10 transition-opacity"></div>
      <div className="relative p-8 h-full flex flex-col">
        <div className="flex items-start gap-5 mb-6">
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 text-white shadow-lg">
            <Edit3 className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Parent Companion</h3>
            <p className="text-gray-600 mt-2">
              Tools to support your child's growth
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {[
            {
              icon: <ClipboardList className="h-6 w-6" />,
              title: "Simple Reports",
              description: "Clear, actionable insights",
              color: "bg-purple-50 border-purple-100"
            },
            {
              icon: <Shield className="h-6 w-6" />,
              title: "Milestones",
              description: "Celebrate achievements",
              color: "bg-purple-50 border-purple-100"
            },
            {
              icon: <BookText className="h-6 w-6" />,
              title: "Activity Ideas",
              description: "Fun learning extensions",
              color: "bg-purple-50 border-purple-100"
            },
            {
              icon: <Calculator className="h-6 w-6" />,
              title: "Progress Alerts",
              description: "Get notified of big wins",
              color: "bg-purple-50 border-purple-100"
            }
          ].map((feature, i) => (
            <div 
              key={i}
              className={`p-4 rounded-lg border ${feature.color} hover:bg-white transition-colors`}
            >
              <div className="text-purple-600 mb-2">
                {feature.icon}
              </div>
              <h4 className="font-semibold text-gray-800">{feature.title}</h4>
              <p className="text-gray-600 text-sm mt-1">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-gray-100">
          <Button 
            asChild 
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-6 text-lg group shadow-lg hover:shadow-xl"
          >
            <Link href="/auth/register">
              <span className="flex items-center justify-center">
                Join the Journey 
                <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What Teachers Say</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Loved by educators across the country
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "My students actually ask to take the assessments! The data helps me personalize their learning.",
                name: "Sarah Johnson",
                role: "3rd Grade Teacher, TX"
              },
              {
                quote: "Finally an assessment tool that doesn't feel like a test. The kids think they're playing games.",
                name: "Michael Chen",
                role: "Elementary Principal, CA"
              },
              {
                quote: "The parent reports have transformed our family-teacher conferences. So much more productive!",
                name: "Emily Rodriguez",
                role: "2nd Grade Teacher, FL"
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100"
              >
                <div className="text-yellow-400 mb-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                <div className="font-semibold text-gray-800">{testimonial.name}</div>
                <div className="text-sm text-gray-500">{testimonial.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Learning?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto">
            Join thousands of schools using our platform to make assessments fun and effective.
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
              <Link href="/about">See How It Works</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}