// src/features/statuses/types/index.ts

/**
 * Core Status entity interface representing the data structure
 * returned by the API for individual status records
 */
export interface Status {
  id: number;
  description: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

/**
 * Request payload interface for creating a new status
 * Maps to the backend validation rules:
 * - description: required|string
 * - slug: nullable|string|max:255|unique:positions,slug
 */
export interface CreateStatusRequest {
  description: string;
  slug?: string; // Optional as per backend validation (nullable)
}

/**
 * Request payload interface for updating an existing status
 * Maps to the backend validation rules:
 * - description: required|string
 * - slug: nullable|string|max:255|unique with ignore current ID
 */
export interface UpdateStatusRequest {
  description: string;
  slug?: string; // Optional as per backend validation (nullable)
}

/**
 * API response interface for single status operations
 * Used for create, read single, and update operations
 */
export interface StatusResponse {
  id: number;
  description: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

/**
 * API response interface for fetching all statuses
 * Returns an array of status objects
 */
export type StatusListResponse = Status[];

/**
 * Const assertion for different types of status-related operations
 * Useful for tracking which operation failed in error handling
 */
export const STATUS_OPERATION = {
  FETCH_ALL: 'FETCH_ALL',
  FETCH_BY_ID: 'FETCH_BY_ID',
  CREATE: 'CREATE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE'
} as const;

/**
 * Type derived from the const assertion above
 */
export type StatusOperation = typeof STATUS_OPERATION[keyof typeof STATUS_OPERATION];

/**
 * Generic API error interface for consistent error handling
 * across all status operations
 */
export interface StatusApiError {
  message: string;
  status?: number;
  operation: StatusOperation;
  details?: string;
  timestamp: string;
}

/**
 * Redux state interface for the statuses feature
 * Provides normalized state structure with loading and error states
 */
export interface StatusesState {
  // Normalized data storage - entities stored by ID for efficient lookups
  entities: Record<number, Status>;
  // Array of IDs to maintain order and enable easy iteration
  ids: number[];
  
  // Loading states for different operations
  loading: {
    fetchAll: boolean;
    fetchById: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  
  // Error states for different operations
  errors: {
    fetchAll: string | null;
    fetchById: string | null;
    create: string | null;
    update: string | null;
    delete: string | null;
  };
  
  // Metadata
  lastFetched: string | null;
  total: number;
}

/**
 * Success response wrapper for operations that return data
 */
export interface ApiSuccessResponse<T> {
  data: T;
  success: true;
}

/**
 * Error response wrapper for failed operations
 */
export interface ApiErrorResponse {
  message: string;
  success: false;
  status?: number;
  details?: unknown;
}

/**
 * Union type for API responses
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Parameters interface for update operations
 * Combines ID with update payload
 */
export interface UpdateStatusParams {
  id: number;
  data: UpdateStatusRequest;
}

/**
 * Parameters interface for delete operations
 */
export interface DeleteStatusParams {
  id: number;
}

/**
 * Type guard to check if a response is successful
 */
export const isApiSuccessResponse = <T>(
  response: ApiResponse<T>
): response is ApiSuccessResponse<T> => {
  return response.success === true;
};

/**
 * Type guard to check if a response is an error
 */
export const isApiErrorResponse = <T>(
  response: ApiResponse<T>
): response is ApiErrorResponse => {
  return response.success === false;
};

/**
 * Validation error interface for form validation
 * Maps to Laravel validation error structure
 */
export interface ValidationErrors {
  description?: string[];
  slug?: string[];
}

/**
 * Enhanced error interface that includes validation errors
 */
export interface StatusValidationError extends StatusApiError {
  validationErrors?: ValidationErrors;
}

/**
 * Const assertion for HTTP status codes for better error handling
 */
export const HTTP_STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500
} as const;

/**
 * Type derived from the const assertion above
 */
export type HttpStatusCode = typeof HTTP_STATUS_CODE[keyof typeof HTTP_STATUS_CODE];

/**
 * Request configuration interface for API calls
 */
export interface StatusApiConfig {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}
