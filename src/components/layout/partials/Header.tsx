'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { BarChart2, Bell, LogOut, Settings, User } from 'lucide-react';
import Link from 'next/link';
import { isChild } from '@/lib/types';

export function Header({ user, setSidebarOpen }: { user: any; setSidebarOpen: (v: boolean) => void }) {
  const { logout } = useAuth();

  const getAvatarUrl = (user: any) => {
    if (!user) return '/default-avatar.png';
    return user.avatarUrl || (isChild(user) ? '/child-avatar.png' : '/parent-avatar.png');
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
      <div className="px-5 sm:px-6 h-14 flex items-center justify-between">
         <div className="flex items-center">
            <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center mr-2">
              <BarChart2 className="h-4 w-4 text-primary" />
            </div>
            <h1 className="text-base font-medium text-gray-800">Student Dashboard</h1>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="relative text-gray-500 hover:bg-gray-100">
            <Bell className="h-[18px] w-[18px]" />
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-red-400 rounded-full border border-white" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="rounded-full p-0 w-9 h-9 hover:bg-gray-100">
                <Avatar className="h-8 w-8 border border-gray-200">
                  <AvatarImage src={getAvatarUrl(user)} />
                  <AvatarFallback className="bg-primary text-white">
                    {isChild(user) ? user.childName?.[0]?.toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 border rounded-md shadow-lg">
              <DropdownMenuLabel className="font-normal py-2">
                <div className="flex flex-col">
                  <span className="font-medium">{isChild(user) ? user.childName : 'Student'}</span>
                  <span className="text-xs text-gray-500">Student Account</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="flex items-center w-full px-2 py-2 text-sm">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center w-full px-2 py-2 text-sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-red-500 px-2 py-2 text-sm hover:bg-red-50 cursor-pointer">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
