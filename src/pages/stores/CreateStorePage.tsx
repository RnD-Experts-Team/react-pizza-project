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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleGoBack}
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Back to Stores</span>
              <span className="sm:hidden">Back</span>
            </Button>
          </div>
          
          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              Create New Store
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl">
              Add a new store to your system with all the necessary details.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-full sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl">
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
        </div>
      </div>
    </div>
  );
};

export default CreateStorePage;