/**
 * Roles Utility Functions
 * 
 * This file contains utility functions, constants, and helper methods for the roles domain.
 * These utilities provide common operations, validation helpers, formatting functions,
 * and other reusable logic that can be used across components and services.
 */

import { GUARD_NAMES, ROLE_VALIDATION } from '../types';
import type { Role, RoleFormData } from '../types';
/**
 * Validation utilities for role forms and data
 */
export const roleValidation = {
  /**
   * Validate role name
   * @param name - Role name to validate
   * @returns Validation result with error message if invalid
   */
  validateName: (name: string): { isValid: boolean; error?: string } => {
    if (!name || !name.trim()) {
      return { isValid: false, error: 'Role name is required' };
    }

    const trimmedName = name.trim();
    
    if (trimmedName.length < ROLE_VALIDATION.NAME_MIN_LENGTH) {
      return { 
        isValid: false, 
        error: `Role name must be at least ${ROLE_VALIDATION.NAME_MIN_LENGTH} characters` 
      };
    }

    if (trimmedName.length > ROLE_VALIDATION.NAME_MAX_LENGTH) {
      return { 
        isValid: false, 
        error: `Role name must be less than ${ROLE_VALIDATION.NAME_MAX_LENGTH} characters` 
      };
    }

    // Check for invalid characters (only allow letters, numbers, spaces, hyphens, underscores)
    const validNamePattern = /^[a-zA-Z0-9\s\-_]+$/;
    if (!validNamePattern.test(trimmedName)) {
      return { 
        isValid: false, 
        error: 'Role name can only contain letters, numbers, spaces, hyphens, and underscores' 
      };
    }

    return { isValid: true };
  },

  /**
   * Validate guard name
   * @param guardName - Guard name to validate
   * @returns Validation result with error message if invalid
   */
  validateGuardName: (guardName: string): { isValid: boolean; error?: string } => {
    if (!guardName || !guardName.trim()) {
      return { isValid: false, error: 'Guard name is required' };
    }

    const validGuardNames = Object.values(GUARD_NAMES);
    if (!validGuardNames.includes(guardName as any)) {
      return { 
        isValid: false, 
        error: `Guard name must be one of: ${validGuardNames.join(', ')}` 
      };
    }

    return { isValid: true };
  },

  /**
   * Validate permissions array
   * @param permissions - Array of permission names to validate
   * @returns Validation result with error message if invalid
   */
  validatePermissions: (permissions: string[]): { isValid: boolean; error?: string } => {
    if (!Array.isArray(permissions)) {
      return { isValid: false, error: 'Permissions must be an array' };
    }

    if (permissions.length === 0) {
      return { isValid: false, error: 'At least one permission must be selected' };
    }

    if (permissions.length > ROLE_VALIDATION.MAX_PERMISSIONS_PER_ROLE) {
      return { 
        isValid: false, 
        error: `Cannot assign more than ${ROLE_VALIDATION.MAX_PERMISSIONS_PER_ROLE} permissions to a role` 
      };
    }

    // Check for empty or invalid permission names
    const invalidPermissions = permissions.filter(p => !p || !p.trim());
    if (invalidPermissions.length > 0) {
      return { isValid: false, error: 'All permissions must have valid names' };
    }

    return { isValid: true };
  },

  /**
   * Validate complete role form data
   * @param data - Role form data to validate
   * @returns Validation result with field-specific errors
   */
  validateRoleForm: (data: RoleFormData): { 
    isValid: boolean; 
    errors: Record<string, string> 
  } => {
    const errors: Record<string, string> = {};

    const nameValidation = roleValidation.validateName(data.name);
    if (!nameValidation.isValid && nameValidation.error) {
      errors.name = nameValidation.error;
    }

    const guardValidation = roleValidation.validateGuardName(data.guard_name);
    if (!guardValidation.isValid && guardValidation.error) {
      errors.guard_name = guardValidation.error;
    }

    const permissionsValidation = roleValidation.validatePermissions(data.permissions);
    if (!permissionsValidation.isValid && permissionsValidation.error) {
      errors.permissions = permissionsValidation.error;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};

/**
 * Role formatting utilities
 */
export const roleFormatting = {
  /**
   * Format role name for display (capitalize words, clean spacing)
   * @param name - Raw role name
   * @returns Formatted role name
   */
  formatDisplayName: (name: string): string => {
    if (!name) return '';
    
    return name
      .trim()
      .toLowerCase()
      .replace(/[_-]/g, ' ')
      .replace(/\s+/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },

  /**
   * Format role name for API (lowercase, spaces to hyphens)
   * @param name - Display role name
   * @returns API-formatted role name
   */
  formatApiName: (name: string): string => {
    if (!name) return '';
    
    return name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '');
  },

  /**
   * Format role creation date
   * @param dateString - ISO date string
   * @returns Formatted date string
   */
  formatCreatedAt: (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (error) {
      return 'Invalid Date';
    }
  },

  /**
   * Format relative time (e.g., "2 hours ago")
   * @param dateString - ISO date string
   * @returns Relative time string
   */
  formatRelativeTime: (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
      if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
      return `${Math.floor(diffInSeconds / 31536000)} years ago`;
    } catch (error) {
      return 'Unknown';
    }
  },

  /**
   * Format permissions count for display
   * @param count - Number of permissions
   * @returns Formatted count string
   */
  formatPermissionCount: (count: number): string => {
    if (count === 0) return 'No permissions';
    if (count === 1) return '1 permission';
    return `${count} permissions`;
  },
};

/**
 * Role comparison and sorting utilities
 */
export const roleSorting = {
  /**
   * Sort roles by name (alphabetical)
   * @param roles - Array of roles to sort
   * @param direction - Sort direction
   * @returns Sorted roles array
   */
  sortByName: (roles: Role[], direction: 'asc' | 'desc' = 'asc'): Role[] => {
    return [...roles].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return direction === 'asc' ? comparison : -comparison;
    });
  },

  /**
   * Sort roles by creation date
   * @param roles - Array of roles to sort
   * @param direction - Sort direction
   * @returns Sorted roles array
   */
  sortByCreatedAt: (roles: Role[], direction: 'asc' | 'desc' = 'desc'): Role[] => {
    return [...roles].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return direction === 'asc' ? dateA - dateB : dateB - dateA;
    });
  },

  /**
   * Sort roles by number of permissions
   * @param roles - Array of roles to sort
   * @param direction - Sort direction
   * @returns Sorted roles array
   */
  sortByPermissionCount: (roles: Role[], direction: 'asc' | 'desc' = 'desc'): Role[] => {
    return [...roles].sort((a, b) => {
      const countA = a.permissions?.length || 0;
      const countB = b.permissions?.length || 0;
      return direction === 'asc' ? countA - countB : countB - countA;
    });
  },
};

/**
 * Role filtering utilities
 */
export const roleFiltering = {
  /**
   * Filter roles by search term
   * @param roles - Array of roles to filter
   * @param searchTerm - Search term to match against
   * @returns Filtered roles array
   */
  filterBySearch: (roles: Role[], searchTerm: string): Role[] => {
    if (!searchTerm.trim()) return roles;
    
    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    return roles.filter(role =>
      role.name.toLowerCase().includes(lowerSearchTerm) ||
      role.permissions?.some(p => p.name.toLowerCase().includes(lowerSearchTerm))
    );
  },

  /**
   * Filter roles by guard name
   * @param roles - Array of roles to filter
   * @param guardName - Guard name to filter by
   * @returns Filtered roles array
   */
  filterByGuardName: (roles: Role[], guardName: string): Role[] => {
    if (!guardName.trim()) return roles;
    
    return roles.filter(role => role.guard_name === guardName.trim());
  },

  /**
   * Filter roles that have specific permissions
   * @param roles - Array of roles to filter
   * @param permissionNames - Array of permission names to match
   * @returns Roles that have any of the specified permissions
   */
  filterByPermissions: (roles: Role[], permissionNames: string[]): Role[] => {
    if (!permissionNames || permissionNames.length === 0) return roles;
    
    return roles.filter(role => 
      role.permissions?.some(permission => 
        permissionNames.includes(permission.name)
      )
    );
  },

  /**
   * Filter roles that have associated permissions
   * @param roles - Array of roles to filter
   * @returns Roles with permissions
   */
  filterWithPermissions: (roles: Role[]): Role[] => {
    return roles.filter(role => 
      role.permissions && role.permissions.length > 0
    );
  },

  /**
   * Filter roles that have no associated permissions
   * @param roles - Array of roles to filter
   * @returns Roles without permissions
   */
  filterWithoutPermissions: (roles: Role[]): Role[] => {
    return roles.filter(role => 
      !role.permissions || role.permissions.length === 0
    );
  },
};

/**
 * Role transformation utilities
 */
export const roleTransformers = {
  /**
   * Transform role to select option format
   * @param role - Role to transform
   * @returns Select option object
   */
  toSelectOption: (role: Role) => ({
    value: role.id,
    label: roleFormatting.formatDisplayName(role.name),
    role,
  }),

  /**
   * Transform roles array to select options
   * @param roles - Array of roles to transform
   * @returns Array of select options
   */
  toSelectOptions: (roles: Role[]) => 
    roles.map(roleTransformers.toSelectOption),

  /**
   * Transform role to search result format
   * @param role - Role to transform
   * @returns Search result object
   */
  toSearchResult: (role: Role) => ({
    id: role.id,
    title: roleFormatting.formatDisplayName(role.name),
    subtitle: `Guard: ${role.guard_name}`,
    meta: roleFormatting.formatPermissionCount(role.permissions?.length || 0),
    role,
  }),

  /**
   * Transform roles to CSV export format
   * @param roles - Array of roles to transform
   * @returns CSV-ready data array
   */
  toCsvData: (roles: Role[]) => 
    roles.map(role => ({
      ID: role.id,
      Name: role.name,
      'Guard Name': role.guard_name,
      'Permission Count': role.permissions?.length || 0,
      'Permission Names': role.permissions?.map(p => p.name).join('; ') || '',
      'Created At': roleFormatting.formatCreatedAt(role.created_at),
      'Updated At': roleFormatting.formatCreatedAt(role.updated_at),
    })),

  /**
   * Transform role to analytics format
   * @param role - Role to transform
   * @returns Analytics-ready object
   */
  toAnalyticsData: (role: Role) => ({
    id: role.id,
    name: role.name,
    permission_count: role.permissions?.length || 0,
    guard_name: role.guard_name,
    created_date: role.created_at.split('T')[0], // YYYY-MM-DD format
    days_since_creation: Math.floor(
      (new Date().getTime() - new Date(role.created_at).getTime()) / (1000 * 60 * 60 * 24)
    ),
  }),
};

/**
 * Role comparison utilities
 */
export const roleComparison = {
  /**
   * Check if two roles are equal
   * @param role1 - First role
   * @param role2 - Second role
   * @returns True if roles are equal
   */
  areEqual: (role1: Role, role2: Role): boolean => {
    return role1.id === role2.id && 
           role1.name === role2.name && 
           role1.guard_name === role2.guard_name;
  },

  /**
   * Find roles that exist in array1 but not in array2
   * @param array1 - First roles array
   * @param array2 - Second roles array
   * @returns Roles unique to array1
   */
  findUniqueToFirst: (array1: Role[], array2: Role[]): Role[] => {
    return array1.filter(role1 => 
      !array2.some(role2 => role1.id === role2.id)
    );
  },

  /**
   * Find common roles between two arrays
   * @param array1 - First roles array
   * @param array2 - Second roles array
   * @returns Common roles
   */
  findCommon: (array1: Role[], array2: Role[]): Role[] => {
    return array1.filter(role1 => 
      array2.some(role2 => role1.id === role2.id)
    );
  },

  /**
   * Compare permission sets between two roles
   * @param role1 - First role
   * @param role2 - Second role
   * @returns Comparison result with differences
   */
  comparePermissions: (role1: Role, role2: Role) => {
    const perms1 = role1.permissions?.map(p => p.name) || [];
    const perms2 = role2.permissions?.map(p => p.name) || [];
    
    return {
      common: perms1.filter(p => perms2.includes(p)),
      onlyInFirst: perms1.filter(p => !perms2.includes(p)),
      onlyInSecond: perms2.filter(p => !perms1.includes(p)),
    };
  },
};

/**
 * Constants for common role operations
 */
export const ROLE_CONSTANTS = {
  DEFAULT_GUARD_NAME: GUARD_NAMES.WEB,
  MAX_ROLES_PER_PAGE: 50,
  SEARCH_DEBOUNCE_MS: 300,
  CACHE_DURATION_MS: 5 * 60 * 1000, // 5 minutes
  
  // Common role name patterns
  COMMON_PATTERNS: {
    ADMIN: 'admin',
    MANAGER: 'manager',
    EDITOR: 'editor',
    VIEWER: 'viewer',
    MODERATOR: 'moderator',
  } as const,
} as const;

/**
 * Helper function to create role name suggestions
 * @param baseName - Base name for the role
 * @returns Array of suggested role names
 */
export const generateRoleSuggestions = (baseName: string): string[] => {
  if (!baseName.trim()) return [];
  
  const cleanBase = baseName.trim().toLowerCase();
  const patterns = Object.values(ROLE_CONSTANTS.COMMON_PATTERNS);
  
  return patterns.map(pattern => `${cleanBase} ${pattern}`);
};

/**
 * Utility to debounce function calls (useful for search)
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Utility to extract unique permission names from roles
 * @param roles - Array of roles
 * @returns Array of unique permission names
 */
export const extractUniquePermissions = (roles: Role[]): string[] => {
  const permissionSet = new Set<string>();
  
  roles.forEach(role => {
    role.permissions?.forEach(permission => {
      permissionSet.add(permission.name);
    });
  });
  
  return Array.from(permissionSet).sort();
};

/**
 * Utility to calculate role statistics
 * @param roles - Array of roles
 * @returns Statistics object
 */
export const calculateRoleStats = (roles: Role[]) => {
  const totalRoles = roles.length;
  const rolesWithPermissions = roles.filter(r => r.permissions && r.permissions.length > 0).length;
  const totalPermissions = roles.reduce((sum, role) => sum + (role.permissions?.length || 0), 0);
  const avgPermissionsPerRole = totalRoles > 0 ? totalPermissions / totalRoles : 0;
  
  return {
    totalRoles,
    rolesWithPermissions,
    rolesWithoutPermissions: totalRoles - rolesWithPermissions,
    totalPermissions,
    avgPermissionsPerRole: Math.round(avgPermissionsPerRole * 100) / 100,
    uniquePermissions: extractUniquePermissions(roles).length,
  };
};
