/**
 * Users Domain Types
 * 
 * This file contains all TypeScript interfaces and types related to users management.
 * It defines the data structures used throughout the users feature, ensuring type safety
 * and providing clear contracts for API responses, component props, and state management.
 * This domain is more complex as users have relationships with roles, permissions, and stores.
 */

// Base user entity from API
export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  roles?: UserRole[];
  permissions?: UserPermission[];
  stores?: UserStore[];
}

// Role data nested within user responses
export interface UserRole {
  id: number;
  name: string;
  permissions?: Array<{
    id: number;
    name: string;
  }>;
}

// Permission data nested within user responses
export interface UserPermission {
  id: number;
  name: string;
}

// Store data nested within user responses
export interface UserStore {
  store: {
    id: string;
    name: string;
  };
  roles: Array<{
    id: number;
    name: string;
    permissions: Array<{
      id: number;
      name: string;
    }>;
  }>;
}

// API response types for users endpoints
export interface GetUsersResponse {
  success: boolean;
  data: {
    current_page: number;
    data: User[];
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

export interface CreateUserResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export interface GetUserByIdResponse {
  success: boolean;
  data: {
    user: User;
  };
}

export interface UpdateUserResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export interface DeleteUserResponse {
  success: boolean;
  message: string;
}

export interface AssignRolesToUserResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export interface GivePermissionsToUserResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

// Pagination link structure
export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

// Request payload types
export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  roles: string[]; // Array of role names
  permissions: string[]; // Array of permission names
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  roles?: string[]; // Array of role names
  permissions?: string[]; // Array of permission names
}

export interface AssignRolesRequest {
  roles: string[]; // Array of role names
}

export interface GivePermissionsRequest {
  permissions: string[]; // Array of permission names
}

// Form data types for UI components
export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  roles: string[];
  permissions: string[];
}

// Redux state types
export interface UsersState {
  users: User[];
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
  perPage: number; // Current per_page setting
  createLoading: boolean;
  createError: string | null;
  updateLoading: boolean;
  updateError: string | null;
  deleteLoading: boolean;
  deleteError: string | null;
  assignRolesLoading: boolean;
  assignRolesError: string | null;
  givePermissionsLoading: boolean;
  givePermissionsError: string | null;
  selectedUserId: number | null;
  searchTerm: string;
  filters: UserFilters;
}

// API Error response structure
export interface ApiErrorResponse {
  message: string;
  errors?: {
    [key: string]: string[];
  };
}

// Common error types for better error handling
export type UserError = 
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'USER_EXISTS'
  | 'USER_NOT_FOUND'
  | 'ROLE_NOT_FOUND'
  | 'PERMISSION_NOT_FOUND'
  | 'EMAIL_TAKEN'
  | 'WEAK_PASSWORD'
  | 'PASSWORD_MISMATCH'
  | 'CANNOT_DELETE_USER'
  | 'NETWORK_ERROR'
  | 'UNKNOWN_ERROR';

// Error with additional context
export interface UserErrorDetails {
  type: UserError;
  message: string;
  field?: string;
  statusCode?: number;
}

// Query parameters for fetching users
export interface GetUsersParams {
  page?: number;
  per_page?: number;
  search?: string;
  role?: string;
}

// Hook return types for consistent API across custom hooks
export interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  pagination: UsersState['pagination'];
  perPage: number;
  setPerPage: (perPage: number) => void;
  fetchUsers: (params?: GetUsersParams) => Promise<void>;
  refetch: () => Promise<void>;
}

export interface UseCreateUserReturn {
  createUser: (data: CreateUserRequest) => Promise<User>;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

export interface UseUpdateUserReturn {
  updateUser: (userId: number, data: UpdateUserRequest) => Promise<User>;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

export interface UseDeleteUserReturn {
  deleteUser: (userId: number) => Promise<void>;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

export interface UseAssignRolesReturn {
  assignRoles: (userId: number, roles: string[]) => Promise<User>;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

export interface UseGivePermissionsReturn {
  givePermissions: (userId: number, permissions: string[]) => Promise<User>;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

// Utility types for component props
export interface UserSelectOption {
  value: number;
  label: string;
  user: User;
}

// Filter and sort options
export type UserSortField = 'name' | 'email' | 'created_at' | 'updated_at' | 'role_count' | 'permission_count';
export type SortDirection = 'asc' | 'desc';

export interface UserFilters {
  search?: string;
  sortField?: UserSortField;
  sortDirection?: SortDirection;
  hasRoles?: boolean;
  hasPermissions?: boolean;
  roleNames?: string[];
  permissionNames?: string[];
  emailVerified?: boolean;
  storeIds?: string[];
}

// Component prop types
export interface UserListProps {
  onEdit?: (user: User) => void;
  onDelete?: (user: User) => void;
  onAssignRoles?: (user: User) => void;
  onGivePermissions?: (user: User) => void;
  onViewDetails?: (user: User) => void;
  selectable?: boolean;
  selectedIds?: number[];
  onSelectionChange?: (selectedIds: number[]) => void;
}

export interface UserFormProps {
  initialData?: Partial<UserFormData>;
  onSubmit: (data: UserFormData) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  error?: string | null;
  availableRoles?: Array<{ value: string; label: string }>;
  availablePermissions?: Array<{ value: string; label: string }>;
  isEdit?: boolean;
}

export interface RoleAssignmentProps {
  userId: number;
  currentRoles?: string[];
  availableRoles?: Array<{ value: string; label: string }>;
  onAssign: (roles: string[]) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  error?: string | null;
}

export interface PermissionAssignmentProps {
  userId: number;
  currentPermissions?: string[];
  availablePermissions?: Array<{ value: string; label: string }>;
  onAssign: (permissions: string[]) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
  error?: string | null;
}

// Constants for validation
export const USER_VALIDATION = {
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 255,
  EMAIL_MAX_LENGTH: 255,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 255,
  REQUIRED_FIELDS: ['name', 'email'] as const,
  MAX_ROLES_PER_USER: 10,
  MAX_PERMISSIONS_PER_USER: 50,
} as const;

// Enhanced user types for detailed views
export interface UserDetails extends User {
  role_count: number;
  permission_count: number;
  store_count: number;
  last_login?: string;
  is_active: boolean;
  can_edit: boolean;
  can_delete: boolean;
  total_permissions: number; // Including permissions from roles
}

// User management types
export interface UserAssignment {
  userId: number;
  userName: string;
  userEmail: string;
  assignedAt: string;
  assignedBy?: string;
  type: 'role' | 'permission' | 'store';
  assignmentId: string | number;
  assignmentName: string;
}

export interface BulkUserOperation {
  userIds: number[];
  operation: 'assign_roles' | 'revoke_roles' | 'give_permissions' | 'revoke_permissions' | 'delete' | 'activate' | 'deactivate';
  targetRoles?: string[];
  targetPermissions?: string[];
}

// User activity tracking
export interface UserActivity {
  userId: number;
  userName: string;
  activity: string;
  timestamp: string;
  details?: Record<string, any>;
}

// Search and filtering types
export interface UserSearchResult {
  id: number;
  title: string;
  subtitle: string;
  meta: string;
  user: User;
}

export interface UserFilterState {
  search: string;
  sortField: UserSortField;
  sortDirection: SortDirection;
  showOnlyVerified: boolean;
  showOnlyWithRoles: boolean;
  showOnlyWithPermissions: boolean;
  selectedRoleNames: string[];
  selectedPermissionNames: string[];
  selectedStoreIds: string[];
}

// Export formats
export interface UserCsvData {
  ID: number;
  Name: string;
  Email: string;
  'Email Verified': string;
  'Role Count': number;
  'Permission Count': number;
  'Store Count': number;
  'Role Names': string;
  'Permission Names': string;
  'Created At': string;
  'Updated At': string;
}

// API endpoint configuration
export const USERS_API_ENDPOINTS = {
  GET_ALL: '/users',
  CREATE: '/users',
  GET_BY_ID: (id: number) => `/users/${id}`,
  UPDATE: (id: number) => `/users/${id}`,
  DELETE: (id: number) => `/users/${id}`,
  ASSIGN_ROLES: (id: number) => `/users/${id}/roles/assign`,
  REVOKE_ROLES: (id: number) => `/users/${id}/roles/revoke`,
  GIVE_PERMISSIONS: (id: number) => `/users/${id}/permissions/give`,
  REVOKE_PERMISSIONS: (id: number) => `/users/${id}/permissions/revoke`,
} as const;

// User status types
export type UserStatus = 'active' | 'inactive' | 'pending_verification' | 'suspended';

// User role summary for analytics
export interface UserRoleSummary {
  userId: number;
  userName: string;
  userEmail: string;
  roleCount: number;
  permissionCount: number;
  totalEffectivePermissions: number;
  roles: Array<{
    id: number;
    name: string;
    permissionCount: number;
  }>;
  directPermissions: Array<{
    id: number;
    name: string;
  }>;
}

// Password policy types
export interface PasswordPolicy {
  minLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumbers: boolean;
  requireSpecialChars: boolean;
  forbiddenPasswords?: string[];
}
