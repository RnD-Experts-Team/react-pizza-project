// Store Management Types

// Base interfaces
export interface StoreMetadata {
  address?: string;
  phone?: string;
  [key: string]: any;
}

export interface Store {
  id: string;
  name: string;
  metadata: StoreMetadata;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface StoreUser {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  roles?: any[];
  permissions?: any[];
}

export interface StoreRole {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  permissions?: any[];
}

// Pagination interfaces (reusing from userManagement pattern)
export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginationMeta {
  current_page: number;
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
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

// Specific API responses
export interface StoresResponse extends ApiResponse<PaginatedResponse<Store>> {}
export interface StoreResponse extends ApiResponse<{ store: Store }> {}
export interface StoreUsersResponse extends ApiResponse<{ users: StoreUser[] }> {}
export interface StoreRolesResponse extends ApiResponse<{ roles: StoreRole[] }> {}

// Form interfaces
export interface CreateStoreForm {
  id: string;
  name: string;
  metadata: StoreMetadata;
  is_active: boolean;
}

export interface UpdateStoreForm {
  name: string;
  metadata: StoreMetadata;
  is_active?: boolean;
}

// Query parameters
export interface StoresQueryParams {
  per_page?: number;
  search?: string;
  page?: number;
}

// Error response
export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// Redux state
export interface StoreManagementState {
  stores: Store[];
  currentStore: Store | null;
  storeUsers: StoreUser[];
  storeRoles: StoreRole[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
}

// Filters
export interface StoreFilters {
  search: string;
  perPage: number;
}

// Tab interface for store management
export interface StoreManagementTab {
  id: 'stores' | 'users' | 'roles';
  label: string;
  count?: number;
}