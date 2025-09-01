/**
 * Stores Hierarchy Main Page
 * 
 * A modern, responsive page that displays all stores with hierarchy navigation.
 * Features beautiful UI and direct access to role hierarchies.
 * 
 * Refactored to use smaller, focused components for better maintainability.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStores } from '../../features/stores/hooks/useStores';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { AlertCircle } from 'lucide-react';
import {
  PageHeader,
  LoadingTable,
  StoresTable
} from '../../components/storeHierarchy/storeHierarchyPage';



export const StoresHierarchyPage: React.FC = () => {
  const navigate = useNavigate();
  
  const {
    stores,
    loading,
    error,
    refetch
  } = useStores(true);

  const handleViewHierarchy = (storeId: string) => {
    navigate(`/stores-hierarchy/view/${storeId}`);
  };

  const handleRefresh = () => {
    refetch();
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
      <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8">
        <PageHeader
          title="Store Hierarchies"
          description="Manage and view role hierarchies across all store locations"
          onRefresh={handleRefresh}
          loading={loading}
        />
        <LoadingTable />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-8">
      <PageHeader
        title="Store Hierarchies"
        description="Manage and view role hierarchies across all store locations"
        onRefresh={handleRefresh}
        loading={loading}
      />

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
    </div>
  );
};

export default StoresHierarchyPage;