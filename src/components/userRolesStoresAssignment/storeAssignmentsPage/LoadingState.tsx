import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-8 sm:py-12 space-y-3">
      <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin" style={{ color: 'var(--primary)' }} />
      <span className="text-sm sm:text-base" style={{ color: 'var(--muted-foreground)' }}>Loading assignments...</span>
    </div>
  );
};

export default LoadingState;