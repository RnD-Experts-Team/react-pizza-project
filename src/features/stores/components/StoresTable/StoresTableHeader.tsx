import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';

interface StoresTableHeaderProps {
  onCreateStore: () => void;
  onRefresh: () => void;
  loading: boolean;
}

export const StoresTableHeader: React.FC<StoresTableHeaderProps> = ({
  onCreateStore,
  onRefresh,
  loading,
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
              onClick={onRefresh}
              disabled={loading}
              className={`flex items-center gap-2 border-border ${
                loading
                  ? 'bg-muted text-muted-foreground opacity-60'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              }`}
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
              />
              <span className="hidden xs:inline">Refresh</span>
            </Button>
            <Button
              onClick={onCreateStore}
              className="flex items-center justify-center gap-2 text-sm bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden xs:inline">Create Store</span>
              <span className="xs:hidden">Create</span>
            </Button>
          </div>
        </div>
      </div>
    </CardHeader>
  );
};
