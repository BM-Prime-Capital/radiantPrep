'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  isAuthenticated?: boolean;
}

export const Header = ({ isAuthenticated }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Use justify-between with absolute center element */}
        <div className="relative flex h-16 items-center justify-between">
          {/* Left: Logo principal */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <img
                src="/logo-complemetrics.png"
                alt="CompleMetrics Logo"
                className="h-8 w-auto drop-shadow-lg brightness-110 hover:scale-105 transition-transform duration-300"
              />
            </Link>
          </div>

          {/* Center: by Radiant Prep avec logo */}

          <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
            <span className="text-sm sm:text-base font-medium text-[#1E9B3B] drop-shadow-sm tracking-wide">
              by
            </span>
            <img
              src="/newlogo.png"
              alt="Radiant Prep Logo"
              className="h-8 sm:h-10 w-auto drop-shadow-lg brightness-110 hover:scale-105 transition-transform duration-300"
            />
            <span className="text-sm sm:text-base font-semibold text-[#1E9B3B] drop-shadow-sm">
              Radiant Prep
            </span>
          </div>

          {/* Right: Auth buttons */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <Link
                href="/dashboard"
                className="text-sm font-medium hover:text-primary"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium hover:text-primary"
                >
                  Sign In
                </Link>
                <Button asChild>
                  <Link href="/auth/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
