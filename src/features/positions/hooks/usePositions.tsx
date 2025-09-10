/**
 * Custom React Hook for Position Management
 * 
 * This hook provides a clean interface to interact with position state and actions.
 * It wraps Redux Toolkit slice actions and provides typed methods for all CRUD
 * operations with automatic loading and error state management.
 */

import { useCallback, useMemo } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';
import {
  // Async thunk actions
  fetchPositions,
  fetchPositionById,
  createPosition,
  updatePosition,
  deletePosition,
  
  // Synchronous actions
  setSelectedPosition,
  clearSelectedPosition,
  openCreateModal,
  closeCreateModal,
  openEditModal,
  closeEditModal,
  setDeletingId,
  clearAllErrors,
  clearError,
  updatePagination,
  resetPositionsState,
  
  // Selectors
  selectPositions,
  selectSelectedPosition,
  selectPositionsLoading,
  selectPositionsError,
  selectPositionsPagination,
  selectPositionsUI,
  selectIsAnyLoading,
  // Removed unused selectPositionById import
} from '../store/positionsSlice';
import type {
  Position,
  CreatePositionDto,
  UpdatePositionDto,
  PositionsQueryParams,
  ApiError,
  PositionsState
} from '../types';

// Typed hooks - you should add these to your store/hooks.ts file
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';

// You need to define these types in your store configuration
type RootState = {
  positions: PositionsState;
  // Add other slices here
};

type AppDispatch = any; // Replace with your actual AppDispatch type from store

// Create typed hooks
const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Interface for the return value of usePositions hook
 * Provides typed access to all position-related state and actions
 */
interface UsePositionsReturn {
  // State
  /** Array of all loaded positions */
  positions: Position[];
  /** Currently selected position */
  selectedPosition: Position | null;
  /** Loading states for each operation */
  loading: PositionsState['loading'];
  /** Error states for each operation */
  error: PositionsState['error'];
  /** Pagination metadata */
  pagination: PositionsState['pagination'];
  /** UI state flags */
  ui: PositionsState['ui'];
  /** Whether any operation is currently loading */
  isAnyLoading: boolean;
  
  // Actions
  /** Fetches all positions with optional query parameters */
  fetchPositions: (params?: PositionsQueryParams) => Promise<Position[]>;
  /** Fetches a single position by ID */
  fetchPositionById: (id: number) => Promise<Position>;
  /** Creates a new position */
  createPosition: (data: CreatePositionDto) => Promise<Position>;
  /** Updates an existing position */
  updatePosition: (id: number, data: UpdatePositionDto) => Promise<Position>;
  /** Deletes a position by ID */
  deletePosition: (id: number) => Promise<void>;
  
  // Utility actions
  /** Sets the currently selected position */
  setSelectedPosition: (position: Position | null) => void;
  /** Clears the currently selected position */
  clearSelectedPosition: () => void;
  /** Gets a position by ID from current state */
  getPositionById: (id: number) => Position | undefined;
  
  // Modal management
  /** Opens the create position modal */
  openCreateModal: () => void;
  /** Closes the create position modal */
  closeCreateModal: () => void;
  /** Opens the edit position modal */
  openEditModal: () => void;
  /** Closes the edit position modal */
  closeEditModal: () => void;
  
  // Delete management
  /** Sets the position ID being deleted (for confirmation) */
  setDeletingId: (id: number | null) => void;
  
  // Error management
  /** Clears all error states */
  clearAllErrors: () => void;
  /** Clears a specific error by operation type */
  clearError: (errorType: keyof PositionsState['error']) => void;
  
  // Pagination management
  /** Updates pagination metadata */
  updatePagination: (pagination: Partial<PositionsState['pagination']>) => void;
  
  // State reset
  /** Resets the entire positions state */
  resetState: () => void;
  
  // Convenience methods
  /** Refreshes the positions list with current parameters */
  refreshPositions: () => Promise<Position[]>;
  /** Checks if a specific position is currently loading */
  isPositionLoading: (operation: keyof PositionsState['loading']) => boolean;
  /** Checks if a specific position has an error */
  hasError: (operation: keyof PositionsState['error']) => boolean;
  /** Gets error message for a specific operation */
  getErrorMessage: (operation: keyof PositionsState['error']) => string | null;
}

/**
 * Custom hook for position management
 * Provides complete interface for position CRUD operations and state management
 * 
 * @returns Object containing position state, loading states, error states, and action methods
 * 
 * @example
 * ```
 * function PositionsList() {
 *   const {
 *     positions,
 *     loading,
 *     error,
 *     fetchPositions,
 *     createPosition,
 *     deletePosition
 *   } = usePositions();
 * 
 *   useEffect(() => {
 *     fetchPositions({ per_page: 10 });
 *   }, []);
 * 
 *   const handleCreate = async (data) => {
 *     try {
 *       await createPosition(data);
 *       // Position created successfully
 *     } catch (error) {
 *       // Handle error
 *     }
 *   };
 * 
 *   if (loading.list) return <div>Loading...</div>;
 *   if (error.list) return <div>Error: {error.list}</div>;
 * 
 *   return (
 *     <div>
 *       {positions.map(position => (
 *         <div key={position.id}>{position.name}</div>
 *       ))}
 *     </div>
 *   );
 * }
 * ```
 */
export const usePositions = (): UsePositionsReturn => {
  const dispatch = useAppDispatch();
  
  // Select state from Redux store using typed selector
  const positions = useAppSelector(selectPositions);
  const selectedPosition = useAppSelector(selectSelectedPosition);
  const loading = useAppSelector(selectPositionsLoading);
  const error = useAppSelector(selectPositionsError);
  const pagination = useAppSelector(selectPositionsPagination);
  const ui = useAppSelector(selectPositionsUI);
  const isAnyLoading = useAppSelector(selectIsAnyLoading);

  // Memoized selector for getting position by ID
  const getPositionById = useCallback(
    (id: number): Position | undefined => {
      return positions.find(position => position.id === id);
    },
    [positions]
  );

  // ================================
  // Async Action Handlers
  // ================================

  /**
   * Fetches all positions with optional parameters
   * @param params - Query parameters for filtering and pagination
   * @returns Promise resolving to positions array
   * @throws ApiError on failure
   */
  const handleFetchPositions = useCallback(
    async (params?: PositionsQueryParams): Promise<Position[]> => {
      try {
        console.log('🔄 Hook: Fetching positions with params:', params);
        
        const resultAction = await dispatch(fetchPositions(params));
        const result = unwrapResult(resultAction);
        
        console.log(`✅ Hook: Successfully fetched ${result.length} positions`);
        return result;
        
      } catch (error) {
        const apiError = error as ApiError;
        console.error('❌ Hook: Failed to fetch positions:', apiError);
        throw apiError;
      }
    },
    [dispatch]
  );

  /**
   * Fetches a single position by ID
   * @param id - Position ID to fetch
   * @returns Promise resolving to position data
   * @throws ApiError on failure
   */
  const handleFetchPositionById = useCallback(
    async (id: number): Promise<Position> => {
      try {
        console.log(`🔄 Hook: Fetching position with ID: ${id}`);
        
        const resultAction = await dispatch(fetchPositionById(id));
        const result = unwrapResult(resultAction);
        
        console.log(`✅ Hook: Successfully fetched position: ${result.name}`);
        return result;
        
      } catch (error) {
        const apiError = error as ApiError;
        console.error(`❌ Hook: Failed to fetch position ${id}:`, apiError);
        throw apiError;
      }
    },
    [dispatch]
  );

  /**
   * Creates a new position
   * @param data - Position data for creation
   * @returns Promise resolving to created position
   * @throws ApiError on failure
   */
  const handleCreatePosition = useCallback(
    async (data: CreatePositionDto): Promise<Position> => {
      try {
        console.log('🔄 Hook: Creating position with data:', data);
        
        const resultAction = await dispatch(createPosition(data));
        const result = unwrapResult(resultAction);
        
        console.log(`✅ Hook: Successfully created position: ${result.name} (ID: ${result.id})`);
        return result;
        
      } catch (error) {
        const apiError = error as ApiError;
        console.error('❌ Hook: Failed to create position:', apiError);
        throw apiError;
      }
    },
    [dispatch]
  );

  /**
   * Updates an existing position
   * @param id - Position ID to update
   * @param data - Updated position data
   * @returns Promise resolving to updated position
   * @throws ApiError on failure
   */
  const handleUpdatePosition = useCallback(
    async (id: number, data: UpdatePositionDto): Promise<Position> => {
      try {
        console.log(`🔄 Hook: Updating position ${id} with data:`, data);
        
        const resultAction = await dispatch(updatePosition({ id, data }));
        const result = unwrapResult(resultAction);
        
        console.log(`✅ Hook: Successfully updated position: ${result.name} (ID: ${result.id})`);
        return result;
        
      } catch (error) {
        const apiError = error as ApiError;
        console.error(`❌ Hook: Failed to update position ${id}:`, apiError);
        throw apiError;
      }
    },
    [dispatch]
  );

  /**
   * Deletes a position by ID
   * @param id - Position ID to delete
   * @returns Promise resolving to void
   * @throws ApiError on failure
   */
  const handleDeletePosition = useCallback(
    async (id: number): Promise<void> => {
      try {
        console.log(`🔄 Hook: Deleting position with ID: ${id}`);
        
        const resultAction = await dispatch(deletePosition(id));
        unwrapResult(resultAction);
        
        console.log(`✅ Hook: Successfully deleted position with ID: ${id}`);
        
      } catch (error) {
        const apiError = error as ApiError;
        console.error(`❌ Hook: Failed to delete position ${id}:`, apiError);
        throw apiError;
      }
    },
    [dispatch]
  );

  // ================================
  // Synchronous Action Handlers
  // ================================

  /**
   * Sets the currently selected position
   * @param position - Position to select or null to clear
   */
  const handleSetSelectedPosition = useCallback(
    (position: Position | null) => {
      console.log('🔄 Hook: Setting selected position:', position?.name || 'null');
      dispatch(setSelectedPosition(position));
    },
    [dispatch]
  );

  /**
   * Clears the currently selected position
   */
  const handleClearSelectedPosition = useCallback(() => {
    console.log('🔄 Hook: Clearing selected position');
    dispatch(clearSelectedPosition());
  }, [dispatch]);

  /**
   * Opens the create position modal
   */
  const handleOpenCreateModal = useCallback(() => {
    console.log('🔄 Hook: Opening create modal');
    dispatch(openCreateModal());
  }, [dispatch]);

  /**
   * Closes the create position modal
   */
  const handleCloseCreateModal = useCallback(() => {
    console.log('🔄 Hook: Closing create modal');
    dispatch(closeCreateModal());
  }, [dispatch]);

  /**
   * Opens the edit position modal
   */
  const handleOpenEditModal = useCallback(() => {
    console.log('🔄 Hook: Opening edit modal');
    dispatch(openEditModal());
  }, [dispatch]);

  /**
   * Closes the edit position modal
   */
  const handleCloseEditModal = useCallback(() => {
    console.log('🔄 Hook: Closing edit modal');
    dispatch(closeEditModal());
  }, [dispatch]);

  /**
   * Sets the position ID being deleted (for confirmation dialogs)
   * @param id - Position ID to delete or null to cancel
   */
  const handleSetDeletingId = useCallback(
    (id: number | null) => {
      console.log(`🔄 Hook: Setting deleting ID: ${id}`);
      dispatch(setDeletingId(id));
    },
    [dispatch]
  );

  /**
   * Clears all error states
   */
  const handleClearAllErrors = useCallback(() => {
    console.log('🔄 Hook: Clearing all errors');
    dispatch(clearAllErrors());
  }, [dispatch]);

  /**
   * Clears a specific error by operation type
   * @param errorType - Type of error to clear
   */
  const handleClearError = useCallback(
    (errorType: keyof PositionsState['error']) => {
      console.log(`🔄 Hook: Clearing ${errorType} error`);
      dispatch(clearError(errorType));
    },
    [dispatch]
  );

  /**
   * Updates pagination metadata
   * @param paginationData - Partial pagination data to update
   */
  const handleUpdatePagination = useCallback(
    (paginationData: Partial<PositionsState['pagination']>) => {
      console.log('🔄 Hook: Updating pagination:', paginationData);
      dispatch(updatePagination(paginationData));
    },
    [dispatch]
  );

  /**
   * Resets the entire positions state to initial values
   */
  const handleResetState = useCallback(() => {
    console.log('🔄 Hook: Resetting positions state');
    dispatch(resetPositionsState());
  }, [dispatch]);

  // ================================
  // Convenience Methods
  // ================================

  /**
   * Refreshes the positions list with the last used parameters
   * @returns Promise resolving to positions array
   */
  const refreshPositions = useCallback(
    async (): Promise<Position[]> => {
      const params: PositionsQueryParams = {
        per_page: pagination.perPage,
        page: pagination.currentPage,
      };
      return handleFetchPositions(params);
    },
    [handleFetchPositions, pagination.perPage, pagination.currentPage]
  );

  /**
   * Checks if a specific operation is currently loading
   * @param operation - Operation type to check
   * @returns Boolean indicating loading state
   */
  const isPositionLoading = useCallback(
    (operation: keyof PositionsState['loading']): boolean => {
      return loading[operation];
    },
    [loading]
  );

  /**
   * Checks if a specific operation has an error
   * @param operation - Operation type to check
   * @returns Boolean indicating error state
   */
  const hasError = useCallback(
    (operation: keyof PositionsState['error']): boolean => {
      return error[operation] !== null;
    },
    [error]
  );

  /**
   * Gets the error message for a specific operation
   * @param operation - Operation type to get error for
   * @returns Error message or null
   */
  const getErrorMessage = useCallback(
    (operation: keyof PositionsState['error']): string | null => {
      return error[operation];
    },
    [error]
  );

  // ================================
  // Memoized Return Object
  // ================================

  return useMemo(
    () => ({
      // State
      positions,
      selectedPosition,
      loading,
      error,
      pagination,
      ui,
      isAnyLoading,

      // Async Actions
      fetchPositions: handleFetchPositions,
      fetchPositionById: handleFetchPositionById,
      createPosition: handleCreatePosition,
      updatePosition: handleUpdatePosition,
      deletePosition: handleDeletePosition,

      // Utility Actions
      setSelectedPosition: handleSetSelectedPosition,
      clearSelectedPosition: handleClearSelectedPosition,
      getPositionById,

      // Modal Management
      openCreateModal: handleOpenCreateModal,
      closeCreateModal: handleCloseCreateModal,
      openEditModal: handleOpenEditModal,
      closeEditModal: handleCloseEditModal,

      // Delete Management
      setDeletingId: handleSetDeletingId,

      // Error Management
      clearAllErrors: handleClearAllErrors,
      clearError: handleClearError,

      // Pagination Management
      updatePagination: handleUpdatePagination,

      // State Reset
      resetState: handleResetState,

      // Convenience Methods
      refreshPositions,
      isPositionLoading,
      hasError,
      getErrorMessage,
    }),
    [
      // State dependencies
      positions,
      selectedPosition,
      loading,
      error,
      pagination,
      ui,
      isAnyLoading,

      // Action dependencies
      handleFetchPositions,
      handleFetchPositionById,
      handleCreatePosition,
      handleUpdatePosition,
      handleDeletePosition,
      handleSetSelectedPosition,
      handleClearSelectedPosition,
      getPositionById,
      handleOpenCreateModal,
      handleCloseCreateModal,
      handleOpenEditModal,
      handleCloseEditModal,
      handleSetDeletingId,
      handleClearAllErrors,
      handleClearError,
      handleUpdatePagination,
      handleResetState,

      // Convenience method dependencies
      refreshPositions,
      isPositionLoading,
      hasError,
      getErrorMessage,
    ]
  );
};

/**
 * Export the hook as default
 */
export default usePositions;

/**
 * Type exports for external use
 */
export type { UsePositionsReturn };
