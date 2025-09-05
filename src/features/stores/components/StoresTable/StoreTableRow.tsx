import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { StoreActionsDropdown } from '@/features/stores/components/StoresTable/StoreActionsDropdown';

interface StoreRowData {
  id: string;
  name: string;
  formattedDate: string;
  statusBadgeVariant: string;
  statusBadgeClassName: string;
  statusText: string;
}

interface StoreTableRowProps {
  store: StoreRowData;
  onView: (storeId: string) => void;
  onEdit: (storeId: string) => void;
  onViewHierarchy: (storeId: string) => void;
}

export const StoreTableRow: React.FC<StoreTableRowProps> = ({
  store,
  onView,
  onEdit,
  onViewHierarchy,
}) => {
  return (
    <TableRow
      key={store.id}
      className="border-border bg-card hover:bg-muted/50 transition-colors"
    >
      <TableCell className="font-medium text-xs sm:text-sm p-2 sm:p-4 text-foreground">
        <div
          className="truncate max-w-[5rem] sm:max-w-none"
          title={store.id}
        >
          {store.id}
        </div>
      </TableCell>

      <TableCell className="p-2 sm:p-4">
        <div
          className="text-xs sm:text-sm truncate max-w-[8rem] sm:max-w-none text-foreground"
          title={store.name}
        >
          {store.name}
        </div>
      </TableCell>


      

      <TableCell className="p-2 sm:p-4">
        <Badge
          variant={store.statusBadgeVariant as any}
          className={`text-xs px-1 py-0.5 sm:px-2 sm:py-1 ${store.statusBadgeClassName}`}
        >
          {store.statusText}
        </Badge>
      </TableCell>

      <TableCell className="text-xs sm:text-sm p-2 sm:p-4 hidden sm:table-cell text-muted-foreground">
        {store.formattedDate}
      </TableCell>

      <TableCell className="text-right p-2 sm:p-4">
        <div className="flex justify-end">
          <StoreActionsDropdown
            storeId={store.id}
            onView={onView}
            onEdit={onEdit}
            onViewHierarchy={onViewHierarchy}
          />
        </div>
      </TableCell>
    </TableRow>
  );
};
