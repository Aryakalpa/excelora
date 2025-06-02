
import AuthForm from '@/components/auth/AuthForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-background via-secondary/5 to-background">
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="mb-6 text-center">
            <Link href="/" className="inline-block">
              <Button variant="ghost" className="text-primary hover:text-primary/80">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
              </Button>
            </Link>
          </div>
          <AuthForm mode="login" />
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t bg-background/80 backdrop-blur-sm">
        © {new Date().getFullYear()} Excelora.
      </footer>
    </div>
  );
}
