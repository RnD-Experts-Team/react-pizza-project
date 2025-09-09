import React from 'react';
import { EnhancedLoadingComponent } from '@/components/EnhancedLoadingComponent';

export const LoadingState: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-48 sm:h-64 bg-card">
      <EnhancedLoadingComponent 
        message="Loading users..."
        size="medium"
        className="h-48 sm:h-64 bg-card text-muted-foreground"
      />
    </div>
  );
};
