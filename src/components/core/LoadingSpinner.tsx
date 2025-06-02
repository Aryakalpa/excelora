import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ size = 24 }: { size?: number }) {
  return (
    <div className="flex justify-center items-center p-4">
      <Loader2 className={`h-${size/4} w-${size/4} animate-spin text-primary`} style={{ height: `${size}px`, width: `${size}px` }} />
    </div>
  );
}
