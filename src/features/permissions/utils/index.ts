/**
 * Permissions Utility Functions
 * 
 * This file contains utility functions, constants, and helper methods for the permissions domain.
 * These utilities provide common operations, validation helpers, formatting functions,
 * and other reusable logic that can be used across components and services.
 */

import {  GUARD_NAMES, PERMISSION_VALIDATION } from '../types';
import type {Permission, PermissionFormData} from '../types';

/**
 * Validation utilities for permission forms and data
 */
export const permissionValidation = {
  /**
   * Validate permission name
   * @param name - Permission name to validate
   * @returns Validation result with error message if invalid
   */
  validateName: (name: string): { isValid: boolean; error?: string } => {
    if (!name || !name.trim()) {
      return { isValid: false, error: 'Permission name is required' };
    }

    const trimmedName = name.trim();
    
    if (trimmedName.length < PERMISSION_VALIDATION.NAME_MIN_LENGTH) {
      return { 
        isValid: false, 
        error: `Permission name must be at least ${PERMISSION_VALIDATION.NAME_MIN_LENGTH} characters` 
      };
    }

    if (trimmedName.length > PERMISSION_VALIDATION.NAME_MAX_LENGTH) {
      return { 
        isValid: false, 
        error: `Permission name must be less than ${PERMISSION_VALIDATION.NAME_MAX_LENGTH} characters` 
      };
    }

    // Check for invalid characters (only allow letters, numbers, spaces, hyphens, underscores)
    const validNamePattern = /^[a-zA-Z0-9\s\-_]+$/;
    if (!validNamePattern.test(trimmedName)) {
      return { 
        isValid: false, 
        error: 'Permission name can only contain letters, numbers, spaces, hyphens, and underscores' 
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
   * Validate complete permission form data
   * @param data - Permission form data to validate
   * @returns Validation result with field-specific errors
   */
  validatePermissionForm: (data: PermissionFormData): { 
    isValid: boolean; 
    errors: Record<string, string> 
  } => {
    const errors: Record<string, string> = {};

    const nameValidation = permissionValidation.validateName(data.name);
    if (!nameValidation.isValid && nameValidation.error) {
      errors.name = nameValidation.error;
    }

    const guardValidation = permissionValidation.validateGuardName(data.guard_name);
    if (!guardValidation.isValid && guardValidation.error) {
      errors.guard_name = guardValidation.error;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};

/**
 * Permission formatting utilities
 */
export const permissionFormatting = {
  /**
   * Format permission name for display (capitalize words, clean spacing)
   * @param name - Raw permission name
   * @returns Formatted permission name
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
   * Format permission name for API (lowercase, spaces to underscores)
   * @param name - Display permission name
   * @returns API-formatted permission name
   */
  formatApiName: (name: string): string => {
    if (!name) return '';
    
    return name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '');
  },

  /**
   * Format permission creation date
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
};

/**
 * Permission comparison and sorting utilities
 */
export const permissionSorting = {
  /**
   * Sort permissions by name (alphabetical)
   * @param permissions - Array of permissions to sort
   * @param direction - Sort direction
   * @returns Sorted permissions array
   */
  sortByName: (permissions: Permission[], direction: 'asc' | 'desc' = 'asc'): Permission[] => {
    return [...permissions].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return direction === 'asc' ? comparison : -comparison;
    });
  },

  /**
   * Sort permissions by creation date
   * @param permissions - Array of permissions to sort
   * @param direction - Sort direction
   * @returns Sorted permissions array
   */
  sortByCreatedAt: (permissions: Permission[], direction: 'asc' | 'desc' = 'desc'): Permission[] => {
    return [...permissions].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return direction === 'asc' ? dateA - dateB : dateB - dateA;
    });
  },

  /**
   * Sort permissions by number of associated roles
   * @param permissions - Array of permissions to sort
   * @param direction - Sort direction
   * @returns Sorted permissions array
   */
  sortByRoleCount: (permissions: Permission[], direction: 'asc' | 'desc' = 'desc'): Permission[] => {
    return [...permissions].sort((a, b) => {
      const countA = a.roles?.length || 0;
      const countB = b.roles?.length || 0;
      return direction === 'asc' ? countA - countB : countB - countA;
    });
  },
};

/**
 * Permission filtering utilities
 */
export const permissionFiltering = {
  /**
   * Filter permissions by search term
   * @param permissions - Array of permissions to filter
   * @param searchTerm - Search term to match against
   * @returns Filtered permissions array
   */
  filterBySearch: (permissions: Permission[], searchTerm: string): Permission[] => {
    if (!searchTerm.trim()) return permissions;
    
    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    return permissions.filter(permission =>
      permission.name.toLowerCase().includes(lowerSearchTerm)
    );
  },

  /**
   * Filter permissions by guard name
   * @param permissions - Array of permissions to filter
   * @param guardName - Guard name to filter by
   * @returns Filtered permissions array
   */
  filterByGuardName: (permissions: Permission[], guardName: string): Permission[] => {
    if (!guardName.trim()) return permissions;
    
    return permissions.filter(permission =>
      permission.guard_name === guardName.trim()
    );
  },

  /**
   * Filter permissions that have associated roles
   * @param permissions - Array of permissions to filter
   * @returns Permissions with roles
   */
  filterWithRoles: (permissions: Permission[]): Permission[] => {
    return permissions.filter(permission => 
      permission.roles && permission.roles.length > 0
    );
  },

  /**
   * Filter permissions that have no associated roles
   * @param permissions - Array of permissions to filter
   * @returns Permissions without roles
   */
  filterWithoutRoles: (permissions: Permission[]): Permission[] => {
    return permissions.filter(permission => 
      !permission.roles || permission.roles.length === 0
    );
  },
};

/**
 * Permission transformation utilities
 */
export const permissionTransformers = {
  /**
   * Transform permission to select option format
   * @param permission - Permission to transform
   * @returns Select option object
   */
  toSelectOption: (permission: Permission) => ({
    value: permission.id,
    label: permissionFormatting.formatDisplayName(permission.name),
    permission,
  }),

  /**
   * Transform permissions array to select options
   * @param permissions - Array of permissions to transform
   * @returns Array of select options
   */
  toSelectOptions: (permissions: Permission[]) => 
    permissions.map(permissionTransformers.toSelectOption),

  /**
   * Transform permission to search result format
   * @param permission - Permission to transform
   * @returns Search result object
   */
  toSearchResult: (permission: Permission) => ({
    id: permission.id,
    title: permissionFormatting.formatDisplayName(permission.name),
    subtitle: `Guard: ${permission.guard_name}`,
    meta: `${permission.roles?.length || 0} roles`,
    permission,
  }),

  /**
   * Transform permissions to CSV export format
   * @param permissions - Array of permissions to transform
   * @returns CSV-ready data array
   */
  toCsvData: (permissions: Permission[]) => 
    permissions.map(permission => ({
      ID: permission.id,
      Name: permission.name,
      'Guard Name': permission.guard_name,
      'Role Count': permission.roles?.length || 0,
      'Created At': permissionFormatting.formatCreatedAt(permission.created_at),
      'Updated At': permissionFormatting.formatCreatedAt(permission.updated_at),
    })),
};

/**
 * Permission comparison utilities
 */
export const permissionComparison = {
  /**
   * Check if two permissions are equal
   * @param perm1 - First permission
   * @param perm2 - Second permission
   * @returns True if permissions are equal
   */
  areEqual: (perm1: Permission, perm2: Permission): boolean => {
    return perm1.id === perm2.id && 
           perm1.name === perm2.name && 
           perm1.guard_name === perm2.guard_name;
  },

  /**
   * Find permissions that exist in array1 but not in array2
   * @param array1 - First permissions array
   * @param array2 - Second permissions array
   * @returns Permissions unique to array1
   */
  findUniqueToFirst: (array1: Permission[], array2: Permission[]): Permission[] => {
    return array1.filter(perm1 => 
      !array2.some(perm2 => perm1.id === perm2.id)
    );
  },

  /**
   * Find common permissions between two arrays
   * @param array1 - First permissions array
   * @param array2 - Second permissions array
   * @returns Common permissions
   */
  findCommon: (array1: Permission[], array2: Permission[]): Permission[] => {
    return array1.filter(perm1 => 
      array2.some(perm2 => perm1.id === perm2.id)
    );
  },
};

/**
 * Constants for common permission operations
 */
export const PERMISSION_CONSTANTS = {
  DEFAULT_GUARD_NAME: GUARD_NAMES.WEB,
  MAX_PERMISSIONS_PER_PAGE: 50,
  SEARCH_DEBOUNCE_MS: 300,
  CACHE_DURATION_MS: 5 * 60 * 1000, // 5 minutes
  
  // Common permission name patterns
  COMMON_PATTERNS: {
    MANAGE: 'manage',
    VIEW: 'view',
    CREATE: 'create',
    UPDATE: 'update',
    DELETE: 'delete',
    EXPORT: 'export',
  } as const,
} as const;

/**
 * Helper function to create permission name suggestions
 * @param baseName - Base name for the permission
 * @returns Array of suggested permission names
 */
export const generatePermissionSuggestions = (baseName: string): string[] => {
  if (!baseName.trim()) return [];
  
  const cleanBase = baseName.trim().toLowerCase();
  const patterns = Object.values(PERMISSION_CONSTANTS.COMMON_PATTERNS);
  
  return patterns.map(pattern => `${pattern} ${cleanBase}`);
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
