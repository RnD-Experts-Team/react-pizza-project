import React from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StoreTableRow } from '@/features/stores/components/StoresTable/StoreTableRow';

interface StoreRowData {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  formattedDate: string;
  statusBadgeVariant: string;
  statusBadgeClassName: string;
  statusText: string;
}

interface StoresDataTableProps {
  storeRowsData: StoreRowData[];
  onView: (storeId: string) => void;
  onEdit: (storeId: string) => void;
  onViewHierarchy: (storeId: string) => void;
}

export const StoresDataTable: React.FC<StoresDataTableProps> = ({
  storeRowsData,
  onView,
  onEdit,
  onViewHierarchy,
}) => {
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
            <TableHead className="min-w-[8rem] text-xs sm:text-sm hidden sm:table-cell text-foreground font-semibold">
              Created
            </TableHead>
            <TableHead className="min-w-[5rem] text-right text-xs sm:text-sm text-foreground font-semibold">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {storeRowsData.map((store) => (
            <StoreTableRow
              key={store.id}
              store={store}
              onView={onView}
              onEdit={onEdit}
              onViewHierarchy={onViewHierarchy}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
