'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Check, Copy } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CopyButtonProps {
  textToCopy: string;
  buttonText?: string;
  className?: string;
}

export default function CopyButton({ textToCopy, buttonText = "Copy Formula", className }: CopyButtonProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast({
        title: 'Copied!',
        description: 'Formula copied to clipboard.',
      });
    } catch (err) {
      console.error('Failed to copy: ', err);
      toast({
        title: 'Error',
        description: 'Failed to copy formula.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <Button onClick={handleCopy} variant="outline" size="sm" className={className} aria-label={copied ? "Copied" : buttonText}>
      {copied ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4" />}
      <span className="ml-2">{copied ? 'Copied!' : buttonText}</span>
    </Button>
  );
}
