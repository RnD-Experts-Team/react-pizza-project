import React from 'react';
import { CardContent } from '@/components/ui/card';
import { StoresDataTable } from '@/features/stores/components/StoresTable/StoresDataTable';
import { EnhancedLoadingComponent } from '@/components/EnhancedLoadingComponent';

interface Store {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  
}

interface StoreRowData extends Store {
  formattedDate: string;
  statusBadgeVariant: string;
  statusBadgeClassName: string;
  statusText: string;
}

interface StoresTableContentProps {
  loading: boolean;
  stores: Store[];
  storeRowsData: StoreRowData[];
  onView: (storeId: string) => void;
  onEdit: (storeId: string) => void;
  onViewHierarchy: (storeId: string) => void;
}

export const StoresTableContent: React.FC<StoresTableContentProps> = ({
  loading,
  stores,
  storeRowsData,
  onView,
  onEdit,
  onViewHierarchy,
}) => {
  return (
    <CardContent className="p-0 bg-card">
      {loading ? (
        <div className="flex items-center justify-center h-48 sm:h-64 bg-card">
          <EnhancedLoadingComponent 
            message="Loading stores..."
            size="medium"
            className="h-48 sm:h-64 bg-card text-muted-foreground"
          />
        </div>
      ) : !stores.length ? (
        <div className="text-center py-6 sm:py-8 bg-card">
          <p className="text-sm sm:text-base text-muted-foreground">
            No stores found.
          </p>
        </div>
      ) : (
        <StoresDataTable
          storeRowsData={storeRowsData}
          onView={onView}
          onEdit={onEdit}
          onViewHierarchy={onViewHierarchy}
        />
      )}
    </CardContent>
  );
};
