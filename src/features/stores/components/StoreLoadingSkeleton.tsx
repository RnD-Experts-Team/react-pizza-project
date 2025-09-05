/**
 * StoreLoadingSkeleton Component
 * Displays loading skeleton for store details
 */

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const StoreLoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <Skeleton className="h-5 w-28 sm:h-6 sm:w-32" />
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-3 w-20 sm:h-4 sm:w-24" />
              <Skeleton className="h-3 w-24 sm:h-4 sm:w-32" />
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <Skeleton className="h-5 w-28 sm:h-6 sm:w-32" />
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex justify-between">
              <Skeleton className="h-3 w-20 sm:h-4 sm:w-24" />
              <Skeleton className="h-3 w-24 sm:h-4 sm:w-32" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
