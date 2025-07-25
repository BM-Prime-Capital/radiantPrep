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
    // 1. Appel API de login
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessCode: accessCode.trim() }), // Nettoyage du code
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Login failed');
    }

    const childInfo = await response.json();
    console.log('Login API response:', childInfo);

    // 2. Validation du rôle
    if (childInfo.role !== 'CHILD') {
      throw new Error('Invalid user role');
    }

    // 3. Mise à jour du state d'authentification
    loginChild({
      id: childInfo.id,
      childName: childInfo.childName,
      grade: dbGradeToAppGrade(childInfo.grade),
      subject: childInfo.currentSubject,
      accessCode: childInfo.accessCode,
    });

    // 4. Notification de succès
    toast({
      title: 'Login successful!',
      description: `Welcome back, ${childInfo.childName}`,
    });

    // 5. Redirection avec plusieurs fallbacks
    console.log('Attempting redirect...');
    try {
      // Essai 1: Redirection normale
      await router.push('/child-dashboard');
      console.log('Router push succeeded');
      
      // Essai 2: Rechargement après un délai si nécessaire
      setTimeout(() => {
        if (window.location.pathname !== '/child-dashboard') {
          console.warn('Router push failed, forcing refresh');
          window.location.href = '/child-dashboard';
        }
      }, 500);
    } catch (error) {
      console.error('Router push error:', error);
      // Essai 3: Redirection immédiate si tout échoue
      window.location.href = '/child-dashboard';
    }

  } catch (error) {
    console.error('Login error:', error);
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
    <div className="min-h-screen bg-white">
      {/* Background animated blobs */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-green-300/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-green-200/20 rounded-full blur-2xl animate-float delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-100/20 rounded-full blur-3xl animate-float delay-2000" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="max-w-xl w-full space-y-10 bg-white border border-gray-200 rounded-xl shadow-xl p-10 animate-slideInUp">
          {/* Header */}
          <div className="text-center space-y-4 animate-slideInRight">
            <div className="flex justify-center">
              <div className="relative h-24 w-24 animate-float">
                {/* Halo animé */}
                <div className="absolute inset-0 rounded-full bg-green-400/30 blur-2xl animate-pulse scale-[1.6] z-0" />

                {/* Conteneur du logo */}
                <div className="relative z-10 h-full w-full rounded-full bg-gradient-to-br from-green-600 to-green-700 shadow-lg p-2 hover:scale-105 transition-all duration-500">
                  <div className="bg-white rounded-full h-full w-full flex items-center justify-center overflow-hidden">
                    <Image
                      src="/logo-complemetrics.png"
                      alt="Radiant Prep Logo"
                      width={56}
                      height={56}
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900">Welcome back</h2>
            <p className="text-sm text-gray-500">
              Enter your access code to continue
            </p>
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

          {/* Footer copyright */}
          <div className="pt-6 border-t border-gray-100 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Radiant Prep. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
