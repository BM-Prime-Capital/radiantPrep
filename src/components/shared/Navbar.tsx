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
  const {  role } = useAuth();
 

  // Si connecté et pas sur la page d'accueil, utilisez le style de la Hero Section
  const navbarStyle = isAuthenticated && !isHomePage 
    ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white border-b border-blue-500/30'
    : 'bg-white/80 backdrop-blur-sm border-b border-gray-200';

  const textColor = isAuthenticated && !isHomePage 
    ? 'text-white hover:text-blue-200'
    : 'text-gray-700 hover:text-blue-600';

  return (
    <header className={`sticky top-0 z-50 ${navbarStyle} shadow-sm`}>
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-12 h-12 relative">
              <Image
                src="/newlogo.png"
                alt="Radiant Prep Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className={`text-xl font-bold ${isAuthenticated && !isHomePage ? 'text-white' : 'text-gray-900'} hidden sm:block`}>
              Radiant Prep
            </span>
          </Link>

          {/* Navigation Links - Hidden for child users */}
          {(!isAuthenticated || role !== 'child') && (
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/about" className={`font-medium transition-colors ${textColor}`}>
                About
              </Link>
              <Link href="/schools" className={`font-medium transition-colors ${textColor}`}>
                For Schools
              </Link>
              <Link href="/parents" className={`font-medium transition-colors ${textColor}`}>
                For Parents
              </Link>
              <Link href="/contact" className={`font-medium transition-colors ${textColor}`}>
                Contact
              </Link>
            </nav>
          )}

          {/* Auth Buttons */}
          <NavbarAuthButtons isAuthenticated={isAuthenticated} isHomePage={isHomePage} />
        </div>
      </div>
    </header>
  );
}