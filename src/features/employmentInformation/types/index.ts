/**
 * @fileoverview TypeScript interfaces and types for Employment Information management
 * @description Defines all types for CRUD operations on employment information data
 * including API request/response models and nested entity types
 */

// ============================================================================
// Core Entity Types
// ============================================================================

/**
 * Employee Information entity - represents basic employee data
 */
export interface EmpInfo {
  /** Unique identifier for the employee */
  id: number;
  /** Store identifier where the employee works */
  store_id: string;
  /** Full name of the employee */
  full_name: string;
  /** Date of birth in ISO format */
  date_of_birth: string;
  /** Whether the employee has family */
  has_family: boolean;
  /** Whether the employee has a car */
  has_car: boolean;
  /** Whether the employee is part of the Arabic team */
  is_arabic_team: boolean;
  /** Additional notes about the employee */
  notes: string | null;
  /** Current employment status */
  status: 'Active' | 'Terminated' | 'On Hold' | 'Pending';
  /** Record creation timestamp */
  created_at: string;
  /** Record last update timestamp */
  updated_at: string;
}

/**
 * Position entity - represents job positions
 */
export interface Position {
  /** Unique identifier for the position */
  id: number;
  /** Position name */
  name: string;
  /** URL-friendly slug for the position */
  slug: string;
  /** Record creation timestamp */
  created_at: string;
  /** Record last update timestamp */
  updated_at: string;
}

// ============================================================================
// Employment Information Types
// ============================================================================

/**
 * Employment type enum - defines valid employment classifications
 */
export type EmploymentType = '1099' | 'W2';

/**
 * Complete Employment Information entity
 * @description Main entity representing employment details with relationships
 */
export interface EmploymentInformation {
  /** Unique identifier for the employment record */
  id: number;
  /** Foreign key reference to employee info */
  emp_info_id: number;
  /** Foreign key reference to position (nullable) */
  position_id: number | null;
  /** Array of Paychex IDs associated with this employment */
  paychex_ids: string[];
  /** Type of employment classification */
  employment_type: EmploymentType;
  /** Date when the employee was hired (ISO format) */
  hired_date: string;
  /** Base pay amount as decimal string */
  base_pay: string;
  /** Performance pay amount as decimal string */
  performance_pay: string;
  /** Whether the employee has a uniform */
  has_uniform: boolean;
  /** Record creation timestamp */
  created_at: string;
  /** Record last update timestamp */
  updated_at: string;
  /** Related employee information (populated in API responses) */
  emp_info?: EmpInfo;
  /** Related position information (populated in API responses) */
  position?: Position;
}

// ============================================================================
// API Request Types
// ============================================================================

/**
 * Request payload for creating new employment information
 * @description Data structure for POST /api/employment-info
 */
export interface CreateEmploymentInformationRequest {
  /** Employee info ID (must exist in emp_infos table) */
  emp_info_id: string;
  /** Position ID (must exist in positions table, nullable) */
  position_id?: string;
  /** Array of Paychex IDs (required, must be array) */
  paychex_ids: string[];
  /** Employment type (must be '1099' or 'W2') */
  employment_type: EmploymentType;
  /** Hire date (format: M-D-YYYY or ISO date) */
  hired_date: string;
  /** Base pay amount (numeric string, min: 0) */
  base_pay: string;
  /** Performance pay amount (numeric string, min: 0) */
  performance_pay: string;
  /** Whether employee has uniform (required boolean) */
  has_uniform: boolean;
}

/**
 * Request payload for updating employment information
 * @description Data structure for PUT /api/employment-info/:id
 * Same structure as create request with all fields required
 */
export interface UpdateEmploymentInformationRequest extends CreateEmploymentInformationRequest {}

// ============================================================================
// API Response Types
// ============================================================================

/**
 * Response for fetching all employment information
 * @description Response structure for GET /api/employment-info
 */
export type GetAllEmploymentInformationResponse = EmploymentInformation[];

/**
 * Response for fetching single employment information by ID
 * @description Response structure for GET /api/employment-info/:id
 */
export type GetEmploymentInformationByIdResponse = EmploymentInformation;

/**
 * Response for creating new employment information
 * @description Response structure for POST /api/employment-info
 */
export interface CreateEmploymentInformationResponse {
  /** Employee info ID */
  emp_info_id: string;
  /** Position ID */
  position_id: string;
  /** Array of Paychex IDs */
  paychex_ids: string[];
  /** Employment type */
  employment_type: EmploymentType;
  /** Hired date in ISO format */
  hired_date: string;
  /** Base pay amount */
  base_pay: string;
  /** Performance pay amount */
  performance_pay: string;
  /** Whether employee has uniform */
  has_uniform: boolean;
  /** Record update timestamp */
  updated_at: string;
  /** Record creation timestamp */
  created_at: string;
  /** Newly created record ID */
  id: number;
}

/**
 * Response for updating employment information
 * @description Response structure for PUT /api/employment-info/:id
 */
export interface UpdateEmploymentInformationResponse {
  /** Unique identifier */
  id: number;
  /** Employee info ID */
  emp_info_id: string;
  /** Position ID */
  position_id: string;
  /** Array of Paychex IDs */
  paychex_ids: string[];
  /** Employment type */
  employment_type: EmploymentType;
  /** Hired date in ISO format */
  hired_date: string;
  /** Base pay amount */
  base_pay: string;
  /** Performance pay amount */
  performance_pay: string;
  /** Whether employee has uniform */
  has_uniform: boolean;
  /** Record creation timestamp */
  created_at: string;
  /** Record last update timestamp */
  updated_at: string;
}

// ============================================================================
// Utility Types
// ============================================================================

/**
 * Generic API error response structure
 */
export interface ApiError {
  /** Error message */
  message: string;
  /** Optional error code */
  code?: string;
  /** Optional validation errors */
  errors?: Record<string, string[]>;
}

/**
 * Loading states for async operations
 */
export type LoadingState = 'idle' | 'pending' | 'succeeded' | 'failed';

/**
 * Employment Information with optional relationships
 * @description Used for partial data scenarios
 */
export type PartialEmploymentInformation = Partial<EmploymentInformation>;

/**
 * Employment Information for display purposes
 * @description Includes computed/formatted fields for UI components
 */
export interface EmploymentInformationDisplay extends EmploymentInformation {
  /** Formatted hire date for display */
  formatted_hired_date?: string;
  /** Full employee name from related emp_info */
  employee_name?: string;
  /** Position name from related position */
  position_name?: string;
  /** Total compensation (base + performance) */
  total_compensation?: number;
}

// ============================================================================
// Redux State Types
// ============================================================================

/**
 * Employment Information slice state structure
 * @description Defines the shape of employment information state in Redux store
 */
export interface EmploymentInformationState {
  /** Array of all employment information records */
  items: EmploymentInformation[];
  /** Currently selected/active employment information */
  currentItem: EmploymentInformation | null;
  /** Loading state for list operations */
  listLoading: LoadingState;
  /** Loading state for individual item operations */
  itemLoading: LoadingState;
  /** Loading state for create operations */
  createLoading: LoadingState;
  /** Loading state for update operations */
  updateLoading: LoadingState;
  /** Loading state for delete operations */
  deleteLoading: LoadingState;
  /** Error message for list operations */
  listError: string | null;
  /** Error message for item operations */
  itemError: string | null;
  /** Error message for create operations */
  createError: string | null;
  /** Error message for update operations */
  updateError: string | null;
  /** Error message for delete operations */
  deleteError: string | null;
  /** Last fetch timestamp for cache management */
  lastFetch: number | null;
}

// ============================================================================
// Hook Types
// ============================================================================

/**
 * Return type for useEmploymentInformations hook
 */
export interface UseEmploymentInformationsReturn {
  /** Array of employment information records */
  employmentInformations: EmploymentInformation[];
  /** Currently selected employment information */
  currentEmploymentInformation: EmploymentInformation | null;
  /** Loading states for different operations */
  loading: {
    list: boolean;
    item: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  /** Error states for different operations */
  errors: {
    list: string | null;
    item: string | null;
    create: string | null;
    update: string | null;
    delete: string | null;
  };
  /** Actions for CRUD operations */
  actions: {
    fetchAll: () => Promise<void>;
    fetchById: (id: number) => Promise<void>;
    create: (data: CreateEmploymentInformationRequest) => Promise<EmploymentInformation | null>;
    update: (id: number, data: UpdateEmploymentInformationRequest) => Promise<EmploymentInformation | null>;
    delete: (id: number) => Promise<boolean>;
    clearErrors: () => void;
    clearCurrent: () => void;
  };
}
