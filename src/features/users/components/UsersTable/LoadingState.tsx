// components/UsersTable/LoadingState.tsx
import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-48 sm:h-64 bg-card text-muted-foreground">
      <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
      <span className="ml-2 text-sm sm:text-base text-foreground">
        Loading users...
      </span>
    </div>
  );
};
