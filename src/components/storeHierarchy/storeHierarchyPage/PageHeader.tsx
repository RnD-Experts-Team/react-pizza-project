/**
 * PageHeader Component
 * 
 * Displays the page title, description, and refresh button for the Store Hierarchies page.
 * Handles the refresh functionality and loading states.
 */

import React from 'react';
import { Button } from '../../ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '../../../lib/utils';

interface PageHeaderProps {
  title: string;
  description: string;
  onRefresh: () => void;
  loading?: boolean;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  onRefresh,
  loading = false
}) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1 sm:space-y-2">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {description}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={onRefresh}
            variant="outline"
            size="sm"
            disabled={loading}
            className="hover:bg-accent"
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
            <span className="hidden sm:inline">Refresh</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;