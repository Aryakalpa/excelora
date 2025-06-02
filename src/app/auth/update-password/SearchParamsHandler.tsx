'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function SearchParamsHandler({ onError }: { onError: (error: string) => void }) {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const errorDescription = searchParams.get('error_description');
    if (errorDescription) {
      onError(errorDescription);
      toast({
        title: 'Password Reset Error',
        description: errorDescription,
        variant: 'destructive',
      });
    }
  }, [searchParams, toast, onError]);

  return null;
} 