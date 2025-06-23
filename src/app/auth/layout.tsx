import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/app/globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { PageLoadingIndicator } from '@/components/shared/PageLoadingIndicator';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Radiant Test Prep - Authentication',
  description: 'Login or register to access Radiant Test Prep',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <PageLoadingIndicator />
      <main className="min-h-screen flex items-center justify-center p-4">
        {children}
      </main>
      <Toaster />
    </AuthProvider>
  );
}