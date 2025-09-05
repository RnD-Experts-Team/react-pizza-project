import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export const LoadingSkeleton: React.FC = React.memo(() => (
  <div className="space-y-2 sm:space-y-3">
    {[...Array(3)].map((_, index) => (
      <div key={index} className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 p-3 sm:p-4">
        <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded mx-auto sm:mx-0" />
        <div className="space-y-2 flex-1 text-center sm:text-left">
          <Skeleton className="h-3 sm:h-4 w-24 sm:w-32 mx-auto sm:mx-0" />
          <Skeleton className="h-3 w-32 sm:w-48 mx-auto sm:mx-0" />
        </div>
        <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Skeleton className="h-5 sm:h-6 w-16 sm:w-20" />
          <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
        </div>
      </div>
    ))}
  </div>
));

LoadingSkeleton.displayName = 'LoadingSkeleton';
