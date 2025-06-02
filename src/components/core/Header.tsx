
import Link from 'next/link';
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/button';
import SignOutButton from '@/components/auth/SignOutButton';
import MobileSignOutButton from '@/components/auth/MobileSignOutButton'; // Added
import { FileText, LogIn, UserPlus, History, Lightbulb, Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetClose, SheetHeader, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggleButton } from '@/components/core/ThemeToggleButton';

export default async function Header() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  const navLinks = [
    { href: "/tips", label: "Tips & Tricks", icon: Lightbulb, authRequired: false },
    { href: "/history", label: "History", icon: History, authRequired: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <FileText className="h-7 w-7 text-primary group-hover:text-accent transition-colors" />
          <span className="font-bold text-xl font-headline text-primary group-hover:text-accent transition-colors">Excelora</span>
        </Link>
        
        <div className="flex items-center space-x-2">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.filter(link => !link.authRequired || user).map(link => (
              <Button variant="ghost" asChild key={link.href}>
                <Link href={link.href} className="flex items-center text-foreground/80 hover:text-primary">
                  <link.icon className="h-4 w-4 mr-2" /> {link.label}
                </Link>
              </Button>
            ))}
            {user ? (
              <SignOutButton /> // Desktop user icon dropdown
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/login" className="flex items-center text-foreground/80 hover:text-primary">
                    <LogIn className="h-4 w-4 mr-2" /> Login
                  </Link>
                </Button>
                <Button asChild variant="default" className="bg-primary hover:bg-primary/90 shadow hover:shadow-md transition-shadow">
                  <Link href="/auth/signup" className="flex items-center">
                    <UserPlus className="h-4 w-4 mr-2" /> Sign Up
                  </Link>
                </Button>
              </>
            )}
          </nav>
          
          <ThemeToggleButton />
          
          {/* Mobile Navigation Trigger */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader className="mb-6">
                   <Link href="/" className="flex items-center space-x-2 mb-4">
                      <FileText className="h-6 w-6 text-primary" />
                      <span className="font-bold text-lg font-headline text-primary">Excelora</span>
                  </Link>
                </SheetHeader>
                <nav className="flex flex-col space-y-3">
                  {navLinks.filter(link => !link.authRequired || (link.authRequired && user) ).map(link => {
                    // For History link, only show if user is logged in, even if it's generally authRequired
                    if (link.href === "/history" && !user) return null; 
                    return (
                      <SheetClose asChild key={link.href}>
                        <Link href={link.href} className="flex items-center p-2 -m-2 rounded-md hover:bg-accent/10 text-foreground/90">
                          <link.icon className="h-5 w-5 mr-3 text-primary" /> {link.label}
                        </Link>
                      </SheetClose>
                    );
                  })}
                  <hr className="my-3"/>
                  {user ? (
                    <>
                      {/* Direct "My History" link for mobile, if not already covered by navLinks */}
                      {!navLinks.find(link => link.href === "/history" && link.authRequired) && (
                        <SheetClose asChild>
                          <Link href="/history" className="flex items-center p-2 -m-2 rounded-md hover:bg-accent/10 text-foreground/90">
                            <History className="h-5 w-5 mr-3 text-primary" /> My History
                          </Link>
                        </SheetClose>
                      )}
                       {/* Separator if both history and sign out are shown */}
                      {navLinks.find(link => link.href === "/history" && link.authRequired) && <div className="pt-1"></div>}
                      <MobileSignOutButton />
                    </>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <Link href="/auth/login" className="flex items-center p-2 -m-2 rounded-md hover:bg-accent/10 text-foreground/90">
                          <LogIn className="h-5 w-5 mr-3 text-primary" /> Login
                        </Link>
                      </SheetClose>
                      <SheetClose asChild>
                        <Link href="/auth/signup" className="flex items-center p-2 -m-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90">
                          <UserPlus className="h-5 w-5 mr-3" /> Sign Up
                        </Link>
                      </SheetClose>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
