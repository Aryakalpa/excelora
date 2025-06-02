
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import AppProviders from '@/components/AppProviders';
import Header from '@/components/core/Header';
import { ThemeProvider } from "@/components/core/ThemeProvider"; // Import ThemeProvider
import FeedbackDialog from '@/components/core/FeedbackDialog'; // Import FeedbackDialog

export const metadata: Metadata = {
  title: 'Excelora - AI Excel Problem Solver',
  description: 'Get AI-powered step-by-step solutions, formulas, and explanations for your Excel problems.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased min-h-screen flex flex-col bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppProviders>
            <Header />
            {children}
            <FeedbackDialog /> {/* Add FeedbackDialog here */}
          </AppProviders>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
