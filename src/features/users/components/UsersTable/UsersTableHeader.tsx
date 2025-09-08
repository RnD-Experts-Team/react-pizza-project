// components/UsersTable/UsersTableHeader.tsx
import React from 'react';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

export const UsersTableHeader: React.FC = () => {
  return (
    <TableHeader className="bg-muted border-b border-border">
      <TableRow className="border-border">
        <TableHead className="min-w-[10rem] text-xs sm:text-sm text-foreground font-semibold">
          Name
        </TableHead>
        <TableHead className="min-w-[8rem] text-xs sm:text-sm hidden sm:table-cell text-foreground font-semibold">
          Roles
        </TableHead>
        <TableHead className="min-w-[8rem] text-xs sm:text-sm hidden md:table-cell text-foreground font-semibold">
          Stores
        </TableHead>
        <TableHead className="min-w-[6rem] text-xs sm:text-sm text-right text-foreground font-semibold">
          Actions
        </TableHead>
      </TableRow>
    </TableHeader>
  );
};
