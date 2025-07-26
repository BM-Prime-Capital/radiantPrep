'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { ChevronLeft, User, Pencil } from 'lucide-react';
import { ChildInformation, ParentUser } from '@/lib/types';
import { Badge } from '@/components/ui/badge';

function isChild(user: ChildInformation | ParentUser | null): user is ChildInformation {
  return (user as ChildInformation)?.childName !== undefined;
}

function isParent(user: ChildInformation | ParentUser | null): user is ParentUser {
  return (user as ParentUser)?.email !== undefined;
}

export default function EditProfilePage() {
  const { user, role } = useAuth();
  const router = useRouter();

  if (!user) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl bg-gradient-to-b from-indigo-50/30 to-white">
      <Button 
        variant="ghost" 
        onClick={() => router.back()}
        className="mb-6 gap-1 pl-0"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Profile
      </Button>

      <Card className="max-w-2xl mx-auto border-0 bg-white shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
              <Pencil className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold text-indigo-800">Edit Profile</CardTitle>
              <CardDescription className="text-indigo-600">
                {role === 'CHILD' ? 'Update student information' : 'Update account details'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isChild(user) ? (
            <>
              <div className="space-y-3">
                <Label htmlFor="name" className="text-indigo-600">Full Name</Label>
                <Input 
                  id="name" 
                  defaultValue={user.childName || ''} 
                  placeholder="Enter full name"
                  className="border-indigo-200 focus:border-indigo-400"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="grade" className="text-indigo-600">Grade Level</Label>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="px-3 py-1 bg-indigo-50 text-indigo-800 border-indigo-200">
                    {user.grade ? String(user.grade).replace('GRADE_', 'Grade ') : 'Not specified'}
                  </Badge>
                  <span className="text-sm text-indigo-600/80">(Contact admin to change)</span>
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="subject" className="text-indigo-600">Current Subject</Label>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="px-3 py-1 bg-indigo-50 text-indigo-800 border-indigo-200">
                    {user.subject || 'Not specified'}
                  </Badge>
                  <span className="text-sm text-indigo-600/80">(Auto-updated)</span>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <Label htmlFor="email" className="text-indigo-600">Email</Label>
              <div className="flex items-center gap-3">
                <Input 
                  id="email" 
                  defaultValue={user.email || ''} 
                  type="email"
                  className="border-indigo-200 focus:border-indigo-400"
                  disabled
                />
                <span className="text-sm text-indigo-600/80">(Contact support to change)</span>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4 pt-6">
            <Button 
              variant="outline" 
              className="border-indigo-200 text-indigo-800 hover:bg-indigo-50"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}