import { memo, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Pagination {
  lastPage: number;
  from: number;
  to: number;
  total: number;
}

interface Permission {
  id: string | number;
  name: string;
  guard_name: string;
  roles?: Array<{ id: string | number; name: string }>;
}

interface PermissionsTableFooterProps {
  loading: boolean;
  permissions: Permission[];
  pagination: Pagination | null;
  currentPage: number;
  perPage: number;
  onPerPageChange: (value: string) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

const PER_PAGE_OPTIONS = ['5', '10', '15', '20', '50'] as const;

export const PermissionsTableFooter = memo<PermissionsTableFooterProps>(({
  loading,
  permissions,
  pagination,
  currentPage,
  perPage,
  onPerPageChange,
  onPreviousPage,
  onNextPage,
}) => {
  // Memoize expensive computations
  const perPageString = useMemo(() => perPage.toString(), [perPage]);
  const shouldShowFooter = useMemo(() => !loading && permissions.length > 0, [loading, permissions.length]);
  const shouldShowPagination = useMemo(() => pagination && pagination.lastPage > 1, [pagination]);
  const isPrevDisabled = useMemo(() => currentPage <= 1, [currentPage]);
  const isNextDisabled = useMemo(() => currentPage >= (pagination?.lastPage || 1), [currentPage, pagination?.lastPage]);

  const resultsText = useMemo(() => {
    if (pagination) {
      return `${pagination.from} to ${pagination.to} of ${pagination.total} permissions`;
    }
    return `1 to ${permissions.length} of ${permissions.length} permissions`;
  }, [pagination, permissions.length]);

  if (!shouldShowFooter) {
    return null;
  }

  return (
    <div className="px-4 py-3 border-t border-border bg-card flex flex-col lg:flex-row items-center justify-between gap-4">
      {/* Left: Per Page Selection */}
      <div className="flex items-center gap-2 text-xs sm:text-sm">
        <span className="text-muted-foreground">Show</span>
        <Select
          value={perPageString}
          onValueChange={onPerPageChange}
        >
          <SelectTrigger className="w-16 h-8 text-xs bg-background border-border text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            {PER_PAGE_OPTIONS.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-muted-foreground">per page</span>
      </div>

      {/* Center: Pagination Controls */}
      {shouldShowPagination && pagination && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPreviousPage}
            disabled={isPrevDisabled}
            className="h-8 px-3 text-xs bg-background border-border text-foreground"
          >
            Prev
          </Button>
          <span className="text-xs sm:text-sm px-3 text-foreground">
            Page {currentPage} of {pagination.lastPage}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={onNextPage}
            disabled={isNextDisabled}
            className="h-8 px-3 text-xs bg-background border-border text-foreground"
          >
            Next
          </Button>
        </div>
      )}

      {/* Right: Results Info */}
      <div className="text-xs sm:text-sm text-muted-foreground">
        {resultsText}
      </div>
    </div>
  );
});

PermissionsTableFooter.displayName = 'PermissionsTableFooter';
