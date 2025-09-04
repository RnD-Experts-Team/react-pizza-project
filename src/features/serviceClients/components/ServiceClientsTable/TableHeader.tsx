import React from 'react';
import { CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Plus } from 'lucide-react';

interface TableHeaderProps {
  loading: boolean;
  onRefresh: () => void;
  onCreateClick: () => void;
}

export const TableHeader: React.FC<TableHeaderProps> = ({
  loading,
  onRefresh,
  onCreateClick
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
      <CardTitle className="text-lg sm:text-xl text-card-foreground">
        Service Clients
      </CardTitle>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={loading}
          className="flex items-center gap-2 bg-secondary text-secondary-foreground border-border hover:bg-secondary/80 disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
          />
          <span className="hidden xs:inline">Refresh</span>
        </Button>
        <Button
          onClick={onCreateClick}
          className="flex items-center justify-center gap-2 text-sm bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden xs:inline">Create Client</span>
          <span className="xs:hidden">Create</span>
        </Button>
      </div>
    </div>
  );
};
