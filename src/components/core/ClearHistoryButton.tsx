
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { clearUserHistory } from '@/app/excelora/actions';
import { Loader2, Trash2, AlertTriangle } from 'lucide-react';

// Removed onHistoryCleared from props as router.refresh() will be used
export default function ClearHistoryButton() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter(); // Initialize useRouter

  const handleClearHistory = async () => {
    setIsLoading(true);
    const result = await clearUserHistory();
    setIsLoading(false);

    if (result.success) {
      toast({
        title: 'History Cleared',
        description: 'Your saved solutions have been successfully deleted.',
        className: 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/50 dark:border-green-700 dark:text-green-300',
      });
      router.refresh(); // Refresh the current route to re-fetch data
    } else {
      toast({
        title: 'Error Clearing History',
        description: result.error || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="shadow hover:shadow-md transition-shadow">
          <Trash2 className="mr-2 h-4 w-4" />
          Clear All History
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-card border-border">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center text-destructive">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-secondary">
            This action cannot be undone. This will permanently delete all your saved Excel solutions from your history.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleClearHistory}
            disabled={isLoading}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" />
            )}
            Yes, Delete My History
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
