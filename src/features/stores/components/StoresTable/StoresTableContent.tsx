import React from 'react';
import { CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { StoresDataTable } from '@/features/stores/components/StoresTable/StoresDataTable';

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
          <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
          <span className="ml-2 text-sm sm:text-base text-foreground">
            Loading stores...
          </span>
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
