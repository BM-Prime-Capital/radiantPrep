'use client';

import { usePathname } from 'next/navigation';
import { Footer, Navbar } from '../shared';
import { useAuth } from '@/contexts/AuthContext';

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const isAuthPage = pathname?.startsWith('/auth');
  const isHomePage = pathname === '/';

  return (
    <div className="flex flex-col min-h-screen">
      {!isAuthPage && (
        <Navbar 
          isHomePage={isHomePage} 
          isAuthenticated={isAuthenticated}
        />
      )}
      <main className="flex-1">
        {children}
      </main>
      {!isAuthPage && (
        <Footer 
          isHomePage={isHomePage} 
          isAuthenticated={isAuthenticated}
        />
      )}
    </div>
  );
}
