
'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { GlobalLoader } from './GlobalLoader';

export function PageLoadingIndicator() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const previousPathnameRef = useRef(pathname);

  useEffect(() => {
    // Only show loader if the pathname has actually changed
    if (previousPathnameRef.current !== pathname) {
      setIsLoading(true);
    }
    // Update the ref to the current pathname for the next comparison
    previousPathnameRef.current = pathname;

    // This timer will hide the loader after a short duration.
    // This ensures the loader is visible during the transition and then disappears.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 750); // Duration can be adjusted

    return () => {
      clearTimeout(timer);
    };
  }, [pathname]);

  // Ensure the loader is not shown on the very first page load/hydration.
  useEffect(() => {
    setIsLoading(false);
  }, []);

  return <GlobalLoader isLoading={isLoading} appName="Radiant Test Prep" />;
}
