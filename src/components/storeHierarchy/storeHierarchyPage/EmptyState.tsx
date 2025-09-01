/**
 * EmptyState Component
 * 
 * Displays a friendly message when no stores are found.
 * Provides visual feedback and guidance to users.
 */

import React from 'react';
import { Building2 } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = "No stores found",
  description = "Get started by adding your first store location",
  icon: Icon = Building2
}) => {
  return (
    <div className="p-6 sm:p-8 text-center">
      <Icon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">
        {title}
      </h3>
      <p className="text-muted-foreground text-sm sm:text-base">
        {description}
      </p>
    </div>
  );
};

export default EmptyState;