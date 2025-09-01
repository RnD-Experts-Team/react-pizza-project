/**
 * EditStorePage Component
 * Page for editing existing stores using the StoreForm component
 * Fully responsive with comprehensive breakpoint support and CSS custom properties
 */

import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStoreById, updateStore } from '../../features/stores/store/storesSlice';
import { StoreForm } from '../../components/stores/StoreForm';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Skeleton } from '../../components/ui/skeleton';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { UpdateStorePayload } from '../../features/stores/types';
import type { AppDispatch, RootState } from '../../store';

export const EditStorePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { storeId } = useParams<{ storeId: string }>();
  
  // Get store data and states from Redux
  const currentStore = useSelector((state: RootState) => state.stores.currentStore);
  const fetchLoading = useSelector((state: RootState) => 
    state.stores.asyncStates.fetchStore.loading
  );
  const fetchError = useSelector((state: RootState) => 
    state.stores.asyncStates.fetchStore.error
  );
  const updateLoading = useSelector((state: RootState) => 
    state.stores.asyncStates.updateStore.loading
  );
  const updateError = useSelector((state: RootState) => 
    state.stores.asyncStates.updateStore.error
  );

  // Fetch store data on component mount
  useEffect(() => {
    if (storeId) {
      dispatch(fetchStoreById(storeId));
    }
  }, [dispatch, storeId]);

  const handleSubmit = async (data: UpdateStorePayload) => {
    if (!storeId) {
      toast.error('Store ID is missing');
      return;
    }

    try {
      await dispatch(updateStore({ storeId, payload: data })).unwrap();
      
      // Show success message
      toast.success('Store updated successfully!', {
        description: `Store "${data.name}" has been updated.`,
      });
      
      // Navigate back to store details or stores list
      navigate(`/stores/view/${storeId}`);
    } catch (error) {
      // Error is handled by Redux and displayed in the form
      console.error('Failed to update store:', error);
      
      // Show error toast
      toast.error('Failed to update store', {
        description: 'Please check the form and try again.',
      });
    }
  };

  const handleGoBack = () => {
    if (storeId) {
      navigate(`/stores/view/${storeId}`);
    } else {
      navigate('/stores');
    }
  };

  // Show error if store ID is missing
  if (!storeId) {
    return (
      <div className="container mx-auto py-3 px-3 sm:py-4 sm:px-4 md:py-6 md:px-6 lg:py-8 lg:px-8">
        <Alert 
          variant="destructive" 
          className="max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto"
          style={{
            backgroundColor: 'var(--destructive)',
            color: 'var(--destructive-foreground)',
            borderColor: 'var(--destructive)'
          }}
        >
          <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
          <AlertDescription className="text-sm sm:text-base">
            Store ID is missing from the URL. Please navigate to this page from the stores list.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show error if failed to fetch store
  if (fetchError && !fetchLoading) {
    return (
      <div className="container mx-auto py-3 px-3 sm:py-4 sm:px-4 md:py-6 md:px-6 lg:py-8 lg:px-8">
        <div className="mb-4 sm:mb-5 md:mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            className="flex items-center gap-1 sm:gap-2 mb-3 sm:mb-4 text-sm sm:text-base"
            style={{
              color: 'var(--foreground)',
              backgroundColor: 'transparent'
            }}
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
        </div>
        
        <Alert 
          variant="destructive"
          className="max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto"
          style={{
            backgroundColor: 'var(--destructive)',
            color: 'var(--destructive-foreground)',
            borderColor: 'var(--destructive)'
          }}
        >
          <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
          <AlertDescription className="text-sm sm:text-base">
            Failed to load store data: {fetchError}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show loading skeleton while fetching
  if (fetchLoading || !currentStore) {
    return (
      <div className="container mx-auto py-3 px-3 sm:py-4 sm:px-4 md:py-6 md:px-6 lg:py-8 lg:px-8">
        {/* Header Skeleton */}
        <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-8">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
            <Skeleton 
              className="h-8 w-24 sm:h-9 sm:w-28 md:w-32" 
              style={{ backgroundColor: 'var(--muted)' }}
            />
          </div>
          <Skeleton 
            className="h-6 w-48 sm:h-7 sm:w-56 md:h-8 md:w-64 mb-2" 
            style={{ backgroundColor: 'var(--muted)' }}
          />
          <Skeleton 
            className="h-3 w-64 sm:h-4 sm:w-80 md:w-96" 
            style={{ backgroundColor: 'var(--muted)' }}
          />
        </div>

        {/* Form Skeleton */}
        <Card 
          className="w-full max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto"
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6">
            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              <div className="space-y-2">
                <Skeleton 
                  className="h-3 w-16 sm:h-4 sm:w-20" 
                  style={{ backgroundColor: 'var(--muted)' }}
                />
                <Skeleton 
                  className="h-8 w-full sm:h-9 md:h-10" 
                  style={{ backgroundColor: 'var(--muted)' }}
                />
              </div>
              <div className="space-y-2">
                <Skeleton 
                  className="h-3 w-12 sm:h-4 sm:w-16" 
                  style={{ backgroundColor: 'var(--muted)' }}
                />
                <Skeleton 
                  className="h-8 w-full sm:h-9 md:h-10" 
                  style={{ backgroundColor: 'var(--muted)' }}
                />
              </div>
              <div className="space-y-2">
                <Skeleton 
                  className="h-3 w-20 sm:h-4 sm:w-24" 
                  style={{ backgroundColor: 'var(--muted)' }}
                />
                <Skeleton 
                  className="h-8 w-full sm:h-9 md:h-10" 
                  style={{ backgroundColor: 'var(--muted)' }}
                />
              </div>
              <div className="space-y-2">
                <Skeleton 
                  className="h-3 w-12 sm:h-4 sm:w-16" 
                  style={{ backgroundColor: 'var(--muted)' }}
                />
                <Skeleton 
                  className="h-16 w-full sm:h-18 md:h-20" 
                  style={{ backgroundColor: 'var(--muted)' }}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton 
                  className="h-5 w-8 sm:h-6 sm:w-10" 
                  style={{ backgroundColor: 'var(--muted)' }}
                />
                <Skeleton 
                  className="h-3 w-20 sm:h-4 sm:w-24" 
                  style={{ backgroundColor: 'var(--muted)' }}
                />
              </div>
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
                <Skeleton 
                  className="h-8 w-full sm:h-9 sm:w-20 md:h-10" 
                  style={{ backgroundColor: 'var(--muted)' }}
                />
                <Skeleton 
                  className="h-8 w-full sm:h-9 sm:w-24 md:h-10 md:w-28" 
                  style={{ backgroundColor: 'var(--muted)' }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className="container mx-auto py-3 px-3 sm:py-4 sm:px-4 md:py-6 md:px-6 lg:py-8 lg:px-8"
      style={{
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
        minHeight: '100vh'
      }}
    >
      {/* Header */}
      <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-8">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-5">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base hover:bg-opacity-80 transition-all duration-200"
            style={{
              color: 'var(--foreground)',
              backgroundColor: 'transparent'
            }}
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5" />
            <span className="hidden sm:inline">Back to Store Details</span>
            <span className="sm:hidden">Back</span>
          </Button>
        </div>
        
        <div className="space-y-1 sm:space-y-2">
          <h1 
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight leading-tight"
            style={{ color: 'var(--foreground)' }}
          >
            Edit Store
          </h1>
          <p 
            className="text-sm sm:text-base md:text-lg mt-1 sm:mt-2 leading-relaxed"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Update the details for store: 
            <span 
              className="font-medium break-words"
              style={{ color: 'var(--foreground)' }}
            >
              {currentStore.name}
            </span>
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="w-full max-w-full sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto">
        <div 
          className="p-4 sm:p-6 lg:p-8 rounded-lg border shadow-sm"
          style={{
            backgroundColor: 'var(--card)',
            borderColor: 'var(--border)',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <StoreForm
            mode="edit"
            initialData={currentStore}
            onSubmit={handleSubmit}
            loading={updateLoading}
            error={updateError}
          />
        </div>
      </div>
    </div>
  );
};

export default EditStorePage;