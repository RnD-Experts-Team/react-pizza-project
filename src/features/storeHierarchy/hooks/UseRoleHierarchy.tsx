/**
 * @fileoverview Role Hierarchy Custom Hooks
 * Enterprise custom hooks providing clean APIs for hierarchical data operations
 * with memoized selectors, performance optimization, and comprehensive error handling.
 */

import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store';
import {
  createHierarchy,
  fetchStoreHierarchies,
  fetchHierarchyTree,
  removeHierarchy,
  refreshStoreData,
  setSelectedStoreId,
  clearErrors,
  clearError,
  updateTreeNodeMetadata,
  invalidateStoreCache,
  normalizeEntities,
  selectLoadingState,
  selectErrorState,
  selectSelectedStoreId,
  selectAllRoles,
  selectAllPermissions,
  makeSelectHierarchiesByStore,
  makeSelectHierarchyTreeByStore,
  makeSelectRoleById,
  makeSelectCacheStatus,
} from '../store/roleHierarchySlice';
import type {
  CreateHierarchyRequest,
  RemoveHierarchyRequest,
  UseCreateHierarchyReturn,
  UseStoreHierarchyReturn,
  UseHierarchyTreeReturn,
  UseRemoveHierarchyReturn,
  RoleHierarchy,
  RoleTreeNode,
  TreeSearchCriteria,
  PermissionAggregationOptions,
  HierarchyValidationResult,
  TreeUtilities,
  Permission,
  Role,
  Store,
} from '../types';

// ===== Type Definitions =====

type NormalizeEntitiesPayload = {
  roles?: Role[];
  permissions?: Permission[];
  stores?: Store[];
};

// ===== Core Hierarchy Management Hooks =====

/**
 * Hook for creating role hierarchies with optimistic updates and error handling
 * @returns Object containing create function, loading state, and error handling
 */
export const useCreateHierarchy = (): UseCreateHierarchyReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const { creating } = useSelector(selectLoadingState);
  const { createError } = useSelector(selectErrorState);

  const createHierarchyHandler = useCallback(
    async (request: CreateHierarchyRequest): Promise<RoleHierarchy> => {
      const result = await dispatch(createHierarchy(request));
      
      if (createHierarchy.fulfilled.match(result)) {
        return result.payload;
      } else {
        throw result.payload || new Error('Failed to create hierarchy');
      }
    },
    [dispatch],
  );

  const clearCreateError = useCallback(() => {
    dispatch(clearError('createError'));
  }, [dispatch]);

  return {
    createHierarchy: createHierarchyHandler,
    isLoading: creating,
    error: createError,
    clearError: clearCreateError,
  };
};

/**
 * Hook for fetching and managing store hierarchies with caching
 * @param storeId - Optional store ID for automatic data fetching
 * @returns Object containing hierarchies data, refetch function, and state management
 */
export const useStoreHierarchy = (storeId?: string): UseStoreHierarchyReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const { fetchingHierarchies } = useSelector(selectLoadingState);
  const { fetchError } = useSelector(selectErrorState);

  // Create memoized selector for this specific store
  const selectHierarchiesByStore = useMemo(
    () => makeSelectHierarchiesByStore(),
    [],
  );

  const selectCacheStatus = useMemo(() => makeSelectCacheStatus(), []);

  // Get hierarchies for the specific store
  const hierarchies = useSelector((state: RootState) =>
    storeId ? selectHierarchiesByStore(state, storeId) : [],
  );

  // Get cache status for the store
  const cacheStatus = useSelector((state: RootState) =>
    storeId ? selectCacheStatus(state, storeId) : null,
  );

  const refetch = useCallback(
    async (targetStoreId: string): Promise<RoleHierarchy[]> => {
      // Invalidate cache first
      dispatch(invalidateStoreCache(targetStoreId));
      
      const result = await dispatch(fetchStoreHierarchies(targetStoreId));
      
      if (fetchStoreHierarchies.fulfilled.match(result)) {
        return result.payload;
      } else {
        throw result.payload || new Error('Failed to fetch store hierarchies');
      }
    },
    [dispatch],
  );

  // Auto-fetch data when storeId changes
  const autoFetch = useCallback(() => {
    if (storeId && (!cacheStatus?.hierarchiesIsFresh || hierarchies.length === 0)) {
      dispatch(fetchStoreHierarchies(storeId));
    }
  }, [storeId, cacheStatus?.hierarchiesIsFresh, hierarchies.length, dispatch]);

  // Trigger auto-fetch when dependencies change
  useMemo(() => {
    autoFetch();
  }, [autoFetch]);

  return {
    hierarchies,
    refetch,
    isLoading: fetchingHierarchies,
    error: fetchError,
    isStale: cacheStatus ? !cacheStatus.hierarchiesIsFresh : false,
  };
};

/**
 * Hook for fetching and managing hierarchy trees with advanced utilities
 * @param storeId - Optional store ID for automatic tree fetching
 * @returns Object containing tree data, utilities, and state management
 */
export const useHierarchyTree = (storeId?: string): UseHierarchyTreeReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const { fetchingTree } = useSelector(selectLoadingState);
  const { treeError } = useSelector(selectErrorState);

  // Create memoized selector for this specific store's tree
  const selectTreeByStore = useMemo(() => makeSelectHierarchyTreeByStore(), []);
  const selectCacheStatus = useMemo(() => makeSelectCacheStatus(), []);

  // Get tree for the specific store
  const tree = useSelector((state: RootState) =>
    storeId ? selectTreeByStore(state, storeId) : [],
  );

  // Get cache status
  const cacheStatus = useSelector((state: RootState) =>
    storeId ? selectCacheStatus(state, storeId) : null,
  );

  const refetchTree = useCallback(
    async (targetStoreId: string): Promise<RoleTreeNode[]> => {
      // Invalidate cache first
      dispatch(invalidateStoreCache(targetStoreId));
      
      const result = await dispatch(fetchHierarchyTree(targetStoreId));
      
      if (fetchHierarchyTree.fulfilled.match(result)) {
        return result.payload;
      } else {
        throw result.payload || new Error('Failed to fetch hierarchy tree');
      }
    },
    [dispatch],
  );

  // Tree utility functions with memoization
  const utils: TreeUtilities = useMemo(() => {
    // Find node by role ID in the tree
    const findNodeByRoleId = (roleId: number): RoleTreeNode | null => {
      const findInNodes = (nodes: RoleTreeNode[]): RoleTreeNode | null => {
        for (const node of nodes) {
          if (node.role.id === roleId) {
            return node;
          }
          const found = findInNodes(node.children);
          if (found) return found;
        }
        return null;
      };
      
      return findInNodes(tree);
    };

    // Get aggregated permissions for a role (including inherited)
    const getAggregatedPermissions = (
      roleId: number,
      options: PermissionAggregationOptions = {},
    ): Permission[] => {
      const {
        includeInherited = true,
        deduplicate = true,
        guardFilter,
      } = options;

      const node = findNodeByRoleId(roleId);
      if (!node) return [];

      let permissions: Permission[] = [...(node.permissions || [])];

      // Add inherited permissions from parent nodes
      if (includeInherited) {
        const getPathToRoot = (targetNode: RoleTreeNode): RoleTreeNode[] => {
          const path: RoleTreeNode[] = [];
          const findPath = (nodes: RoleTreeNode[], target: RoleTreeNode): boolean => {
            for (const currentNode of nodes) {
              path.push(currentNode);
              if (currentNode.role.id === target.role.id) {
                return true;
              }
              if (findPath(currentNode.children, target)) {
                return true;
              }
              path.pop();
            }
            return false;
          };
          
          findPath(tree, targetNode);
          return path;
        };

        const pathToRoot = getPathToRoot(node);
        pathToRoot.forEach(ancestorNode => {
          if (ancestorNode.role.id !== roleId) {
            permissions.push(...(ancestorNode.permissions || []));
          }
        });
      }

      // Filter by guard if specified
      if (guardFilter) {
        permissions = permissions.filter(p => p.guard_name === guardFilter);
      }

      // Remove duplicates if requested
      if (deduplicate) {
        const seen = new Set<number>();
        permissions = permissions.filter(p => {
          if (seen.has(p.id)) return false;
          seen.add(p.id);
          return true;
        });
      }

      return permissions;
    };

    // Get path from root to specific role
    const getPathToRole = (roleId: number): RoleTreeNode[] => {
      const path: RoleTreeNode[] = [];
      
      const findPath = (nodes: RoleTreeNode[]): boolean => {
        for (const node of nodes) {
          path.push(node);
          
          if (node.role.id === roleId) {
            return true;
          }
          
          if (findPath(node.children)) {
            return true;
          }
          
          path.pop();
        }
        return false;
      };
      
      findPath(tree);
      return path;
    };

    // Validate hierarchy structure
    const validateHierarchy = (): HierarchyValidationResult => {
      const errors: string[] = [];
      const warnings: string[] = [];
      const suggestions: string[] = [];
      const visitedRoles = new Set<number>();

      const validateNode = (node: RoleTreeNode, depth: number = 0) => {
        const roleId = node.role.id;

        // Check for circular references
        if (visitedRoles.has(roleId)) {
          errors.push(`Circular reference detected for role: ${node.role.name}`);
          return;
        }

        visitedRoles.add(roleId);

        // Check maximum depth
        if (depth > 10) {
          warnings.push(`Deep nesting detected (depth: ${depth}) for role: ${node.role.name}`);
        }

        // Check for empty children arrays
        if (node.children.length === 0 && depth === 0) {
          suggestions.push(`Root role "${node.role.name}" has no subordinates`);
        }

        // Check permissions
        if (!node.permissions || node.permissions.length === 0) {
          warnings.push(`Role "${node.role.name}" has no permissions assigned`);
        }

        // Recursively validate children
        node.children.forEach(child => {
          validateNode(child, depth + 1);
        });

        visitedRoles.delete(roleId);
      };

      tree.forEach(rootNode => validateNode(rootNode));

      return {
        isValid: errors.length === 0,
        errors,
        warnings,
        suggestions,
      };
    };

    // Transform tree with options
    const transformTree = (options: any = {}): RoleTreeNode[] => {
      const { maxDepth = Infinity, includePermissions = true, includeMetadata = true } = options;

      const transformNode = (node: RoleTreeNode, currentDepth: number = 0): RoleTreeNode => {
        const transformedNode: RoleTreeNode = {
          role: node.role,
          children: currentDepth < maxDepth 
            ? node.children.map(child => transformNode(child, currentDepth + 1))
            : [],
          permissions: includePermissions ? node.permissions : [],
        };

        if (includeMetadata && node.treeMetadata) {
          transformedNode.treeMetadata = node.treeMetadata;
        }

        return transformedNode;
      };

      return tree.map(rootNode => transformNode(rootNode));
    };

    // Search tree with criteria
    const searchTree = (criteria: TreeSearchCriteria): RoleTreeNode[] => {
      const results: RoleTreeNode[] = [];
      
      const searchNode = (node: RoleTreeNode) => {
        let matches = true;

        if (criteria.roleId && node.role.id !== criteria.roleId) {
          matches = false;
        }

        if (criteria.roleName && !node.role.name.toLowerCase().includes(criteria.roleName.toLowerCase())) {
          matches = false;
        }

        if (criteria.permissionName) {
          const hasPermission = node.permissions?.some(p => 
            p.name.toLowerCase().includes(criteria.permissionName!.toLowerCase())
          );
          if (!hasPermission) matches = false;
        }

        if (matches) {
          results.push(node);
        }

        // Search children
        node.children.forEach(searchNode);
      };

      tree.forEach(searchNode);
      return results;
    };

    return {
      findNodeByRoleId,
      getAggregatedPermissions,
      getPathToRole,
      validateHierarchy,
      transformTree,
      searchTree,
    };
  }, [tree]);

  // Auto-fetch tree when storeId changes
  const autoFetchTree = useCallback(() => {
    if (storeId && (!cacheStatus?.treeIsFresh || tree.length === 0)) {
      dispatch(fetchHierarchyTree(storeId));
    }
  }, [storeId, cacheStatus?.treeIsFresh, tree.length, dispatch]);

  // Trigger auto-fetch when dependencies change
  useMemo(() => {
    autoFetchTree();
  }, [autoFetchTree]);

  return {
    tree,
    refetchTree,
    isLoading: fetchingTree,
    error: treeError,
    utils,
  };
};

/**
 * Hook for removing role hierarchies with optimistic updates
 * @returns Object containing remove function, loading state, and error handling
 */
export const useRemoveHierarchy = (): UseRemoveHierarchyReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const { removing } = useSelector(selectLoadingState);
  const { removeError } = useSelector(selectErrorState);

  const removeHierarchyHandler = useCallback(
    async (request: RemoveHierarchyRequest): Promise<void> => {
      const result = await dispatch(removeHierarchy(request));
      
      if (!removeHierarchy.fulfilled.match(result)) {
        throw result.payload || new Error('Failed to remove hierarchy');
      }
    },
    [dispatch],
  );

  const clearRemoveError = useCallback(() => {
    dispatch(clearError('removeError'));
  }, [dispatch]);

  return {
    removeHierarchy: removeHierarchyHandler,
    isLoading: removing,
    error: removeError,
    clearError: clearRemoveError,
  };
};

// ===== Utility and Management Hooks =====

/**
 * Hook for managing selected store with persistence
 * @returns Object containing selected store, setter, and related utilities
 */
export const useSelectedStore = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedStoreId = useSelector(selectSelectedStoreId);

  const setStoreId = useCallback(
    (storeId: string | null) => {
      dispatch(setSelectedStoreId(storeId));
    },
    [dispatch],
  );

  return {
    selectedStoreId,
    setSelectedStoreId: setStoreId,
  };
};

/**
 * Hook for bulk data operations and cache management
 * @returns Object containing refresh functions and cache utilities
 */
export const useHierarchyDataManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { fetchingHierarchies, fetchingTree } = useSelector(selectLoadingState);

  const refreshAll = useCallback(
    async (storeId: string) => {
      const result = await dispatch(refreshStoreData(storeId));
      
      if (refreshStoreData.fulfilled.match(result)) {
        return result.payload;
      } else {
        throw result.payload || new Error('Failed to refresh store data');
      }
    },
    [dispatch],
  );

  const invalidateCache = useCallback(
    (storeId: string) => {
      dispatch(invalidateStoreCache(storeId));
    },
    [dispatch],
  );

  const normalizeData = useCallback(
    (entities: NormalizeEntitiesPayload) => {
      dispatch(normalizeEntities(entities));
    },
    [dispatch],
  );

  return {
    refreshAll,
    invalidateCache,
    normalizeData,
    isRefreshing: fetchingHierarchies || fetchingTree,
  };
};

/**
 * Hook for error management across all hierarchy operations
 * @returns Object containing error states and clearing functions
 */
export const useHierarchyErrors = () => {
  const dispatch = useDispatch<AppDispatch>();
  const errors = useSelector(selectErrorState);

  const clearAllErrors = useCallback(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  const clearSpecificError = useCallback(
    (errorType: keyof typeof errors) => {
      dispatch(clearError(errorType));
    },
    [dispatch],
  );

  return {
    errors,
    hasErrors: Object.values(errors).some(Boolean),
    clearAllErrors,
    clearSpecificError,
  };
};

/**
 * Hook for tree node metadata management (UI state)
 * @param storeId - Store ID for the tree
 * @returns Object containing metadata update functions
 */
export const useTreeNodeMetadata = (storeId: string) => {
  const dispatch = useDispatch<AppDispatch>();

  const updateNodeMetadata = useCallback(
    (roleId: number, metadata: Partial<RoleTreeNode['treeMetadata']>) => {
      dispatch(updateTreeNodeMetadata({ storeId, roleId, metadata }));
    },
    [dispatch, storeId],
  );

  const expandNode = useCallback(
    (roleId: number) => {
      updateNodeMetadata(roleId, { isExpanded: true });
    },
    [updateNodeMetadata],
  );

  const collapseNode = useCallback(
    (roleId: number) => {
      updateNodeMetadata(roleId, { isExpanded: false });
    },
    [updateNodeMetadata],
  );

  const selectNode = useCallback(
    (roleId: number) => {
      updateNodeMetadata(roleId, { isSelected: true });
    },
    [updateNodeMetadata],
  );

  const deselectNode = useCallback(
    (roleId: number) => {
      updateNodeMetadata(roleId, { isSelected: false });
    },
    [updateNodeMetadata],
  );

  return {
    updateNodeMetadata,
    expandNode,
    collapseNode,
    selectNode,
    deselectNode,
  };
};

/**
 * Hook for role-specific operations and lookups
 * @param roleId - Optional role ID for automatic data fetching
 * @returns Object containing role data and related operations
 */
export const useRoleOperations = (roleId?: number) => {
  const selectRoleById = useMemo(() => makeSelectRoleById(), []);
  
  const role = useSelector((state: RootState) =>
    roleId ? selectRoleById(state, roleId) : null,
  );

  const allRoles = useSelector(selectAllRoles);
  const allPermissions = useSelector(selectAllPermissions);

  // Get roles that can be higher in hierarchy (excluding current role)
  const availableHigherRoles = useMemo(() => {
    return allRoles.filter(r => r.id !== roleId);
  }, [allRoles, roleId]);

  // Get roles that can be lower in hierarchy (excluding current role)
  const availableLowerRoles = useMemo(() => {
    return allRoles.filter(r => r.id !== roleId);
  }, [allRoles, roleId]);

  return {
    role,
    allRoles,
    allPermissions,
    availableHigherRoles,
    availableLowerRoles,
  };
};

// ===== Performance-Optimized Combined Hook =====

/**
 * Combined hook providing all role hierarchy functionality with optimized selectors
 * @param storeId - Store ID for automatic data fetching and operations
 * @returns Comprehensive object containing all hierarchy management functionality
 */
export const useRoleHierarchyComplete = (storeId?: string) => {
  // Individual hooks
  const createHook = useCreateHierarchy();
  const storeHook = useStoreHierarchy(storeId);
  const treeHook = useHierarchyTree(storeId);
  const removeHook = useRemoveHierarchy();
  const storeManagement = useSelectedStore();
  const dataManagement = useHierarchyDataManagement();
  const errorManagement = useHierarchyErrors();
  const nodeMetadata = useTreeNodeMetadata(storeId || '');
  const roleOperations = useRoleOperations();

  // Combined loading state
  const isLoading = createHook.isLoading || 
                   storeHook.isLoading || 
                   treeHook.isLoading || 
                   removeHook.isLoading ||
                   dataManagement.isRefreshing;

  return {
    // Data
    hierarchies: storeHook.hierarchies,
    tree: treeHook.tree,
    selectedStoreId: storeManagement.selectedStoreId,
    roles: roleOperations.allRoles,
    permissions: roleOperations.allPermissions,

    // Operations
    createHierarchy: createHook.createHierarchy,
    removeHierarchy: removeHook.removeHierarchy,
    refetchHierarchies: storeHook.refetch,
    refetchTree: treeHook.refetchTree,
    refreshAll: dataManagement.refreshAll,

    // State management
    setSelectedStoreId: storeManagement.setSelectedStoreId,
    invalidateCache: dataManagement.invalidateCache,
    updateNodeMetadata: nodeMetadata.updateNodeMetadata,
    expandNode: nodeMetadata.expandNode,
    collapseNode: nodeMetadata.collapseNode,

    // Tree utilities
    treeUtils: treeHook.utils,

    // Error handling
    errors: errorManagement.errors,
    hasErrors: errorManagement.hasErrors,
    clearAllErrors: errorManagement.clearAllErrors,
    clearCreateError: createHook.clearError,
    clearRemoveError: removeHook.clearError,

    // Loading states
    isLoading,
    isCreating: createHook.isLoading,
    isRemoving: removeHook.isLoading,
    isFetchingHierarchies: storeHook.isLoading,
    isFetchingTree: treeHook.isLoading,
    isRefreshing: dataManagement.isRefreshing,

    // Data freshness
    isStale: storeHook.isStale,
  };
};

// ===== Default Export =====

export default {
  useCreateHierarchy,
  useStoreHierarchy,
  useHierarchyTree,
  useRemoveHierarchy,
  useSelectedStore,
  useHierarchyDataManagement,
  useHierarchyErrors,
  useTreeNodeMetadata,
  useRoleOperations,
  useRoleHierarchyComplete,
};
