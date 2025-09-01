import React from 'react';
import { Store } from 'lucide-react';
import { TableCell, TableRow } from '../../ui/table';

export const EmptyState: React.FC = () => {
  return (
    <TableRow>
      <TableCell colSpan={7} className="text-center py-8 sm:py-12" style={{ color: 'var(--muted-foreground)' }}>
        <div className="flex flex-col items-center space-y-2">
          <Store className="h-8 w-8 sm:h-12 sm:w-12 opacity-50" style={{ color: 'var(--muted-foreground)' }} />
          <p className="text-sm sm:text-base font-medium">No role assignments found</p>
          <p className="text-xs sm:text-sm opacity-75">This store has no role assignments yet</p>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default EmptyState;