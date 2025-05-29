
import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Using Inter as a common, clean font
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { Navbar } from '@/components/shared/Navbar';
import { PageLoadingIndicator } from '@/components/shared/PageLoadingIndicator';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Radiant Test Prep - Diagnostic Testing',
  description: 'Radiant Test Prep\'s Diagnostic Testing Program for academic excellence.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased flex flex-col min-h-screen`}>
        <AuthProvider>
          <PageLoadingIndicator />
          <Navbar />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="bg-card border-t border-border py-6 text-center text-muted-foreground text-sm">
            <p>&copy; {new Date().getFullYear()} Radiant Test Prep. All rights reserved.</p>
            <p>Empowering Learning Journeys</p>
          </footer>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
