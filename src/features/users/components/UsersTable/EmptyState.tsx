// components/UsersTable/EmptyState.tsx
import React from 'react';

export const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-6 sm:py-8 bg-card">
      <p className="text-sm sm:text-base text-muted-foreground">
        No users found.
      </p>
    </div>
  );
};
