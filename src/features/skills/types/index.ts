// src/features/skills/types/index.ts
/**
 * Skills Management Types and Interfaces
 *
 * This file contains all TypeScript interfaces, types, enums,
 * and utility type guards related to the Skill entity and its API operations.
 */

/**
 * Core Skill entity interface
 * Represents a skill object as returned from the API
 */
export interface Skill {
  /** Unique identifier for the skill */
  id: number;
  /** Human-readable name of the skill */
  name: string;
  /** URL-friendly slug for the skill (optional) */
  slug: string | null;
  /** ISO 8601 timestamp when the skill was created */
  created_at: string;
  /** ISO 8601 timestamp when the skill was last updated */
  updated_at: string;
}

/**
 * Data Transfer Object for creating a new skill
 * Used when sending data to the create skill API endpoint
 */
export interface CreateSkillDto {
  /** Required name for the new skill (max 255 characters) */
  name: string;
  /** Optional slug for the new skill (max 255 characters, must be unique) */
  slug?: string | null;
}

/**
 * Data Transfer Object for updating an existing skill
 * Used when sending data to the update skill API endpoint
 */
export interface UpdateSkillDto {
  /** Required name for the skill (max 255 characters) */
  name: string;
  /** Optional slug for the skill (max 255 characters, unique except for current record) */
  slug?: string | null;
}

/**
 * Employee information related to a skill
 */
export interface EmpInfo {
  id: number;
  store_id: string;
  full_name: string;
  date_of_birth: string;
  has_family: boolean;
  has_car: boolean;
  is_arabic_team: boolean;
  notes: string;
  status: string;
  created_at: string;
  updated_at: string;

  pivot: {
    skill_id: number;
    emp_info_id: number;
    rating: string;
    created_at: string;
    updated_at: string;
  };
}

/**
 * Skill entity with related employee info details
 * Returned by the Get Skill by ID API
 */
export interface SkillWithEmpInfos extends Skill {
  emp_infos: EmpInfo[];
}

/**
 * API response wrapper for list of Skills
 * (array of Skill objects)
 */
export type SkillsListResponse = Skill[];

/**
 * API response wrapper for single Skill operations (get by ID, create, update)
 */
export interface SkillResponse {
  data: Skill | SkillWithEmpInfos;
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
  /** Additional error details */
  details?: any;
}

/**
 * Skill validation error type
 * Specific validation errors for skill fields
 */
export interface SkillValidationErrors {
  name?: string[];
  slug?: string[];
}

/**
 * Redux state interface for skills management
 * Defines the shape of the skills slice state
 */
export interface SkillsState {
  /** Array of all loaded skills */
  skills: Skill[];
  /** Currently selected/viewed skill */
  selectedSkill: SkillWithEmpInfos | Skill | null;
  /** Loading state for async operations */
  loading: {
    /** Loading state for fetching skills list */
    list: boolean;
    /** Loading state for fetching single skill */
    single: boolean;
    /** Loading state for creating skill */
    create: boolean;
    /** Loading state for updating skill */
    update: boolean;
    /** Loading state for deleting skill */
    delete: boolean;
  };
  /** Error states for different operations */
  error: {
    /** Error for fetching skills list */
    list: string | null;
    /** Error for fetching single skill */
    single: string | null;
    /** Error for creating skill */
    create: string | null;
    /** Error for updating skill */
    update: string | null;
    /** Error for deleting skill */
    delete: string | null;
  };
  /** Additional UI state flags */
  ui: {
    /** Whether the create modal/form is open */
    isCreateModalOpen: boolean;
    /** Whether the edit modal/form is open */
    isEditModalOpen: boolean;
    /** ID of skill being deleted (for confirmation dialogs) */
    deletingId: number | null;
  };
}

/**
 * Query parameters for fetching skills list, for extensibility
 */
export interface SkillsQueryParams {
  per_page?: number;
  page?: number;
  search?: string;
  sort_by?: 'name' | 'created_at' | 'updated_at';
  sort_order?: 'asc' | 'desc';
}

/**
 * Async thunk action types for better type inference in Redux Toolkit
 */
export type AsyncThunkConfig = {
  /** State type */
  state: { skills: SkillsState };
  /** Reject value type for error handling */
  rejectValue: ApiError;
};

/**
 * Union type for all possible skill operations
 * Useful for tracking which operation is currently active
 */
export type SkillOperation = 'list' | 'single' | 'create' | 'update' | 'delete';

/**
 * Type guard to check if an object is a valid Skill
 * @param obj - Object to validate
 * @returns boolean indicating if object is a Skill
 */
export const isSkill = (obj: any): obj is Skill => {
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
