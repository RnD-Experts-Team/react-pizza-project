// User Role Store Assignment Types

export interface UserRoleStoreAssignmentMetadata {
  start_date?: string;
  notes?: string;
  department?: string;
  [key: string]: any;
}

export interface UserRoleStoreAssignment {
  id?: number;
  user_id: number;
  role_id: number;
  store_id: string;
  metadata?: UserRoleStoreAssignmentMetadata;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  user?: {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    created_at?: string;
    updated_at?: string;
  };
  role?: {
    id: number;
    name: string;
    guard_name: string;
    created_at?: string;
    updated_at?: string;
  };
  store?: {
    id: string;
    name: string;
    metadata?: {
      phone?: string;
      address?: string;
      [key: string]: any;
    };
    is_active: boolean;
    created_at?: string;
    updated_at?: string;
  };
}

// Request Types
export interface AssignUserRoleToStoreRequest {
  user_id: number;
  role_id: number;
  store_id: string;
  metadata?: UserRoleStoreAssignmentMetadata;
  is_active: boolean;
}

export interface ToggleUserRoleStoreStatusRequest {
  user_id: number;
  role_id: number;
  store_id: string;
}

export interface BulkAssignmentItem {
  role_id: number;
  store_id: string;
  metadata?: UserRoleStoreAssignmentMetadata;
}

export interface BulkAssignUserRolesRequest {
  user_id: number;
  assignments: BulkAssignmentItem[];
}

export interface RemoveUserRoleStoreRequest {
  user_id: number;
  role_id: number;
  store_id: string;
}

// Response Types
export interface AssignUserRoleToStoreResponse {
  success: boolean;
  message: string;
  data: {
    assignment: UserRoleStoreAssignment;
  };
}

export interface ToggleUserRoleStoreStatusResponse {
  success: boolean;
  message: string;
}

export interface GetStoreAssignmentsResponse {
  success: boolean;
  data: {
    assignments: UserRoleStoreAssignment[];
  };
}

export interface GetUserAssignmentsResponse {
  success: boolean;
  data: {
    assignments: UserRoleStoreAssignment[];
  };
}

export interface BulkAssignUserRolesResponse {
  success: boolean;
  message: string;
  data: {
    assignments: UserRoleStoreAssignment[];
  };
}

export interface RemoveUserRoleStoreResponse {
  success: boolean;
  message: string;
}

// State Types
export interface UserRoleStoreAssignmentState {
  assignments: UserRoleStoreAssignment[];
  storeAssignments: UserRoleStoreAssignment[];
  userAssignments: UserRoleStoreAssignment[];
  loading: boolean;
  error: string | null;
  assignmentLoading: boolean;
  toggleLoading: boolean;
  bulkAssignLoading: boolean;
  removeLoading: boolean;
}

// Filter and Search Types
export interface UserRoleStoreAssignmentFilters {
  user_id?: number;
  role_id?: number;
  store_id?: string;
  is_active?: boolean;
  search?: string;
}

export interface UserRoleStoreAssignmentTableData extends UserRoleStoreAssignment {
  userName?: string;
  userEmail?: string;
  roleName?: string;
  storeName?: string;
}