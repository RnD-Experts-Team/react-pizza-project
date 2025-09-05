import React from 'react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';

interface UsersTableHeaderProps {
  loading: boolean;
  onRefresh: () => void;
}

export const UsersTableHeader: React.FC<UsersTableHeaderProps> = ({
  loading,
  onRefresh,
}) => {
  return (
    <CardHeader
      className="mb-0 bg-muted border-b"
      style={{ color: 'var(--card-foreground)' }}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <CardTitle className="text-lg sm:text-xl text-card-foreground">
          Users
        </CardTitle>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2 order-1 sm:order-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
              className={`flex items-center gap-2 bg-secondary text-secondary-foreground border-border ${
                loading ? 'opacity-60' : ''
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
