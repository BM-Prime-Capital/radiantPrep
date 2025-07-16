'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { NavbarAuthButtons } from "./NavbarAuthButtons";
import { useAuth } from "@/contexts/AuthContext";

interface NavbarProps {
  isHomePage: boolean;
  isAuthenticated: boolean;
}

export function Navbar({ isHomePage, isAuthenticated }: NavbarProps) {
  const { user, role } = useAuth();
  
  return (
    <header className="sticky top-0 z-50 bg-[#5299ff] text-white shadow-lg">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 relative">
              <Image
                src="/logo-white.png"
                alt="Radiant Prep's Testing Program Logo"
                fill
                className="object-contain transition-transform group-hover:scale-105"
                priority
              />
            </div>
            <span className="text-xl font-bold text-white hidden sm:block">
              Radiant Prep's Testing Program
            </span>
          </Link>

          {/* Auth Buttons */}
          <NavbarAuthButtons isHomePage={isHomePage} />
        </div>
      </div>
    </header>
  );
}