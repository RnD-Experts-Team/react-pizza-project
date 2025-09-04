import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PaginationState {
  shouldShowPagination: boolean;
  currentPage: number;
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
}

interface Pagination {
  current_page: number;
  last_page: number;
}

interface StoresTableFooterProps {
  perPage: number;
  perPageOptions: string[];
  loading: boolean;
  paginationState: PaginationState;
  pagination: Pagination | null;
  resultsText: string;
  onPerPageChange: (value: string) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
}

export const StoresTableFooter: React.FC<StoresTableFooterProps> = ({
  perPage,
  perPageOptions,
  loading,
  paginationState,
  pagination,
  resultsText,
  onPerPageChange,
  onPreviousPage,
  onNextPage,
}) => {
  return (
    <div className="px-4 py-3 border-t border-border bg-card flex flex-col lg:flex-row items-center justify-between gap-4">
      {/* Left: Per Page Selection */}
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
            {perPageOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-muted-foreground">per page</span>
      </div>

      {/* Center: Pagination Controls */}
      {paginationState.shouldShowPagination && pagination && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onPreviousPage}
            disabled={paginationState.isPrevDisabled}
            className="h-8 px-3 text-xs bg-background border-border text-foreground"
          >
            Prev
          </Button>
          <span className="text-xs sm:text-sm px-3 text-foreground">
            Page {paginationState.currentPage} of {pagination.last_page}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={onNextPage}
            disabled={paginationState.isNextDisabled}
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
};
