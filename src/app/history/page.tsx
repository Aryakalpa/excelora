
import { createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import CopyButton from '@/components/core/CopyButton';
import { FileText, Brain, Lightbulb, HistoryIcon, AlertCircle, Inbox, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { fetchUserHistory } from '@/app/excelora/actions'; 
import ClearHistoryButton from '@/components/core/ClearHistoryButton'; 

interface QueryRecord {
  id: string;
  problem: string;
  solution_guide: string | null;
  formula: string | null;
  explanation: string | null;
  created_at: string;
}

export default async function HistoryPage() {
  const supabase = createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login?message=Please log in to view your history.');
  }

  const result = await fetchUserHistory();
  
  const typedQueries: QueryRecord[] | null = result.history || null;
  const displayError: string | null = result.error || null;

  const hasHistory = typedQueries && typedQueries.length > 0;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Card className="card-interactive card-with-excel-grid border-border">
            <CardHeader className="pb-4">
              <CardTitle className="font-headline text-3xl flex items-center text-primary">
                <HistoryIcon className="mr-3 h-8 w-8" /> Your Saved Solutions
              </CardTitle>
              <CardDescription className="text-md text-secondary">
                Review your past Excel problems and the AI-generated solutions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {displayError && (
                 <Alert variant="destructive" className="mb-6 shadow">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error Loading History</AlertTitle>
                  <AlertDescription>
                    {displayError}
                    <br />
                    Please try refreshing the page. If the problem persists, contact support.
                  </AlertDescription>
                </Alert>
              )}
              {!displayError && !hasHistory && (
                <Alert className="mb-6 bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300 shadow">
                  <Inbox className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <AlertTitle className="font-semibold text-amber-800 dark:text-amber-200">No History Yet</AlertTitle>
                  <AlertDescription className="text-amber-700 dark:text-amber-300">
                    You haven't saved any solutions. Go to the <Link href="/" className="font-medium hover:underline text-primary">home page</Link> to solve an Excel problem and build your personal knowledge base!
                  </AlertDescription>
                </Alert>
              )}
              {hasHistory && (
                <Accordion type="multiple" className="w-full space-y-4">
                  {typedQueries.map((query) => (
                    <AccordionItem value={query.id} key={query.id} className="group accordion-item-tech">
                      <AccordionTrigger className="accordion-trigger-tech">
                        <div className="flex flex-col w-full">
                           <p className="font-medium text-lg flex items-center">
                             <Wand2 className="h-5 w-5 mr-2 text-accent flex-shrink-0" />
                             {query.problem}
                           </p>
                           <p className="text-xs text-muted-foreground mt-1 pl-7">
                             Saved {formatDistanceToNow(new Date(query.created_at), { addSuffix: true })}
                           </p>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="accordion-content-tech">
                        {query.formula && (
                          <div className="p-3 bg-muted/50 dark:bg-muted/20 rounded-md border border-input">
                            <h4 className="font-semibold text-md mb-2 flex items-center text-primary"><Brain className="mr-2 h-5 w-5" />Formula:</h4>
                            <pre className="p-3 bg-background dark:bg-muted/30 rounded-md overflow-x-auto font-code text-sm border border-input text-foreground">
                              <code>{query.formula}</code>
                            </pre>
                            <CopyButton textToCopy={query.formula} buttonText="Copy Formula" className="mt-2 bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm" />
                          </div>
                        )}
                        {query.solution_guide && (
                          <div className="p-3 bg-muted/50 dark:bg-muted/20 rounded-md border border-input">
                            <h4 className="font-semibold text-md mb-2 flex items-center text-primary"><FileText className="mr-2 h-5 w-5" />Guide:</h4>
                            <div className="prose-excelora text-foreground" dangerouslySetInnerHTML={{ __html: query.solution_guide }} />
                          </div>
                        )}
                        {query.explanation && (
                           <div className="p-3 bg-muted/50 dark:bg-muted/20 rounded-md border border-input">
                            <h4 className="font-semibold text-md mb-2 flex items-center text-primary"><Lightbulb className="mr-2 h-5 w-5" />Explanation:</h4>
                             <div className="prose-excelora text-foreground" dangerouslySetInnerHTML={{ __html: query.explanation }} />
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
            <CardFooter className="border-t pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <Button asChild variant="default" className="shadow hover:shadow-md transition-shadow hover:scale-[1.03] hover:brightness-110">
                    <Link href="/">Solve a New Problem</Link>
                </Button>
                {hasHistory && !displayError && (
                  <ClearHistoryButton />
                )}
            </CardFooter>
          </Card>
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground border-t bg-background/50">
        © {new Date().getFullYear()} Excelora. AI-Powered Excel Assistance.
      </footer>
    </div>
  );
}
