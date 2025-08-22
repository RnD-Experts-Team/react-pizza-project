import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  createRoleHierarchy,
  fetchStoreHierarchy,
  fetchStoreHierarchyTree,
  clearError,
  clearHierarchies,
  updateHierarchyStatus,
} from '../store/slices/roleHierarchySlice';
import type {
  CreateRoleHierarchyRequest,
  RoleHierarchy,
  HierarchyTreeNode,
  RoleHierarchyFilters,
} from '../types/roleHierarchy';
import type { RootState } from '../store';

export const useReduxRoleHierarchy = () => {
  const dispatch = useAppDispatch();
  
  // Selectors
  const {
    hierarchies,
    hierarchyTree,
    loading,
    error,
    createLoading,
    treeLoading,
  } = useAppSelector((state: RootState) => state.roleHierarchy);

  // Actions
  const handleCreateRoleHierarchy = useCallback(
    async (data: CreateRoleHierarchyRequest) => {
      try {
        const result = await dispatch(createRoleHierarchy(data)).unwrap();
        return { success: true, data: result };
      } catch (error: any) {
        return { success: false, error: error.message || 'Failed to create role hierarchy' };
      }
    },
    [dispatch]
  );

  const handleFetchStoreHierarchy = useCallback(
    async (storeId: string) => {
      try {
        const result = await dispatch(fetchStoreHierarchy(storeId)).unwrap();
        return { success: true, data: result };
      } catch (error: any) {
        return { success: false, error: error.message || 'Failed to fetch store hierarchy' };
      }
    },
    [dispatch]
  );

  const handleFetchStoreHierarchyTree = useCallback(
    async (storeId: string) => {
      try {
        const result = await dispatch(fetchStoreHierarchyTree(storeId)).unwrap();
        return { success: true, data: result };
      } catch (error: any) {
        return { success: false, error: error.message || 'Failed to fetch hierarchy tree' };
      }
    },
    [dispatch]
  );

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleClearHierarchies = useCallback(() => {
    dispatch(clearHierarchies());
  }, [dispatch]);

  const handleUpdateHierarchyStatus = useCallback(
    (id: number, is_active: boolean) => {
      dispatch(updateHierarchyStatus({ id, is_active }));
    },
    [dispatch]
  );

  // Utility functions
  const getHierarchyById = useCallback(
    (id: number): RoleHierarchy | undefined => {
      return hierarchies.find(hierarchy => hierarchy.id === id);
    },
    [hierarchies]
  );

  const getHierarchiesByStore = useCallback(
    (storeId: string): RoleHierarchy[] => {
      return hierarchies.filter(hierarchy => hierarchy.store_id === storeId);
    },
    [hierarchies]
  );

  const getHierarchiesByRole = useCallback(
    (roleId: number, isHigherRole: boolean = true): RoleHierarchy[] => {
      return hierarchies.filter(hierarchy => 
        isHigherRole ? hierarchy.higher_role_id === roleId : hierarchy.lower_role_id === roleId
      );
    },
    [hierarchies]
  );

  const filterHierarchies = useCallback(
    (filters: RoleHierarchyFilters): RoleHierarchy[] => {
      return hierarchies.filter(hierarchy => {
        if (filters.store_id && hierarchy.store_id !== filters.store_id) return false;
        if (filters.higher_role_id && hierarchy.higher_role_id !== filters.higher_role_id) return false;
        if (filters.lower_role_id && hierarchy.lower_role_id !== filters.lower_role_id) return false;
        if (filters.is_active !== undefined && hierarchy.is_active !== filters.is_active) return false;
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          const matchesSearch = 
            hierarchy.higher_role?.name.toLowerCase().includes(searchLower) ||
            hierarchy.lower_role?.name.toLowerCase().includes(searchLower) ||
            hierarchy.store?.name.toLowerCase().includes(searchLower) ||
            hierarchy.metadata?.reason?.toLowerCase().includes(searchLower);
          if (!matchesSearch) return false;
        }
        return true;
      });
    },
    [hierarchies]
  );

  const getActiveHierarchies = useCallback((): RoleHierarchy[] => {
    return hierarchies.filter(hierarchy => hierarchy.is_active);
  }, [hierarchies]);

  const getInactiveHierarchies = useCallback((): RoleHierarchy[] => {
    return hierarchies.filter(hierarchy => !hierarchy.is_active);
  }, [hierarchies]);

  // Tree utility functions
  const findNodeInTree = useCallback(
    (tree: HierarchyTreeNode[], roleId: number): HierarchyTreeNode | null => {
      for (const node of tree) {
        if (node.role.id === roleId) return node;
        const found = findNodeInTree(node.children, roleId);
        if (found) return found;
      }
      return null;
    },
    []
  );

  const getAllRolesFromTree = useCallback(
    (tree: HierarchyTreeNode[]): number[] => {
      const roles: number[] = [];
      const traverse = (nodes: HierarchyTreeNode[]) => {
        nodes.forEach(node => {
          roles.push(node.role.id);
          traverse(node.children);
        });
      };
      traverse(tree);
      return roles;
    },
    []
  );

  const getTreeDepth = useCallback(
    (tree: HierarchyTreeNode[]): number => {
      if (tree.length === 0) return 0;
      return 1 + Math.max(...tree.map(node => getTreeDepth(node.children)));
    },
    []
  );

  return {
    // State
    hierarchies,
    hierarchyTree,
    loading,
    error,
    createLoading,
    treeLoading,
    
    // Actions
    createRoleHierarchy: handleCreateRoleHierarchy,
    fetchStoreHierarchy: handleFetchStoreHierarchy,
    fetchStoreHierarchyTree: handleFetchStoreHierarchyTree,
    clearError: handleClearError,
    clearHierarchies: handleClearHierarchies,
    updateHierarchyStatus: handleUpdateHierarchyStatus,
    
    // Utility functions
    getHierarchyById,
    getHierarchiesByStore,
    getHierarchiesByRole,
    filterHierarchies,
    getActiveHierarchies,
    getInactiveHierarchies,
    
    // Tree utility functions
    findNodeInTree,
    getAllRolesFromTree,
    getTreeDepth,
  };
};

export default useReduxRoleHierarchy;