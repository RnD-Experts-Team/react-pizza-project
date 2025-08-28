/**
 * CreateStorePage Component
 * Page for creating new stores using the StoreForm component
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createStore } from '../../features/stores/store/storesSlice';
import { StoreForm } from '../../components/stores/StoreForm';
import { Button } from '../../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import type { CreateStorePayload, UpdateStorePayload } from '../../features/stores/types';
import type { AppDispatch, RootState } from '../../store';

export const CreateStorePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  // Get loading and error states from Redux
  const loading = useSelector((state: RootState) => 
    state.stores.asyncStates.createStore.loading
  );
  const error = useSelector((state: RootState) => 
    state.stores.asyncStates.createStore.error
  );

  const handleSubmit = async (data: CreateStorePayload | UpdateStorePayload) => {
    try {
      // Since this is create mode, data should always be CreateStorePayload
      await dispatch(createStore(data as CreateStorePayload)).unwrap();
      
      // Show success message
      toast.success('Store created successfully!', {
        description: `Store "${'name' in data ? data.name : 'New store'}" has been created.`,
      });
      
      // Navigate back to stores list
      navigate('/stores');
    } catch (error) {
      // Error is handled by Redux and displayed in the form
      console.error('Failed to create store:', error);
      
      // Show error toast
      toast.error('Failed to create store', {
        description: 'Please check the form and try again.',
      });
    }
  };

  const handleGoBack = () => {
    navigate('/stores');
  };

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
            Back to Stores
          </Button>
        </div>
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Store</h1>
          <p className="text-muted-foreground mt-2">
            Add a new store to your system with all the necessary details.
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl">
        <StoreForm
          mode="create"
          onSubmit={handleSubmit}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default CreateStorePage;