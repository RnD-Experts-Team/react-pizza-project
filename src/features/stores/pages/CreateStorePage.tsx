/**
 * CreateStorePage Component
 * Page for creating new stores using the StoreForm component
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createStore } from '@/features/stores/store/storesSlice';
import { StoreForm } from '@/features/stores/components/StoreForm';
import { ManageLayout } from '@/components/layouts/ManageLayout';
import { toast } from 'sonner';
import type { CreateStorePayload, UpdateStorePayload } from '@/features/stores/types';
import type { AppDispatch, RootState } from '@/store';

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

  return (
    <ManageLayout
      title="Create New Store"
      subtitle="Add a new store to your system with all the necessary details."
      backButton={{
        show: true,
      }}
      
    >
      
        <div className="bg-card border border-border rounded-lg shadow-sm">
          <div className="p-4 sm:p-6 lg:p-8">
            <StoreForm
              mode="create"
              onSubmit={handleSubmit}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      
    </ManageLayout>
  );
};

export default CreateStorePage;