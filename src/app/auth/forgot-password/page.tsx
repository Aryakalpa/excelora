
'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { handleForgotPasswordRequest } from '@/app/excelora/actions';
import { Loader2, Mail, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setFormError(null);
    setFormSuccess(null);

    const result = await handleForgotPasswordRequest(email);

    if (result.error) {
      setFormError(result.error);
      toast({
        title: 'Error Sending Reset Link',
        description: result.error,
        variant: 'destructive',
      });
    } else {
      setFormSuccess('If an account exists for this email, a password reset link has been sent.');
      toast({
        title: 'Reset Link Sent!',
        description: 'Please check your email for instructions to reset your password.',
        className: 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/50 dark:border-green-700 dark:text-green-300',
      });
      setEmail(''); // Clear email field on success
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-secondary/5 to-background">
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <Link href="/auth/login" className="inline-block">
              <Button variant="ghost" className="text-primary hover:text-primary/80">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
              </Button>
            </Link>
          </div>
          <Card className="w-full shadow-xl border-primary/20 bg-card/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="font-headline text-3xl text-primary">Reset Your Password</CardTitle>
              <CardDescription className="text-md">
                Enter your email address below. If an account is associated with it, we'll send you a link to reset your password.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                {formError && (
                  <Alert variant="destructive" className="shadow-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Request Failed</AlertTitle>
                    <AlertDescription>{formError}</AlertDescription>
                  </Alert>
                )}
                {formSuccess && (
                  <Alert variant="default" className="shadow-sm bg-green-50 border-green-200 text-green-700 dark:bg-green-900/50 dark:border-green-700 dark:text-green-300">
                    <Mail className="h-4 w-4" />
                    <AlertTitle>Check Your Email</AlertTitle>
                    <AlertDescription>{formSuccess}</AlertDescription>
                  </Alert>
                )}
                {!formSuccess && (
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
                )}
              </CardContent>
              {!formSuccess && (
                <CardFooter className="flex flex-col space-y-4 pt-6">
                  <Button type="submit" className="w-full text-lg py-6 shadow hover:shadow-md transition-shadow" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Mail className="mr-2 h-5 w-5" />}
                    Send Reset Link
                  </Button>
                </CardFooter>
              )}
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
