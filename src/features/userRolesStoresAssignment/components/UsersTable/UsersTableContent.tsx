import React from 'react';
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { UsersTableRow } from '@/features/userRolesStoresAssignment/components/UsersTable/UsersTableRow';
import { LoadingState } from '@/features/userRolesStoresAssignment/components/UsersTable/LoadingState';
import { EmptyState } from '@/features/userRolesStoresAssignment/components/UsersTable/EmptyState';

interface User {
  id: number;
  name: string;
  email: string;
  roles?: Array<{ id: number; name: string }>;
  stores?: Array<{ store: { id: string; name: string } }>;
}

interface UsersTableContentProps {
  users: User[];
  loading: boolean;
  onView: (userId: number) => void;
  onAssign: (userId: number) => void;
}

export const UsersTableContent: React.FC<UsersTableContentProps> = ({
  users,
  loading,
  onView,
  onAssign,
}) => {
  if (loading) {
    return <LoadingState />;
  }

  if (!users.length) {
    return <EmptyState />;
  }

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader className="bg-muted border-b">
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
        
        <TableBody>
          {users.map((user) => (
            <UsersTableRow
              key={user.id}
              user={user}
              onView={onView}
              onAssign={onAssign}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
