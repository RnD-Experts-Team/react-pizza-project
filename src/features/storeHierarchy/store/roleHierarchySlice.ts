/**
 * @fileoverview Role Hierarchy Redux Slice
 * Enterprise Redux Toolkit slice with normalized state, async thunks,
 * and optimized selectors for complex role hierarchy management.
 */

import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../store';
import roleHierarchyApi from '../services/api';
import type {
  RoleHierarchy,
  RoleTreeNode,
  Role,
  Permission,
  Store,
  ApiError,
  RoleHierarchyState,
  CreateHierarchyRequest,
  RemoveHierarchyRequest,
} from '../types';

// ===== Initial State Definition =====

const initialState: RoleHierarchyState = {
  // Normalized data structures
  hierarchiesById: {},
  hierarchiesByStore: {},
  treesByStore: {},
  rolesById: {},
  permissionsById: {},
  storesById: {},

  // Loading states for different operations
  loading: {
    creating: false,
    fetchingHierarchies: false,
    fetchingTree: false,
    removing: false,
  },

  // Error states for comprehensive error handling
  errors: {
    createError: null,
    fetchError: null,
    treeError: null,
    removeError: null,
  },

  // Cache management
  lastUpdated: {},
  selectedStoreId: null,
};

// ===== Async Thunks for API Operations =====

/**
 * Creates a new role hierarchy relationship
 * Handles optimistic updates and error recovery
 */
export const createHierarchy = createAsyncThunk<
  RoleHierarchy,
  CreateHierarchyRequest,
  {
    rejectValue: ApiError;
    state: RootState;
  }
>(
  'roleHierarchy/createHierarchy',
  async (payload, { rejectWithValue }) => {
    try {
      const result = await roleHierarchyApi.createRoleHierarchy(payload);
      return result.hierarchy;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  },
);

/**
 * Fetches all hierarchies for a specific store with caching
 */
export const fetchStoreHierarchies = createAsyncThunk<
  RoleHierarchy[],
  string,
  {
    rejectValue: ApiError;
    state: RootState;
  }
>(
  'roleHierarchy/fetchStoreHierarchies',
  async (storeId, { rejectWithValue, getState }) => {
    try {
      // Check if data is fresh (within last 5 minutes)
      const state = getState();
      const lastUpdate =
        state.roleHierarchy.lastUpdated[`hierarchies_${storeId}`];
      const isFresh = lastUpdate && Date.now() - lastUpdate < 300000; // 5 minutes

      if (
        isFresh &&
        state.roleHierarchy.hierarchiesByStore[storeId]?.length > 0
      ) {
        // Return cached data without making API call
        const cachedIds = state.roleHierarchy.hierarchiesByStore[storeId];
        return cachedIds
          .map((id) => state.roleHierarchy.hierarchiesById[id])
          .filter(Boolean);
      }

      const result = await roleHierarchyApi.getStoreHierarchy(storeId);
      return result.hierarchies;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  },
);

/**
 * Fetches hierarchical tree structure for a store with transformation
 */
export const fetchHierarchyTree = createAsyncThunk<
  RoleTreeNode[],
  string,
  {
    rejectValue: ApiError;
    state: RootState;
  }
>(
  'roleHierarchy/fetchHierarchyTree',
  async (storeId, { rejectWithValue, getState }) => {
    try {
      // Check cache freshness
      const state = getState();
      const lastUpdate = state.roleHierarchy.lastUpdated[`tree_${storeId}`];
      const isFresh = lastUpdate && Date.now() - lastUpdate < 300000; // 5 minutes

      if (isFresh && state.roleHierarchy.treesByStore[storeId]?.length > 0) {
        return state.roleHierarchy.treesByStore[storeId];
      }

      const result = await roleHierarchyApi.getStoreHierarchyTree(storeId);

      // Transform API response to normalized tree structure
      const transformedTree = roleHierarchyApi.transformApiTreeToNormalized(
        result.hierarchy_tree,
      );

      return transformedTree;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  },
);

/**
 * Removes a role hierarchy relationship with optimistic updates
 */
export const removeHierarchy = createAsyncThunk<
  RemoveHierarchyRequest,
  RemoveHierarchyRequest,
  {
    rejectValue: ApiError;
    state: RootState;
  }
>(
  'roleHierarchy/removeHierarchy',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      await roleHierarchyApi.removeRoleHierarchy(payload);

      // Trigger a refresh of the store data to ensure consistency
      dispatch(fetchStoreHierarchies(payload.store_id));
      dispatch(fetchHierarchyTree(payload.store_id));

      return payload;
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  },
);

/**
 * Bulk operation to refresh all data for a store
 */
export const refreshStoreData = createAsyncThunk<
  { hierarchies: RoleHierarchy[]; tree: RoleTreeNode[] },
  string,
  {
    rejectValue: ApiError;
    state: RootState;
  }
>(
  'roleHierarchy/refreshStoreData',
  async (storeId, { rejectWithValue }) => {
    try {
      const [hierarchiesResult, treeResult] = await Promise.all([
        roleHierarchyApi.getStoreHierarchy(storeId),
        roleHierarchyApi.getStoreHierarchyTree(storeId),
      ]);

      return {
        hierarchies: hierarchiesResult.hierarchies,
        tree: roleHierarchyApi.transformApiTreeToNormalized(
          treeResult.hierarchy_tree,
        ),
      };
    } catch (error) {
      return rejectWithValue(error as ApiError);
    }
  },
);

// ===== Slice Definition with Complex State Management =====

const roleHierarchySlice = createSlice({
  name: 'roleHierarchy',
  initialState,
  reducers: {
    /**
     * Sets the currently selected store for hierarchy operations
     */
    setSelectedStoreId: (state, action: PayloadAction<string | null>) => {
      state.selectedStoreId = action.payload;
    },

    /**
     * Clears all error states across operations
     */
    clearErrors: (state) => {
      state.errors = {
        createError: null,
        fetchError: null,
        treeError: null,
        removeError: null,
      };
    },

    /**
     * Clears specific error by type
     */
    clearError: (
      state,
      action: PayloadAction<keyof RoleHierarchyState['errors']>,
    ) => {
      state.errors[action.payload] = null;
    },

    /**
     * Updates tree node metadata for UI state management
     */
    updateTreeNodeMetadata: (
      state,
      action: PayloadAction<{
        storeId: string;
        roleId: number;
        metadata: Partial<RoleTreeNode['treeMetadata']>;
      }>,
    ) => {
      const { storeId, roleId, metadata } = action.payload;
      const tree = state.treesByStore[storeId];

      if (tree) {
        const updateNodeMetadata = (nodes: RoleTreeNode[]): void => {
          nodes.forEach((node) => {
            if (node.role.id === roleId) {
              node.treeMetadata = { ...node.treeMetadata, ...metadata };
            } else if (node.children.length > 0) {
              updateNodeMetadata(node.children);
            }
          });
        };

        updateNodeMetadata(tree);
      }
    },

    /**
     * Invalidates cache for specific store
     */
    invalidateStoreCache: (state, action: PayloadAction<string>) => {
      const storeId = action.payload;
      delete state.lastUpdated[`hierarchies_${storeId}`];
      delete state.lastUpdated[`tree_${storeId}`];
    },

    /**
     * Normalizes and stores related entities from API responses
     */
    normalizeEntities: (
      state,
      action: PayloadAction<{
        roles?: Role[];
        permissions?: Permission[];
        stores?: Store[];
      }>,
    ) => {
      const { roles, permissions, stores } = action.payload;

      if (roles) {
        roles.forEach((role) => {
          state.rolesById[role.id] = role;
        });
      }

      if (permissions) {
        permissions.forEach((permission) => {
          state.permissionsById[permission.id] = permission;
        });
      }

      if (stores) {
        stores.forEach((store) => {
          state.storesById[store.id] = store;
        });
      }
    },
  },

  extraReducers: (builder) => {
    // ===== Create Hierarchy Cases =====
    builder
      .addCase(createHierarchy.pending, (state) => {
        state.loading.creating = true;
        state.errors.createError = null;
      })
      .addCase(createHierarchy.fulfilled, (state, action) => {
        state.loading.creating = false;
        state.errors.createError = null;

        const hierarchy = action.payload;

        // Store hierarchy in normalized state
        state.hierarchiesById[hierarchy.id] = hierarchy;

        // Update store-based index
        const storeId = hierarchy.store_id;
        if (!state.hierarchiesByStore[storeId]) {
          state.hierarchiesByStore[storeId] = [];
        }

        if (!state.hierarchiesByStore[storeId].includes(hierarchy.id)) {
          state.hierarchiesByStore[storeId].push(hierarchy.id);
        }

        // Extract and normalize related entities
        if (hierarchy.higher_role) {
          state.rolesById[hierarchy.higher_role.id] = hierarchy.higher_role;
        }
        if (hierarchy.lower_role) {
          state.rolesById[hierarchy.lower_role.id] = hierarchy.lower_role;
        }
        if (hierarchy.store) {
          state.storesById[hierarchy.store.id] = hierarchy.store;
        }

        // Update cache timestamp
        state.lastUpdated[`hierarchies_${storeId}`] = Date.now();
      })
      .addCase(createHierarchy.rejected, (state, action) => {
        state.loading.creating = false;
        state.errors.createError = action.payload || {
          code: 'CREATE_FAILED',
          message: 'Failed to create hierarchy',
        };
      })

      // ===== Fetch Store Hierarchies Cases =====
      .addCase(fetchStoreHierarchies.pending, (state) => {
        state.loading.fetchingHierarchies = true;
        state.errors.fetchError = null;
      })
      .addCase(fetchStoreHierarchies.fulfilled, (state, action) => {
        state.loading.fetchingHierarchies = false;
        state.errors.fetchError = null;

        const hierarchies = action.payload;
        const storeId = action.meta.arg;

        // Clear existing hierarchies for this store
        state.hierarchiesByStore[storeId] = [];

        // Normalize hierarchies and related entities
        hierarchies.forEach((hierarchy) => {
          state.hierarchiesById[hierarchy.id] = hierarchy;
          state.hierarchiesByStore[storeId].push(hierarchy.id);

          // Normalize related entities
          if (hierarchy.higher_role) {
            state.rolesById[hierarchy.higher_role.id] = hierarchy.higher_role;
          }
          if (hierarchy.lower_role) {
            state.rolesById[hierarchy.lower_role.id] = hierarchy.lower_role;
          }
        });

        // Update selected store if not set
        if (!state.selectedStoreId && hierarchies.length > 0) {
          state.selectedStoreId = storeId;
        }

        // Update cache timestamp
        state.lastUpdated[`hierarchies_${storeId}`] = Date.now();
      })
      .addCase(fetchStoreHierarchies.rejected, (state, action) => {
        state.loading.fetchingHierarchies = false;
        state.errors.fetchError = action.payload || {
          code: 'FETCH_FAILED',
          message: 'Failed to fetch store hierarchies',
        };
      })

      // ===== Fetch Hierarchy Tree Cases =====
      .addCase(fetchHierarchyTree.pending, (state) => {
        state.loading.fetchingTree = true;
        state.errors.treeError = null;
      })
      .addCase(fetchHierarchyTree.fulfilled, (state, action) => {
        state.loading.fetchingTree = false;
        state.errors.treeError = null;

        const tree = action.payload;
        const storeId = action.meta.arg;

        // Store normalized tree
        state.treesByStore[storeId] = tree;

        // Extract and normalize all roles and permissions from tree
        const extractEntitiesFromTree = (nodes: RoleTreeNode[]) => {
          nodes.forEach((node) => {
            // Normalize role
            state.rolesById[node.role.id] = node.role;

            // Normalize permissions
            node.permissions?.forEach((permission) => {
              state.permissionsById[permission.id] = permission;
            });

            // Recursively process children
            if (node.children.length > 0) {
              extractEntitiesFromTree(node.children);
            }
          });
        };

        extractEntitiesFromTree(tree);

        // Update cache timestamp
        state.lastUpdated[`tree_${storeId}`] = Date.now();
      })
      .addCase(fetchHierarchyTree.rejected, (state, action) => {
        state.loading.fetchingTree = false;
        state.errors.treeError = action.payload || {
          code: 'TREE_FETCH_FAILED',
          message: 'Failed to fetch hierarchy tree',
        };
      })

      // ===== Remove Hierarchy Cases =====
      .addCase(removeHierarchy.pending, (state) => {
        state.loading.removing = true;
        state.errors.removeError = null;
      })
      .addCase(removeHierarchy.fulfilled, (state, action) => {
        state.loading.removing = false;
        state.errors.removeError = null;

        const { store_id } = action.payload;

        // Invalidate cache to force refresh
        delete state.lastUpdated[`hierarchies_${store_id}`];
        delete state.lastUpdated[`tree_${store_id}`];
      })
      .addCase(removeHierarchy.rejected, (state, action) => {
        state.loading.removing = false;
        state.errors.removeError = action.payload || {
          code: 'REMOVE_FAILED',
          message: 'Failed to remove hierarchy',
        };
      })

      // ===== Refresh Store Data Cases =====
      .addCase(refreshStoreData.pending, (state) => {
        state.loading.fetchingHierarchies = true;
        state.loading.fetchingTree = true;
      })
      .addCase(refreshStoreData.fulfilled, (state, action) => {
        state.loading.fetchingHierarchies = false;
        state.loading.fetchingTree = false;

        const { hierarchies, tree } = action.payload;
        const storeId = action.meta.arg;

        // Update hierarchies
        state.hierarchiesByStore[storeId] = [];
        hierarchies.forEach((hierarchy) => {
          state.hierarchiesById[hierarchy.id] = hierarchy;
          state.hierarchiesByStore[storeId].push(hierarchy.id);
        });

        // Update tree
        state.treesByStore[storeId] = tree;

        // Update cache timestamps
        const now = Date.now();
        state.lastUpdated[`hierarchies_${storeId}`] = now;
        state.lastUpdated[`tree_${storeId}`] = now;
      })
      .addCase(refreshStoreData.rejected, (state, action) => {
        state.loading.fetchingHierarchies = false;
        state.loading.fetchingTree = false;

        state.errors.fetchError = action.payload || {
          code: 'REFRESH_FAILED',
          message: 'Failed to refresh store data',
        };
      });
  },
});

// ===== Advanced Selectors with Memoization =====

/**
 * Root selector for role hierarchy state
 */
export const selectRoleHierarchyState = (state: RootState) =>
  state.roleHierarchy;

/**
 * Selectors for loading states
 */
export const selectLoadingState = createSelector(
  [selectRoleHierarchyState],
  (state) => state.loading,
);

export const selectIsLoading = createSelector([selectLoadingState], (loading) =>
  Object.values(loading).some(Boolean),
);

/**
 * Selectors for error states
 */
export const selectErrorState = createSelector(
  [selectRoleHierarchyState],
  (state) => state.errors,
);

export const selectHasErrors = createSelector([selectErrorState], (errors) =>
  Object.values(errors).some(Boolean),
);

/**
 * Selector for selected store ID
 */
export const selectSelectedStoreId = createSelector(
  [selectRoleHierarchyState],
  (state) => state.selectedStoreId,
);

/**
 * Selector for all hierarchies as normalized entities
 */
export const selectAllHierarchies = createSelector(
  [selectRoleHierarchyState],
  (state) => Object.values(state.hierarchiesById),
);

/**
 * Parametrized selector for hierarchies by store ID
 */
export const makeSelectHierarchiesByStore = () =>
  createSelector(
    [selectRoleHierarchyState, (_: RootState, storeId: string) => storeId],
    (state, storeId) => {
      const hierarchyIds = state.hierarchiesByStore[storeId] || [];
      return hierarchyIds
        .map((id) => state.hierarchiesById[id])
        .filter(Boolean)
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        );
    },
  );

/**
 * Selector for hierarchy tree of selected store
 */
export const selectHierarchyTree = createSelector(
  [selectRoleHierarchyState, selectSelectedStoreId],
  (state, selectedStoreId) => {
    if (!selectedStoreId) return [];
    return state.treesByStore[selectedStoreId] || [];
  },
);

/**
 * Parametrized selector for hierarchy tree by store ID
 */
export const makeSelectHierarchyTreeByStore = () =>
  createSelector(
    [selectRoleHierarchyState, (_: RootState, storeId: string) => storeId],
    (state, storeId) => state.treesByStore[storeId] || [],
  );

/**
 * Selector for all normalized roles
 */
export const selectAllRoles = createSelector(
  [selectRoleHierarchyState],
  (state) => Object.values(state.rolesById),
);

/**
 * Selector for all normalized permissions
 */
export const selectAllPermissions = createSelector(
  [selectRoleHierarchyState],
  (state) => Object.values(state.permissionsById),
);

/**
 * Parametrized selector for role by ID
 */
export const makeSelectRoleById = () =>
  createSelector(
    [selectRoleHierarchyState, (_: RootState, roleId: number) => roleId],
    (state, roleId) => state.rolesById[roleId] || null,
  );

/**
 * Advanced selector for flattened tree structure
 */
export const selectFlattenedTree = createSelector(
  [selectHierarchyTree],
  (tree) => {
    if (!tree.length) return [];
    return roleHierarchyApi.flattenTree(tree);
  },
);

/**
 * Cache status selectors
 */
export const makeSelectCacheStatus = () =>
  createSelector(
    [selectRoleHierarchyState, (_: RootState, storeId: string) => storeId],
    (state, storeId) => {
      const hierarchiesLastUpdate = state.lastUpdated[`hierarchies_${storeId}`];
      const treeLastUpdate = state.lastUpdated[`tree_${storeId}`];
      const now = Date.now();
      const cacheTimeout = 300000; // 5 minutes

      return {
        hierarchiesIsFresh:
          hierarchiesLastUpdate && now - hierarchiesLastUpdate < cacheTimeout,
        treeIsFresh: treeLastUpdate && now - treeLastUpdate < cacheTimeout,
        lastUpdated: {
          hierarchies: hierarchiesLastUpdate || null,
          tree: treeLastUpdate || null,
        },
      };
    },
  );

// ===== Export Actions and Reducer =====

export const {
  setSelectedStoreId,
  clearErrors,
  clearError,
  updateTreeNodeMetadata,
  invalidateStoreCache,
  normalizeEntities,
} = roleHierarchySlice.actions;

export default roleHierarchySlice.reducer;

// ===== Type Exports for Hook Usage =====

export type { RoleHierarchyState };
