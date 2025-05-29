
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { BookOpenText, Home, LogIn, LogOut, UserPlus, ClipboardList, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

export function Navbar() {
  const { isAuthenticated, role, user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navItems = [
    { href: '/', label: 'Home', icon: <Home className="h-5 w-5" /> },
    ...(isAuthenticated && role === 'child'
      ? [
          { href: '/assessment/select', label: 'Start Assessment', icon: <ClipboardList className="h-5 w-5" /> },
          { href: '/assessment/results', label: 'View Results', icon: <CheckCircle2 className="h-5 w-5" /> },
        ]
      : []),
    ...(isAuthenticated && role === 'parent'
      ? [
          // { href: '/dashboard', label: 'Parent Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
          // Currently no dashboard page, so link to register another child or view codes could go here
        ]
      : []),
  ];

  return (
    <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors">
              <BookOpenText className="h-8 w-8" />
              <span className="font-semibold text-xl tracking-tight">Radiant Test Prep</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted hover:text-accent-foreground"
                )}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                 <span className="text-sm text-muted-foreground hidden sm:inline">
                  Welcome, {role === 'child' ? (user as any)?.childName : (user as any)?.email?.split('@')[0]}!
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <div className="space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/auth/login">
                    <LogIn className="h-4 w-4 mr-2" />
                    Child Login
                  </Link>
                </Button>
                <Button variant="default" size="sm" asChild>
                  <Link href="/auth/register">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Parent Register
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Nav Links (Optional: Could be in a Sheet component) */}
      <div className="md:hidden border-t border-border">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors",
                  pathname === item.href
                    ? "bg-primary/10 text-primary"
                    : "text-foreground hover:bg-muted hover:text-accent-foreground"
                )}
              >
                {item.icon}
                <span className="ml-2">{item.label}</span>
              </Link>
            ))}
        </div>
      </div>
    </nav>
  );
}
