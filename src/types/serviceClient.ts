// Service Client Management Types

// Base interfaces
export interface ServiceClient {
  id: number;
  name: string;
  token_hash: string;
  is_active: boolean;
  expires_at: string | null;
  notes: string;
  created_at: string;
  updated_at: string;
  last_used_at: string | null;
  use_count: number;
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

export interface ServiceClientsResponse extends ApiResponse<PaginatedResponse<ServiceClient>> {}

export interface ServiceClientResponse extends ApiResponse<{ service: ServiceClient }> {}

export interface CreateServiceClientResponse extends ApiResponse<{
  service: ServiceClient;
  token: string;
}> {}

export interface RotateTokenResponse extends ApiResponse<{
  service: ServiceClient;
  token: string;
}> {}

// Form interfaces
export interface CreateServiceClientForm {
  name: string;
  is_active: boolean;
  expires_at: string | null;
  notes: string;
}

export interface RotateTokenForm {
  expires_at: string;
}

// Query parameters
export interface ServiceClientsQueryParams {
  per_page?: number;
  search?: string;
  page?: number;
}

// Error response
export interface ErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

// State management
export interface ServiceClientManagementState {
  serviceClients: ServiceClient[];
  loading: boolean;
  error: string | null;
  pagination: PaginationMeta | null;
}

// Filters
export interface ServiceClientFilters {
  search: string;
  perPage: number;
}

// Dialog states
export interface CreateServiceClientDialogState {
  open: boolean;
  loading: boolean;
}

export interface RotateTokenDialogState {
  open: boolean;
  loading: boolean;
  serviceClient: ServiceClient | null;
}

// Token display
export interface TokenDisplayData {
  token: string;
  serviceClient: ServiceClient;
}