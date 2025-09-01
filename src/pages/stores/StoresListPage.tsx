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
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import {
  Store,
  Plus,
  AlertCircle,
  Building2,
  RefreshCw,
} from 'lucide-react';
import type { AppDispatch, RootState } from '../../store';

export const StoresListPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();



  // Redux selectors
  const stores = useSelector((state: RootState) => 
    state.stores.stores?.stores || []
  );
  const loading = useSelector((state: RootState) => 
    state.stores.asyncStates.fetchStores.loading
  );
  const error = useSelector((state: RootState) => 
    state.stores.asyncStates.fetchStores.error
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



  const renderHeader = () => (
    <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-center md:justify-between">
      <div className="flex items-center gap-3 sm:gap-4">
        <div 
          className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 rounded-lg flex items-center justify-center"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--primary) 10%, transparent)',
          }}
        >
          <Building2 
            className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6"
            style={{ color: 'var(--primary)' }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <h1 
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight"
            style={{ color: 'var(--foreground)' }}
          >
            Stores Management
          </h1>
          <p 
            className="text-sm sm:text-base md:text-lg mt-1 sm:mt-2"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Manage your store locations and settings
          </p>
        </div>
      </div>
      <Button 
        onClick={handleCreateStore} 
        className="shrink-0 w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
        style={{
          backgroundColor: 'var(--primary)',
          color: 'var(--primary-foreground)',
          border: 'none'
        }}
      >
        <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
        Create Store
      </Button>
    </div>
  );





  return (
    <div 
      className="min-h-screen"
      style={{ backgroundColor: 'var(--background)' }}
    >
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 md:space-y-8">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8 md:mb-10">
            {renderHeader()}
          </div>

          {/* Error Alert */}
          {error && (
            <Alert 
              variant="destructive"
              className="mb-4 sm:mb-6 p-3 sm:p-4 md:p-6"
              style={{
                backgroundColor: 'var(--destructive)',
                borderColor: 'var(--destructive)',
                color: 'var(--destructive-foreground)'
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
                    backgroundColor: 'transparent'
                  }}
                >
                  <RefreshCw className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Stores Table */}
          <Card 
            className="overflow-hidden"
            style={{
              backgroundColor: 'var(--card)',
              borderColor: 'var(--border)',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <CardHeader className="p-4 sm:p-6 md:p-8">
              <CardTitle 
                className="flex items-center gap-2 sm:gap-3 text-lg sm:text-xl md:text-2xl"
                style={{ color: 'var(--card-foreground)' }}
              >
                <Store 
                  className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7"
                  style={{ color: 'var(--primary)' }}
                />
                <span>Stores List</span>
              </CardTitle>
            </CardHeader>
            <CardContent 
              className="p-0 sm:p-2 md:p-4"
              style={{ backgroundColor: 'var(--card)' }}
            >
              <div className="overflow-x-auto">
                <StoresTable
                  stores={stores}
                  loading={loading}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StoresListPage;