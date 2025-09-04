import { memo, useMemo } from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';

interface PermissionsTableHeaderProps {
  permissionsCount: number;
  loading: boolean;
  onRefresh: () => void;
  onCreatePermission: () => void;
}

export const PermissionsTableHeader = memo<PermissionsTableHeaderProps>(({
  loading,
  onRefresh,
  onCreatePermission,
}) => {
  // Memoize the dynamic class name to prevent recalculation
  const refreshIconClassName = useMemo(
    () => `h-4 w-4 ${loading ? 'animate-spin' : ''}`,
    [loading]
  );

  return (
    <CardHeader className="mb-0 bg-muted border-b border-border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <CardTitle className="text-lg sm:text-xl text-card-foreground">
          Permissions
        </CardTitle>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2 order-1 sm:order-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center gap-2 bg-secondary text-secondary-foreground border-border disabled:bg-muted disabled:opacity-60"
            >
              <RefreshCw className={refreshIconClassName} />
              <span className="hidden xs:inline">Refresh</span>
            </Button>
            <Button
              onClick={onCreatePermission}
              className="flex items-center justify-center gap-2 text-sm bg-primary text-primary-foreground shadow-sm"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden xs:inline">Create Permission</span>
              <span className="xs:hidden">Create</span>
            </Button>
          </div>
        </div>
      </div>
    </CardHeader>
  );
});

PermissionsTableHeader.displayName = 'PermissionsTableHeader';
