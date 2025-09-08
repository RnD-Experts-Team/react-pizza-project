import React from 'react';
import { PermissionCard } from '@/features/users/components/CreateAndEditUser/PermissionCard';
import { PaginationControls } from '@/features/users/components/CreateAndEditUser/PaginationControls';
import type { Permission, PaginationInfo } from '@/features/users/schemas/userFormSchemas';

interface PermissionSelectionSectionProps {
  permissions: Permission[];
  selectedPermissions: string[];
  roleBasedPermissions?: string[];
  onPermissionChange: (permissionName: string, checked: boolean) => void;
  paginationInfo: PaginationInfo;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export const PermissionSelectionSection = React.memo<PermissionSelectionSectionProps>(({ 
  permissions, 
  selectedPermissions, 
  roleBasedPermissions = [], 
  onPermissionChange, 
  paginationInfo, 
  onPageChange, 
  isLoading = false 
}) => {
  const isPermissionSelected = (permissionName: string) => selectedPermissions.includes(permissionName);
  const isPermissionFromRole = (permissionName: string) => roleBasedPermissions.includes(permissionName);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-foreground mb-3 sm:mb-4">
          Additional Permissions
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Grant additional permissions beyond those provided by roles. Permissions from roles are automatically included.
        </p>
        
        {isLoading ? (
          <div className="grid gap-3 sm:gap-4">
            {/* Loading skeleton */}
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="flex items-start space-x-3 p-4 rounded-lg border bg-muted">
                  <div className="w-4 h-4 bg-muted-foreground/20 rounded mt-1"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-muted-foreground/20 rounded w-2/3"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : permissions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No permissions available.</p>
          </div>
        ) : (
          <>
            <div className="grid gap-3 sm:gap-4">
              {permissions.map((permission) => {
                const isFromRole = isPermissionFromRole(permission.name);
                const isSelected = isPermissionSelected(permission.name);
                
                return (
                  <div key={permission.id} className="relative">
                    <PermissionCard
                      permission={permission}
                      checked={isSelected}
                      onPermissionChange={onPermissionChange}
                    />
                    {isFromRole && (
                      <div className="absolute top-2 right-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          From Role
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* Pagination Controls */}
            <PaginationControls
              paginationInfo={paginationInfo}
              onPageChange={onPageChange}
              className="mt-6"
            />
          </>
        )}
        
        {/* Permissions Summary */}
        <div className="mt-4 space-y-3">
          {/* Role-based permissions */}
          {roleBasedPermissions.length > 0 && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                Permissions from Roles ({roleBasedPermissions.length}):
              </p>
              <div className="flex flex-wrap gap-2">
                {roleBasedPermissions.map((permissionName) => (
                  <span
                    key={permissionName}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100"
                  >
                    {permissionName}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Additional manual permissions */}
          {selectedPermissions.filter(p => !roleBasedPermissions.includes(p)).length > 0 && (
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm font-medium text-green-900 dark:text-green-100 mb-2">
                Additional Permissions ({selectedPermissions.filter(p => !roleBasedPermissions.includes(p)).length}):
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedPermissions
                  .filter(p => !roleBasedPermissions.includes(p))
                  .map((permissionName) => (
                    <span
                      key={permissionName}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                    >
                      {permissionName}
                    </span>
                  ))
                }
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

PermissionSelectionSection.displayName = 'PermissionSelectionSection';