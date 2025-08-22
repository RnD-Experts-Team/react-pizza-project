// Role Hierarchy Management Types

export interface RoleHierarchyMetadata {
  created_by?: string;
  reason?: string;
  [key: string]: any;
}

export interface RoleHierarchy {
  id?: number;
  higher_role_id: number;
  lower_role_id: number;
  store_id: string;
  metadata?: RoleHierarchyMetadata;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  higher_role?: {
    id: number;
    name: string;
    guard_name: string;
    created_at?: string;
    updated_at?: string;
  };
  lower_role?: {
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
export interface CreateRoleHierarchyRequest {
  higher_role_id: number;
  lower_role_id: number;
  store_id: string;
  metadata?: RoleHierarchyMetadata;
  is_active: boolean;
}

// Response Types
export interface CreateRoleHierarchyResponse {
  success: boolean;
  message: string;
  data: {
    hierarchy: RoleHierarchy;
  };
}

export interface GetStoreHierarchyResponse {
  success: boolean;
  data: {
    hierarchies: RoleHierarchy[];
  };
}

// Role Hierarchy Tree Types
export interface Permission {
  id: number;
  name: string;
  guard_name: string;
  created_at?: string;
  updated_at?: string;
  pivot?: {
    role_id: number;
    permission_id: number;
  };
}

export interface RoleWithPermissions {
  id: number;
  name: string;
  guard_name: string;
  created_at?: string;
  updated_at?: string;
  permissions: Permission[];
}

export interface HierarchyTreeNode {
  role: RoleWithPermissions;
  children: HierarchyTreeNode[];
  permissions: Permission[];
}

export interface GetStoreHierarchyTreeResponse {
  success: boolean;
  data: {
    hierarchy_tree: HierarchyTreeNode[];
  };
}

// State Types
export interface RoleHierarchyState {
  hierarchies: RoleHierarchy[];
  hierarchyTree: HierarchyTreeNode[];
  loading: boolean;
  error: string | null;
  createLoading: boolean;
  treeLoading: boolean;
}

// Filter Types
export interface RoleHierarchyFilters {
  store_id?: string;
  higher_role_id?: number;
  lower_role_id?: number;
  is_active?: boolean;
  search?: string;
}

// Table Data Types
export interface RoleHierarchyTableData extends RoleHierarchy {
  higherRoleName?: string;
  lowerRoleName?: string;
  storeName?: string;
}

// Form Types
export interface RoleHierarchyFormData {
  higher_role_id: number | null;
  lower_role_id: number | null;
  store_id: string;
  metadata: RoleHierarchyMetadata;
  is_active: boolean;
}

// API Error Types
export interface RoleHierarchyApiError {
  success: false;
  message: string;
  errors?: {
    [key: string]: string[];
  };
}