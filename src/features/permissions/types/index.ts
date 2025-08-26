/**
 * Permissions Domain Types
 * 
 * This file contains all TypeScript interfaces and types related to permissions management.
 * It defines the data structures used throughout the permissions feature, ensuring type safety
 * and providing clear contracts for API responses, component props, and state management.
 */

// Base permission entity from API
export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  roles?: PermissionRole[];
}

// Role data nested within permission responses
export interface PermissionRole {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot: {
    permission_id: number;
    role_id: number;
  };
}

// API response types for permissions endpoints
export interface GetPermissionsResponse {
  success: boolean;
  data: {
    current_page: number;
    data: Permission[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

export interface CreatePermissionResponse {
  success: boolean;
  message: string;
  data: {
    permission: Permission;
  };
}

// Pagination link structure
export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

// Request payload types
export interface CreatePermissionRequest {
  name: string;
  guard_name: string;
}

// Form data types for UI components
export interface PermissionFormData {
  name: string;
  guard_name: string;
}

// Redux state types
export interface PermissionsState {
  permissions: Permission[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    from: number;
    to: number;
  } | null;
  createLoading: boolean;
  createError: string | null;
}

// API Error response structure
export interface ApiErrorResponse {
  message: string;
  errors?: {
    [key: string]: string[];
  };
}

// Common error types for better error handling
export type PermissionError = 
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'PERMISSION_EXISTS'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

// Error with additional context
export interface PermissionErrorDetails {
  type: PermissionError;
  message: string;
  field?: string;
  statusCode?: number;
}

// Query parameters for fetching permissions
export interface GetPermissionsParams {
  page?: number;
  per_page?: number;
  search?: string;
}

// Hook return types for consistent API across custom hooks
export interface UsePermissionsReturn {
  permissions: Permission[];
  loading: boolean;
  error: string | null;
  pagination: PermissionsState['pagination'];
  fetchPermissions: (params?: GetPermissionsParams) => Promise<void>;
  refetch: () => Promise<void>;
}

export interface UseCreatePermissionReturn {
  createPermission: (data: CreatePermissionRequest) => Promise<Permission>;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

// Utility types for component props
export interface PermissionSelectOption {
  value: number;
  label: string;
  permission: Permission;
}

// Filter and sort options
export type PermissionSortField = 'name' | 'created_at' | 'updated_at';
export type SortDirection = 'asc' | 'desc';

export interface PermissionFilters {
  search?: string;
  sortField?: PermissionSortField;
  sortDirection?: SortDirection;
}

// Component prop types
export interface PermissionListProps {
  onEdit?: (permission: Permission) => void;
  onDelete?: (permission: Permission) => void;
  selectable?: boolean;
  selectedIds?: number[];
  onSelectionChange?: (selectedIds: number[]) => void;
}

export interface PermissionFormProps {
  initialData?: Partial<PermissionFormData>;
  onSubmit: (data: PermissionFormData) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  error?: string | null;
}

// Constants for guard names and validation
export const GUARD_NAMES = {
  WEB: 'web',
  API: 'api',
} as const;

export type GuardName = typeof GUARD_NAMES[keyof typeof GUARD_NAMES];

// Validation constraints
export const PERMISSION_VALIDATION = {
  NAME_MIN_LENGTH: 3,
  NAME_MAX_LENGTH: 255,
  REQUIRED_FIELDS: ['name', 'guard_name'] as const,
} as const;
