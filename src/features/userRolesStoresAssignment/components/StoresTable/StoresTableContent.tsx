/**
 * StoresTableContent Component
 * Main table content with loading states and data display
 */
import React from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StoresTableRow } from '@/features/userRolesStoresAssignment/components/StoresTable/StoresTableRow';
import { EnhancedLoadingComponent } from '@/components/EnhancedLoadingComponent';

interface Store {
  id: string;
  name: string;
  is_active: boolean;
}

interface StoresTableContentProps {
  stores: Store[];
  loading: boolean;
  onView: (storeId: string) => void;
  onAssign: (storeId: string) => void;
}

export const StoresTableContent: React.FC<StoresTableContentProps> = ({
  stores,
  loading,
  onView,
  onAssign,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 sm:h-64 bg-card">
        <EnhancedLoadingComponent 
          message="Loading stores..."
          size="medium"
          className="h-48 sm:h-64 bg-card text-muted-foreground"
        />
      </div>
    );
  }

  if (!stores.length) {
    return (
      <div className="text-center py-6 sm:py-8 bg-card">
        <p className="text-sm sm:text-base text-muted-foreground">
          No stores found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader className="bg-muted border-b border-border">
          <TableRow className="border-border">
            <TableHead className="min-w-[6rem] text-xs sm:text-sm text-foreground font-semibold">
              Store ID
            </TableHead>
            <TableHead className="min-w-[10rem] text-xs sm:text-sm text-foreground font-semibold">
              Name
            </TableHead>
            <TableHead className="min-w-[5rem] text-xs sm:text-sm text-foreground font-semibold">
              Status
            </TableHead>
            <TableHead className="min-w-[5rem] text-right text-xs sm:text-sm text-foreground font-semibold">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stores.map((store) => (
            <StoresTableRow
              key={store.id}
              store={store}
              onView={onView}
              onAssign={onAssign}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
