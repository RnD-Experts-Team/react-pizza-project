// User Management Types

// Base interfaces
export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot?: {
    role_id?: number;
    permission_id?: number;
    model_type?: string;
    model_id?: number;
  };
  roles?: Role[];
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  pivot?: {
    model_type?: string;
    model_id?: number;
    role_id?: number;
    permission_id?: number;
  };
  permissions?: Permission[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  roles: Role[];
  permissions: Permission[];
}

// Pagination interfaces
export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginationMeta {
  current_page: number;
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
}

export interface PaginatedResponse<T> extends PaginationMeta {
  data: T[];
}

// API Response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface UsersResponse extends ApiResponse<PaginatedResponse<User>> {}
export interface RolesResponse extends ApiResponse<PaginatedResponse<Role>> {}
export interface PermissionsResponse extends ApiResponse<PaginatedResponse<Permission>> {}

export interface UserResponse extends ApiResponse<{ user: User }> {}
export interface RoleResponse extends ApiResponse<{ role: Role }> {}
export interface PermissionResponse extends ApiResponse<{ permission: Permission }> {}

// Form interfaces
export interface CreateUserForm {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  roles: string[];
  permissions: string[];
}

export interface UpdateUserForm {
  name: string;
  roles: string[];
  permissions: string[];
}

export interface CreateRoleForm {
  name: string;
  guard_name: string;
  permissions: string[];
}

export interface CreatePermissionForm {
  name: string;
  guard_name: string;
}

export interface AssignRolesForm {
  roles: string[];
}

export interface AssignPermissionsForm {
  permissions: string[];
}

// Query parameters
export interface UsersQueryParams {
  per_page?: number;
  search?: string;
  role?: string;
  page?: number;
}

// Error response
export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// User Management State
export interface UserManagementState {
  users: User[];
  roles: Role[];
  permissions: Permission[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
}

// Filter and search options
export interface UserFilters {
  search: string;
  role: string;
  perPage: number;
}

export interface UserManagementTab {
  id: 'users' | 'roles' | 'permissions';
  label: string;
  count?: number;
}