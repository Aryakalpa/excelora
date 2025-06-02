
'use client';

import { useState, FormEvent } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Loader2, LogIn, UserPlus, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface AuthFormProps {
  mode: 'login' | 'signup';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const supabase = createSupabaseBrowserClient();
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setAuthError(null);

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        toast({
          title: 'Account Created!',
          description: 'Please check your email to verify your account and complete sign up.',
          className: 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/50 dark:border-green-700 dark:text-green-300',
        });
        router.push('/auth/login?message=Verification email sent. Please check your inbox.');
      } else { // login mode
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        toast({
          title: 'Logged In Successfully!',
          description: 'Welcome back to Excelora.',
          className: 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/50 dark:border-green-700 dark:text-green-300',
        });
        router.push('/');
        router.refresh();
      }
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred during authentication.';
      setAuthError(errorMessage);
      toast({
        title: 'Authentication Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-xl border-primary/20 bg-card/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="font-headline text-3xl text-primary">
          {mode === 'login' ? 'Welcome Back!' : 'Create Your Excelora Account'}
        </CardTitle>
        <CardDescription className="text-md">
          {mode === 'login'
            ? "Sign in to access your saved Excel solutions and history."
            : "Sign up to save your questions, AI-generated solutions, and track your learning journey."}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {authError && (
            <Alert variant="destructive" className="shadow-sm">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Authentication Failed</AlertTitle>
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-base">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
              className="text-base py-3 px-4 shadow-inner"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-base">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="•••••••• (min. 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              disabled={isLoading}
              className="text-base py-3 px-4 shadow-inner"
            />
          </div>
          {mode === 'login' && (
            <div className="text-sm text-right">
              <Link href="/auth/forgot-password" className="font-medium text-primary hover:underline">
                Forgot Password?
              </Link>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-6">
          <Button type="submit" className="w-full text-lg py-6 shadow hover:shadow-md transition-shadow" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              mode === 'login' ? <LogIn className="mr-2 h-5 w-5" /> : <UserPlus className="mr-2 h-5 w-5" />
            )}
            {mode === 'login' ? 'Log In to Your Account' : 'Create Account'}
          </Button>
          <p className="text-sm text-muted-foreground">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
            <Link
              href={mode === 'login' ? '/auth/signup' : '/auth/login'}
              className="font-medium text-primary hover:underline ml-1"
            >
              {mode === 'login' ? 'Sign up here' : 'Log in here'}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
