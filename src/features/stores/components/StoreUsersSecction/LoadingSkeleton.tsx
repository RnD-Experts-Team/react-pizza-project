/**
 * StoreUsersLoadingSkeleton Component
 * Displays loading skeleton while fetching user assignments
 */
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Constants
const SKELETON_ROWS = 3;

export const StoreUsersLoadingSkeleton: React.FC = React.memo(() => {
  return (
    <div className="space-y-2 sm:space-y-3">
      {[...Array(SKELETON_ROWS)].map((_, index) => (
        <div key={index} className="flex items-center space-x-2 sm:space-x-4 p-2 sm:p-4">
          <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 rounded-full" />
          <div className="space-y-1 sm:space-y-2 flex-1">
            <Skeleton className="h-3 sm:h-4 w-24 sm:w-32" />
            <Skeleton className="h-2 sm:h-3 w-32 sm:w-48" />
          </div>
          <Skeleton className="h-5 sm:h-6 w-16 sm:w-20" />
          <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
        </div>
      ))}
    </div>
  );
});

StoreUsersLoadingSkeleton.displayName = 'StoreUsersLoadingSkeleton';
