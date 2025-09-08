import React from 'react';
import { RoleCard } from '@/features/users/components/CreateAndEditUser/RoleCard';
import { PaginationControls } from '@/features/users/components/CreateAndEditUser/PaginationControls';
import type { Role, PaginationInfo } from '@/features/users/schemas/userFormSchemas';

interface RoleSelectionSectionProps {
  roles: Role[];
  selectedRoles: string[];
  onRoleChange: (roleName: string, checked: boolean) => void;
  paginationInfo: PaginationInfo;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const RoleSelectionSection = React.memo<RoleSelectionSectionProps>(({ 
  roles, 
  selectedRoles, 
  onRoleChange, 
  paginationInfo, 
  onPageChange, 
  isLoading = false 
}) => {
  const isRoleSelected = (roleName: string) => selectedRoles.includes(roleName);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
          Assign Roles
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Select one or more roles for this user. Each role comes with its own set of permissions.
        </p>
        
        {isLoading ? (
          <div className="grid gap-3 sm:gap-4">
            {/* Loading skeleton */}
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="flex items-start space-x-3 p-4 rounded-lg border bg-muted">
                  <div className="w-4 h-4 bg-muted-foreground/20 rounded mt-1"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-muted-foreground/20 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted-foreground/20 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : roles.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No roles available.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-3 sm:gap-4">
              {roles.map((role) => (
                <RoleCard
                  key={role.id}
                  role={role}
                  checked={isRoleSelected(role.name)}
                  onRoleChange={onRoleChange}
                />
              ))}
            </div>
            
            {/* Pagination Controls */}
            <PaginationControls
              paginationInfo={paginationInfo}
              onPageChange={onPageChange}
              className="mt-6"
            />
          </>
        )}
        
        {/* Selected Roles Summary */}
        {selectedRoles.length > 0 && (
          <div className="mt-4 p-3 bg-accent/50 rounded-lg border">
            <p className="text-sm font-medium text-foreground mb-2">
              Selected Roles ({selectedRoles.length}):
            </p>
            <div className="flex flex-wrap gap-2">
              {selectedRoles.map((roleName) => (
                <span
                  key={roleName}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary text-primary-foreground"
                >
                  {roleName}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

RoleSelectionSection.displayName = 'RoleSelectionSection';