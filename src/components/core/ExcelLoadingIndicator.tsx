
'use client';

import { cn } from "@/lib/utils";

interface ExcelLoadingIndicatorProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const ExcelLoadingIndicator = ({ className, size = 'md' }: ExcelLoadingIndicatorProps) => {
  const cellSizeClasses = 
    size === 'sm' ? 'h-2.5 w-2.5' : 
    size === 'md' ? 'h-3.5 w-3.5' : 
    'h-4 w-4';
  const gapClass = 
    size === 'sm' ? 'gap-0.5' : 
    size === 'md' ? 'gap-1' : 
    'gap-1.5';
  
  const numCells = 8; // 4x2 grid

  return (
    <div className={cn("flex flex-col items-center justify-center p-6 space-y-3", className)}>
      <div className={cn("grid grid-cols-4", gapClass)}>
        {[...Array(numCells)].map((_, i) => (
          <div
            key={i}
            className={cn(
              cellSizeClasses,
              "bg-primary/50 rounded-sm animate-excel-pulse"
            )}
            style={{ animationDelay: `${i * 0.12}s` }} // Stagger animation
          />
        ))}
      </div>
      <p className="text-sm text-muted-foreground font-medium animate-pulse">Crunching data...</p>
    </div>
  );
};

export default ExcelLoadingIndicator;
