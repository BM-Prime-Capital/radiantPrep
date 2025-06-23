'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { GlobalLoader } from './GlobalLoader';

export function PageLoadingIndicator() {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const previousPathnameRef = useRef(pathname);

  useEffect(() => {
    if (previousPathnameRef.current !== pathname) {
      setIsLoading(true);
    }
    previousPathnameRef.current = pathname;

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 750);

    return () => clearTimeout(timer);
  }, [pathname]);

  return <GlobalLoader isLoading={isLoading} />;
}