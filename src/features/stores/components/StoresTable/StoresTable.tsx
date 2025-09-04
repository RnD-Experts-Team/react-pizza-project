/**
 * StoresTable Component
 * Displays a table of stores with action buttons for view, edit, and delete operations
 * Fully responsive with light/dark mode support using CSS custom properties
 * Now includes integrated Redux state management and data fetching
 * Styled to match AuthRulesTable component with Card wrapper and pagination
 * Performance optimized with memoization and callback optimizations
 * Refactored into smaller reusable components
 */

import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useStores } from '@/features/stores/hooks/useStores';
import { setPerPage } from '@/features/stores/store/storesSlice';
import { selectPerPage } from '@/features/stores/store/storesSlice';
import { Card } from '@/components/ui/card';
import { ErrorAlert } from '@/features/stores/components/StoresTable/ErrorAlert';
import { StoresTableHeader } from '@/features/stores/components/StoresTable/StoresTableHeader';
import { StoresTableContent } from '@/features/stores/components/StoresTable/StoresTableContent';
import { StoresTableFooter } from '@/features/stores/components/StoresTable/StoresTableFooter';

// Per page options - moved outside component to prevent recreation
const PER_PAGE_OPTIONS = ['5', '10', '15', '25', '50'];

interface StoresTableProps {
  onCreateStore?: () => void;
}

export const StoresTable: React.FC<StoresTableProps> = ({
  onCreateStore,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Use the custom hook instead of direct Redux selectors
  const {
    stores,
    loading,
    error,
    pagination,
    refetch,
    changePage,
    currentPageData,
  } = useStores();

  // Get current per page value from Redux
  const perPage = useSelector(selectPerPage);

  // Memoize stores data to prevent unnecessary re-renders
  const memoizedStores = useMemo(() => stores, [stores]);

  // Memoized event handlers to prevent child re-renders
  const handleView = useCallback((storeId: string) => {
    navigate(`/stores/view/${storeId}`);
  }, [navigate]);

  const handleEdit = useCallback((storeId: string) => {
    navigate(`/stores/edit/${storeId}`);
  }, [navigate]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleCreateStore = useCallback(() => {
    if (onCreateStore) {
      onCreateStore();
    } else {
      navigate('/stores/create');
    }
  }, [onCreateStore, navigate]);

  const handleViewHierarchy = useCallback((storeId: string) => {
    navigate(`/stores-hierarchy/view/${storeId}`);
  }, [navigate]);

  // Memoized pagination handler
  const handlePageChange = useCallback((page: number) => {
    changePage(page);
  }, [changePage]);

  // Memoized per page change handler
  const handlePerPageChange = useCallback(async (value: string) => {
    const newPerPage = parseInt(value, 10);
    dispatch(setPerPage(newPerPage));
    
    // Refetch with new per page value
    await refetch({ 
      per_page: newPerPage, 
      page: 1 
    });
  }, [dispatch, refetch]);

  // Memoized date formatter
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, []);

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
    if (!memoizedStores.length) return 'No results';
    
    const { from, to, total } = currentPageData;
    if (total <= perPage) {
      return `${total} result${total !== 1 ? 's' : ''}`;
    }
    return `Showing ${from} to ${to} of ${total} results`;
  }, [loading, memoizedStores.length, currentPageData, perPage]);

  // Memoized navigation handlers
  const onPreviousPage = useCallback(() => {
    handlePageChange(paginationState.currentPage - 1);
  }, [handlePageChange, paginationState.currentPage]);

  const onNextPage = useCallback(() => {
    handlePageChange(paginationState.currentPage + 1);
  }, [handlePageChange, paginationState.currentPage]);

  // Memoized store row data to prevent unnecessary Badge re-renders
  const storeRowsData = useMemo(() => {
    return memoizedStores.map((store) => ({
      ...store,
      formattedDate: formatDate(store.created_at),
      statusBadgeVariant: store.is_active ? 'default' : 'secondary',
      statusBadgeClassName: store.is_active
        ? 'bg-primary text-primary-foreground border-primary'
        : 'bg-secondary text-secondary-foreground border-border',
      statusText: store.is_active ? 'Active' : 'Inactive',
    }));
  }, [memoizedStores, formatDate]);

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      {/* Error Alert */}
      {error && <ErrorAlert error={error} />}

      {/* Stores Table */}
      <Card className="rounded-sm bg-card border border-border shadow-lg">
        <StoresTableHeader
          onCreateStore={handleCreateStore}
          onRefresh={handleRetry}
          loading={loading}
        />

        <StoresTableContent
          loading={loading}
          stores={memoizedStores}
          storeRowsData={storeRowsData}
          onView={handleView}
          onEdit={handleEdit}
          onViewHierarchy={handleViewHierarchy}
        />

        <StoresTableFooter
          perPage={perPage}
          perPageOptions={PER_PAGE_OPTIONS}
          loading={loading}
          paginationState={paginationState}
          pagination={pagination}
          resultsText={resultsText}
          onPerPageChange={handlePerPageChange}
          onPreviousPage={onPreviousPage}
          onNextPage={onNextPage}
        />
      </Card>
    </div>
  );
};

export default StoresTable;
