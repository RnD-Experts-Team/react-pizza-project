import React from 'react';

interface ErrorStateProps {
  error: { message?: string } | null;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <div className="text-center py-6 sm:py-8" style={{ color: 'var(--destructive)' }}>
      <p className="text-sm sm:text-base font-medium">Error loading assignments</p>
      <p className="text-xs sm:text-sm mt-1 opacity-80">{error?.message || 'Unknown error'}</p>
    </div>
  );
};

export default ErrorState;