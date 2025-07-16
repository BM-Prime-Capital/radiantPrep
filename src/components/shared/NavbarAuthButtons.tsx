'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, BookOpen, BarChart2, ChevronDown, Home } from "lucide-react";
import { motion } from "framer-motion";

interface NavbarAuthButtonsProps {
  isHomePage: boolean;
}

export function NavbarAuthButtons({ isHomePage }: NavbarAuthButtonsProps) {
  const { user, role, logout } = useAuth();

  const isAuthenticated = !!user;

  const getDisplayName = () => {
    if (!user) return 'User';
    if (role === 'child' && 'childName' in user) return user.childName;
    if (role === 'parent' && 'email' in user) return user.email.split('@')[0];
    return 'User';
  };

  const getAvatarFallback = () => getDisplayName().charAt(0).toUpperCase();

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        {role === 'child' && (
          <motion.div whileHover={{ scale: 1.03 }}>
            <Button 
              asChild 
              className="hidden md:flex gap-2 bg-white text-[#5299ff] hover:bg-gray-50 border border-white/20"
            >
              <Link href="/child-dashboard">
                <BookOpen className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </Button>
          </motion.div>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button 
                variant="ghost" 
                className="relative h-10 w-10 rounded-full hover:bg-[#3d87ff]"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/default.png" alt="User" />
                  <AvatarFallback className="bg-white text-[#5299ff]">
                    {getAvatarFallback()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent 
            className="w-56 p-2 rounded-xl shadow-lg border border-gray-200 bg-white" 
            align="end"
          >
            <DropdownMenuLabel className="p-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium text-gray-900">
                  {getDisplayName()}
                </p>
                <p className="text-xs text-gray-500">
                  {role === 'child' ? 'Student Account' : 'Parent Account'}
                </p>
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator className="bg-gray-100" />
            
            <DropdownMenuItem asChild className="p-2 rounded-md hover:bg-gray-100">
              <Link href="/profile" className="flex items-center text-gray-700">
                <User className="mr-2 h-4 w-4 text-[#5299ff]" />
                <span>Profile Settings</span>
              </Link>
            </DropdownMenuItem>
            
            {role === 'child' && (
              <DropdownMenuItem asChild className="p-2 rounded-md hover:bg-gray-100">
                <Link href="/child-dashboard" className="flex items-center text-gray-700">
                  <BarChart2 className="mr-2 h-4 w-4 text-[#5299ff]" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
            )}
            
            <DropdownMenuItem asChild className="p-2 rounded-md hover:bg-gray-100">
              <Link href="/" className="flex items-center text-gray-700">
                <Home className="mr-2 h-4 w-4 text-[#5299ff]" />
                <span>Home</span>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-gray-100" />
            
            <DropdownMenuItem 
              onClick={logout}
              className="p-2 rounded-md hover:bg-red-50 text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <motion.div whileHover={{ scale: 1.03 }}>
        <Button 
          asChild 
          variant="outline"
          className="border-white text-white hover:bg-white/20 hover:text-white bg-transparent"
        >
          <Link href="/auth/login" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="text-white">Login</span>
          </Link>
        </Button>
      </motion.div>
      
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Button 
          asChild 
          className="bg-white text-[#5299ff] hover:bg-gray-100 shadow-md"
        >
          <Link href="/auth/register" className="flex items-center gap-2">
            <span>Sign Up</span>
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}