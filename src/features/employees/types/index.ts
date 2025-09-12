/**
 * Employee Management Types
 *
 * This file contains all TypeScript type definitions for the employee management system.
 * It includes comprehensive interfaces for API requests, responses, and state management.
 */

// ============================================================================
// Core Entity Types
// ============================================================================

/**
 * Store information associated with an employee
 */
export interface Store {
  id: string;
  name: string;
  number: string;
  created_at: string;
  updated_at: string;
}

/**
 * Pivot table data for employee-skill relationships
 */
export interface SkillPivot {
  emp_info_id: number;
  skill_id: number;
  rating: SkillRating;
  created_at: string;
  updated_at: string;
}

/**
 * Skill information with rating pivot data
 */
export interface Skill {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
  pivot: SkillPivot;
}

/**
 * Schedule preference information for an employee
 */
export interface SchedulePreference {
  id: number;
  emp_info_id: number;
  preference_id: number;
  maximum_hours: number;
  employment_type: string;
  created_at: string;
  updated_at: string;
}

/**
 * Employment information for an employee
 */
export interface EmploymentInfo {
  id: number;
  emp_info_id: number;
  position_id: number;
  paychex_ids: string[];
  employment_type: string;
  hired_date: string;
  base_pay: string;
  performance_pay: string;
  has_uniform: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Complete employee information including all related data
 */
export interface Employee {
  id: number;
  store_id: string;
  full_name: string;
  date_of_birth: string;
  has_family: boolean;
  has_car: boolean;
  is_arabic_team: boolean;
  notes: string | null;
  status: EmployeeStatus;
  created_at: string;
  updated_at: string;
  store: Store;
  skills: Skill[];
  schedule_preferences: SchedulePreference[];
  employment_info: EmploymentInfo | null;
}

// ============================================================================
// Enum Types and Literals
// ============================================================================

export type EmployeeStatus = 'Active' | 'Suspension' | 'Terminated' | 'On Leave';

export type SkillRating = 'A+' | 'A' | 'B' | 'C' | 'D';

// ============================================================================
// Pagination Types
// ============================================================================

/**
 * Pagination options for API requests
 */
export interface PaginationOptions {
  page?: number;
  per_page?: number;
}

/**
 * Enhanced pagination state with per_page support
 */
export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  perPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  availablePerPageOptions: number[];
  // Additional store context for pagination
  currentStoreId?: string;
}

// ============================================================================
// API Request Types
// ============================================================================

export interface CreateEmployeeRequest {
  store_id: string;
  full_name: string;
  date_of_birth: string;
  has_family: boolean;
  has_car: boolean;
  is_arabic_team: boolean;
  notes?: string;
  status: EmployeeStatus;
}

export interface UpdateEmployeeRequest extends CreateEmployeeRequest {}

export interface AttachSkillRequest {
  rating: SkillRating;
}

export interface UpdateSkillRequest extends AttachSkillRequest {}

// ============================================================================
// API Response Types
// ============================================================================

export interface CreateEmployeeResponse {
  id: number;
  store_id: string;
  full_name: string;
  date_of_birth: string;
  has_family: boolean;
  has_car: boolean;
  is_arabic_team: boolean;
  notes: string | null;
  status: EmployeeStatus;
  created_at: string;
  updated_at: string;
}

export interface UpdateEmployeeResponse extends CreateEmployeeResponse {}

export type GetAllEmployeesResponse = Employee[];

export type GetEmployeeByIdResponse = Employee;

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

export interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface GetEmployeesByStoreResponse {
  current_page: number;
  data: Employee[];
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
// Error Types
// ============================================================================

export interface ApiError {
  message: string;
  status?: number;
  details?: Record<string, any>;
}

export interface ValidationError extends ApiError {
  errors: Record<string, string[]>;
}

export interface AuthError extends ApiError {
  type: 'UNAUTHORIZED' | 'TOKEN_EXPIRED' | 'FORBIDDEN';
}

export interface NetworkError extends ApiError {
  type: 'NETWORK_ERROR' | 'TIMEOUT' | 'CONNECTION_FAILED';
}

export interface ServerError extends ApiError {
  type: 'INTERNAL_SERVER_ERROR' | 'SERVICE_UNAVAILABLE';
}

export interface GenericError extends ApiError {
  // No additional properties needed - inherits from base ApiError
}

export type ApiErrorType = ValidationError | AuthError | NetworkError | ServerError | GenericError;

// ============================================================================
// Redux State Types
// ============================================================================

export interface LoadingState {
  isLoading: boolean;
  operation?: string;
}

export interface ErrorState {
  hasError: boolean;
  message?: string;
  details?: ApiErrorType;
}

export interface EmployeesState {
  employees: Employee[];
  currentEmployee: Employee | null;
  loading: {
    fetchAll: LoadingState;
    fetchById: LoadingState;
    create: LoadingState;
    update: LoadingState;
    delete: LoadingState;
    skills: LoadingState;
    fetchByStore: LoadingState;
  };
  errors: {
    fetchAll: ErrorState;
    fetchById: ErrorState;
    create: ErrorState;
    update: ErrorState;
    delete: ErrorState;
    skills: ErrorState;
    fetchByStore: ErrorState;
  };
  pagination: PaginationState;
  cache: {
    lastFetch: number | null;
    cacheDuration: number;
    isStale: boolean;
  };
}

// ============================================================================
// Utility Types and Type Guards
// ============================================================================

export type Partial<T> = {
  [P in keyof T]?: T[P];
};

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export const isValidationError = (error: any): error is ValidationError => {
  return error && typeof error === 'object' && 'errors' in error && typeof error.errors === 'object';
};

export const isAuthError = (error: any): error is AuthError => {
  return error && typeof error === 'object' && 'type' in error &&
         ['UNAUTHORIZED', 'TOKEN_EXPIRED', 'FORBIDDEN'].includes(error.type);
};

export const isNetworkError = (error: any): error is NetworkError => {
  return error && typeof error === 'object' && 'type' in error &&
         ['NETWORK_ERROR', 'TIMEOUT', 'CONNECTION_FAILED'].includes(error.type);
};

export const isGenericError = (error: any): error is GenericError => {
  return error && typeof error === 'object' && 'message' in error && 
         !('type' in error) && !('errors' in error);
};

export const hasEmploymentInfo = (employee: Employee): employee is Employee & { employment_info: EmploymentInfo } => {
  return employee.employment_info !== null;
};

export const isPaginatedResponse = (response: any): response is GetEmployeesByStoreResponse => {
  return response && typeof response === 'object' && 'data' in response && 'current_page' in response;
};

// ============================================================================
// Form Types
// ============================================================================

export interface EmployeeFormData {
  store_id: string;
  full_name: string;
  date_of_birth: string;
  has_family: boolean;
  has_car: boolean;
  is_arabic_team: boolean;
  notes: string;
  status: EmployeeStatus;
}

export interface EmployeeFormErrors {
  store_id?: string;
  full_name?: string;
  date_of_birth?: string;
  has_family?: string;
  has_car?: string;
  is_arabic_team?: string;
  notes?: string;
  status?: string;
  general?: string;
}

export interface SkillFormData {
  employeeId: number;
  skillId: number;
  rating: SkillRating;
}

export interface SkillFormErrors {
  rating?: string;
  general?: string;
}

// ============================================================================
// Hook Return Types
// ============================================================================

export interface UseEmployeesReturn {
  employees: Employee[];
  currentEmployee: Employee | null;
  loading: EmployeesState['loading'];
  errors: EmployeesState['errors'];
  pagination: PaginationState;
  actions: {
    // Core CRUD operations
    fetchAllEmployees: () => Promise<void>;
    fetchEmployeeById: (id: number) => Promise<void>;
    createEmployee: (data: CreateEmployeeRequest) => Promise<Employee | null>;
    updateEmployee: (id: number, data: UpdateEmployeeRequest) => Promise<Employee | null>;
    deleteEmployee: (id: number) => Promise<boolean>;
    
    // Store-specific operations with pagination
    fetchEmployeesByStore: (storeId: string, options?: PaginationOptions) => Promise<void>;
    
    // Pagination control methods
    changePerPage: (perPage: number) => Promise<void>;
    goToPage: (page: number) => Promise<void>;
    nextPage: () => Promise<void>;
    prevPage: () => Promise<void>;
    
    // Skill management operations
    attachSkill: (employeeId: number, skillId: number, data: AttachSkillRequest) => Promise<boolean>;
    updateSkill: (employeeId: number, skillId: number, data: UpdateSkillRequest) => Promise<boolean>;
    detachSkill: (employeeId: number, skillId: number) => Promise<boolean>;
    
    // Utility methods
    clearCurrentEmployee: () => void;
    clearError: (errorType: keyof EmployeesState['errors']) => void;
    clearAllErrors: () => void;
    refreshEmployees: () => Promise<void>;
  };
}

// ============================================================================
// Constants
// ============================================================================

export const EMPLOYEE_STATUSES: EmployeeStatus[] = ['Active', 'Suspension', 'Terminated', 'On Leave'];

export const SKILL_RATINGS: SkillRating[] = ['A+', 'A', 'B', 'C', 'D'];

export const DEFAULT_CACHE_DURATION = 5 * 60 * 1000;

export const DEFAULT_PAGINATION: PaginationState = {
  currentPage: 1,
  totalPages: 1,
  totalRecords: 0,
  perPage: 15,
  hasNextPage: false,
  hasPrevPage: false,
  availablePerPageOptions: [10, 15, 25, 50, 100],
  currentStoreId: undefined,
};

export const API_ENDPOINTS = {
  EMPLOYEES: '/api/employees',
  EMPLOYEE_BY_ID: (id: number) => `/api/employees/${id}`,
  EMPLOYEES_BY_STORE: (storeId: string) => `/api/stores/${storeId}/employees`,
  EMPLOYEE_SKILL: (employeeId: number, skillId: number) => `/api/employees/${employeeId}/skills/${skillId}`,
} as const;
