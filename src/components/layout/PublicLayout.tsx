// components/layout/PublicLayout.tsx
'use client';

import { usePathname } from 'next/navigation';
import { Header } from './Header';
import { Footer } from './Footer';
import { useAuth } from '@/contexts/AuthContext';

export const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  const isAuthPage = pathname?.startsWith('/auth');

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthPage && <Header isAuthenticated={isAuthenticated} isLoading={isLoading} />}
      <main className="flex-1">{children}</main>
      {!isAuthPage && <Footer isAuthenticated={isAuthenticated} />}
    </div>
  );
};
