
'use client';

import type React from 'react';
import { useState, useEffect } from 'react'; // Added useEffect
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { GenerateExcelSolutionOutput } from '@/ai/flows/generate-excel-solution';
import { handleSubmitProblem } from '@/app/excelora/actions';
import { Send, Loader2, Sparkles } from 'lucide-react';

interface ProblemFormProps {
  onFormSubmit: (problemDescription: string) => void;
  onSolutionReady: (solution: GenerateExcelSolutionOutput | null) => void;
  initialProblem?: string;
}

export default function ProblemForm({ onFormSubmit, onSolutionReady, initialProblem = '' }: ProblemFormProps) {
  const [problem, setProblem] = useState(initialProblem);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Sync internal state if initialProblem prop changes
    // This is useful when an example is clicked on the HomePage
    setProblem(initialProblem);
  }, [initialProblem]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!problem.trim()) {
      toast({
        title: 'Empty Problem',
        description: 'Please describe your Excel problem clearly for the best results.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    onFormSubmit(problem);

    try {
      const result = await handleSubmitProblem(problem);
      if (result.error) {
        toast({
          title: 'Solution Generation Error',
          description: result.error,
          variant: 'destructive',
        });
        onSolutionReady(null);
      } else if (result.solution) {
        onSolutionReady(result.solution);
         toast({
          title: 'Solution Generated!',
          description: 'Your AI-powered Excel solution is ready below.',
          className: 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/50 dark:border-green-700 dark:text-green-300',
        });
      }
    } catch (error: any) {
      console.error("Error submitting problem:", error);
      toast({
        title: 'Unexpected Error',
        description: error.message || 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
      onSolutionReady(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full card-interactive card-with-excel-grid border-primary/20">
      <CardHeader className="pb-4">
        <CardTitle className="font-headline text-2xl flex items-center text-primary">
            <Sparkles className="mr-2 h-6 w-6 text-accent" /> Describe Your Excel Challenge
        </CardTitle>
        <CardDescription className="text-md">
          Be specific for the best results. For example: "How do I calculate a 5% bonus for employees in column C if their sales in column D are over $10,000?"
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <Textarea
            placeholder="Enter your Excel problem here..."
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            rows={6}
            className="resize-none text-base shadow-inner focus:border-primary focus:ring-primary/50 bg-background/70 dark:bg-card/80"
            disabled={isLoading}
          />
          <Button type="submit" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground shadow hover:shadow-lg transition-all duration-150 text-md px-6 py-3 hover:scale-[1.03] hover:brightness-110 active:scale-[1.01]" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
              <Send className="mr-2 h-5 w-5" />
            )}
            Get AI Solution
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
