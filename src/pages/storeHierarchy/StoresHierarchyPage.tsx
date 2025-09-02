/**
 * Stores Hierarchy Main Page
 * 
 * A modern, responsive page that displays all stores with hierarchy navigation.
 * Features beautiful UI and direct access to role hierarchies.
 * 
 * Refactored to use ManageLayout for consistent layout structure.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStores } from '../../features/stores/hooks/useStores';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ManageLayout } from '../../components/layouts/ManageLayout';
import {
  LoadingTable,
  StoresTable
} from '../../components/storeHierarchy/storeHierarchyPage';



export const StoresHierarchyPage: React.FC = () => {
  const navigate = useNavigate();
  
  const {
    stores,
    loading,
    error,
  } = useStores(true);

  const handleViewHierarchy = (storeId: string) => {
    navigate(`/stores-hierarchy/view/${storeId}`);
  };


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };



  if (loading) {
    return (
      <ManageLayout
        title="Store Hierarchies"
        subtitle="Manage and view role hierarchies across all store locations"
      >
        <LoadingTable />
      </ManageLayout>
    );
  }

  return (
    <ManageLayout
      title="Store Hierarchies"
      subtitle="Manage and view role hierarchies across all store locations"
    >
      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm sm:text-base">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <StoresTable
        stores={stores}
        onViewHierarchy={handleViewHierarchy}
        formatDate={formatDate}
      />
    </ManageLayout>
  );
};

export default StoresHierarchyPage;