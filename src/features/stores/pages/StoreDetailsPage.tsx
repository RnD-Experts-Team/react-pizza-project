/**
 * StoreDetailsPage Component (Refactored)
 * Displays comprehensive store information using smaller, reusable components
 */

import React, { useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '@/features/stores/hooks/useStores';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { StoreUsersSection } from '@/features/stores/components/StoreUsersSecction/StoreUsersSection';
import { StoreRolesSection } from '@/features/stores/components/StoreRolesSection/StoreRolesSection';
import { ManageLayout } from '@/components/layouts/ManageLayout';
import { StoreBasicInfo } from '@/features/stores/components/StoreBasicInfo';
import { StoreLocationContact } from '@/features/stores/components/StoreLocationContact';
import { StoreLoadingSkeleton } from '@/features/stores/components/StoreLoadingSkeleton';
import {
  Edit,
  AlertCircle,
  GitBranch,
} from 'lucide-react';

export const StoreDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Use the custom hook for store data
  const { store, loading, error } = useStore(id || null);

  const handleEditStore = useCallback(() => {
    if (id) {
      navigate(`/stores/edit/${id}`);
    }
  }, [id, navigate]);

  const handleViewHierarchy = useCallback((storeId: string) => {
    navigate(`/stores-hierarchy/view/${storeId}`);
  }, [navigate]);

  if (loading) {
    return (
      <ManageLayout
        title="Loading..."
        subtitle="Please wait while we load the store details"
        backButton={{ show: true, to: '/stores' }}
      >
        <StoreLoadingSkeleton />
      </ManageLayout>
    );
  }

  if (error) {
    return (
      <ManageLayout
        title="Error"
        subtitle="Failed to load store details"
        backButton={{ show: true, to: '/stores' }}
      >
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm sm:text-base">
              Failed to load store details: {error}
            </AlertDescription>
          </Alert>
        </div>
      </ManageLayout>
    );
  }

  if (!store) {
    return (
      <ManageLayout
        title="Store Not Found"
        subtitle="The store may have been deleted or the ID is invalid"
        backButton={{ show: true, to: '/stores' }}
      >
        <div className="max-w-7xl mx-auto">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm sm:text-base">
              Store not found. The store may have been deleted or the ID is invalid.
            </AlertDescription>
          </Alert>
        </div>
      </ManageLayout>
    );
  }

  return (
    <ManageLayout
      title={store.name}
      subtitle={`Store ID: ${store.id}`}
      backButton={{ show: true, to: '/stores' }}
      mainButtons={
        <Button onClick={handleEditStore}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Store
        </Button>
      }
      subButtons={
        <Button
          variant="outline"
          onClick={() => handleViewHierarchy(store.id)}
        >
          <GitBranch className="mr-2 h-4 w-4" />
          View Hierarchy
        </Button>
      }
    >
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Store Information Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <StoreBasicInfo store={store} />
          <StoreLocationContact store={store} />
        </div>

        {/* Users and Roles Sections */}
        <div className="space-y-4 sm:space-y-6">
          <StoreUsersSection storeId={store.id} />
          <StoreRolesSection storeId={store.id} />
        </div>
      </div>
    </ManageLayout>
  );
};

export default StoreDetailsPage;
