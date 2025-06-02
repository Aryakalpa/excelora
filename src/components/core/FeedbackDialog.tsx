
'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { handleFeedbackSubmission } from '@/app/excelora/actions';
import { MessageSquarePlus, Send, Loader2 } from 'lucide-react';

export default function FeedbackDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!feedbackText.trim()) {
      toast({
        title: 'Empty Feedback',
        description: 'Please write your feedback before submitting.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    const result = await handleFeedbackSubmission(feedbackText);
    setIsLoading(false);

    if (result.success) {
      toast({
        title: 'Feedback Sent!',
        description: 'Thank you for your valuable feedback.',
        className: 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/50 dark:border-green-700 dark:text-green-300',
      });
      setFeedbackText('');
      setIsOpen(false);
    } else {
      toast({
        title: 'Submission Error',
        description: result.error || 'Could not submit your feedback. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="fixed bottom-6 right-6 rounded-full h-14 w-14 p-0 shadow-lg hover:shadow-xl transition-shadow border-primary/50 bg-card hover:bg-primary/10 group z-50"
          aria-label="Give Feedback"
        >
          <MessageSquarePlus className="h-6 w-6 text-primary group-hover:text-accent transition-colors" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] bg-card border-border shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-headline text-primary flex items-center">
            <MessageSquarePlus className="mr-2 h-6 w-6" />
            Share Your Feedback
          </DialogTitle>
          <DialogDescription className="text-md text-secondary">
            We'd love to hear your thoughts, suggestions, or any issues you've encountered.
            Your feedback helps us improve Excelora!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="feedback-textarea" className="text-base sr-only">Your Feedback</Label>
            <Textarea
              id="feedback-textarea"
              placeholder="Type your feedback here..."
              rows={6}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              disabled={isLoading}
              className="text-base shadow-inner focus:border-primary focus:ring-primary/50"
            />
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow hover:shadow-md transition-shadow">
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Send className="mr-2 h-5 w-5" />
              )}
              Send Feedback
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
