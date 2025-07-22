// components/layouts/ChildLayout.tsx
'use client';

import { ReactNode, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Sidebar } from './partials/Sidebar';
import { Header } from './partials/Header';

import { isChild } from '@/lib/types';

export default function ChildLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-gray-100/50">
      {/* Overlay Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}>
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" />
        </div>
      )}
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:hidden ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <Sidebar mobile setSidebarOpen={setSidebarOpen} />
      </div>
      <div className="fixed inset-y-0 left-0 z-40 w-72 bg-white shadow-lg border-r border-gray-200 hidden lg:block">
        <Sidebar setSidebarOpen={setSidebarOpen} />
      </div>

      {/* Content */}
      <div className="lg:ml-72">
        <Header user={user} setSidebarOpen={setSidebarOpen} />
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto animate-slideInUp">{children}</div>
        </main>
      </div>
    </div>
  );
}
