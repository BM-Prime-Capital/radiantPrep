'use client';

import { Loader2 } from 'lucide-react';

interface GlobalLoaderProps {
  isLoading: boolean;
}

export function GlobalLoader({ isLoading }: GlobalLoaderProps) {
  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-background/80 flex flex-col items-center justify-center z-[9999] backdrop-blur-sm">
      <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
      <p className="text-xl font-semibold text-foreground">
        Loading Radiant Prep Test...
      </p>
    </div>
  );
}