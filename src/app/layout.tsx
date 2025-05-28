import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Using Inter as a common, clean font
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { Navbar } from '@/components/shared/Navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'EduCode Access - Radiant Prep',
  description: 'Radiant Prep\'s Diagnostic Testing Program',
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
          <Navbar />
          <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          <footer className="bg-card border-t border-border py-6 text-center text-muted-foreground text-sm">
            <p>&copy; {new Date().getFullYear()} Radiant Prep. All rights reserved.</p>
            <p>EduCode Access - Empowering Learning Journeys</p>
          </footer>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
