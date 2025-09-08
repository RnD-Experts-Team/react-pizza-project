import { useState, useCallback, useMemo } from 'react';
import type { Role, Permission } from '@/features/users/schemas/userFormSchemas';

interface UseRolePermissionManagerProps {
  roles: Role[];
  permissions: Permission[];
  initialSelectedRoles?: string[];
  initialSelectedPermissions?: string[];
}

export const useRolePermissionManager = ({
  roles,
  initialSelectedRoles = [],
  initialSelectedPermissions = []
}: UseRolePermissionManagerProps) => {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(initialSelectedRoles);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>(initialSelectedPermissions);

  // Handle role selection/deselection
  const handleRoleChange = useCallback((roleName: string, checked: boolean) => {
    setSelectedRoles(prev => {
      if (checked) {
        return prev.includes(roleName) ? prev : [...prev, roleName];
      } else {
        return prev.filter(role => role !== roleName);
      }
    });

    // Auto-select/deselect permissions based on role
    const role = roles.find(r => r.name === roleName);
    if (role?.permissions) {
      const rolePermissionNames = role.permissions.map(p => p.name);
      
      setSelectedPermissions(prev => {
        if (checked) {
          // Add role permissions that aren't already selected
          const newPermissions = rolePermissionNames.filter(p => !prev.includes(p));
          return [...prev, ...newPermissions];
        } else {
          // Remove role permissions
          return prev.filter(p => !rolePermissionNames.includes(p));
        }
      });
    }
  }, [roles]);

  // Handle individual permission selection/deselection
  const handlePermissionChange = useCallback((permissionName: string, checked: boolean) => {
    setSelectedPermissions(prev => {
      if (checked) {
        return prev.includes(permissionName) ? prev : [...prev, permissionName];
      } else {
        return prev.filter(permission => permission !== permissionName);
      }
    });
  }, []);

  // Check if a role is selected
  const isRoleSelected = useCallback((roleName: string) => {
    return selectedRoles.includes(roleName);
  }, [selectedRoles]);

  // Check if a permission is selected
  const isPermissionSelected = useCallback((permissionName: string) => {
    return selectedPermissions.includes(permissionName);
  }, [selectedPermissions]);

  // Get permissions that are automatically selected by roles
  const roleBasedPermissions = useMemo(() => {
    const permissions = new Set<string>();
    selectedRoles.forEach(roleName => {
      const role = roles.find(r => r.name === roleName);
      if (role?.permissions) {
        role.permissions.forEach(p => permissions.add(p.name));
      }
    });
    return Array.from(permissions);
  }, [selectedRoles, roles]);

  // Get permissions that are manually selected (not from roles)
  const manualPermissions = useMemo(() => {
    return selectedPermissions.filter(p => !roleBasedPermissions.includes(p));
  }, [selectedPermissions, roleBasedPermissions]);

  // Get all effective permissions (role-based + manual)
  const allEffectivePermissions = useMemo(() => {
    return Array.from(new Set([...roleBasedPermissions, ...selectedPermissions]));
  }, [roleBasedPermissions, selectedPermissions]);

  // Reset selections
  const resetSelections = useCallback(() => {
    setSelectedRoles([]);
    setSelectedPermissions([]);
  }, []);

  // Set selections programmatically
  const setSelections = useCallback((roles: string[], permissions: string[]) => {
    setSelectedRoles(roles);
    setSelectedPermissions(permissions);
  }, []);

  return {
    selectedRoles,
    selectedPermissions,
    handleRoleChange,
    handlePermissionChange,
    isRoleSelected,
    isPermissionSelected,
    roleBasedPermissions,
    manualPermissions,
    allEffectivePermissions,
    resetSelections,
    setSelections
  };
};