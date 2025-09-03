import { useState, useCallback } from 'react';

interface Role {
  name: string;
  // Add other role properties as needed
}

interface Permission {
  name: string;
  // Add other permission properties as needed
}

export const useAuthRuleAuthorization = () => {
  // Authorization state - using checkbox selection
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedPermissionsAny, setSelectedPermissionsAny] = useState<string[]>([]);
  const [selectedPermissionsAll, setSelectedPermissionsAll] = useState<string[]>([]);

  // Toggle role selection
  const toggleRoleSelection = useCallback((roleName: string) => {
    setSelectedRoles(prev => {
      if (prev.includes(roleName)) {
        return prev.filter(r => r !== roleName);
      } else {
        return [...prev, roleName];
      }
    });
  }, []);

  // Toggle permission selection for ANY
  const togglePermissionAnySelection = useCallback((permissionName: string) => {
    setSelectedPermissionsAny(prev => {
      if (prev.includes(permissionName)) {
        return prev.filter(p => p !== permissionName);
      } else {
        // Remove from ALL permissions if being added to ANY
        setSelectedPermissionsAll(prevAll => prevAll.filter(p => p !== permissionName));
        return [...prev, permissionName];
      }
    });
  }, []);

  // Toggle permission selection for ALL
  const togglePermissionAllSelection = useCallback((permissionName: string) => {
    setSelectedPermissionsAll(prev => {
      if (prev.includes(permissionName)) {
        return prev.filter(p => p !== permissionName);
      } else {
        // Remove from ANY permissions if being added to ALL
        setSelectedPermissionsAny(prevAny => prevAny.filter(p => p !== permissionName));
        return [...prev, permissionName];
      }
    });
  }, []);

  // Select all roles
  const selectAllRoles = useCallback((availableRoles: Role[]) => {
    const roleNames = availableRoles.map(role => role.name);
    setSelectedRoles(roleNames);
  }, []);

  // Clear all roles
  const clearAllRoles = useCallback(() => {
    setSelectedRoles([]);
  }, []);

  // Select all permissions for ANY
  const selectAllPermissionsAny = useCallback((availablePermissions: Permission[]) => {
    const permissionNames = availablePermissions.map(permission => permission.name);
    setSelectedPermissionsAny(permissionNames);
    // Clear ALL permissions when selecting all ANY permissions
    setSelectedPermissionsAll([]);
  }, []);

  // Clear all permissions for ANY
  const clearAllPermissionsAny = useCallback(() => {
    setSelectedPermissionsAny([]);
  }, []);

  // Select all permissions for ALL
  const selectAllPermissionsAll = useCallback((availablePermissions: Permission[]) => {
    const permissionNames = availablePermissions.map(permission => permission.name);
    setSelectedPermissionsAll(permissionNames);
    // Clear ANY permissions when selecting all ALL permissions
    setSelectedPermissionsAny([]);
  }, []);

  // Clear all permissions for ALL
  const clearAllPermissionsAll = useCallback(() => {
    setSelectedPermissionsAll([]);
  }, []);

  // Reset all selections
  const resetSelections = useCallback(() => {
    setSelectedRoles([]);
    setSelectedPermissionsAny([]);
    setSelectedPermissionsAll([]);
  }, []);

  // Get authorization data for form submission
  const getAuthorizationData = useCallback(() => {
    return {
      selectedRoles,
      selectedPermissionsAny,
      selectedPermissionsAll,
    };
  }, [selectedRoles, selectedPermissionsAny, selectedPermissionsAll]);

  // Check if any authorization is selected
  const hasAnySelection = useCallback(() => {
    return selectedRoles.length > 0 || selectedPermissionsAny.length > 0 || selectedPermissionsAll.length > 0;
  }, [selectedRoles, selectedPermissionsAny, selectedPermissionsAll]);

  return {
    // State
    selectedRoles,
    selectedPermissionsAny,
    selectedPermissionsAll,
    
    // Role handlers
    toggleRoleSelection,
    selectAllRoles,
    clearAllRoles,
    
    // Permission ANY handlers
    togglePermissionAnySelection,
    selectAllPermissionsAny,
    clearAllPermissionsAny,
    
    // Permission ALL handlers
    togglePermissionAllSelection,
    selectAllPermissionsAll,
    clearAllPermissionsAll,
    
    // Utility functions
    resetSelections,
    getAuthorizationData,
    hasAnySelection,
  };
};