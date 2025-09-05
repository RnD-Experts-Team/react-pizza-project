/**
 * StoresTableHeader Component
 * Header component with title and refresh button
 */
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface StoresTableHeaderProps {
  loading: boolean;
  onRetry: () => void;
}

export const StoresTableHeader: React.FC<StoresTableHeaderProps> = ({
  loading,
  onRetry,
}) => {
  return (
    <CardHeader className="mb-0 bg-muted border-b border-border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <CardTitle className="text-lg sm:text-xl text-card-foreground">
          Stores
        </CardTitle>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2 order-1 sm:order-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              disabled={loading}
              className={`flex items-center gap-2 border-border ${
                loading 
                  ? 'bg-muted text-secondary-foreground opacity-60' 
                  : 'bg-secondary text-secondary-foreground'
              }`}
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
              />
              <span className="hidden xs:inline">Refresh</span>
            </Button>
          </div>
        </div>
      </div>
    </CardHeader>
  );
};
