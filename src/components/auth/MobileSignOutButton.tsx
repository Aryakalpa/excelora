
'use client';

import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { SheetClose } from '@/components/ui/sheet';

export default function MobileSignOutButton() {
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/'); // Redirect to home page after sign out
    router.refresh(); // Refresh server components
  };

  return (
    <SheetClose asChild>
      <Button
        variant="ghost"
        onClick={handleSignOut}
        className="w-full justify-start p-2 -m-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
      >
        <LogOut className="mr-3 h-5 w-5 text-destructive" />
        Sign Out
      </Button>
    </SheetClose>
  );
}
