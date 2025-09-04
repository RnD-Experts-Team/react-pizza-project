import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PaginationInfo {
  from: number;
  to: number;
  total: number;
  currentPage: number;
  lastPage: number;
}

interface RolesTablePaginationProps {
  paginationInfo: PaginationInfo | null;
  perPage: number;
  loading: boolean;
  onPerPageChange: (value: string) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export const RolesTablePagination: React.FC<RolesTablePaginationProps> = ({
  paginationInfo,
  perPage,
  loading,
  onPerPageChange,
  onPreviousPage,
  onNextPage,
}) => {
  const perPageOptions = [5, 10, 15, 25, 50];

  if (!paginationInfo) {
    return null;
  }

  return (
    <div className="bg-card border-border flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t">
      {/* Left: Per-page selector */}
      <div className="flex items-center gap-2 text-xs sm:text-sm">
        <span className="text-muted-foreground">Show</span>
        <Select value={perPage.toString()} onValueChange={onPerPageChange}>
          <SelectTrigger className="w-16 h-8 text-xs bg-background border-border text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            {perPageOptions.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xs sm:text-sm text-muted-foreground">
          per page
        </span>
      </div>

      {/* Center: Page navigation */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onPreviousPage}
          disabled={loading || paginationInfo.currentPage <= 1}
          className="h-8 px-3 text-xs bg-background border-border text-foreground"
        >
          Prev
        </Button>

        <span className="text-xs sm:text-sm px-3 text-foreground">
          Page {paginationInfo.currentPage} of {paginationInfo.lastPage}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={onNextPage}
          disabled={
            loading || paginationInfo.currentPage >= paginationInfo.lastPage
          }
          className="h-8 px-3 text-xs bg-background border-border text-foreground"
        >
          Next
        </Button>
      </div>

      {/* Right: Results info */}
      <div className="text-xs sm:text-sm text-muted-foreground">
        <span className="hidden sm:inline">
          {paginationInfo.from} to {paginationInfo.to} of {paginationInfo.total}{' '}
          roles
        </span>
        <span className="sm:hidden">
          {paginationInfo.from}-{paginationInfo.to} of {paginationInfo.total}
        </span>
      </div>
    </div>
  );
};
