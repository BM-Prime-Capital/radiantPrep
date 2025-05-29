
'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { GlobalLoader } from './GlobalLoader';

export function PageLoadingIndicator() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true); // Start true for initial load
  const previousPathnameRef = useRef(pathname); // Keep track of previous path

  useEffect(() => {
    // For navigations, ensure isLoading is set to true to re-trigger the loader display
    if (previousPathnameRef.current !== pathname) {
      setIsLoading(true);
    }
    // Update the ref to the current pathname for the next comparison cycle
    previousPathnameRef.current = pathname;

    // Timer to hide the loader after a short duration
    // This applies to both initial load (because isLoading starts true) and navigations
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 750); // Duration can be adjusted based on preference

    return () => {
      clearTimeout(timer); // Clean up the timer if the component unmounts or pathname changes again quickly
    };
  }, [pathname]); // Re-run this effect when the pathname changes

  return <GlobalLoader isLoading={isLoading} appName="Radiant Test Prep" />;
}
