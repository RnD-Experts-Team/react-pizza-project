import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PaginationFooterProps {
  pagination: {
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
  };
  perPage: number;
  perPageOptions: number[];
  loading: boolean;
  onPerPageChange: (value: string) => void;
  onPageChange: (page: number) => void;
}

export const PaginationFooter: React.FC<PaginationFooterProps> = ({
  pagination,
  perPage,
  perPageOptions,
  loading,
  onPerPageChange,
  onPageChange
}) => {
  return (
    <>
      {/* Left: Per-page selector */}
      <div className="flex items-center gap-2 text-xs sm:text-sm">
        <span className="text-muted-foreground">Show</span>
        <Select
          value={perPage.toString()}
          onValueChange={onPerPageChange}
          disabled={loading}
        >
          <SelectTrigger className="w-16 h-8 text-xs bg-background border-border text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            {perPageOptions.map(option => (
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
          onClick={() => onPageChange(pagination.current_page - 1)}
          disabled={loading || pagination.current_page <= 1}
          className="h-8 px-3 text-xs bg-background border-border text-foreground"
        >
          Prev
        </Button>

        <span className="text-xs sm:text-sm px-3 text-foreground">
          Page {pagination.current_page} of {pagination.last_page}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pagination.current_page + 1)}
          disabled={
            loading || pagination.current_page >= pagination.last_page
          }
          className="h-8 px-3 text-xs bg-background border-border text-foreground"
        >
          Next
        </Button>
      </div>

      {/* Right: Results info */}
      <div className="text-xs sm:text-sm text-muted-foreground">
        <span className="hidden sm:inline">
          {pagination.from} to {pagination.to} of {pagination.total}{' '}
          clients
        </span>
        <span className="sm:hidden">
          {pagination.from}-{pagination.to} of {pagination.total}
        </span>
      </div>
    </>
  );
};
