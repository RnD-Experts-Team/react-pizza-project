/**
 * Authorization Rules Table Footer Component
 *
 * Features:
 * - Pagination controls
 * - Per page selector
 * - Results information display
 * - Responsive design
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';

interface Pagination {
  current_page: number;
  last_page: number;
  from: number;
  to: number;
  total: number;
}

interface Filters {
  perPage: number;
  currentPage: number;
}

interface AuthRulesTableFooterProps {
  pagination?: Pagination;
  filters: Filters;
  loading: boolean;
  totalRules: number;
  onUpdateFilters: (updates: Partial<Filters>) => void;
}

export const AuthRulesTableFooter: React.FC<AuthRulesTableFooterProps> = ({
  pagination,
  filters,
  loading,
  totalRules,
  onUpdateFilters,
}) => {
  const handlePageChange = (page: number) => {
    onUpdateFilters({ currentPage: page });
  };

  const handlePerPageChange = (perPage: number) => {
    onUpdateFilters({
      perPage,
      currentPage: 1, // Reset to first page when changing per_page
    });
  };

  return (
    <CardFooter className="pt-4 sm:pt-5 lg:pt-6 bg-card border-t border-border">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full">
        {/* Left side - Per page selector */}
        <div className="flex items-center gap-2 order-2 sm:order-1">
          <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
            Show:
          </span>
          <select
            value={filters.perPage}
            onChange={(e) => handlePerPageChange(Number(e.target.value))}
            disabled={loading}
            className={`text-xs sm:text-sm px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-primary text-foreground border-border ${
              loading ? 'bg-muted opacity-60' : 'bg-background'
            }`}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
            <span className="hidden sm:inline">per page</span>
            <span className="sm:hidden">/page</span>
          </span>
        </div>

        {/* Center - Page navigation */}
        <div className="flex items-center gap-2 order-1 sm:order-2">
          <Button
            variant="outline"
            size="sm"
            disabled={
              !pagination ||
              pagination.current_page <= 1 ||
              loading
            }
            onClick={() =>
              handlePageChange((pagination?.current_page || 1) - 1)
            }
            className={`text-secondary-foreground border-border ${
              !pagination ||
              pagination.current_page <= 1 ||
              loading
                ? 'bg-muted opacity-50'
                : 'bg-secondary'
            }`}
          >
            <span className="hidden xs:inline">Previous</span>
            <span className="xs:hidden">Prev</span>
          </Button>

          <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap px-2">
            {pagination ? (
              <>
                <span className="hidden sm:inline">
                  Page {pagination.current_page} of {pagination.last_page}
                </span>
                <span className="sm:hidden">
                  {pagination.current_page}/{pagination.last_page}
                </span>
              </>
            ) : (
              <span className="hidden sm:inline">Page 1 of 1</span>
            )}
          </span>

          <Button
            variant="outline"
            size="sm"
            disabled={
              !pagination ||
              pagination.current_page >= pagination.last_page ||
              loading
            }
            onClick={() =>
              handlePageChange((pagination?.current_page || 1) + 1)
            }
            className={`text-secondary-foreground border-border ${
              !pagination ||
              pagination.current_page >= pagination.last_page ||
              loading
                ? 'bg-muted opacity-50'
                : 'bg-secondary'
            }`}
          >
            <span className="hidden xs:inline">Next</span>
            <span className="xs:hidden">Next</span>
          </Button>
        </div>

        {/* Right side - Results info */}
        <div className="flex items-center order-3">
          <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
            {pagination ? (
              <>
                <span className="hidden sm:inline">
                  Showing {pagination.from}-{pagination.to} of{' '}
                  {pagination.total} rules
                </span>
                <span className="sm:hidden">
                  {pagination.from}-{pagination.to} of {pagination.total}
                </span>
              </>
            ) : (
              <span className="hidden sm:inline">
                Showing {totalRules}{' '}
                {totalRules === 1 ? 'rule' : 'rules'}
              </span>
            )}
          </span>
        </div>
      </div>
    </CardFooter>
  );
};