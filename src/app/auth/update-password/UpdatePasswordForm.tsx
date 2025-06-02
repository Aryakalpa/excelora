'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import { Loader2, KeyRound, ArrowLeft, AlertTriangle, CheckCircle, LogIn } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function UpdatePasswordForm() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      toast({ title: 'Error', description: 'Passwords do not match.', variant: 'destructive' });
      return;
    }
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long.');
      toast({ title: 'Error', description: 'Password must be at least 6 characters long.', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    setFormError(null);
    setFormSuccess(null);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setFormError(error.message);
      toast({
        title: 'Password Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setFormSuccess('Your password has been updated successfully! You can now log in with your new password.');
      toast({
        title: 'Password Updated!',
        description: 'You can now log in with your new password.',
        className: 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/50 dark:border-green-700 dark:text-green-300',
      });
      setTimeout(() => router.push('/auth/login'), 3000);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-secondary/5 to-background">
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <Card className="w-full shadow-xl border-primary/20 bg-card/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-headline text-3xl text-primary">Set Your New Password</CardTitle>
              <CardDescription className="text-md">
                Please enter and confirm your new password below.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                {formError && (
                  <Alert variant="destructive" className="shadow-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Update Failed</AlertTitle>
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                )}
                {formSuccess && (
                  <Alert variant="default" className="shadow-sm bg-green-50 border-green-200 text-green-700 dark:bg-green-900/50 dark:border-green-700 dark:text-green-300">
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Success!</AlertTitle>
                    <AlertDescription>{formSuccess}</AlertDescription>
                  </Alert>
                )}
                {!formSuccess && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="password">New Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="•••••••• (min. 6 characters)"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="text-base py-3 px-4 shadow-inner"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                        className="text-base py-3 px-4 shadow-inner"
                      />
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-4 pt-6">
                {formSuccess ? (
                  <Button asChild className="w-full text-lg py-6 shadow hover:shadow-md transition-shadow">
                    <Link href="/auth/login">
                      <LogIn className="mr-2 h-5 w-5" /> Go to Login
                    </Link>
                  </Button>
                ) : (
                  <Button type="submit" className="w-full text-lg py-6 shadow hover:shadow-md transition-shadow" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <KeyRound className="mr-2 h-5 w-5" />}
                    Update Password
                  </Button>
                )}
                <Link href="/auth/login" className="inline-block mt-4">
                  <Button variant="ghost" className="text-primary hover:text-primary/80">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
                  </Button>
                </Link>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t bg-background/80 backdrop-blur-sm">
        © {new Date().getFullYear()} Excelora.
      </footer>
    </div>
  );
} 