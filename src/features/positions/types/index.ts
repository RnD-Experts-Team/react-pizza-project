/**
 * Position Management Types and Interfaces
 * 
 * This file contains all TypeScript interfaces, types, and enums
 * related to the Position entity and its API operations.
 */

/**
 * Core Position entity interface
 * Represents a position object as returned from the API
 */
export interface Position {
  /** Unique identifier for the position */
  id: number;
  /** Human-readable name of the position */
  name: string;
  /** URL-friendly slug for the position (optional) */
  slug: string | null;
  /** ISO 8601 timestamp when the position was created */
  created_at: string;
  /** ISO 8601 timestamp when the position was last updated */
  updated_at: string;
}

/**
 * Data Transfer Object for creating a new position
 * Used when sending data to the create position API endpoint
 */
export interface CreatePositionDto {
  /** Required name for the new position (max 255 characters) */
  name: string;
  /** Optional slug for the new position (max 255 characters, must be unique) */
  slug?: string;
}

/**
 * Data Transfer Object for updating an existing position
 * Used when sending data to the update position API endpoint
 */
export interface UpdatePositionDto {
  /** Required name for the position (max 255 characters) */
  name: string;
  /** Optional slug for the position (max 255 characters, must be unique except for current record) */
  slug?: string;
}

/**
 * API response wrapper for paginated position lists
 * Extends the basic Position array with pagination metadata
 */
export interface PositionsListResponse {
  /** Array of position objects */
  data: Position[];
  /** Current page number */
  current_page?: number;
  /** Total number of pages */
  last_page?: number;
  /** Number of items per page */
  per_page?: number;
  /** Total number of positions */
  total?: number;
}

/**
 * API response for single position operations (get, create, update)
 * Represents the response structure for individual position endpoints
 */
export interface PositionResponse {
  /** The position data */
  data?: Position;
  /** Optional success message */
  message?: string;
}

/**
 * Generic API error response structure
 * Standardized error format from the backend
 */
export interface ApiError {
  /** Human-readable error message */
  message: string;
  /** HTTP status code */
  status?: number;
  /** Detailed validation errors (field-specific) */
  errors?: Record<string, string[]>;
  /** Error code for programmatic handling */
  code?: string;
}

/**
 * Position validation error type
 * Specific validation errors for position fields
 */
export interface PositionValidationErrors {
  /** Name field validation errors */
  name?: string[];
  /** Slug field validation errors */
  slug?: string[];
}

/**
 * Redux state interface for position management
 * Defines the shape of the positions slice state
 */
export interface PositionsState {
  /** Array of all loaded positions */
  positions: Position[];
  /** Currently selected/viewed position */
  selectedPosition: Position | null;
  /** Loading state for async operations */
  loading: {
    /** Loading state for fetching positions list */
    list: boolean;
    /** Loading state for fetching single position */
    single: boolean;
    /** Loading state for creating position */
    create: boolean;
    /** Loading state for updating position */
    update: boolean;
    /** Loading state for deleting position */
    delete: boolean;
  };
  /** Error states for different operations */
  error: {
    /** Error for fetching positions list */
    list: string | null;
    /** Error for fetching single position */
    single: string | null;
    /** Error for creating position */
    create: string | null;
    /** Error for updating position */
    update: string | null;
    /** Error for deleting position */
    delete: string | null;
  };
  /** Pagination metadata */
  pagination: {
    /** Current page number */
    currentPage: number;
    /** Total number of pages */
    totalPages: number;
    /** Number of items per page */
    perPage: number;
    /** Total number of positions */
    total: number;
  };
  /** Additional UI state flags */
  ui: {
    /** Whether the create modal/form is open */
    isCreateModalOpen: boolean;
    /** Whether the edit modal/form is open */
    isEditModalOpen: boolean;
    /** ID of position being deleted (for confirmation dialogs) */
    deletingId: number | null;
  };
}

/**
 * Query parameters for fetching positions list
 * Used for filtering, searching, and pagination
 */
export interface PositionsQueryParams {
  /** Number of items per page */
  per_page?: number;
  /** Current page number */
  page?: number;
  /** Search query string */
  search?: string;
  /** Sort field */
  sort_by?: 'name' | 'created_at' | 'updated_at';
  /** Sort direction */
  sort_order?: 'asc' | 'desc';
}

/**
 * Async thunk action types for better type inference
 * These types help TypeScript understand the shape of async actions
 */
export type AsyncThunkConfig = {
  /** State type */
  state: { positions: PositionsState };
  /** Reject value type for error handling */
  rejectValue: ApiError;
};

/**
 * Union type for all possible position operations
 * Useful for tracking which operation is currently active
 */
export type PositionOperation = 'list' | 'single' | 'create' | 'update' | 'delete';

/**
 * Type guard to check if an object is a valid Position
 * @param obj - Object to validate
 * @returns boolean indicating if object is a Position
 */
export const isPosition = (obj: any): obj is Position => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'number' &&
    typeof obj.name === 'string' &&
    (typeof obj.slug === 'string' || obj.slug === null) &&
    typeof obj.created_at === 'string' &&
    typeof obj.updated_at === 'string'
  );
};

/**
 * Type guard to check if an error response contains validation errors
 * @param error - Error object to check
 * @returns boolean indicating if error has validation errors
 */
export const hasValidationErrors = (error: ApiError): error is ApiError & { errors: Record<string, string[]> } => {
  return error.errors !== undefined && typeof error.errors === 'object';
};
