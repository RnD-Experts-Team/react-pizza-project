/**
 * EditStorePage Component
 * Page for editing existing stores using the StoreForm component
 * Uses ManageLayout for consistent layout structure
 */

import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStoreById, updateStore } from '@/features/stores/store/storesSlice';
import { StoreForm } from '@/features/stores/components/StoreForm';
import { ManageLayout } from '@/components/layouts/ManageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { UpdateStorePayload } from '@/features/stores/types';
import type { AppDispatch, RootState } from '@/store';

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

  // Show error if store ID is missing
  if (!storeId) {
    return (
      <ManageLayout
        title="Edit Store"
        subtitle="Store ID is missing"
        backButton={{
          show: true,
        }}
      >
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Store ID is missing from the URL. Please navigate to this page from the stores list.
          </AlertDescription>
        </Alert>
      </ManageLayout>
    );
  }

  // Show error if failed to fetch store
  if (fetchError && !fetchLoading) {
    return (
      <ManageLayout
        title="Edit Store"
        subtitle="Failed to load store data"
        backButton={{
          show: true,
        }}
      >
        <Alert variant="destructive" className="max-w-2xl mx-auto">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load store data: {fetchError}
          </AlertDescription>
        </Alert>
      </ManageLayout>
    );
  }

  // Show loading skeleton while fetching
  if (fetchLoading || !currentStore) {
    return (
      <ManageLayout
        title="Edit Store"
        subtitle="Loading store data..."
        backButton={{
          show: true,
        }}
      >
        <Card className="w-full max-w-2xl mx-auto">
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
      </ManageLayout>
    );
  }

  return (
    <ManageLayout
      title="Edit Store"
      subtitle={`Update the details for store: ${currentStore.name}`}
      backButton={{
        show: true,
      }}
    >
      <div className="w-full max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-6">
            <StoreForm
              mode="edit"
              initialData={currentStore}
              onSubmit={handleSubmit}
              loading={updateLoading}
              error={updateError}
            />
          </CardContent>
        </Card>
      </div>
    </ManageLayout>
  );
};

export default EditStorePage;