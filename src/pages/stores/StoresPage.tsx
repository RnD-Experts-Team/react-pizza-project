/**
 * StoresPage Component
 * Main page component for store management that combines all store-related
 * functionality including list, create, edit, and detail views with routing
 */

import React, { useState, useCallback } from 'react';
import {  useSearchParams } from 'react-router-dom';
import { Plus } from 'lucide-react';

// shadcn/ui imports
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner'; // or your toast system

// Store management imports
import { StoresList } from '../../components/stores/StoresList';
import { CreateStoreDialog } from '../../components/stores/CreateStoreDialog';
import { EditStoreDialog } from '../../components/stores/EditStoreDialog';
import { StoreDetailsView } from '../../components/stores/StoreDetailsView';
import { useStores } from '../../features/stores/hooks/useStores';
import type { Store } from '../../features/stores/types';

/**
 * URL search params interface
 */
interface SearchParams {
  view?: 'list' | 'details';
  storeId?: string;
  tab?: string;
}

/**
 * StoresPage component
 */
export const StoresPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get URL parameters
  const view = (searchParams.get('view') as 'list' | 'details') || 'list';
  const selectedStoreId = searchParams.get('storeId');
  const activeTab = searchParams.get('tab') || 'list';

  // Local state for dialogs
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [storeToEdit, setStoreToEdit] = useState<Store | null>(null);
  const [notification, setNotification] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  // Get stores data for ID validation and auto-generation
  const { stores } = useStores();
  const existingStoreIds = stores.map(store => store.id);

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

  // Handle create store success
  const handleCreateSuccess = useCallback((store: Store) => {
    toast.success('Store created successfully', {
      description: `${store.name} (${store.id}) has been created.`,
    });
    
    setNotification({
      type: 'success',
      message: `Store "${store.name}" has been created successfully.`,
    });
    
    // Auto-dismiss notification after 5 seconds
    setTimeout(() => setNotification(null), 5000);
  }, []);

  // Handle edit store
  const handleEditStore = useCallback((store: Store) => {
    setStoreToEdit(store);
    setEditDialogOpen(true);
  }, []);

  // Handle edit store success
  const handleEditSuccess = useCallback((store: Store) => {
    toast.success('Store updated successfully', {
      description: `${store.name} (${store.id}) has been updated.`,
    });
    
    setNotification({
      type: 'success',
      message: `Store "${store.name}" has been updated successfully.`,
    });
    
    setStoreToEdit(null);
    
    // Auto-dismiss notification after 5 seconds
    setTimeout(() => setNotification(null), 5000);
  }, []);

  // Handle view store details
  const handleViewStore = useCallback((store: Store) => {
    updateSearchParams({
      view: 'details',
      storeId: store.id,
      tab: 'overview',
    });
  }, [updateSearchParams]);

  // Handle back to list
  const handleBackToList = useCallback(() => {
    updateSearchParams({
      view: 'list',
      storeId: undefined,
      tab: undefined,
    });
  }, [updateSearchParams]);

 

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
          <Button onClick={() => setCreateDialogOpen(true)}>
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
          <Tabs value={activeTab} onValueChange={(value) => updateSearchParams({ tab: value })}>
            <TabsList>
              <TabsTrigger value="list">All Stores</TabsTrigger>
              <TabsTrigger value="active">Active Only</TabsTrigger>
              <TabsTrigger value="inactive">Inactive Only</TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-6">
              <StoresList
                onCreateStore={() => setCreateDialogOpen(true)}
                onEditStore={handleEditStore}
                onViewStore={handleViewStore}
                className="mt-6"
              />
            </TabsContent>

            <TabsContent value="active" className="space-y-6">
              <StoresList
                onCreateStore={() => setCreateDialogOpen(true)}
                onEditStore={handleEditStore}
                onViewStore={handleViewStore}
                className="mt-6"
              />
            </TabsContent>

            <TabsContent value="inactive" className="space-y-6">
              <StoresList
                onCreateStore={() => setCreateDialogOpen(true)}
                onEditStore={handleEditStore}
                onViewStore={handleViewStore}
                className="mt-6"
              />
            </TabsContent>
          </Tabs>
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

      {/* Create Store Dialog */}
      <CreateStoreDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onSuccess={handleCreateSuccess}
        existingStoreIds={existingStoreIds}
      />

      {/* Edit Store Dialog */}
      <EditStoreDialog
        store={storeToEdit}
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) {
            setStoreToEdit(null);
          }
        }}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

export default StoresPage;
