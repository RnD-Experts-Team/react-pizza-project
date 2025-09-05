/**
 * StoresTableRow Component
 * Individual row component for displaying store data
 */
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, UserPlus } from 'lucide-react';

interface Store {
  id: string;
  name: string;
  is_active: boolean;
}

interface StoresTableRowProps {
  store: Store;
  onView: (storeId: string) => void;
  onAssign: (storeId: string) => void;
}

export const StoresTableRow: React.FC<StoresTableRowProps> = ({
  store,
  onView,
  onAssign,
}) => {
  return (
    <TableRow
      className="border-border bg-card hover:bg-muted/50"
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
          variant={store.is_active ? 'default' : 'secondary'}
          className={`text-xs px-1 py-0.5 sm:px-2 sm:py-1 ${
            store.is_active
              ? 'bg-primary text-primary-foreground border-primary'
              : 'bg-secondary text-secondary-foreground border-border'
          }`}
        >
          {store.is_active ? 'Active' : 'Inactive'}
        </Badge>
      </TableCell>
      <TableCell className="text-right p-2 sm:p-4">
        <div className="flex items-center justify-end gap-1 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAssign(store.id)}
            className="text-xs px-2 py-1 sm:px-3 sm:py-2 h-auto bg-secondary text-secondary-foreground border-border"
          >
            <UserPlus className="h-3 w-3 sm:mr-1" />
            <span className="hidden sm:inline">Assign</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(store.id)}
            className="text-xs px-2 py-1 sm:px-3 sm:py-2 h-auto text-muted-foreground bg-transparent"
          >
            <Eye className="h-3 w-3 sm:mr-1" />
            <span className="hidden sm:inline">View</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};
