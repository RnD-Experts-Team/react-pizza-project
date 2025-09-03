/**
 * Comprehensive type definitions for Authorization Rules Management
 * 
 * This file contains all shared types used across the auth rules feature:
 * - Core AuthRule entity and related enums
 * - API request/response interfaces for all 5 endpoints
 * - Pagination, validation error, and generic API response types
 * - Redux state management types
 */

// ============================================================================
// CORE ENTITIES & ENUMS
// ============================================================================

/**
 * HTTP methods supported by auth rules
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD';

/**
 * Authorization requirement types - determines how permissions/roles are evaluated
 * @deprecated - Use separate permissions_any and permissions_all arrays instead
 */
export type AuthorizationType = 'any' | 'all';

/**
 * Core AuthRule entity as returned by the API
 */
export interface AuthRule {
  id: number;
  service: string;
  method: HttpMethod;
  path_dsl: string | null;
  path_regex: string | null;
  route_name: string | null;
  roles_any: string[] | null;
  permissions_any: string[] | null;
  permissions_all: string[] | null;
  is_active: boolean;
  priority: number;
  created_at: string;
  updated_at: string;
}

/**
 * Pagination link structure used in Laravel pagination
 */
export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

/**
 * Paginated response structure from Laravel API
 */
export interface PaginatedResponse<T> {
  current_page: number;
  data: T[];
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

// ============================================================================
// API REQUEST TYPES
// ============================================================================

/**
 * Query parameters for fetching auth rules (GET /api/v1/auth-rules)
 */
export interface FetchAuthRulesParams {
  service?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

/**
 * Base fields common to both path_dsl and route_name rule creation
 */
interface CreateAuthRuleBase {
  service: string;
  method: HttpMethod;
  priority?: number;
  is_active: boolean;
  // Authorization can be roles_any, permissions_any, or permissions_all
  // At least one must be provided
  roles_any?: string[];
  permissions_any?: string[];
  permissions_all?: string[];
}

/**
 * Create auth rule using path_dsl (dynamic path matching)
 */
export interface CreateAuthRuleWithPathDSL extends CreateAuthRuleBase {
  path_dsl: string;
  route_name?: never; // Ensures mutual exclusivity
}

/**
 * Create auth rule using route_name (named route matching)
 */
export interface CreateAuthRuleWithRouteName extends CreateAuthRuleBase {
  route_name: string;
  path_dsl?: never; // Ensures mutual exclusivity
}

/**
 * Union type for create auth rule requests - enforces either path_dsl OR route_name
 */
export type CreateAuthRuleRequest = CreateAuthRuleWithPathDSL | CreateAuthRuleWithRouteName;

/**
 * Test auth rule path matching request
 */
export interface TestAuthRuleRequest {
  path_dsl: string;
  test_path: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

/**
 * Generic successful API response wrapper
 */
export interface ApiSuccessResponse<T = any> {
  success: true;
  message?: string;
  data: T;
}

/**
 * Generic error API response wrapper
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: string;
  errors?: Record<string, string[]>; // Laravel validation errors
}

/**
 * Union type for all API responses
 */
export type ApiResponse<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Response for fetching auth rules (GET /api/v1/auth-rules)
 */
export type FetchAuthRulesResponse = ApiSuccessResponse<PaginatedResponse<AuthRule>>;

/**
 * Response for creating auth rules (POST /api/v1/auth-rules)
 */
export interface CreateAuthRuleResponseData {
  rule: AuthRule;
}
export type CreateAuthRuleResponse = ApiSuccessResponse<CreateAuthRuleResponseData>;

/**
 * Response for testing auth rules (POST /api/v1/auth-rules/test)
 */
export interface TestAuthRuleResponseData {
  path_dsl: string;
  path_regex: string;
  test_path: string;
  matches: boolean;
  compiled_successfully: boolean;
}
export type TestAuthRuleResponse = ApiSuccessResponse<TestAuthRuleResponseData>;

/**
 * Response for toggling auth rule status (POST /api/v1/auth-rules/{id}/toggle-status)
 */
export interface ToggleAuthRuleStatusResponseData {
  rule: AuthRule;
}
export type ToggleAuthRuleStatusResponse = ApiSuccessResponse<ToggleAuthRuleStatusResponseData>;

// ============================================================================
// ERROR HANDLING TYPES
// ============================================================================

/**
 * Structured validation error from Laravel (422 status)
 */
export interface ValidationError {
  field: string;
  messages: string[];
}

/**
 * Different types of API errors we need to handle
 */
export type ApiErrorType = 
  | 'validation'      // 422 - Validation errors
  | 'invalid_dsl'     // 400 - Invalid DSL syntax
  | 'unauthorized'    // 401 - Invalid/missing token
  | 'forbidden'       // 403 - Insufficient permissions
  | 'not_found'       // 404 - Resource not found
  | 'server_error'    // 500 - Internal server error
  | 'network_error'   // Network/connection issues
  | 'unknown';        // Catch-all for unexpected errors

/**
 * Standardized error object for consistent error handling across the app
 */
export interface StandardizedError {
  type: ApiErrorType;
  message: string;
  details?: string;
  validationErrors?: ValidationError[];
  statusCode?: number;
}

// ============================================================================
// REDUX STATE TYPES
// ============================================================================

/**
 * Loading states for different operations
 */
export interface LoadingStates {
  fetching: boolean;
  creating: boolean;
  testing: boolean;
  toggling: Record<number, boolean>; // Track toggle loading per rule ID
}

/**
 * Redux state for auth rules management
 */
export interface AuthRulesState {
  // Data
  rules: AuthRule[];
  pagination: Omit<PaginatedResponse<AuthRule>, 'data'> | null;
  testResult: TestAuthRuleResponseData | null;
  
  // UI State
  loading: LoadingStates;
  error: StandardizedError | null;
  successMessage: string | null;
  
  // Filters & Search
  filters: {
    service: string;
    search: string;
    currentPage: number;
    perPage: number;
  };
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * Type guard to check if response is successful
 */
export const isApiSuccessResponse = <T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> => {
  return response.success === true;
};

/**
 * Type guard to check if response is an error
 */
export const isApiErrorResponse = (
  response: ApiResponse
): response is ApiErrorResponse => {
  return response.success === false;
};

/**
 * Helper type to extract data type from API response
 */
export type ExtractApiData<T> = T extends ApiSuccessResponse<infer U> ? U : never;

/**
 * Form data structure for create rule forms
 */
export interface AuthRuleFormData {
  service: string;
  method: HttpMethod;
  pathType: 'dsl' | 'route'; // UI helper to toggle between path_dsl and route_name
  path_dsl?: string;
  route_name?: string;
  roles: string[];
  permissions_any: string[];
  permissions_all: string[];
  priority: number;
  is_active: boolean;
}

/**
 * Available options for dropdowns/selects
 */
export interface AuthRuleOptions {
  services: string[];
  methods: HttpMethod[];
  roles: string[];
  permissions: string[];
}
