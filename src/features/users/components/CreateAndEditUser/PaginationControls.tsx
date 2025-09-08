import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PaginationInfo } from '@/features/users/schemas/userFormSchemas';

interface PaginationControlsProps {
  paginationInfo: PaginationInfo;
  onPageChange: (page: number) => void;
  className?: string;
}

export const PaginationControls = React.memo<PaginationControlsProps>(({ 
  paginationInfo, 
  onPageChange, 
  className = '' 
}) => {
  const { currentPage, totalPages, hasPrevPage, hasNextPage } = paginationInfo;

  const handlePrevious = () => {
    if (hasPrevPage) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasNextPage) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show pages around current page
      const start = Math.max(1, currentPage - 2);
      const end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={handlePrevious}
        disabled={!hasPrevPage}
        className="flex items-center space-x-1"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Previous</span>
      </Button>
      
      <div className="flex items-center space-x-1">
        {getPageNumbers().map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageClick(page)}
            className="min-w-[2.5rem]"
          >
            {page}
          </Button>
        ))}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleNext}
        disabled={!hasNextPage}
        className="flex items-center space-x-1"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
});

PaginationControls.displayName = 'PaginationControls';