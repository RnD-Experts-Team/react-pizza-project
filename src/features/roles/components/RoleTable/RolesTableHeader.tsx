import React from 'react';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Plus, RefreshCw } from 'lucide-react';

interface RolesTableHeaderProps {
  totalRoles: number;
  loading: boolean;
  onRefresh: () => void;
  onAssignPermissions: () => void;
  onCreateRole: () => void;
}

export const RolesTableHeader: React.FC<RolesTableHeaderProps> = ({
  loading,
  onRefresh,
  onAssignPermissions,
  onCreateRole,
}) => {
  return (
    <CardHeader
      className="mb-0 bg-muted border border-border border-b"
      
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <CardTitle
          className="text-lg sm:text-xl text-card-foreground"

        >
          Roles
        </CardTitle>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2 order-1 sm:order-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
              className="flex items-center gap-2"
              style={{
                backgroundColor: loading
                  ? 'var(--muted)'
                  : 'var(--secondary)',
                color: 'var(--secondary-foreground)',
                borderColor: 'var(--border)',
                opacity: loading ? 0.6 : 1,
              }}
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
              />
              <span className="hidden xs:inline">Refresh</span>
            </Button>
            <Button
              onClick={onAssignPermissions}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 bg-secondary text-secondary-foreground border-border "
            >
              <Settings className="h-4 w-4" />
              <span className="hidden xs:inline">Assign</span>
            </Button>
            <Button
              onClick={onCreateRole}
              className="flex items-center justify-center gap-2 text-sm bg-primary text-primary-foreground"
              style={{
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden xs:inline">Create Role</span>
              <span className="xs:hidden">Create</span>
            </Button>
          </div>
        </div>
      </div>
    </CardHeader>
  );
};
