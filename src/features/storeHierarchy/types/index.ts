/**
 * @fileoverview Role Hierarchy Types
 * Comprehensive TypeScript definitions for enterprise role hierarchy management
 * with recursive tree structures, permissions, and metadata handling.
 */

// ===== Base Entity Types =====

/**
 * Base role interface representing a user role in the system
 */
export interface Role {
  /** Unique identifier for the role */
  id: number;
  /** Human-readable role name */
  name: string;
  /** Guard name for role scope (e.g., 'web', 'api') */
  guard_name: string;
  /** Role creation timestamp */
  created_at: string;
  /** Role last update timestamp */
  updated_at: string;
  /** Associated permissions for this role */
  permissions?: Permission[];
}

/**
 * Permission interface representing granular access rights
 */
export interface Permission {
  /** Unique identifier for the permission */
  id: number;
  /** Human-readable permission name */
  name: string;
  /** Guard name for permission scope */
  guard_name: string;
  /** Permission creation timestamp */
  created_at: string;
  /** Permission last update timestamp */
  updated_at: string;
  /** Pivot data for role-permission relationships */
  pivot?: PermissionPivot;
}

/**
 * Pivot table data for role-permission relationships
 */
export interface PermissionPivot {
  /** Foreign key to role */
  role_id: number;
  /** Foreign key to permission */
  permission_id: number;
  /** Additional pivot metadata if needed */
  [key: string]: unknown;
}

/**
 * Store interface representing a business location or unit
 */
export interface Store {
  /** Unique store identifier */
  id: string;
  /** Human-readable store name */
  name: string;
  /** Store metadata containing additional information */
  metadata: StoreMetadata;
  /** Whether the store is currently active */
  is_active: boolean;
  /** Store creation timestamp */
  created_at: string;
  /** Store last update timestamp */
  updated_at: string;
}

/**
 * Store metadata interface for additional store information
 */
export interface StoreMetadata {
  /** Store contact phone number */
  phone?: string;
  /** Store physical address */
  address?: string;
  /** Additional flexible metadata fields */
  [key: string]: unknown;
}

// ===== Hierarchy Core Types =====

/**
 * Role hierarchy metadata for tracking creation and context
 */
export interface HierarchyMetadata {
  /** User or system that created this hierarchy */
  created_by: string;
  /** Business reason for this hierarchy relationship */
  reason: string;
  /** Additional flexible metadata fields */
  [key: string]: unknown;
}

/**
 * Core role hierarchy relationship
 */
export interface RoleHierarchy {
  /** Unique hierarchy relationship identifier */
  id: number;
  /** ID of the higher-level (parent) role */
  higher_role_id: number;
  /** ID of the lower-level (child) role */
  lower_role_id: number;
  /** Store context for this hierarchy */
  store_id: string;
  /** Metadata about this hierarchy relationship */
  metadata: HierarchyMetadata;
  /** Whether this hierarchy relationship is active */
  is_active: boolean;
  /** Hierarchy creation timestamp */
  created_at: string;
  /** Hierarchy last update timestamp */
  updated_at: string;
  /** Populated higher role data */
  higher_role?: Role;
  /** Populated lower role data */
  lower_role?: Role;
  /** Populated store data */
  store?: Store;
}

// ===== Recursive Tree Types =====

/**
 * Tree node representing a role in the hierarchy with its children
 * Uses recursive type definition for nested structures
 */
export interface RoleTreeNode {
  /** The role at this node */
  role: Role;
  /** Child nodes in the hierarchy */
  children: RoleTreeNode[];
  /** Direct permissions for this role (may include inherited) */
  permissions: Permission[];
  /** Optional metadata for tree operations */
  treeMetadata?: TreeNodeMetadata;
}

/**
 * Metadata for tree node operations and state management
 */
export interface TreeNodeMetadata {
  /** Current depth in the tree (0 for root) */
  depth?: number;
  /** Path from root to this node */
  path?: number[];
  /** Whether this node is expanded in UI */
  isExpanded?: boolean;
  /** Whether this node is selected in UI */
  isSelected?: boolean;
  /** Loading state for this node */
  isLoading?: boolean;
  /** Error state for this node */
  hasError?: boolean;
  /** Inherited permissions from ancestors */
  inheritedPermissions?: Permission[];
}

// ===== API Request/Response Types =====

/**
 * Request payload for creating a new role hierarchy
 */
export interface CreateHierarchyRequest {
  /** ID of the higher-level role */
  higher_role_id: number;
  /** ID of the lower-level role */
  lower_role_id: number;
  /** Store context for this hierarchy */
  store_id: string;
  /** Metadata about this hierarchy creation */
  metadata: HierarchyMetadata;
  /** Whether the hierarchy should be active */
  is_active: boolean;
}

/**
 * Request payload for removing a role hierarchy
 */
export interface RemoveHierarchyRequest {
  /** ID of the higher-level role */
  higher_role_id: number;
  /** ID of the lower-level role */
  lower_role_id: number;
  /** Store context for this hierarchy */
  store_id: string;
}

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = unknown> {
  /** Whether the request was successful */
  success: boolean;
  /** Human-readable response message */
  message?: string;
  /** Response data payload */
  data?: T;
  /** Error details if unsuccessful */
  error?: ApiError;
}

/**
 * API error structure for failed requests
 */
export interface ApiError {
  /** Error code */
  code?: string | number;
  /** Human-readable error message */
  message: string;
  /** Detailed error information */
  details?: Record<string, unknown>;
  /** Validation errors by field */
  validation_errors?: Record<string, string[]>;
}

/**
 * Response data for hierarchy creation
 */
export interface CreateHierarchyResponse {
  /** The created hierarchy with populated relationships */
  hierarchy: RoleHierarchy;
}

/**
 * Response data for store hierarchies list
 */
export interface StoreHierarchiesResponse {
  /** Array of hierarchies for the requested store */
  hierarchies: RoleHierarchy[];
}

/**
 * Response data for hierarchy tree structure
 */
export interface HierarchyTreeResponse {
  /** Tree structure starting from root roles */
  hierarchy_tree: RoleTreeNode[];
}

// ===== State Management Types =====

/**
 * Loading states for different hierarchy operations
 */
export interface HierarchyLoadingState {
  /** Loading state for creating hierarchy */
  creating: boolean;
  /** Loading state for fetching store hierarchies */
  fetchingHierarchies: boolean;
  /** Loading state for fetching hierarchy tree */
  fetchingTree: boolean;
  /** Loading state for removing hierarchy */
  removing: boolean;
}

/**
 * Error states for hierarchy operations
 */
export interface HierarchyErrorState {
  /** Error from creating hierarchy */
  createError: ApiError | null;
  /** Error from fetching hierarchies */
  fetchError: ApiError | null;
  /** Error from fetching tree */
  treeError: ApiError | null;
  /** Error from removing hierarchy */
  removeError: ApiError | null;
}

/**
 * Normalized hierarchy data for efficient state management
 */
export interface NormalizedHierarchyState {
  /** Hierarchies indexed by ID */
  hierarchiesById: Record<number, RoleHierarchy>;
  /** Hierarchies grouped by store ID */
  hierarchiesByStore: Record<string, number[]>;
  /** Tree structures indexed by store ID */
  treesByStore: Record<string, RoleTreeNode[]>;
  /** Roles indexed by ID for quick lookups */
  rolesById: Record<number, Role>;
  /** Permissions indexed by ID */
  permissionsById: Record<number, Permission>;
  /** Stores indexed by ID */
  storesById: Record<string, Store>;
}

/**
 * Complete role hierarchy Redux state
 */
export interface RoleHierarchyState extends NormalizedHierarchyState {
  /** Loading states for various operations */
  loading: HierarchyLoadingState;
  /** Error states for operations */
  errors: HierarchyErrorState;
  /** Last update timestamps for cache invalidation */
  lastUpdated: Record<string, number>;
  /** Currently selected store for hierarchy operations */
  selectedStoreId: string | null;
}

// ===== Utility Types =====

/**
 * Discriminated union for different hierarchy operation states
 */
export type HierarchyOperationState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: unknown }
  | { status: 'error'; error: ApiError };

/**
 * Tree traversal direction options
 */
export type TreeTraversalDirection = 'depth-first' | 'breadth-first';

/**
 * Tree search criteria
 */
export interface TreeSearchCriteria {
  /** Search by role ID */
  roleId?: number;
  /** Search by role name (partial match) */
  roleName?: string;
  /** Search by permission name */
  permissionName?: string;
  /** Include inactive hierarchies */
  includeInactive?: boolean;
}

/**
 * Permission aggregation options
 */
export interface PermissionAggregationOptions {
  /** Include inherited permissions from parent roles */
  includeInherited?: boolean;
  /** Remove duplicate permissions */
  deduplicate?: boolean;
  /** Filter by permission guard */
  guardFilter?: string;
}

/**
 * Tree transformation options
 */
export interface TreeTransformOptions {
  /** Maximum depth to include */
  maxDepth?: number;
  /** Include permissions in each node */
  includePermissions?: boolean;
  /** Include metadata in nodes */
  includeMetadata?: boolean;
  /** Custom node transformer function */
  nodeTransformer?: (node: RoleTreeNode) => RoleTreeNode;
}

/**
 * Hierarchy validation result
 */
export interface HierarchyValidationResult {
  /** Whether the hierarchy is valid */
  isValid: boolean;
  /** Validation error messages */
  errors: string[];
  /** Validation warnings */
  warnings: string[];
  /** Suggested fixes */
  suggestions: string[];
}

// ===== Hook Return Types =====

/**
 * Return type for useCreateHierarchy hook
 */
export interface UseCreateHierarchyReturn {
  /** Function to create a new hierarchy */
  createHierarchy: (request: CreateHierarchyRequest) => Promise<RoleHierarchy>;
  /** Current loading state */
  isLoading: boolean;
  /** Current error state */
  error: ApiError | null;
  /** Reset error state */
  clearError: () => void;
}

/**
 * Return type for useStoreHierarchy hook
 */
export interface UseStoreHierarchyReturn {
  /** Array of hierarchies for the store */
  hierarchies: RoleHierarchy[];
  /** Function to refetch hierarchies */
  refetch: (storeId: string) => Promise<RoleHierarchy[]>;
  /** Current loading state */
  isLoading: boolean;
  /** Current error state */
  error: ApiError | null;
  /** Whether data is stale and needs refresh */
  isStale: boolean;
}

/**
 * Return type for useHierarchyTree hook
 */
export interface UseHierarchyTreeReturn {
  /** Tree structure for the store */
  tree: RoleTreeNode[];
  /** Function to refetch tree */
  refetchTree: (storeId: string) => Promise<RoleTreeNode[]>;
  /** Current loading state */
  isLoading: boolean;
  /** Current error state */
  error: ApiError | null;
  /** Tree utility functions */
  utils: TreeUtilities;
}

/**
 * Return type for useRemoveHierarchy hook
 */
export interface UseRemoveHierarchyReturn {
  /** Function to remove a hierarchy */
  removeHierarchy: (request: RemoveHierarchyRequest) => Promise<void>;
  /** Current loading state */
  isLoading: boolean;
  /** Current error state */
  error: ApiError | null;
  /** Clear error state */
  clearError: () => void;
}

/**
 * Tree utility functions interface
 */
export interface TreeUtilities {
  /** Find a node by role ID */
  findNodeByRoleId: (roleId: number) => RoleTreeNode | null;
  /** Get all permissions for a role (including inherited) */
  getAggregatedPermissions: (
    roleId: number,
    options?: PermissionAggregationOptions
  ) => Permission[];
  /** Get path from root to a specific role */
  getPathToRole: (roleId: number) => RoleTreeNode[];
  /** Validate hierarchy structure */
  validateHierarchy: () => HierarchyValidationResult;
  /** Transform tree with options */
  transformTree: (options?: TreeTransformOptions) => RoleTreeNode[];
  /** Search tree with criteria */
  searchTree: (criteria: TreeSearchCriteria) => RoleTreeNode[];
}

// ===== Type Guards =====

/**
 * Type guard to check if an object is a valid Role
 */
export const isRole = (obj: unknown): obj is Role => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof (obj as Role).id === 'number' &&
    typeof (obj as Role).name === 'string'
  );
};

/**
 * Type guard to check if an object is a valid RoleTreeNode
 */
export const isRoleTreeNode = (obj: unknown): obj is RoleTreeNode => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    isRole((obj as RoleTreeNode).role) &&
    Array.isArray((obj as RoleTreeNode).children)
  );
};

/**
 * Type guard to check if response is successful
 */
export const isSuccessfulResponse = <T>(
  response: ApiResponse<T>
): response is ApiResponse<T> & { success: true; data: T } => {
  return response.success === true && response.data !== undefined;
};

// ===== Export Utility Types =====

/**
 * Extract the data type from an ApiResponse
 */
export type ExtractApiData<T> = T extends ApiResponse<infer U> ? U : never;

/**
 * Make all properties of a tree node optional for partial updates
 */
export type PartialTreeNode = Partial<
  Omit<RoleTreeNode, 'children'> & {
    children: PartialTreeNode[];
  }
>;

/**
 * Deep readonly version of RoleTreeNode for immutable operations
 */
export type ReadonlyTreeNode = {
  readonly role: Readonly<Role>;
  readonly children: readonly ReadonlyTreeNode[];
  readonly permissions: readonly Permission[];
  readonly treeMetadata?: Readonly<TreeNodeMetadata>;
};
