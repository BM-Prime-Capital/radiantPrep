'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { dbGradeToAppGrade } from '@/lib/gradeUtils';

export default function LoginPage() {
  const router = useRouter();
  const { loginChild } = useAuth();
  const { toast } = useToast();

  const [accessCode, setAccessCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessCode: accessCode.trim() }),
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Login failed');
      }

      const childInfo = await response.json();

      if (childInfo.role !== 'CHILD') {
        throw new Error('Invalid user role');
      }

      loginChild({
        id: childInfo.id,
        childName: childInfo.childName,
        grade: dbGradeToAppGrade(childInfo.grade),
        subject: childInfo.currentSubject,
        accessCode: childInfo.accessCode,
      });

      toast({
        title: 'Login successful!',
        description: `Welcome back, ${childInfo.childName}`,
      });

      await router.push('/child-dashboard');

      setTimeout(() => {
        if (window.location.pathname !== '/child-dashboard') {
          window.location.href = '/child-dashboard';
        }
      }, 500);

    } catch (error) {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Invalid access code',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Background blobs with animation */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-green-300/20 rounded-full blur-3xl animate-blob float-delay-0" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-green-200/20 rounded-full blur-2xl animate-blob float-delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-100/20 rounded-full blur-3xl animate-blob float-delay-2000" />
      </div>

      {/* Content */}
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

            {/* Welcome back improved */}
            <div className="space-y-1 animate-fadeInUp">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight drop-shadow-sm transition-all duration-500 hover:scale-[1.02]">
                Welcome back
              </h2>
              <p className="text-sm text-gray-600">
                Enter your access code to continue
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm text-center font-medium text-gray-700 mb-2">
                Access Code
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Key className="h-5 w-5" />
                </div>
                <input
                  type={showCode ? 'text' : 'password'}
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="w-full h-14 pl-10 pr-12 text-sm text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E9B3B] focus:border-[#1E9B3B] transition-colors"
                  placeholder="Your access code"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 text-lg font-semibold text-white rounded-lg shadow-md bg-gradient-to-br from-[#1E9B3B] to-green-700 hover:brightness-110 transition-all duration-300"
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>

          {/* Footer links */}
          <div className="text-center text-sm text-gray-500 space-x-4">
            <span>
              Need help?{' '}
              <a href="/contact" className="text-[#1E9B3B] font-medium hover:underline">
                Contact support
              </a>
            </span>
            <span>|</span>
            <a href="/" className="text-[#1E9B3B] font-medium hover:underline">
              Back to Home
            </a>
          </div>

          {/* Copyright */}
          <div className="pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Radiant Prep. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
