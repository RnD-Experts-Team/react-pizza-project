/**
 * Users Utility Functions
 * 
 * This file contains utility functions, constants, and helper methods for the users domain.
 * These utilities provide common operations, validation helpers, formatting functions,
 * and other reusable logic that can be used across components and services.
 * Users domain utilities are more complex due to authentication, authorization, and relationships.
 */

import { USER_VALIDATION } from '../types';
import type { User, UserFormData, PasswordPolicy, UserStatus } from '../types';
/**
 * Validation utilities for user forms and data
 */
export const userValidation = {
  /**
   * Validate user name
   * @param name - User name to validate
   * @returns Validation result with error message if invalid
   */
  validateName: (name: string): { isValid: boolean; error?: string } => {
    if (!name || !name.trim()) {
      return { isValid: false, error: 'User name is required' };
    }

    const trimmedName = name.trim();
    
    if (trimmedName.length < USER_VALIDATION.NAME_MIN_LENGTH) {
      return { 
        isValid: false, 
        error: `Name must be at least ${USER_VALIDATION.NAME_MIN_LENGTH} characters` 
      };
    }

    if (trimmedName.length > USER_VALIDATION.NAME_MAX_LENGTH) {
      return { 
        isValid: false, 
        error: `Name must be less than ${USER_VALIDATION.NAME_MAX_LENGTH} characters` 
      };
    }

    // Check for valid name pattern (letters, spaces, apostrophes, hyphens)
    const validNamePattern = /^[a-zA-Z\s'-]+$/;
    if (!validNamePattern.test(trimmedName)) {
      return { 
        isValid: false, 
        error: 'Name can only contain letters, spaces, apostrophes, and hyphens' 
      };
    }

    return { isValid: true };
  },

  /**
   * Validate email address
   * @param email - Email to validate
   * @returns Validation result with error message if invalid
   */
  validateEmail: (email: string): { isValid: boolean; error?: string } => {
    if (!email || !email.trim()) {
      return { isValid: false, error: 'Email is required' };
    }

    const trimmedEmail = email.trim().toLowerCase();
    
    if (trimmedEmail.length > USER_VALIDATION.EMAIL_MAX_LENGTH) {
      return { 
        isValid: false, 
        error: `Email must be less than ${USER_VALIDATION.EMAIL_MAX_LENGTH} characters` 
      };
    }

    // RFC 5322 compliant email regex (simplified)
    const emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!emailPattern.test(trimmedEmail)) {
      return { 
        isValid: false, 
        error: 'Please enter a valid email address' 
      };
    }

    return { isValid: true };
  },

  /**
   * Validate password against policy
   * @param password - Password to validate
   * @param policy - Password policy to enforce
   * @returns Validation result with error message if invalid
   */
  validatePassword: (
    password: string, 
    policy: PasswordPolicy = {
      minLength: USER_VALIDATION.PASSWORD_MIN_LENGTH,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    }
  ): { isValid: boolean; error?: string } => {
    if (!password) {
      return { isValid: false, error: 'Password is required' };
    }

    if (password.length < policy.minLength) {
      return { 
        isValid: false, 
        error: `Password must be at least ${policy.minLength} characters long` 
      };
    }

    if (password.length > USER_VALIDATION.PASSWORD_MAX_LENGTH) {
      return { 
        isValid: false, 
        error: `Password must be less than ${USER_VALIDATION.PASSWORD_MAX_LENGTH} characters` 
      };
    }

    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      return { 
        isValid: false, 
        error: 'Password must contain at least one uppercase letter' 
      };
    }

    if (policy.requireLowercase && !/[a-z]/.test(password)) {
      return { 
        isValid: false, 
        error: 'Password must contain at least one lowercase letter' 
      };
    }

    if (policy.requireNumbers && !/\d/.test(password)) {
      return { 
        isValid: false, 
        error: 'Password must contain at least one number' 
      };
    }

    if (policy.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\?]/.test(password)) {
      return { 
        isValid: false, 
        error: 'Password must contain at least one special character' 
      };
    }

    // Check against forbidden passwords
    if (policy.forbiddenPasswords?.some(forbidden => 
      password.toLowerCase().includes(forbidden.toLowerCase()))) {
      return { 
        isValid: false, 
        error: 'Password contains forbidden words' 
      };
    }

    return { isValid: true };
  },

  /**
   * Validate password confirmation
   * @param password - Original password
   * @param confirmation - Password confirmation
   * @returns Validation result with error message if invalid
   */
  validatePasswordConfirmation: (password: string, confirmation: string): { isValid: boolean; error?: string } => {
    if (!confirmation) {
      return { isValid: false, error: 'Password confirmation is required' };
    }

    if (password !== confirmation) {
      return { 
        isValid: false, 
        error: 'Password confirmation does not match' 
      };
    }

    return { isValid: true };
  },

  /**
   * Validate roles array
   * @param roles - Array of role names to validate
   * @returns Validation result with error message if invalid
   */
  validateRoles: (roles: string[]): { isValid: boolean; error?: string } => {
    if (!Array.isArray(roles)) {
      return { isValid: false, error: 'Roles must be an array' };
    }

    if (roles.length > USER_VALIDATION.MAX_ROLES_PER_USER) {
      return { 
        isValid: false, 
        error: `Cannot assign more than ${USER_VALIDATION.MAX_ROLES_PER_USER} roles to a user` 
      };
    }

    // Check for empty or invalid role names
    const invalidRoles = roles.filter(r => !r || !r.trim());
    if (invalidRoles.length > 0) {
      return { isValid: false, error: 'All roles must have valid names' };
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

    if (permissions.length > USER_VALIDATION.MAX_PERMISSIONS_PER_USER) {
      return { 
        isValid: false, 
        error: `Cannot assign more than ${USER_VALIDATION.MAX_PERMISSIONS_PER_USER} permissions to a user` 
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
   * Validate complete user form data
   * @param data - User form data to validate
   * @param isEdit - Whether this is an edit operation (password optional)
   * @returns Validation result with field-specific errors
   */
  validateUserForm: (
    data: UserFormData, 
    isEdit: boolean = false
  ): { 
    isValid: boolean; 
    errors: Record<string, string> 
  } => {
    const errors: Record<string, string> = {};

    const nameValidation = userValidation.validateName(data.name);
    if (!nameValidation.isValid && nameValidation.error) {
      errors.name = nameValidation.error;
    }

    const emailValidation = userValidation.validateEmail(data.email);
    if (!emailValidation.isValid && emailValidation.error) {
      errors.email = emailValidation.error;
    }

    // Password validation - required for create, optional for edit
    if (!isEdit || data.password) {
      if (!data.password && !isEdit) {
        errors.password = 'Password is required';
      } else if (data.password) {
        const passwordValidation = userValidation.validatePassword(data.password);
        if (!passwordValidation.isValid && passwordValidation.error) {
          errors.password = passwordValidation.error;
        }

        const confirmationValidation = userValidation.validatePasswordConfirmation(
          data.password, 
          data.password_confirmation || ''
        );
        if (!confirmationValidation.isValid && confirmationValidation.error) {
          errors.password_confirmation = confirmationValidation.error;
        }
      }
    }

    const rolesValidation = userValidation.validateRoles(data.roles);
    if (!rolesValidation.isValid && rolesValidation.error) {
      errors.roles = rolesValidation.error;
    }

    const permissionsValidation = userValidation.validatePermissions(data.permissions);
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
 * User formatting utilities
 */
export const userFormatting = {
  /**
   * Format user name for display (capitalize words)
   * @param name - Raw user name
   * @returns Formatted user name
   */
  formatDisplayName: (name: string): string => {
    if (!name) return '';
    
    return name
      .trim()
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  },

  /**
   * Format email for display (lowercase, trim)
   * @param email - Raw email
   * @returns Formatted email
   */
  formatEmail: (email: string): string => {
    if (!email) return '';
    return email.trim().toLowerCase();
  },

  /**
   * Format user creation date
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
   * Format email verification status
   * @param verifiedAt - Email verification date string or null
   * @returns Verification status string
   */
  formatEmailVerificationStatus: (verifiedAt: string | null): string => {
    return verifiedAt ? 'Verified' : 'Unverified';
  },

  /**
   * Format roles count for display
   * @param count - Number of roles
   * @returns Formatted count string
   */
  formatRoleCount: (count: number): string => {
    if (count === 0) return 'No roles';
    if (count === 1) return '1 role';
    return `${count} roles`;
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

  /**
   * Format user initials for avatar
   * @param name - User name
   * @returns User initials (up to 2 characters)
   */
  formatInitials: (name: string): string => {
    if (!name) return '';
    
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  },
};

/**
 * User comparison and sorting utilities
 */
export const userSorting = {
  /**
   * Sort users by name (alphabetical)
   * @param users - Array of users to sort
   * @param direction - Sort direction
   * @returns Sorted users array
   */
  sortByName: (users: User[], direction: 'asc' | 'desc' = 'asc'): User[] => {
    return [...users].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return direction === 'asc' ? comparison : -comparison;
    });
  },

  /**
   * Sort users by email (alphabetical)
   * @param users - Array of users to sort
   * @param direction - Sort direction
   * @returns Sorted users array
   */
  sortByEmail: (users: User[], direction: 'asc' | 'desc' = 'asc'): User[] => {
    return [...users].sort((a, b) => {
      const comparison = a.email.localeCompare(b.email);
      return direction === 'asc' ? comparison : -comparison;
    });
  },

  /**
   * Sort users by creation date
   * @param users - Array of users to sort
   * @param direction - Sort direction
   * @returns Sorted users array
   */
  sortByCreatedAt: (users: User[], direction: 'asc' | 'desc' = 'desc'): User[] => {
    return [...users].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return direction === 'asc' ? dateA - dateB : dateB - dateA;
    });
  },

  /**
   * Sort users by role count
   * @param users - Array of users to sort
   * @param direction - Sort direction
   * @returns Sorted users array
   */
  sortByRoleCount: (users: User[], direction: 'asc' | 'desc' = 'desc'): User[] => {
    return [...users].sort((a, b) => {
      const countA = a.roles?.length || 0;
      const countB = b.roles?.length || 0;
      return direction === 'asc' ? countA - countB : countB - countA;
    });
  },

  /**
   * Sort users by permission count
   * @param users - Array of users to sort
   * @param direction - Sort direction
   * @returns Sorted users array
   */
  sortByPermissionCount: (users: User[], direction: 'asc' | 'desc' = 'desc'): User[] => {
    return [...users].sort((a, b) => {
      const countA = a.permissions?.length || 0;
      const countB = b.permissions?.length || 0;
      return direction === 'asc' ? countA - countB : countB - countA;
    });
  },

  /**
   * Sort users by email verification status
   * @param users - Array of users to sort
   * @param direction - Sort direction (verified first = desc)
   * @returns Sorted users array
   */
  sortByVerificationStatus: (users: User[], direction: 'asc' | 'desc' = 'desc'): User[] => {
    return [...users].sort((a, b) => {
      const aVerified = !!a.email_verified_at;
      const bVerified = !!b.email_verified_at;
      
      if (aVerified === bVerified) return 0;
      
      if (direction === 'desc') {
        return aVerified ? -1 : 1; // Verified first
      } else {
        return aVerified ? 1 : -1; // Unverified first
      }
    });
  },
};

/**
 * User filtering utilities
 */
export const userFiltering = {
  /**
   * Filter users by search term (name and email)
   * @param users - Array of users to filter
   * @param searchTerm - Search term to match against
   * @returns Filtered users array
   */
  filterBySearch: (users: User[], searchTerm: string): User[] => {
    if (!searchTerm.trim()) return users;
    
    const lowerSearchTerm = searchTerm.toLowerCase().trim();
    return users.filter(user =>
      user.name.toLowerCase().includes(lowerSearchTerm) ||
      user.email.toLowerCase().includes(lowerSearchTerm)
    );
  },

  /**
   * Filter users by email verification status
   * @param users - Array of users to filter
   * @param verified - Whether to show verified or unverified users
   * @returns Filtered users array
   */
  filterByVerificationStatus: (users: User[], verified: boolean): User[] => {
    return users.filter(user => 
      verified ? !!user.email_verified_at : !user.email_verified_at
    );
  },

  /**
   * Filter users by roles
   * @param users - Array of users to filter
   * @param roleNames - Array of role names to match
   * @returns Users that have any of the specified roles
   */
  filterByRoles: (users: User[], roleNames: string[]): User[] => {
    if (!roleNames || roleNames.length === 0) return users;
    
    return users.filter(user => 
      user.roles?.some(role => roleNames.includes(role.name))
    );
  },

  /**
   * Filter users by permissions
   * @param users - Array of users to filter
   * @param permissionNames - Array of permission names to match
   * @returns Users that have any of the specified permissions
   */
  filterByPermissions: (users: User[], permissionNames: string[]): User[] => {
    if (!permissionNames || permissionNames.length === 0) return users;
    
    return users.filter(user => 
      user.permissions?.some(permission => 
        permissionNames.includes(permission.name)
      ) ||
      user.roles?.some(role =>
        role.permissions?.some(permission =>
          permissionNames.includes(permission.name)
        )
      )
    );
  },

  /**
   * Filter users that have roles
   * @param users - Array of users to filter
   * @returns Users with roles
   */
  filterWithRoles: (users: User[]): User[] => {
    return users.filter(user => user.roles && user.roles.length > 0);
  },

  /**
   * Filter users that have permissions
   * @param users - Array of users to filter
   * @returns Users with permissions (direct or through roles)
   */
  filterWithPermissions: (users: User[]): User[] => {
    return users.filter(user => 
      (user.permissions && user.permissions.length > 0) ||
      (user.roles && user.roles.some(role => 
        role.permissions && role.permissions.length > 0
      ))
    );
  },

  /**
   * Filter users by stores
   * @param users - Array of users to filter
   * @param storeIds - Array of store IDs to match
   * @returns Users that have access to any of the specified stores
   */
  filterByStores: (users: User[], storeIds: string[]): User[] => {
    if (!storeIds || storeIds.length === 0) return users;
    
    return users.filter(user => 
      user.stores?.some(userStore => 
        storeIds.includes(userStore.store.id)
      )
    );
  },
};

/**
 * User transformation utilities
 */
export const userTransformers = {
  /**
   * Transform user to select option format
   * @param user - User to transform
   * @returns Select option object
   */
  toSelectOption: (user: User) => ({
    value: user.id,
    label: `${userFormatting.formatDisplayName(user.name)} (${user.email})`,
    user,
  }),

  /**
   * Transform users array to select options
   * @param users - Array of users to transform
   * @returns Array of select options
   */
  toSelectOptions: (users: User[]) => 
    users.map(userTransformers.toSelectOption),

  /**
   * Transform user to search result format
   * @param user - User to transform
   * @returns Search result object
   */
  toSearchResult: (user: User) => ({
    id: user.id,
    title: userFormatting.formatDisplayName(user.name),
    subtitle: user.email,
    meta: `${userFormatting.formatRoleCount(user.roles?.length || 0)} • ${userFormatting.formatEmailVerificationStatus(user.email_verified_at)}`,
    user,
  }),

  /**
   * Transform users to CSV export format
   * @param users - Array of users to transform
   * @returns CSV-ready data array
   */
  toCsvData: (users: User[]) => 
    users.map(user => ({
      ID: user.id,
      Name: user.name,
      Email: user.email,
      'Email Verified': userFormatting.formatEmailVerificationStatus(user.email_verified_at),
      'Role Count': user.roles?.length || 0,
      'Permission Count': user.permissions?.length || 0,
      'Store Count': user.stores?.length || 0,
      'Role Names': user.roles?.map(r => r.name).join('; ') || '',
      'Permission Names': user.permissions?.map(p => p.name).join('; ') || '',
      'Created At': userFormatting.formatCreatedAt(user.created_at),
      'Updated At': userFormatting.formatCreatedAt(user.updated_at),
    })),

  /**
   * Transform user to analytics format
   * @param user - User to transform
   * @returns Analytics-ready object
   */
  toAnalyticsData: (user: User) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    is_verified: !!user.email_verified_at,
    role_count: user.roles?.length || 0,
    permission_count: user.permissions?.length || 0,
    store_count: user.stores?.length || 0,
    created_date: user.created_at.split('T')[0], // YYYY-MM-DD format
    days_since_creation: Math.floor(
      (new Date().getTime() - new Date(user.created_at).getTime()) / (1000 * 60 * 60 * 24)
    ),
  }),
};

/**
 * User comparison utilities
 */
export const userComparison = {
  /**
   * Check if two users are equal
   * @param user1 - First user
   * @param user2 - Second user
   * @returns True if users are equal
   */
  areEqual: (user1: User, user2: User): boolean => {
    return user1.id === user2.id && 
           user1.name === user2.name && 
           user1.email === user2.email;
  },

  /**
   * Compare role assignments between two users
   * @param user1 - First user
   * @param user2 - Second user
   * @returns Comparison result with differences
   */
  compareRoles: (user1: User, user2: User) => {
    const roles1 = user1.roles?.map(r => r.name) || [];
    const roles2 = user2.roles?.map(r => r.name) || [];
    
    return {
      common: roles1.filter(r => roles2.includes(r)),
      onlyInFirst: roles1.filter(r => !roles2.includes(r)),
      onlyInSecond: roles2.filter(r => !roles1.includes(r)),
    };
  },

  /**
   * Compare permission assignments between two users
   * @param user1 - First user
   * @param user2 - Second user
   * @returns Comparison result with differences
   */
  comparePermissions: (user1: User, user2: User) => {
    const perms1 = user1.permissions?.map(p => p.name) || [];
    const perms2 = user2.permissions?.map(p => p.name) || [];
    
    return {
      common: perms1.filter(p => perms2.includes(p)),
      onlyInFirst: perms1.filter(p => !perms2.includes(p)),
      onlyInSecond: perms2.filter(p => !perms1.includes(p)),
    };
  },
};

/**
 * Constants for common user operations
 */
export const USER_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 15,
  MAX_USERS_PER_PAGE: 100,
  SEARCH_DEBOUNCE_MS: 300,
  CACHE_DURATION_MS: 5 * 60 * 1000, // 5 minutes
  
  // User status values
  STATUS: {
    ACTIVE: 'active' as UserStatus,
    INACTIVE: 'inactive' as UserStatus,
    PENDING_VERIFICATION: 'pending_verification' as UserStatus,
    SUSPENDED: 'suspended' as UserStatus,
  },
  
  // Default password policy
  DEFAULT_PASSWORD_POLICY: {
    minLength: USER_VALIDATION.PASSWORD_MIN_LENGTH,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    forbiddenPasswords: ['password', '123456', 'qwerty', 'admin'],
  } as PasswordPolicy,
} as const;

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
 * Utility to calculate user statistics
 * @param users - Array of users
 * @returns Statistics object
 */
export const calculateUserStats = (users: User[]) => {
  const totalUsers = users.length;
  const verifiedUsers = users.filter(u => u.email_verified_at).length;
  const usersWithRoles = users.filter(u => u.roles && u.roles.length > 0).length;
  const usersWithPermissions = users.filter(u => u.permissions && u.permissions.length > 0).length;
  const usersWithStores = users.filter(u => u.stores && u.stores.length > 0).length;
  
  const totalRoleAssignments = users.reduce((sum, user) => sum + (user.roles?.length || 0), 0);
  const totalPermissionAssignments = users.reduce((sum, user) => sum + (user.permissions?.length || 0), 0);
  const avgRolesPerUser = totalUsers > 0 ? totalRoleAssignments / totalUsers : 0;
  const avgPermissionsPerUser = totalUsers > 0 ? totalPermissionAssignments / totalUsers : 0;
  
  return {
    totalUsers,
    verifiedUsers,
    unverifiedUsers: totalUsers - verifiedUsers,
    verificationRate: totalUsers > 0 ? (verifiedUsers / totalUsers) * 100 : 0,
    usersWithRoles,
    usersWithPermissions,
    usersWithStores,
    usersWithoutRoles: totalUsers - usersWithRoles,
    avgRolesPerUser: Math.round(avgRolesPerUser * 100) / 100,
    avgPermissionsPerUser: Math.round(avgPermissionsPerUser * 100) / 100,
  };
};

/**
 * Utility to generate password suggestions
 * @param userName - User name for personalization
 * @returns Array of suggested passwords
 */
export const generatePasswordSuggestions = (): string[] => {
  const adjectives = ['Swift', 'Bright', 'Bold', 'Quick', 'Smart', 'Strong'];
  const nouns = ['Tiger', 'Eagle', 'Storm', 'Star', 'Wave', 'Fire'];
  const numbers = ['123', '456', '789', '321', '654', '987'];
  const symbols = ['!', '@', '#', '$', '%', '&'];
  
  const suggestions: string[] = [];
  
  for (let i = 0; i < 3; i++) {
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const number = numbers[Math.floor(Math.random() * numbers.length)];
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    
    suggestions.push(`${adjective}${noun}${number}${symbol}`);
  }
  
  return suggestions;
};
