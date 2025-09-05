/**
 * StoreUsersEmptyState Component
 * Displays empty state when no user assignments are found
 */
import React from 'react';
import { Users } from 'lucide-react';

export const StoreUsersEmptyState: React.FC = React.memo(() => {
  return (
    <div className="text-center py-6 sm:py-8 px-4">
      <Users className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mb-3 sm:mb-4" />
      <h3 className="text-base sm:text-lg font-medium text-muted-foreground mb-2">
        No user assignments
      </h3>
      <p className="text-xs sm:text-sm text-muted-foreground mb-4 max-w-sm mx-auto">
        This store doesn't have any user role assignments yet.
      </p>
    </div>
  );
});

StoreUsersEmptyState.displayName = 'StoreUsersEmptyState';
