/**
 * StoresTableFooter Component
 * Footer component with pagination controls and results info
 */
import React, { useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Per page options - moved outside component to prevent recreation
const PER_PAGE_OPTIONS = ['5', '10', '15', '25', '50'];

interface Store {
  id: string;
  name: string;
  is_active: boolean;
}

interface Pagination {
  current_page: number;
  last_page: number;
}

interface CurrentPageData {
  from: number;
  to: number;
  total: number;
}

interface StoresTableFooterProps {
  stores: Store[];
  loading: boolean;
  pagination: Pagination | null;
  perPage: number;
  currentPageData: CurrentPageData;
  onPageChange: (page: number) => void;
  onPerPageChange: (value: string) => void;
}

export const StoresTableFooter: React.FC<StoresTableFooterProps> = ({
  stores,
  loading,
  pagination,
  perPage,
  currentPageData,
  onPageChange,
  onPerPageChange,
}) => {
  // Memoized pagination state calculations
  const paginationState = useMemo(() => {
    const shouldShowPagination = !!(pagination && pagination.last_page > 1);
    const currentPage = pagination?.current_page || 1;
    const isPrevDisabled = currentPage <= 1 || loading;
    const isNextDisabled = currentPage >= (pagination?.last_page || 1) || loading;
    return {
      shouldShowPagination,
      currentPage,
      isPrevDisabled,
      isNextDisabled,
    };
  }, [pagination, loading]);

  // Memoized results text to prevent recalculation
  const resultsText = useMemo(() => {
    if (loading) return 'Loading...';
    if (!stores.length) return 'No results';
    
    const { from, to, total } = currentPageData;
    if (total <= perPage) {
      return `${total} result${total !== 1 ? 's' : ''}`;
    }
    return `Showing ${from} to ${to} of ${total} results`;
  }, [loading, stores.length, currentPageData, perPage]);

  // Memoized navigation handlers
  const onPreviousPage = useCallback(() => {
    onPageChange(paginationState.currentPage - 1);
  }, [onPageChange, paginationState.currentPage]);

  const onNextPage = useCallback(() => {
    onPageChange(paginationState.currentPage + 1);
  }, [onPageChange, paginationState.currentPage]);

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
