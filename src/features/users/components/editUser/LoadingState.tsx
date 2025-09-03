import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ message = "Loading user..." }) => {
  return (
    <div className="container mx-auto py-4 px-4 sm:py-6 sm:px-6 md:py-8 lg:py-10 xl:py-12">
      <div className="flex items-center justify-center py-8 sm:py-10 md:py-12 lg:py-16">
        <Loader2 className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 animate-spin text-primary" />
        <span className="ml-2 text-sm sm:text-base md:text-lg text-foreground">{message}</span>
      </div>
    </div>
  );
};

export default LoadingState;