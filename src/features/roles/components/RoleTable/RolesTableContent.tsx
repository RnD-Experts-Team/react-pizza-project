import React from 'react';
import { 
  Table, 
  TableBody, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import type { Role } from '@/features/roles/types';
import { RoleRow } from '@/features/roles/components/RoleTable/RoleRow';
import { EnhancedLoadingComponent } from '@/components/EnhancedLoadingComponent';

interface RolesTableContentProps {
  roles: Role[];
  loading: boolean;
}

export const RolesTableContent: React.FC<RolesTableContentProps> = ({
  roles,
  loading,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 sm:h-64 bg-card">
        <EnhancedLoadingComponent 
          message="Loading roles..."
          size="medium"
          className="h-48 sm:h-64 bg-card text-muted-foreground"
        />
      </div>
    );
  }

  if (!roles.length) {
    return (
      <div
        className="text-center py-6 sm:py-8 bg-card"
      >
        <p
          className="text-sm sm:text-base text-muted-foreground"
        >
          No roles found.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader className='bg-muted border-border border border-b'
        >
          <TableRow className='border-border' >
            <TableHead
              className="min-w-[8rem] text-xs sm:text-sm text-foreground font-semibold"

            >
              Name
            </TableHead>
            <TableHead
              className="min-w-[12rem] text-xs sm:text-sm text-foreground font-semibold"

            >
              Permissions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <RoleRow key={role.id} role={role} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
