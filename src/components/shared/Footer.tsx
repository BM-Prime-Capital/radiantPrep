'use client';

import { useAuth } from '@/contexts/AuthContext';

export function Footer({ 
  isHomePage,
  isAuthenticated 
}: { 
  isHomePage: boolean;
  isAuthenticated: boolean;
}) {
  const footerStyle = isAuthenticated && !isHomePage 
    ? 'bg-primary text-white'
    : 'bg-gray-100 text-gray-700';

  return (
    <footer className={`py-10 ${footerStyle}`}>
      <div className="container mx-auto px-6 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Radiant Prep. All rights reserved.
        </p>
        <p className="text-sm mt-1">Empowering students through effective test preparation.</p>
      </div>
    </footer>
  );
}
