
import * as React from "react"; 
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ChevronRight, Zap, Brain, Search, BarChart3, Keyboard, Table as TableIcon, FileText, Lightbulb, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Tip {
  id: string;
  title: string;
  description: string;
  categorySlug: string; 
  categoryName: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  icon?: React.ReactNode; 
  link?: string; 
}

const excelTips: Tip[] = [
  { id: 'tip-f1', title: 'XLOOKUP: Modern Data Lookup', description: 'XLOOKUP simplifies finding data. It\'s flexible, easy, and replaces VLOOKUP/HLOOKUP.', categorySlug: 'formulas', categoryName: 'Formulas', difficulty: 'Intermediate', icon: <Brain className="h-6 w-6 text-primary group-hover:text-accent transition-colors" /> },
  { id: 'tip-f2', title: 'Conditional Summing: SUMIF/SUMIFS', description: 'SUMIF for single criterion sums, SUMIFS for multiple. Great for targeted financial summaries.', categorySlug: 'formulas', categoryName: 'Formulas', difficulty: 'Beginner', icon: <Brain className="h-6 w-6 text-primary group-hover:text-accent transition-colors" /> },
  { id: 'tip-f3', title: 'Graceful Errors: IFERROR', description: 'Display custom messages or values if a formula errs (e.g., #DIV/0!), keeping sheets clean.', categorySlug: 'formulas', categoryName: 'Formulas', difficulty: 'Beginner', icon: <Brain className="h-6 w-6 text-primary group-hover:text-accent transition-colors" /> },
  { id: 'tip-f4', title: 'Combine Text: TEXTJOIN & CONCAT', description: 'TEXTJOIN concatenates with delimiter, ignoring empties. CONCAT is simpler for direct joining.', categorySlug: 'formulas', categoryName: 'Formulas', difficulty: 'Intermediate', icon: <Brain className="h-6 w-6 text-primary group-hover:text-accent transition-colors" /> },
  { id: 'tip-f5', title: 'Dynamic Arrays: UNIQUE & SORT', description: 'Leverage UNIQUE for distinct values and SORT to order them automatically. Requires newer Excel versions.', categorySlug: 'formulas', categoryName: 'Formulas', difficulty: 'Intermediate', icon: <Brain className="h-6 w-6 text-primary group-hover:text-accent transition-colors" /> },
  { id: 'tip-f6', title: 'Powerful Lookups: INDEX & MATCH', description: 'INDEX & MATCH offer a robust and flexible alternative to VLOOKUP for complex data retrieval.', categorySlug: 'formulas', categoryName: 'Formulas', difficulty: 'Advanced', icon: <Brain className="h-6 w-6 text-primary group-hover:text-accent transition-colors" /> },
  { id: 'tip-f7', title: 'Date & Time: TODAY, NOW, DATEDIF', description: 'Work with current dates/times. Calculate differences between dates for durations or age.', categorySlug: 'formulas', categoryName: 'Formulas', difficulty: 'Beginner', icon: <Brain className="h-6 w-6 text-primary group-hover:text-accent transition-colors" /> },
  { id: 'tip-f8', title: 'Text Manipulation: LEFT, RIGHT, MID, LEN', description: 'Extract parts of text strings, or find their length. Essential for cleaning and parsing data.', categorySlug: 'formulas', categoryName: 'Formulas', difficulty: 'Intermediate', icon: <Brain className="h-6 w-6 text-primary group-hover:text-accent transition-colors" /> },
  { id: 'tip-da1', title: 'Intro to PivotTables', description: 'Summarize, analyze, and explore large datasets with a few clicks using PivotTables.', categorySlug: 'data-analysis', categoryName: 'Data Analysis', difficulty: 'Beginner', icon: <Search className="h-6 w-6 text-primary group-hover:text-accent transition-colors" /> },
  { id: 'tip-da2', title: 'Interactive Filters: Slicers', description: 'Slicers provide buttons to filter data in Tables, PivotTables, and Charts dynamically.', categorySlug: 'data-analysis', categoryName: 'Data Analysis', difficulty: 'Intermediate', icon: <Search className="h-6 w-6 text-primary group-hover:text-accent transition-colors" /> },
  { id: 'tip-p1', title: 'Automated Entry: Flash Fill', description: 'Excel\'s Flash Fill automatically completes data when it senses a pattern, saving manual effort.', categorySlug: 'productivity', categoryName: 'Productivity', difficulty: 'Beginner', icon: <Sparkles className="h-6 w-6 text-primary group-hover:text-accent transition-colors" /> },
  { id: 'tip-p2', title: 'Quick Styling: Format Painter', description: 'Double-click Format Painter to copy formatting (font, color, borders) to multiple places.', categorySlug: 'productivity', categoryName: 'Productivity', difficulty: 'Beginner', icon: <Sparkles className="h-6 w-6 text-primary group-hover:text-accent transition-colors" /> },
  { id: 'tip-v1', title: 'Choosing Chart Types', description: 'Understand when to use bar, line, pie, or scatter charts to best convey your data story.', categorySlug: 'visualization', categoryName: 'Visualization', difficulty: 'Beginner', icon: <BarChart3 className="h-6 w-6 text-primary group-hover:text-accent transition-colors" /> },
  { id: 'tip-v2', title: 'In-Cell Charts: Sparklines', description: 'Sparklines are tiny charts within a cell, providing quick visual data trends.', categorySlug: 'visualization', categoryName: 'Visualization', difficulty: 'Intermediate', icon: <BarChart3 className="h-6 w-6 text-primary group-hover:text-accent transition-colors" /> },
  { id: 'tip-sc1', title: 'Toggle Filters: Ctrl+Shift+L', description: 'Quickly add or remove filters from a data range. A massive time-saver.', categorySlug: 'shortcuts', categoryName: 'Shortcuts', difficulty: 'Beginner', icon: <Keyboard className="h-6 w-6 text-primary group-hover:text-accent transition-colors" /> },
  { id: 'tip-sc2', title: 'Repeat Action/Cycle Refs: F4', description: 'F4 repeats your last action or cycles cell reference types ($A$1, A$1) in formulas.', categorySlug: 'shortcuts', categoryName: 'Shortcuts', difficulty: 'Intermediate', icon: <Keyboard className="h-6 w-6 text-primary group-hover:text-accent transition-colors" /> },
  { id: 'tip-df1', title: 'Conditional Formatting Basics', description: 'Highlight cells based on values using rules like "greater than" or color scales.', categorySlug: 'data-formatting', categoryName: 'Formatting', difficulty: 'Beginner', icon: <TableIcon className="h-6 w-6 text-primary group-hover:text-accent transition-colors" /> },
  { id: 'tip-df2', title: 'Excel Tables: Ctrl+T', description: 'Format data as an Excel Table (Ctrl+T) for structured references, easy formatting, and auto-expansion.', categorySlug: 'data-formatting', categoryName: 'Formatting', difficulty: 'Beginner', icon: <TableIcon className="h-6 w-6 text-primary group-hover:text-accent transition-colors" /> },
];


export default function TipsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <Button variant="ghost" asChild className="mb-8 text-primary hover:text-primary/80 hover:bg-primary/10">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Link>
          </Button>

          <section className="relative h-72 sm:h-80 w-full rounded-xl overflow-hidden shadow-2xl mb-12 border border-border group">
            <Image
              src="https://sdmntprwestus3.oaiusercontent.com/files/00000000-8448-61fd-a66f-96c7d6f3a0a5/raw?se=2025-06-02T15%3A22%3A21Z&sp=r&sv=2024-08-04&sr=b&scid=25037e50-4e22-5f85-b5f2-257401a9a42f&skoid=732f244e-db13-47c3-bcc7-7ee02a9397bc&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-01T20%3A47%3A58Z&ske=2025-06-02T20%3A47%3A58Z&sks=b&skv=2024-08-04&sig=t7X00%2BO/U3tli2eafpHozOX9VccuJca370qSJqOXhpc%3D"
              alt="Excel Tips and Tricks Hero Image"
              layout="fill"
              objectFit="cover"
              className="opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 ease-in-out"
              priority
              data-ai-hint="abstract technology"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent flex flex-col justify-end p-8 sm:p-12">
              {/* Text overlay removed as per user request */}
            </div>
          </section>
          
          <section className="mb-12">
            <p className="text-lg text-secondary mb-10 leading-relaxed text-center max-w-3xl mx-auto">
              Dive into our curated collection of Excel wisdom. Whether you're a beginner or aiming to become a power user, these insights will help you work smarter and faster.
            </p>
          </section>

          <section>
            <div className="flex items-center mb-10">
              <Lightbulb className="mr-4 h-10 w-10 text-accent flex-shrink-0" />
              <div>
                <h2 className="text-3xl font-semibold font-headline text-primary">
                  Master Excel: Essential Tips &amp; Techniques
                </h2>
                <p className="text-secondary text-md">Browse through key insights to enhance your spreadsheet skills.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {excelTips.map(tip => (
                <Card 
                  key={tip.id} 
                  className="card-interactive card-with-excel-grid bg-card shadow-lg flex flex-col border-border hover:border-primary/40 group"
                >
                  <CardHeader className="pb-4 pt-5">
                    <div className="flex items-start space-x-3">
                         {React.cloneElement(tip.icon || <FileText className="h-7 w-7 text-primary group-hover:text-accent" />, { className: "h-7 w-7 text-primary group-hover:text-accent flex-shrink-0 mt-1 transition-colors" })}
                         <div className="flex-grow">
                            <CardTitle className="text-xl font-semibold text-primary group-hover:text-accent transition-colors">{tip.title}</CardTitle>
                            <div className="mt-2.5 flex flex-wrap gap-2">
                                <Badge
                                    variant="outline"
                                    className="border-primary/50 text-primary/90 bg-primary/10 text-xs group-hover:border-accent/50 group-hover:text-accent/90 group-hover:bg-accent/10 transition-colors shadow-sm"
                                >
                                    {tip.categoryName}
                                </Badge>
                                <Badge 
                                    variant={
                                        tip.difficulty === 'Beginner' ? 'default' : 
                                        tip.difficulty === 'Intermediate' ? 'secondary' : 'destructive'
                                    }
                                    className={
                                        `text-xs py-1 px-2.5 rounded-full shadow-sm transition-colors
                                        ${tip.difficulty === 'Beginner' ? 
                                            'bg-green-100 text-green-800 border-green-300 dark:bg-green-700/30 dark:text-green-200 dark:border-green-600 group-hover:bg-green-200 dark:group-hover:bg-green-700/50' :
                                        tip.difficulty === 'Intermediate' ? 
                                            'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-700/30 dark:text-blue-200 dark:border-blue-600 group-hover:bg-blue-200 dark:group-hover:bg-blue-700/50' :
                                            'bg-red-100 text-red-800 border-red-300 dark:bg-red-700/30 dark:text-red-200 dark:border-red-600 group-hover:bg-red-200 dark:group-hover:bg-red-700/50'
                                        }`
                                    }
                                >
                                    {tip.difficulty}
                                </Badge>
                            </div>
                         </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow pt-2 pb-5">
                    <p className="text-sm text-secondary group-hover:text-foreground/90 transition-colors leading-relaxed">{tip.description}</p>
                  </CardContent>
                  {tip.link && (
                    <CardFooter className="pt-4 pb-5 border-t border-border/30 mt-auto">
                      <Button variant="link" asChild className="text-accent p-0 h-auto group-hover:underline focus:ring-accent/50">
                        <Link href={tip.link}>Learn more <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" /></Link>
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
      <footer className="py-8 text-center text-sm text-muted-foreground border-t bg-background/90 backdrop-blur-sm mt-12">
        © {new Date().getFullYear()} Excelora. Empowering Your Spreadsheet Journey.
      </footer>
    </div>
  );
}
