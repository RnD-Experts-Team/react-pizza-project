// src/features/preferences/types/index.ts

/**
 * Preferences Management Types and Interfaces
 * 
 * This file contains all TypeScript interfaces, types, and utility
 * functions related to the Preference entity and its API operations.
 */

/**
 * Core Preference entity interface
 * Represents a preference object as returned from the API
 */
export interface Preference {
  /** Unique identifier for the preference */
  id: number;
  /** Human-readable name of the preference */
  name: string;
  /** URL-friendly slug for the preference (nullable) */
  slug: string | null;
  /** ISO 8601 timestamp when the preference was created */
  created_at: string;
  /** ISO 8601 timestamp when the preference was last updated */
  updated_at: string;
  /** Optional associated schedule preferences */
  schedule_preferences?: SchedulePreference[];
}

/**
 * SchedulePreference entity interface
 * Represents associated schedule preferences linked to a preference
 */
export interface SchedulePreference {
  /** Unique identifier */
  id: number;
  /** Employee info ID this schedule preference belongs to */
  emp_info_id: number;
  /** Foreign key preference ID */
  preference_id: number;
  /** Maximum hours allowed */
  maximum_hours: number;
  /** Employment type string (e.g., "FT") */
  employment_type: string;
  /** ISO 8601 created timestamp */
  created_at: string;
  /** ISO 8601 updated timestamp */
  updated_at: string;
}

/**
 * Data Transfer Object for creating a new preference
 * Used when sending data to the create preference API endpoint
 */
export interface CreatePreferenceDto {
  /** Required name for the new preference (max 255 characters) */
  name: string;
  /** Optional slug for the new preference (max 255 characters, must be unique) */
  slug?: string;
}

/**
 * Data Transfer Object for updating an existing preference
 * Used when sending data to the update preference API endpoint
 */
export interface UpdatePreferenceDto {
  /** Required name for the preference (max 255 characters) */
  name: string;
  /** Optional slug for the preference (max 255 characters, must be unique except for current record) */
  slug?: string;
}

/**
 * API response wrapper for list of preferences
 * Represents the array of preference objects returned by the API
 */
export interface PreferencesListResponse extends Array<Preference> {}

/**
 * API response for single preference operations (get, create, update)
 * Represents the response structure for individual preference endpoints
 */
export interface PreferenceResponse {
  /** The preference data */
  data?: Preference;
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
  details?: any; // Add this line to allow the details property
}

/**
 * Preference validation error type
 * Specific validation errors for preference fields
 */
export interface PreferenceValidationErrors {
  /** Name field validation errors */
  name?: string[];
  /** Slug field validation errors */
  slug?: string[];
}

/**
 * Redux state interface for preference management
 * Defines the shape of the preferences slice state
 */
export interface PreferencesState {
  /** Array of all loaded preferences */
  preferences: Preference[];
  /** Currently selected/viewed preference */
  selectedPreference: Preference | null;
  /** Loading state for async operations */
  loading: {
    /** Loading state for fetching preferences list */
    list: boolean;
    /** Loading state for fetching single preference */
    single: boolean;
    /** Loading state for creating preference */
    create: boolean;
    /** Loading state for updating preference */
    update: boolean;
    /** Loading state for deleting preference */
    delete: boolean;
  };
  /** Error states for different operations */
  error: {
    /** Error for fetching preferences list */
    list: string | null;
    /** Error for fetching single preference */
    single: string | null;
    /** Error for creating preference */
    create: string | null;
    /** Error for updating preference */
    update: string | null;
    /** Error for deleting preference */
    delete: string | null;
  };
  /** Additional UI state flags */
  ui: {
    /** Whether the create modal/form is open */
    isCreateModalOpen: boolean;
    /** Whether the edit modal/form is open */
    isEditModalOpen: boolean;
    /** ID of preference being deleted (for confirmation dialogs) */
    deletingId: number | null;
  };
}

/**
 * Async thunk action types for better type inference
 * These types help TypeScript understand the shape of async actions
 */
export type AsyncThunkConfig = {
  /** State type */
  state: { preferences: PreferencesState };
  /** Reject value type for error handling */
  rejectValue: ApiError;
};

/**
 * Union type for all possible preference operations
 * Useful for tracking which operation is currently active
 */
export type PreferenceOperation = 'list' | 'single' | 'create' | 'update' | 'delete';

/**
 * Type guard to check if an object is a valid Preference
 * @param obj - Object to validate
 * @returns boolean indicating if object is a Preference
 */
export const isPreference = (obj: any): obj is Preference => {
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
export const hasValidationErrors = (
  error: ApiError
): error is ApiError & { errors: Record<string, string[]> } => {
  return error.errors !== undefined && typeof error.errors === 'object';
};
