// src/features/schedulePreferences/types/index.ts

/**
 * Schedule Preferences Type Definitions
 * 
 * This file contains all TypeScript interfaces and types for the schedule preferences feature.
 * It includes API request/response models, Redux state types, and utility types.
 * Uses modern TypeScript patterns with const assertions instead of enums for better compatibility
 * with erasableSyntaxOnly flag and runtime type stripping.
 * 
 * @fileoverview Types for schedule preferences (skill management) functionality
 * @author Generated for schedule preferences API integration
 * @version 1.0.0
 */

// =============================================================================
// CONST OBJECTS WITH UNION TYPES (Modern enum alternatives)
// =============================================================================

/**
 * Employment type constants based on backend validation rules
 * Uses const assertion for type safety and erasable syntax compatibility
 */
export const EmploymentType = {
  /** Full Time */
  FULL_TIME: 'FT',
  /** Part Time */
  PART_TIME: 'PT'
} as const;

/**
 * Employment type union type derived from the const object
 * @type EmploymentType
 */
export type EmploymentType = typeof EmploymentType[keyof typeof EmploymentType];

/**
 * Employee status constants based on API response data
 * Uses const assertion for type safety and erasable syntax compatibility
 */
export const EmployeeStatus = {
  ACTIVE: 'Active',
  TERMINATED: 'Terminated',
  SUSPENDED: 'Suspended'
} as const;

/**
 * Employee status union type derived from the const object
 * @type EmployeeStatus
 */
export type EmployeeStatus = typeof EmployeeStatus[keyof typeof EmployeeStatus];

/**
 * Loading state constants for async operations
 * Uses const assertion for type safety and erasable syntax compatibility
 */
export const LoadingState = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed'
} as const;

/**
 * Loading state union type derived from the const object
 * @type LoadingState
 */
export type LoadingState = typeof LoadingState[keyof typeof LoadingState];

// =============================================================================
// BASE INTERFACES - NESTED OBJECTS
// =============================================================================

/**
 * Employee information interface representing the emp_info nested object
 * @interface EmpInfo
 */
export interface EmpInfo {
  /** Unique employee information identifier */
  id: number;
  /** Store identifier where the employee works */
  store_id: string;
  /** Employee's full name */
  full_name: string;
  /** Employee's date of birth in ISO 8601 format */
  date_of_birth: string;
  /** Whether the employee has family responsibilities */
  has_family: boolean;
  /** Whether the employee owns a car */
  has_car: boolean;
  /** Whether the employee is part of the Arabic team */
  is_arabic_team: boolean;
  /** Additional notes about the employee */
  notes: string;
  /** Current employment status */
  status: EmployeeStatus;
  /** Record creation timestamp in ISO 8601 format */
  created_at: string;
  /** Record last update timestamp in ISO 8601 format */
  updated_at: string;
}

/**
 * Preference information interface representing the preference nested object
 * @interface Preference
 */
export interface Preference {
  /** Unique preference identifier */
  id: number;
  /** Human-readable preference name */
  name: string;
  /** URL-friendly preference slug */
  slug: string;
  /** Record creation timestamp in ISO 8601 format */
  created_at: string;
  /** Record last update timestamp in ISO 8601 format */
  updated_at: string;
}

// =============================================================================
// MAIN SCHEDULE PREFERENCE INTERFACES
// =============================================================================

/**
 * Complete schedule preference interface with all nested relationships
 * Used for API responses that include full object details
 * @interface SchedulePreference
 */
export interface SchedulePreference {
  /** Unique schedule preference identifier */
  id: number;
  /** Foreign key reference to employee information */
  emp_info_id: number;
  /** Foreign key reference to preference */
  preference_id: number;
  /** Maximum working hours allowed for this preference */
  maximum_hours: number;
  /** Type of employment (FT = Full Time, PT = Part Time) */
  employment_type: EmploymentType;
  /** Record creation timestamp in ISO 8601 format */
  created_at: string;
  /** Record last update timestamp in ISO 8601 format */
  updated_at: string;
  /** Complete employee information object (included in API responses) */
  emp_info: EmpInfo;
  /** Complete preference information object (included in API responses) */
  preference: Preference;
}

/**
 * Simplified schedule preference interface without nested objects
 * Used for basic operations and internal state management
 * @interface SchedulePreferenceBase
 */
export interface SchedulePreferenceBase {
  /** Unique schedule preference identifier */
  id: number;
  /** Foreign key reference to employee information */
  emp_info_id: number;
  /** Foreign key reference to preference */
  preference_id: number;
  /** Maximum working hours allowed for this preference */
  maximum_hours: number;
  /** Type of employment (FT = Full Time, PT = Part Time) */
  employment_type: EmploymentType;
  /** Record creation timestamp in ISO 8601 format */
  created_at: string;
  /** Record last update timestamp in ISO 8601 format */
  updated_at: string;
}

// =============================================================================
// API REQUEST/RESPONSE TYPES
// =============================================================================

/**
 * Request payload for creating a new schedule preference
 * Based on backend validation rules:
 * - emp_info_id: required, must exist in emp_infos table
 * - preference_id: required, must exist in preferences table
 * - maximum_hours: required integer, minimum value of 1
 * - employment_type: required, must be 'FT' or 'PT'
 * @interface CreateSchedulePreferenceRequest
 */
export interface CreateSchedulePreferenceRequest {
  /** Employee information ID (must exist in database) */
  emp_info_id: string | number;
  /** Preference ID (must exist in database) */
  preference_id: string | number;
  /** Maximum hours (minimum 1, integer) */
  maximum_hours: string | number;
  /** Employment type ('FT' or 'PT') */
  employment_type: EmploymentType | string;
}

/**
 * Request payload for updating an existing schedule preference
 * Same validation rules as creation request
 * @interface UpdateSchedulePreferenceRequest
 */
export interface UpdateSchedulePreferenceRequest {
  /** Employee information ID (must exist in database) */
  emp_info_id: string | number;
  /** Preference ID (must exist in database) */
  preference_id: string | number;
  /** Maximum hours (minimum 1, integer) */
  maximum_hours: string | number;
  /** Employment type ('FT' or 'PT') */
  employment_type: EmploymentType | string;
}

/**
 * Response from create schedule preference API
 * Returns the created object with generated timestamps and ID
 * @interface CreateSchedulePreferenceResponse
 */
export interface CreateSchedulePreferenceResponse {
  /** Newly generated unique identifier */
  id: number;
  /** Employee information ID (converted to number) */
  emp_info_id: string | number;
  /** Preference ID (converted to number) */
  preference_id: string | number;
  /** Maximum hours (converted to number) */
  maximum_hours: number;
  /** Employment type */
  employment_type: EmploymentType;
  /** Record creation timestamp in ISO 8601 format */
  created_at: string;
  /** Record last update timestamp in ISO 8601 format */
  updated_at: string;
}

/**
 * Response from update schedule preference API
 * Returns the updated object with modified timestamp
 * @interface UpdateSchedulePreferenceResponse
 */
export interface UpdateSchedulePreferenceResponse {
  /** Unique identifier */
  id: number;
  /** Employee information ID (converted to number) */
  emp_info_id: string | number;
  /** Preference ID (converted to number) */
  preference_id: string | number;
  /** Maximum hours (converted to number) */
  maximum_hours: number;
  /** Employment type */
  employment_type: EmploymentType;
  /** Record creation timestamp in ISO 8601 format */
  created_at: string;
  /** Record last update timestamp in ISO 8601 format */
  updated_at: string;
}

/**
 * Response from get all schedule preferences API
 * Returns array of complete schedule preference objects with nested data
 * @type GetAllSchedulePreferencesResponse
 */
export type GetAllSchedulePreferencesResponse = SchedulePreference[];

/**
 * Response from get schedule preference by ID API
 * Returns single complete schedule preference object with nested data
 * @type GetSchedulePreferenceByIdResponse
 */
export type GetSchedulePreferenceByIdResponse = SchedulePreference;

// =============================================================================
// REDUX STATE TYPES
// =============================================================================

/**
 * Redux state interface for schedule preferences feature
 * Manages the complete state including data, loading states, and errors
 * @interface SchedulePreferencesState
 */
export interface SchedulePreferencesState {
  /** Array of all schedule preferences */
  schedulePreferences: SchedulePreference[];
  /** Currently selected/active schedule preference */
  currentSchedulePreference: SchedulePreference | null;
  /** Loading state for fetching all schedule preferences */
  fetchAllStatus: LoadingState;
  /** Loading state for fetching single schedule preference */
  fetchByIdStatus: LoadingState;
  /** Loading state for creating schedule preference */
  createStatus: LoadingState;
  /** Loading state for updating schedule preference */
  updateStatus: LoadingState;
  /** Loading state for deleting schedule preference */
  deleteStatus: LoadingState;
  /** Error message for fetch all operation */
  fetchAllError: string | null;
  /** Error message for fetch by ID operation */
  fetchByIdError: string | null;
  /** Error message for create operation */
  createError: string | null;
  /** Error message for update operation */
  updateError: string | null;
  /** Error message for delete operation */
  deleteError: string | null;
  /** Timestamp of last successful data fetch */
  lastFetch: string | null;
  /** Total count of schedule preferences (for pagination) */
  totalCount: number;
}

// =============================================================================
// ERROR HANDLING TYPES
// =============================================================================

/**
 * Generic API error response interface
 * @interface ApiError
 */
export interface ApiError {
  /** Error message */
  message: string;
  /** HTTP status code */
  status?: number;
  /** Additional error details */
  details?: Record<string, any>;
  /** Validation errors (if applicable) */
  errors?: Record<string, string[]>;
}

/**
 * Validation error interface for form handling
 * @interface ValidationError
 */
export interface ValidationError {
  /** Field name that failed validation */
  field: string;
  /** Validation error message */
  message: string;
  /** Error code for programmatic handling */
  code?: string;
}

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Utility type for partial updates (useful for form handling)
 * @type PartialSchedulePreferenceUpdate
 */
export type PartialSchedulePreferenceUpdate = Partial<CreateSchedulePreferenceRequest>;

/**
 * Utility type for schedule preference without timestamps and ID
 * Useful for form initial values and creating new preferences
 * @type SchedulePreferenceFormData
 */
export type SchedulePreferenceFormData = Omit<CreateSchedulePreferenceRequest, 'created_at' | 'updated_at' | 'id'>;

/**
 * Utility type for read-only schedule preference (immutable state)
 * @type ReadonlySchedulePreference
 */
export type ReadonlySchedulePreference = Readonly<SchedulePreference>;

/**
 * Utility type for arrays of read-only schedule preferences
 * @type ReadonlySchedulePreferencesArray
 */
export type ReadonlySchedulePreferencesArray = ReadonlyArray<ReadonlySchedulePreference>;

// =============================================================================
// ASYNC THUNK TYPES
// =============================================================================

/**
 * Parameters for fetchSchedulePreferenceById async thunk
 * @interface FetchSchedulePreferenceByIdParams
 */
export interface FetchSchedulePreferenceByIdParams {
  /** ID of the schedule preference to fetch */
  id: number;
}

/**
 * Parameters for updateSchedulePreference async thunk
 * @interface UpdateSchedulePreferenceParams
 */
export interface UpdateSchedulePreferenceParams {
  /** ID of the schedule preference to update */
  id: number;
  /** Data to update */
  data: UpdateSchedulePreferenceRequest;
}

/**
 * Parameters for deleteSchedulePreference async thunk
 * @interface DeleteSchedulePreferenceParams
 */
export interface DeleteSchedulePreferenceParams {
  /** ID of the schedule preference to delete */
  id: number;
}

// =============================================================================
// HOOK RETURN TYPES
// =============================================================================

/**
 * Return type for useSchedulePreferences hook
 * @interface UseSchedulePreferencesReturn
 */
export interface UseSchedulePreferencesReturn {
  /** Array of all schedule preferences */
  schedulePreferences: SchedulePreference[];
  /** Current loading state */
  loading: boolean;
  /** Current error state */
  error: string | null;
  /** Function to fetch all schedule preferences */
  fetchAll: () => Promise<void>;
  /** Function to fetch schedule preference by ID */
  fetchById: (id: number) => Promise<void>;
  /** Function to create new schedule preference */
  create: (data: CreateSchedulePreferenceRequest) => Promise<void>;
  /** Function to update existing schedule preference */
  update: (id: number, data: UpdateSchedulePreferenceRequest) => Promise<void>;
  /** Function to delete schedule preference */
  remove: (id: number) => Promise<void>;
  /** Function to clear errors */
  clearError: () => void;
  /** Currently selected schedule preference */
  currentSchedulePreference: SchedulePreference | null;
}

// =============================================================================
// EXPORT ALIASES (for backward compatibility and convenience)
// =============================================================================

/** @deprecated Use SchedulePreference instead */
export type SkillPreference = SchedulePreference;

/** @deprecated Use CreateSchedulePreferenceRequest instead */
export type CreateSkillRequest = CreateSchedulePreferenceRequest;

/** @deprecated Use UpdateSchedulePreferenceRequest instead */
export type UpdateSkillRequest = UpdateSchedulePreferenceRequest;

// =============================================================================
// TYPE GUARDS (for runtime type checking)
// =============================================================================

/**
 * Type guard to check if an object is a valid SchedulePreference
 * @param obj - Object to check
 * @returns {boolean} True if object is a SchedulePreference
 */
export const isSchedulePreference = (obj: any): obj is SchedulePreference => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.id === 'number' &&
    typeof obj.emp_info_id === 'number' &&
    typeof obj.preference_id === 'number' &&
    typeof obj.maximum_hours === 'number' &&
    typeof obj.employment_type === 'string' &&
    (obj.employment_type === EmploymentType.FULL_TIME || obj.employment_type === EmploymentType.PART_TIME) &&
    typeof obj.created_at === 'string' &&
    typeof obj.updated_at === 'string' &&
    typeof obj.emp_info === 'object' &&
    typeof obj.preference === 'object'
  );
};

/**
 * Type guard to check if an object is a valid CreateSchedulePreferenceRequest
 * @param obj - Object to check
 * @returns {boolean} True if object is a CreateSchedulePreferenceRequest
 */
export const isCreateSchedulePreferenceRequest = (obj: any): obj is CreateSchedulePreferenceRequest => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    (typeof obj.emp_info_id === 'string' || typeof obj.emp_info_id === 'number') &&
    (typeof obj.preference_id === 'string' || typeof obj.preference_id === 'number') &&
    (typeof obj.maximum_hours === 'string' || typeof obj.maximum_hours === 'number') &&
    typeof obj.employment_type === 'string' &&
    (obj.employment_type === EmploymentType.FULL_TIME || 
     obj.employment_type === EmploymentType.PART_TIME ||
     obj.employment_type === 'FT' ||
     obj.employment_type === 'PT')
  );
};

// =============================================================================
// HELPER FUNCTIONS FOR CONST OBJECT VALUES
// =============================================================================

/**
 * Helper function to get all employment type values as an array
 * Useful for form dropdowns and validation
 * @returns Array of employment type values
 */
export const getEmploymentTypeValues = (): EmploymentType[] => {
  return Object.values(EmploymentType);
};

/**
 * Helper function to get all employee status values as an array
 * Useful for form dropdowns and validation
 * @returns Array of employee status values
 */
export const getEmployeeStatusValues = (): EmployeeStatus[] => {
  return Object.values(EmployeeStatus);
};

/**
 * Helper function to get all loading state values as an array
 * Useful for debugging and state management
 * @returns Array of loading state values
 */
export const getLoadingStateValues = (): LoadingState[] => {
  return Object.values(LoadingState);
};

/**
 * Helper function to check if a string is a valid employment type
 * @param value - String to check
 * @returns True if value is a valid employment type
 */
export const isValidEmploymentType = (value: string): value is EmploymentType => {
  return getEmploymentTypeValues().includes(value as EmploymentType);
};

/**
 * Helper function to check if a string is a valid employee status
 * @param value - String to check
 * @returns True if value is a valid employee status
 */
export const isValidEmployeeStatus = (value: string): value is EmployeeStatus => {
  return getEmployeeStatusValues().includes(value as EmployeeStatus);
};

/**
 * Helper function to check if a string is a valid loading state
 * @param value - String to check
 * @returns True if value is a valid loading state
 */
export const isValidLoadingState = (value: string): value is LoadingState => {
  return getLoadingStateValues().includes(value as LoadingState);
};
