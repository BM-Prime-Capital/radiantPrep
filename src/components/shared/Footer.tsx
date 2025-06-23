'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export function Footer({ 
  isHomePage,
  isAuthenticated 
}: { 
  isHomePage: boolean;
  isAuthenticated: boolean;
}) {
  // Si connecté et pas sur la page d'accueil, utilisez le style de la Hero Section
  const footerStyle = isAuthenticated && !isHomePage 
    ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white'
    : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-t border-gray-200';

  return (
    <footer className={`py-12 ${footerStyle}`}>
      <div className="container mx-auto px-6">
        {/* Conteneur principal centré */}
        <div className="flex flex-col items-center text-center">
          {/* Bloc copyright centré */}
          <div className="mb-6">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Radiant Prep. All rights reserved.
            </p>
            <p className="text-sm mt-2">
              Empowering students through effective test preparation.
            </p>
          </div>
          
          {/* Liens de navigation centrés */}
          {/* <div className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link href="/privacy" className="text-sm hover:underline">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm hover:underline">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-sm hover:underline">
              Contact Us
            </Link>
          </div> */}
        </div>
      </div>
    </footer>
  );
}