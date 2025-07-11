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
import { LogOut, User, BookOpen, BarChart2, ChevronDown, Home, Trophy, Settings } from "lucide-react";
import { motion } from "framer-motion";

interface NavbarAuthButtonsProps {
  isAuthenticated: boolean;
  isHomePage: boolean;
}

export function NavbarAuthButtons({ isAuthenticated, isHomePage }: NavbarAuthButtonsProps) {
  const { user, role, logout } = useAuth();

  // Styles conditionnels
  const buttonVariant = isHomePage ? 'outline' : 'ghost';
  
  const getDisplayName = () => {
    if (!user) return 'User';
    if (role === 'child' && 'childName' in user) {
      return user.childName;
    }
    if (role === 'parent' && 'email' in user) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const getAvatarFallback = () => {
    const name = getDisplayName();
    return name.charAt(0).toUpperCase();
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-4">
        {role === 'child' && (
          <motion.div whileHover={{ scale: 1.03 }}>
            <Button 
              asChild 
              variant={isHomePage ? 'default' : 'secondary'}
              className={`hidden md:flex gap-2 ${isHomePage ? 
                'bg-gradient-to-r from-blue-600 to-indigo-600 text-white' : 
                'bg-white text-blue-600 hover:bg-blue-50'}`}
            >
              <Link href="/child-dashboard">
                <BookOpen className="h-4 w-4" />
                <span>My Dashboard</span>
                <Trophy className="h-4 w-4 ml-1 text-yellow-500" />
              </Link>
            </Button>
          </motion.div>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button 
                variant="ghost" 
                className={`relative h-10 w-10 rounded-full ${isHomePage ? 
                  'border border-gray-200' : 
                  'hover:bg-white/20'}`}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/avatars/default.png" alt="User" />
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                    {getAvatarFallback()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </motion.div>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent 
            className="w-56 p-2 rounded-xl shadow-lg border border-gray-100" 
            align="end" 
            forceMount
          >
            <DropdownMenuLabel className="p-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none flex items-center">
                  <User className="h-4 w-4 mr-2 text-blue-500" />
                  {getDisplayName()}
                </p>
                <p className="text-xs leading-none text-muted-foreground flex items-center">
                  <span className={`inline-block h-2 w-2 rounded-full mr-2 ${
                    role === 'child' ? 'bg-green-500' : 'bg-purple-500'
                  }`} />
                  {role === 'child' ? 'Student Account' : 'Parent Account'}
                </p>
              </div>
            </DropdownMenuLabel>
            
            <DropdownMenuSeparator className="bg-gray-100" />
            
            <DropdownMenuItem className="p-2 rounded-md hover:bg-blue-50" asChild>
              <Link href="/profile" className="flex items-center">
                <User className="mr-2 h-4 w-4 text-blue-500" />
                <span>Profile Settings</span>
              </Link>
            </DropdownMenuItem>
            
            {role === 'child' && (
              <DropdownMenuItem className="p-2 rounded-md hover:bg-blue-50" asChild>
                <Link href="/child-dashboard" className="flex items-center">
                  <BarChart2 className="mr-2 h-4 w-4 text-green-500" />
                  <span>Learning Dashboard</span>
                </Link>
              </DropdownMenuItem>
            )}
            
            <DropdownMenuItem className="p-2 rounded-md hover:bg-blue-50" asChild>
              <Link href="/" className="flex items-center">
                <Home className="mr-2 h-4 w-4 text-orange-500" />
                <span>Home</span>
              </Link>
            </DropdownMenuItem>
            
            <DropdownMenuSeparator className="bg-gray-100" />
            
            <DropdownMenuItem 
              className="p-2 rounded-md hover:bg-red-50 text-red-600 focus:text-red-600" 
              onClick={logout}
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
          variant={isHomePage ? 'outline' : 'ghost'}
          className={`${isHomePage ? 
            'border-blue-600 text-blue-600 hover:bg-blue-50' : 
            'text-white hover:bg-white/20'}`}
        >
          <Link href="/auth/login" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Student Login</span>
          </Link>
        </Button>
      </motion.div>
      
      <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
        <Button 
          asChild 
          className={`bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md ${
            isHomePage ? '' : 'hover:shadow-lg'
          }`}
        >
          <Link href="/auth/register" className="flex items-center gap-2">
            <span>Enroll Your Child</span>
            <ChevronDown className="h-4 w-4" />
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}