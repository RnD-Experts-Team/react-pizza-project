import  { memo } from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PermissionTableRow } from '@/features/permissions/components/PermissionsTable/PermissionTableRow';
import { EnhancedLoadingComponent } from '@/components/EnhancedLoadingComponent';

interface Permission {
  id: string | number;
  name: string;
  guard_name: string;
  roles?: Array<{ id: string | number; name: string }>;
}

interface PermissionsTableContentProps {
  permissions: Permission[];
  loading: boolean;
}

// Loading component - using EnhancedLoadingComponent for better UX
const LoadingState = memo(() => (
  <div className="flex items-center justify-center h-48 sm:h-64 bg-card">
    <EnhancedLoadingComponent 
      message="Loading permissions..."
      size="medium"
      className="h-48 sm:h-64 bg-card text-muted-foreground"
    />
  </div>
));
LoadingState.displayName = 'LoadingState';

// Empty state component
const EmptyState = memo(() => (
  <div className="text-center py-6 sm:py-8 bg-card">
    <p className="text-sm sm:text-base text-muted-foreground">
      No permissions found.
    </p>
  </div>
));
EmptyState.displayName = 'EmptyState';

// Table header component - this never changes so can be memoized
const TableHeaderComponent = memo(() => (
  <TableHeader className="bg-muted border-b border-border">
    <TableRow className="border-border">
      <TableHead className="min-w-[8rem] text-xs sm:text-sm text-foreground font-semibold">
        Name
      </TableHead>
      <TableHead className="min-w-[12rem] text-xs sm:text-sm text-foreground font-semibold">
        Used by Roles
      </TableHead>
    </TableRow>
  </TableHeader>
));
TableHeaderComponent.displayName = 'TableHeaderComponent';

export const PermissionsTableContent = memo<PermissionsTableContentProps>(({
  permissions,
  loading,
}) => {
  if (loading) {
    return <LoadingState />;
  }

  if (!permissions.length) {
    return <EmptyState />;
  }

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHeaderComponent />
        <TableBody>
          {permissions.map((permission) => (
            <PermissionTableRow key={permission.id} permission={permission} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
});

PermissionsTableContent.displayName = 'PermissionsTableContent';
