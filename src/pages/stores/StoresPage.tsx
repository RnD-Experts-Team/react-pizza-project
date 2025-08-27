/**
 * StoresPage Component
 * Main page component for store management that combines all store-related
 * functionality including list, create, edit, and detail views with routing
 */

import React, { useState, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';

// shadcn/ui imports
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner'; // or your toast system

// Store management imports
import { StoresList } from '../../components/stores/StoresList';
import { StoreDetailsView } from '../../components/stores/StoreDetailsView';
import { useStores } from '../../features/stores/hooks/useStores';
import type { Store } from '../../features/stores/types';

/**
 * URL search params interface
 */
interface SearchParams {
  view?: 'list' | 'details';
  storeId?: string;
}

/**
 * StoresPage component
 */
export const StoresPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Get URL parameters
  const view = (searchParams.get('view') as 'list' | 'details') || 'list';
  const selectedStoreId = searchParams.get('storeId');
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Update URL parameters
  const updateSearchParams = useCallback((updates: Partial<SearchParams>) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    
    setSearchParams(newParams);
  }, [searchParams, setSearchParams]);



  // Handle create store
  const handleCreateStore = useCallback(() => {
    navigate('/stores/create');
  }, [navigate]);

  // Handle edit store
  const handleEditStore = useCallback((store: Store) => {
    navigate(`/stores/edit/${store.id}`);
  }, [navigate]);



  // Handle view store details
  const handleViewStore = useCallback((store: Store) => {
    updateSearchParams({
      view: 'details',
      storeId: store.id,
    });
  }, [updateSearchParams]);

  // Handle back to list
  const handleBackToList = useCallback(() => {
    updateSearchParams({
      view: 'list',
      storeId: undefined,
    });
  }, [updateSearchParams]);

  // Handle delete store
  const handleDeleteStore = useCallback(async (store: Store) => {
    try {
      // TODO: Implement actual delete API call
      console.log('Deleting store:', store);
      
      toast.success('Store deleted successfully', {
        description: `${store.name} (${store.id}) has been deleted.`,
      });
      
      setNotification({
        type: 'success',
        message: `Store "${store.name}" has been deleted successfully.`,
      });
      
      // Auto-dismiss notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);
      
      // If we're viewing the deleted store, go back to list
      if (selectedStoreId === store.id) {
        handleBackToList();
      }
    } catch (error) {
      console.error('Failed to delete store:', error);
      
      toast.error('Failed to delete store', {
        description: 'An error occurred while deleting the store. Please try again.',
      });
      
      setNotification({
        type: 'error',
        message: 'Failed to delete store. Please try again.',
      });
      
      // Auto-dismiss notification after 5 seconds
      setTimeout(() => setNotification(null), 5000);
    }
  }, [selectedStoreId, handleBackToList]);

 

  // Dismiss notification
  const dismissNotification = useCallback(() => {
    setNotification(null);
  }, []);

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Store Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your store locations and information
          </p>
        </div>
        
        {view === 'list' && (
          <Button onClick={handleCreateStore}>
            <Plus className="h-4 w-4 mr-2" />
            Create Store
          </Button>
        )}
      </div>

      {/* Success/Error Notifications */}
      {notification && (
        <Alert 
          variant={notification.type === 'error' ? 'destructive' : 'default'}
          className="relative"
        >
          <AlertDescription>{notification.message}</AlertDescription>
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 h-6 w-6 p-0"
            onClick={dismissNotification}
          >
            ×
          </Button>
        </Alert>
      )}

      {/* Main Content */}
      <div className="space-y-6">
        {view === 'list' ? (
          /* List View */
          <StoresList
            onCreateStore={handleCreateStore}
            onEditStore={handleEditStore}
            onViewStore={handleViewStore}
            onDeleteStore={handleDeleteStore}
            className="mt-6"
          />
        ) : (
          /* Details View */
          <StoreDetailsView
            storeId={selectedStoreId}
            onEdit={handleEditStore}
            onBack={handleBackToList}
            onUserAction={(user, action) => {
              console.log('User action:', { user, action });
              // TODO: Implement user actions
            }}
            onRoleAction={(role, action) => {
              console.log('Role action:', { role, action });
              // TODO: Implement role actions
            }}
          />
        )}
      </div>


    </div>
  );
};

export default StoresPage;
