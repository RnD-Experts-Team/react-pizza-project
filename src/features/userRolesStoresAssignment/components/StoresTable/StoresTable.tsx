/**
 * StoresTable Component
 * Main component that orchestrates the stores table display
 */
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useStores } from '@/features/stores/hooks/useStores';
import { setPerPage, selectPerPage } from '@/features/stores/store/storesSlice';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { StoresTableContainer } from '@/features/userRolesStoresAssignment/components/StoresTable/StoresTableContainer';

export const StoresTable: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Use the custom hook for stores data
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

  const handleView = useCallback((storeId: string) => {
    navigate(`/user-role-store-assignment/view/store/${storeId}`);
  }, [navigate]);

  const handleAssign = useCallback((storeId: string) => {
    navigate(`/user-role-store-assignment/assign?storeId=${storeId}`);
  }, [navigate]);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const handlePageChange = useCallback((page: number) => {
    changePage(page);
  }, [changePage]);

  const handlePerPageChange = useCallback(async (value: string) => {
    const newPerPage = parseInt(value, 10);
    dispatch(setPerPage(newPerPage));
    
    // Refetch with new per page value
    await refetch({ 
      per_page: newPerPage, 
      page: 1 
    });
  }, [dispatch, refetch]);

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load stores: {error}
          </AlertDescription>
        </Alert>
      )}

      <StoresTableContainer
        stores={stores}
        loading={loading}
        pagination={pagination}
        perPage={perPage}
        currentPageData={currentPageData}
        onView={handleView}
        onAssign={handleAssign}
        onRetry={handleRetry}
        onPageChange={handlePageChange}
        onPerPageChange={handlePerPageChange}
      />
    </div>
  );
};

export default StoresTable;
