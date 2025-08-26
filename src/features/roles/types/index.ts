/**
 * Roles Domain Types
 * 
 * This file contains all TypeScript interfaces and types related to roles management.
 * It defines the data structures used throughout the roles feature, ensuring type safety
 * and providing clear contracts for API responses, component props, and state management.
 */

// Base role entity from API
export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  permissions?: RolePermission[];
}

// Permission data nested within role responses
export interface RolePermission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot: {
    role_id: number;
    permission_id: number;
  };
}

// API response types for roles endpoints
export interface GetRolesResponse {
  success: boolean;
  data: {
    current_page: number;
    data: Role[];
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

export interface CreateRoleResponse {
  success: boolean;
  message: string;
  data: {
    role: Role;
  };
}

export interface AssignPermissionsToRoleResponse {
  success: boolean;
  message: string;
  data: {
    role: Role;
  };
}

// Pagination link structure (shared with permissions)
export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

// Request payload types
export interface CreateRoleRequest {
  name: string;
  guard_name: string;
  permissions: string[]; // Array of permission names
}

export interface AssignPermissionsRequest {
  permissions: string[]; // Array of permission names
}

// Form data types for UI components
export interface RoleFormData {
  name: string;
  guard_name: string;
  permissions: string[]; // Array of permission names or IDs
}

// Redux state types
export interface RolesState {
  roles: Role[];
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
  assignLoading: boolean;
  assignError: string | null;
  selectedRoleId: number | null;
}

// API Error response structure (shared with permissions)
export interface ApiErrorResponse {
  message: string;
  errors?: {
    [key: string]: string[];
  };
}

// Common error types for better error handling
export type RoleError = 
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'ROLE_EXISTS'
  | 'ROLE_NOT_FOUND'
  | 'PERMISSION_NOT_FOUND'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

// Error with additional context
export interface RoleErrorDetails {
  type: RoleError;
  message: string;
  field?: string;
  statusCode?: number;
}

// Query parameters for fetching roles
export interface GetRolesParams {
  page?: number;
  per_page?: number;
  search?: string;
}

// Hook return types for consistent API across custom hooks
export interface UseRolesReturn {
  roles: Role[];
  loading: boolean;
  error: string | null;
  pagination: RolesState['pagination'];
  fetchRoles: (params?: GetRolesParams) => Promise<void>;
  refetch: () => Promise<void>;
}

export interface UseCreateRoleReturn {
  createRole: (data: CreateRoleRequest) => Promise<Role>;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

export interface UseAssignPermissionsReturn {
  assignPermissions: (roleId: number, permissions: string[]) => Promise<Role>;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

// Utility types for component props
export interface RoleSelectOption {
  value: number;
  label: string;
  role: Role;
}

// Filter and sort options
export type RoleSortField = 'name' | 'created_at' | 'updated_at' | 'permission_count';
export type SortDirection = 'asc' | 'desc';

export interface RoleFilters {
  search?: string;
  sortField?: RoleSortField;
  sortDirection?: SortDirection;
  hasPermissions?: boolean;
  permissionIds?: number[];
}

// Component prop types
export interface RoleListProps {
  onEdit?: (role: Role) => void;
  onDelete?: (role: Role) => void;
  onAssignPermissions?: (role: Role) => void;
  selectable?: boolean;
  selectedIds?: number[];
  onSelectionChange?: (selectedIds: number[]) => void;
}

export interface RoleFormProps {
  initialData?: Partial<RoleFormData>;
  onSubmit: (data: RoleFormData) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  error?: string | null;
  availablePermissions?: Array<{ value: string; label: string }>;
}

export interface PermissionAssignmentProps {
  roleId: number;
  currentPermissions?: string[];
  availablePermissions?: Array<{ value: string; label: string }>;
  onAssign: (permissions: string[]) => Promise<void>;
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
export const ROLE_VALIDATION = {
  NAME_MIN_LENGTH: 3,
  NAME_MAX_LENGTH: 255,
  REQUIRED_FIELDS: ['name', 'guard_name'] as const,
  MAX_PERMISSIONS_PER_ROLE: 50,
} as const;

// Role-specific utility types
export interface RoleWithPermissionCount extends Role {
  permission_count: number;
}

export interface RolePermissionSummary {
  roleId: number;
  roleName: string;
  permissionCount: number;
  permissions: Array<{
    id: number;
    name: string;
  }>;
}

// Extended role data for detailed views
export interface RoleDetails extends Role {
  permission_count: number;
  users_count?: number;
  last_assigned?: string;
  can_edit: boolean;
  can_delete: boolean;
}

// Role assignment/management types
export interface RoleAssignment {
  roleId: number;
  roleName: string;
  assignedAt: string;
  assignedBy?: string;
}

export interface BulkRoleOperation {
  roleIds: number[];
  operation: 'assign' | 'revoke' | 'delete';
  targetId?: number; // For user assignments
  permissions?: string[]; // For permission assignments
}

// Permission changes tracking
export interface PermissionChange {
  permissionId: number;
  permissionName: string;
  action: 'added' | 'removed';
  timestamp: string;
}

export interface RolePermissionHistory {
  roleId: number;
  roleName: string;
  changes: PermissionChange[];
  lastModified: string;
  modifiedBy?: string;
}

// Search and filtering types
export interface RoleSearchResult {
  id: number;
  title: string;
  subtitle: string;
  meta: string;
  role: Role;
}

export interface RoleFilterState {
  search: string;
  sortField: RoleSortField;
  sortDirection: SortDirection;
  showOnlyWithPermissions: boolean;
  selectedPermissionIds: number[];
}

// Export formats
export interface RoleCsvData {
  ID: number;
  Name: string;
  'Guard Name': string;
  'Permission Count': number;
  'Permission Names': string;
  'Created At': string;
  'Updated At': string;
}

// API endpoint configuration
export const ROLES_API_ENDPOINTS = {
  GET_ALL: '/roles',
  CREATE: '/roles',
  GET_BY_ID: (id: number) => `/roles/${id}`,
  UPDATE: (id: number) => `/roles/${id}`,
  DELETE: (id: number) => `/roles/${id}`,
  ASSIGN_PERMISSIONS: (id: number) => `/roles/${id}/permissions/assign`,
  REVOKE_PERMISSIONS: (id: number) => `/roles/${id}/permissions/revoke`,
} as const;
