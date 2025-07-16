import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getServerSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { BookOpen, BarChart3, Users, Edit3, ArrowRight, Sparkles, Trophy, School, BadgeCheck } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const session = await getServerSession();

  if (session?.user?.role === 'CHILD') redirect('/child-dashboard');
  if (session?.user?.role === 'PARENT') redirect('/parent-dashboard');

  return (
    <div className="min-h-screen bg-background-page text-foreground-page">
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(#f5f5f5_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 space-y-8 animate-fade-in">
              <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-4">
                <Sparkles className="w-4 h-4 mr-2" />
                Transformative Learning
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 leading-tight">
                Unlock Your Child's <span className="text-blue-600">Potential</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
                Our adaptive learning platform personalizes education to match each student's unique pace and style, making learning effective and enjoyable.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition">
                  <Link href="/auth/login">
                    Get Started <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-gray-900 text-gray-900 hover:bg-gray-50">
                  <Link href="/about">
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="relative aspect-square w-full max-w-lg mx-auto">
                <div className="absolute inset-0 bg-blue-100 rounded-2xl rotate-6"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-400 rounded-2xl shadow-xl flex items-center justify-center p-8">
                  <Trophy className="w-24 h-24 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-blue-600">Radiant Prep's Testing Program</span>?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We combine innovative technology with proven educational methods
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <BookOpen className="w-10 h-10 text-blue-600" />,
                title: "Personalized Learning",
                description: "Adaptive paths tailored to each student's needs"
              },
              {
                icon: <BarChart3 className="w-10 h-10 text-blue-600" />,
                title: "Real-time Analytics",
                description: "Track progress with detailed insights"
              },
              {
                icon: <School className="w-10 h-10 text-blue-600" />,
                title: "Expert Content",
                description: "Curriculum designed by education specialists"
              },
              {
                icon: <BadgeCheck className="w-10 h-10 text-blue-600" />,
                title: "Proven Results",
                description: "Students show measurable improvement"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                <div className="w-16 h-16 mb-6 rounded-lg bg-blue-50 flex items-center justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It <span className="text-blue-600">Works</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple steps to transform your child's learning experience
            </p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute left-1/2 top-0 h-full w-0.5 bg-gradient-to-b from-blue-400 via-blue-300 to-blue-200 -translate-x-1/2"></div>
            
            {[
              {
                step: "1",
                title: "Assessment",
                description: "We evaluate your child's current level",
                icon: <BookOpen className="w-8 h-8 text-white" />
              },
              {
                step: "2",
                title: "Personalized Plan",
                description: "Create a customized learning path",
                icon: <BarChart3 className="w-8 h-8 text-white" />
              },
              {
                step: "3",
                title: "Engaging Lessons",
                description: "Interactive content that keeps students motivated",
                icon: <Users className="w-8 h-8 text-white" />
              },
              {
                step: "4",
                title: "Progress Tracking",
                description: "Regular updates on achievements and areas to improve",
                icon: <Edit3 className="w-8 h-8 text-white" />
              }
            ].map((item, index) => (
              <div 
                key={index} 
                className={`relative mb-12 last:mb-0 ${index % 2 === 0 ? 'lg:text-right lg:pr-16' : 'lg:text-left lg:pl-16'}`}
              >
                <div className="lg:absolute lg:top-0 lg:left-1/2 w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center -translate-x-8 shadow-lg mx-auto lg:mx-0 mb-6 lg:mb-0">
                  {item.icon}
                </div>
                <div className="lg:w-1/2 mx-auto lg:mx-0">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Parents <span className="text-blue-600">Say</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Success stories from our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "My child's confidence has grown tremendously since using Radiant Prep's Testing Program.",
                name: "Sarah Johnson",
                role: "Parent"
              },
              {
                quote: "The personalized approach made all the difference for my son's learning.",
                name: "Michael Chen",
                role: "Parent & Educator"
              },
              {
                quote: "Finally a platform that makes learning fun and effective!",
                name: "Emma Rodriguez",
                role: "Parent"
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-white hover:shadow-md transition-shadow">
                <CardContent className="p-8">
                  <div className="mb-6 text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="text-gray-700 italic mb-6">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-blue-500">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Transform Learning?
          </h2>
          <p className="text-lg text-blue-100 mb-10">
            Join thousands of parents who are seeing real results
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-white hover:bg-gray-100 text-blue-600 shadow-md">
              <Link href="/auth/register">
                Start Free Trial
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="border-white text-white bg-transparent hover:bg-white/10">
              <Link href="/contact">
                Contact Us
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}