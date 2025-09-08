import { useState, useCallback, useMemo } from 'react';
import type { PaginationInfo } from '@/features/users/schemas/userFormSchemas';

interface UsePaginationProps {
  totalItems: number;
  itemsPerPage: number;
  initialPage?: number;
}

export const usePagination = ({
  totalItems,
  itemsPerPage,
  initialPage = 1
}: UsePaginationProps) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Calculate pagination info
  const paginationInfo = useMemo((): PaginationInfo => {
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
    const safePage = Math.min(Math.max(1, currentPage), totalPages);
    
    return {
      totalPages,
      currentPage: safePage,
      totalItems,
      hasNextPage: safePage < totalPages,
      hasPrevPage: safePage > 1
    };
  }, [totalItems, itemsPerPage, currentPage]);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const validPage = Math.min(Math.max(1, page), totalPages);
    setCurrentPage(validPage);
  }, [totalItems, itemsPerPage]);

  // Go to next page
  const goToNextPage = useCallback(() => {
    if (paginationInfo.hasNextPage) {
      handlePageChange(currentPage + 1);
    }
  }, [paginationInfo.hasNextPage, currentPage, handlePageChange]);

  // Go to previous page
  const goToPrevPage = useCallback(() => {
    if (paginationInfo.hasPrevPage) {
      handlePageChange(currentPage - 1);
    }
  }, [paginationInfo.hasPrevPage, currentPage, handlePageChange]);

  // Go to first page
  const goToFirstPage = useCallback(() => {
    handlePageChange(1);
  }, [handlePageChange]);

  // Go to last page
  const goToLastPage = useCallback(() => {
    handlePageChange(paginationInfo.totalPages);
  }, [paginationInfo.totalPages, handlePageChange]);

  // Get current page items (for client-side pagination)
  const getCurrentPageItems = useCallback(<T>(items: T[]): T[] => {
    const startIndex = (paginationInfo.currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return items.slice(startIndex, endIndex);
  }, [paginationInfo.currentPage, itemsPerPage]);

  // Get pagination range info
  const getPaginationRange = useCallback(() => {
    const startItem = (paginationInfo.currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(paginationInfo.currentPage * itemsPerPage, totalItems);
    
    return {
      startItem,
      endItem,
      totalItems
    };
  }, [paginationInfo.currentPage, itemsPerPage, totalItems]);

  // Reset to first page
  const resetToFirstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return {
    paginationInfo,
    currentPage: paginationInfo.currentPage,
    totalPages: paginationInfo.totalPages,
    hasNextPage: paginationInfo.hasNextPage,
    hasPrevPage: paginationInfo.hasPrevPage,
    handlePageChange,
    goToNextPage,
    goToPrevPage,
    goToFirstPage,
    goToLastPage,
    getCurrentPageItems,
    getPaginationRange,
    resetToFirstPage
  };
};