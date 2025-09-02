/**
 * StoresListPage Component
 * Main page that displays the stores table with create store functionality
 * Fully responsive with CSS color variables for light/dark mode compatibility
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStores } from '../../features/stores/store/storesSlice';
import { StoresTable } from '../../components/stores/StoresTable';
import { ManageLayout } from '../../components/layouts/ManageLayout';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import type { AppDispatch, RootState } from '../../store';

export const StoresListPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Redux selectors
  const stores = useSelector(
    (state: RootState) => state.stores.stores?.stores || [],
  );
  const loading = useSelector(
    (state: RootState) => state.stores.asyncStates.fetchStores.loading,
  );
  const error = useSelector(
    (state: RootState) => state.stores.asyncStates.fetchStores.error,
  );

  // Initial data fetch
  useEffect(() => {
    dispatch(fetchStores());
  }, [dispatch]);

  const handleCreateStore = () => {
    navigate('/stores/create');
  };

  const handleRetry = () => {
    dispatch(fetchStores());
  };

  return (
    <ManageLayout
      title="Stores Management"
      subtitle="Manage your store locations and settings"
    >
      {/* Error Alert */}
      {error && (
        <Alert
          variant="destructive"
          className="mb-4 sm:mb-6 p-3 sm:p-4 md:p-6"
          style={{
            backgroundColor: 'var(--destructive)',
            borderColor: 'var(--destructive)',
            color: 'var(--destructive-foreground)',
          }}
        >
          <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
          <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <span className="text-sm sm:text-base break-words">
              Failed to load stores: {error}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetry}
              className="shrink-0 h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm"
              style={{
                borderColor: 'var(--destructive-foreground)',
                color: 'var(--destructive-foreground)',
                backgroundColor: 'transparent',
              }}
            >
              <RefreshCw className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Stores Table with integrated create functionality */}
      <div className="overflow-x-auto">
        <StoresTable
          stores={stores}
          loading={loading}
          onCreateStore={handleCreateStore}
        />
      </div>
    </ManageLayout>
  );
};

export default StoresListPage;
