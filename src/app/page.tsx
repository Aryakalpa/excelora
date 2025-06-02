
'use client';

import { useState, useEffect } from 'react';
import ProblemForm from '@/components/core/ProblemForm';
import SolutionDisplay from '@/components/core/SolutionDisplay';
import ExcelLoadingIndicator from '@/components/core/ExcelLoadingIndicator';
import type { GenerateExcelSolutionOutput } from '@/ai/flows/generate-excel-solution';
import { Info, Lightbulb, ListChecks, Zap, Brain, TrendingUp, Sparkles, MessageSquareQuote, MousePointerClick } from 'lucide-react'; // Changed MessageSquareQuestion to MessageSquareQuote
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const ALL_EXAMPLE_PROBLEMS = [
  "How do I sum values in column A if column B says 'Sales'?",
  "Create a dropdown list in a cell based on a range of another sheet.",
  "Highlight all rows where the date in column C is older than 30 days.",
  "Calculate the average of the top 5 scores in a list.",
  "How to combine First Name and Last Name from two columns into one?",
  "Find the VLOOKUP equivalent that can look to the left.",
  "Generate a unique list of items from a column with duplicates.",
  "How to conditionally format cells based on another cell's value?",
  "Calculate compound interest for an investment.",
  "Split text from one cell into multiple columns.",
  "How to create a pivot table to summarize sales by region?",
  "Freeze the top row and first column when scrolling.",
  "Use IF function to categorize numbers as Low, Medium, or High.",
  "Remove blank rows from a dataset quickly.",
  "How do I use the XLOOKUP function to find a specific product price?",
];


const quickTips = [
  { id: 1, text: "Use Ctrl+Shift+L to quickly toggle filters on a data range.", icon: <Sparkles className="h-5 w-5 text-accent" /> },
  { id: 2, text: "Double-click the Format Painter to apply formatting to multiple places.", icon: <Sparkles className="h-5 w-5 text-accent" /> },
  { id: 3, text: "Press F4 to repeat your last action or cycle through cell reference types (A1, $A$1, A$1, $A1).", icon: <Sparkles className="h-5 w-5 text-accent" /> },
  { id: 4, text: "Use Alt + = to quickly sum a column or row. Excel intelligently guesses the range.", icon: <Sparkles className="h-5 w-5 text-accent" /> },
];

export default function HomePage() {
  const [solution, setSolution] = useState<GenerateExcelSolutionOutput | null>(null);
  const [currentProblem, setCurrentProblem] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [displayedExamples, setDisplayedExamples] = useState<string[]>([]);
  const [initialProblemForForm, setInitialProblemForForm] = useState('');

  useEffect(() => {
    const shuffled = [...ALL_EXAMPLE_PROBLEMS].sort(() => 0.5 - Math.random());
    setDisplayedExamples(shuffled.slice(0, 3)); // Pick 3 examples
  }, []); // Runs once on mount to set initial examples

  const handleFormSubmit = (problemDescription: string) => {
    setCurrentProblem(problemDescription);
    setInitialProblemForForm(problemDescription); // Keep form populated if user submits
    setSolution(null);
    setIsLoading(true);
    setShowError(false);
  };

  const handleSolutionReady = (newSolution: GenerateExcelSolutionOutput | null) => {
    if (newSolution) {
      setSolution(newSolution);
      setShowError(false);
    } else {
      setSolution(null);
      setShowError(true);
    }
    setIsLoading(false);
  };

  const handleExampleClick = (problemText: string) => {
    setInitialProblemForForm(problemText);
    setCurrentProblem(''); // Clear any previous full submission state
    setSolution(null);
    setShowError(false);
    setIsLoading(false);

    const problemFormCard = document.getElementById('problem-form-card');
    if (problemFormCard) {
      problemFormCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setTimeout(() => {
        const textarea = document.querySelector('#problem-form-card textarea') as HTMLTextAreaElement | null;
        textarea?.focus();
      }, 100);
    }
  };

  const showInitialContent = !isLoading && !solution && !currentProblem && !showError;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {showInitialContent && (
            <>
              <Card className="mb-8 card-interactive card-with-excel-grid border-border">
                <CardHeader className="pb-4 bg-gradient-to-r from-primary/80 via-primary/70 to-accent/70 rounded-t-lg">
                  <div className="flex items-center mb-2">
                    <Brain className="mr-3 h-10 w-10 text-primary-foreground" />
                    <CardTitle className="font-headline text-4xl text-primary-foreground">
                      Excel Smarter, Not Harder
                    </CardTitle>
                  </div>
                  <CardDescription className="text-lg text-primary-foreground/90 pt-2">
                    Welcome to Excelora! Describe your Excel challenge, and our AI will craft step-by-step solutions, formulas, and clear explanations to help you conquer any spreadsheet task.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-secondary mb-4">
                    Ready to transform your Excel workflow? Type your problem below or try an example.
                  </p>
                  <Link href="/auth/signup" legacyBehavior>
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 shadow-md hover:shadow-lg hover:border-accent transition-all duration-300">
                      Sign Up to Save Solutions & Track Progress <TrendingUp className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {displayedExamples.length > 0 && (
                <Card className="mb-10 card-interactive card-with-excel-grid border-border">
                  <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center text-primary">
                      <MessageSquareQuote className="mr-3 h-7 w-7 text-accent" /> Need Inspiration? 
                    </CardTitle>
                    <CardDescription className="text-md text-secondary">
                      Click an example below to populate the form and see how Excelora can help.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {displayedExamples.map((example, index) => (
                        <li key={index}>
                          <Button
                            variant="ghost"
                            className="w-full justify-start text-left h-auto py-2.5 px-3 hover:bg-accent/10 group"
                            onClick={() => handleExampleClick(example)}
                          >
                            <MousePointerClick className="mr-3 h-5 w-5 text-accent/80 group-hover:text-accent flex-shrink-0" />
                            <span className="text-foreground/90 group-hover:text-primary">{example}</span>
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          <div id="problem-form-card"> {/* ID for scrolling */}
            <ProblemForm
              onFormSubmit={handleFormSubmit}
              onSolutionReady={handleSolutionReady}
              initialProblem={initialProblemForForm}
            />
          </div>

          {isLoading && <div className="mt-8"><ExcelLoadingIndicator size="lg" /></div>}

          {!isLoading && solution && currentProblem && (
            <SolutionDisplay solution={solution} problemDescription={currentProblem} />
          )}

          {!isLoading && !solution && currentProblem && showError && (
             <Card className="mt-8 shadow-lg border-destructive/50 bg-destructive/10 text-destructive-foreground">
               <CardHeader className="bg-destructive/80 rounded-t-lg">
                 <CardTitle className="flex items-center text-destructive-foreground"><Info className="mr-2 h-6 w-6" /> Solution Generation Failed</CardTitle>
               </CardHeader>
               <CardContent className="pt-6 text-destructive-foreground/90">
                 <p>We encountered an issue generating a solution for your problem: "{currentProblem}". This could be due to a temporary issue with the AI service or the complexity of the request.</p>
                 <p className="mt-2">Please try rephrasing your problem or try again in a few moments.</p>
                 <Button variant="outline" onClick={() => { setCurrentProblem(''); setInitialProblemForForm(''); setShowError(false); }} className="mt-4 border-destructive-foreground/50 text-destructive-foreground hover:bg-destructive/20">
                   Try a New Problem
                 </Button>
               </CardContent>
             </Card>
          )}

          {!isLoading && !currentProblem && !showError && (
            <Card className="mt-12 card-interactive card-with-excel-grid border-border">
              <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center text-accent">
                  <ListChecks className="mr-3 h-7 w-7" /> Quick Excel Tips
                </CardTitle>
                <CardDescription className="text-md text-secondary">Boost your productivity with these handy shortcuts and tricks.</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {quickTips.map((tip) => (
                    <li key={tip.id} className="flex items-start p-3 bg-muted/50 rounded-lg shadow-sm hover:shadow-md transition-shadow hover:bg-muted/70 border border-transparent hover:border-accent/50">
                      <span className="mr-3 mt-1 flex-shrink-0 text-accent">{tip.icon}</span>
                      <span className="text-foreground/90">{tip.text}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 text-center">
                  <Button variant="default" asChild className="bg-accent text-accent-foreground hover:bg-accent/90 shadow hover:shadow-md transition-shadow hover:scale-[1.03]">
                    <Link href="/tips">Discover More Tips & Tricks</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t bg-background/80 backdrop-blur-sm">
        © {new Date().getFullYear()} Excelora. AI-powered Excel assistance.
      </footer>
    </div>
  );
}
