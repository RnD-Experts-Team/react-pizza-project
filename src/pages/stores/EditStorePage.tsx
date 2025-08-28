/**
 * EditStorePage Component
 * Page for editing existing stores using the StoreForm component
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
      <div className="container mx-auto py-6 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Store ID is missing from the URL. Please navigate to this page from the stores list.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show error if failed to fetch store
  if (fetchError && !fetchLoading) {
    return (
      <div className="container mx-auto py-6 px-4">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            className="flex items-center gap-2 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load store data: {fetchError}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Show loading skeleton while fetching
  if (fetchLoading || !currentStore) {
    return (
      <div className="container mx-auto py-6 px-4">
        {/* Header Skeleton */}
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Skeleton className="h-9 w-32" />
          </div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        {/* Form Skeleton */}
        <Card className="w-full max-w-2xl">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-20 w-full" />
              </div>
              <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-10" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-28" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleGoBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Store Details
          </Button>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Store</h1>
          <p className="text-muted-foreground mt-2">
            Update the details for store: <span className="font-medium">{currentStore.name}</span>
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <StoreForm
          mode="edit"
          initialData={currentStore}
          onSubmit={handleSubmit}
          loading={updateLoading}
          error={updateError}
        />
      </div>
    </div>
  );
};

export default EditStorePage;