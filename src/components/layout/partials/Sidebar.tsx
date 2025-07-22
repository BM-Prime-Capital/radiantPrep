'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ChevronRight, BookOpen, FileText, BarChart2, Trophy, X } from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', href: '/child-dashboard', icon: BookOpen },
  { name: 'Assessments', href: '/assessment/select', icon: FileText },
  { name: 'Progress', href: '/progress', icon: BarChart2 },
  { name: 'Achievements', href: '/achievements', icon: Trophy, badge: '3' },
];

export function Sidebar({ mobile = false, setSidebarOpen }: { mobile?: boolean; setSidebarOpen?: (open: boolean) => void }) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-5 bg-white border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-6 bg-gray-50 rounded-lg flex items-center justify-center">
            <img src="/newlogo.png" alt="Logo" className="w-5 h-5 object-contain" />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">Radiant Prep</h2>
        </div>
        {mobile && setSidebarOpen && (
          <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:bg-gray-100">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <button
              key={item.name}
              onClick={() => router.push(item.href)}
              className={`group w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                isActive ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg scale-[1.02]' : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center">
                <item.icon className={`h-4 w-4 mr-3 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}`} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className={`text-xs font-medium px-2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-primary-100 text-primary-700'}`}>
                  {item.badge}
                </span>
              )}
              {isActive && <ChevronRight className="h-3 w-3 text-white" />}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
