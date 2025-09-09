// components/UsersTable/LoadingState.tsx
import React from 'react';
import { EnhancedLoadingComponent } from '@/components/EnhancedLoadingComponent';

export const LoadingState: React.FC = () => {
  return (
    <EnhancedLoadingComponent
      message="Loading users..."
      size="medium"
      className="h-48 sm:h-64 bg-card text-muted-foreground"
    />
  );
};
