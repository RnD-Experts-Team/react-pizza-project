import React from 'react';
import { Shield } from 'lucide-react';

export const EmptyState: React.FC = React.memo(() => (
  <div className="text-center py-6 sm:py-8 lg:py-12 px-4">
    <Shield className="mx-auto h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-muted-foreground mb-3 sm:mb-4" />
    <h3 className="text-base sm:text-lg lg:text-xl font-medium text-muted-foreground mb-2">
      No role assignments
    </h3>
    <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mb-4 max-w-md mx-auto">
      This store doesn't have any role assignments yet.
    </p>
  </div>
));

EmptyState.displayName = 'EmptyState';
