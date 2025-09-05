import React from 'react';

interface StoreFormHeaderProps {
  mode: 'create' | 'edit';
}

export const StoreFormHeader: React.FC<StoreFormHeaderProps> = ({ mode }) => {
  return (
    <div className="mb-6 sm:mb-8">
      <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-2">
        {mode === 'create' ? 'Store Information' : 'Edit Store Information'}
      </h2>
      <p className="text-sm text-muted-foreground">
        {mode === 'create'
          ? 'Please fill in all required fields to create a new store.'
          : 'Update the store information below.'}
      </p>
    </div>
  );
};
