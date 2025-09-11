// src/features/preferences/hooks/usePreferences.ts

/**
 * Custom React Hook for Preferences Management
 *
 * This hook provides a clean interface to interact with preference state and actions.
 * It wraps Redux Toolkit slice actions and provides typed methods for all CRUD
 * operations with automatic loading and error state management.
 */

import { useCallback, useMemo } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';
import {
  // Async thunk actions
  fetchPreferences,
  fetchPreferenceById,
  createPreference,
  updatePreference,
  deletePreference,

  // Synchronous actions
  setSelectedPreference,
  clearSelectedPreference,
  openCreateModal,
  closeCreateModal,
  openEditModal,
  closeEditModal,
  setDeletingId,
  clearAllErrors,
  clearError,
  resetPreferencesState,

  // Selectors
  selectPreferences,
  selectSelectedPreference,
  selectPreferencesLoading,
  selectPreferencesError,
  selectPreferencesUI,
  selectIsAnyLoading,
} from '../store/preferencesSlice';
import type {
  Preference,
  CreatePreferenceDto,
  UpdatePreferenceDto,
  PreferencesState,
  ApiError,
} from '../types';

// Typed hooks - assume these are defined in your store/hooks.ts file
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';

type RootState = {
  preferences: PreferencesState;
  // add other slices as needed
};

type AppDispatch = any; // Replace with your actual AppDispatch type from store

const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Interface for the return value of usePreferences hook
 * Provides typed access to all preference-related state and actions
 */
interface UsePreferencesReturn {
  // State
  /** Array of all loaded preferences */
  preferences: Preference[];
  /** Currently selected preference */
  selectedPreference: PreferencesState['selectedPreference'];
  /** Loading states for each operation */
  loading: PreferencesState['loading'];
  /** Error states for each operation */
  error: PreferencesState['error'];
  /** UI state flags */
  ui: PreferencesState['ui'];
  /** Whether any operation is currently loading */
  isAnyLoading: boolean;

  // Actions
  /** Fetches all preferences */
  fetchPreferences: () => Promise<Preference[]>;
  /** Fetches a single preference by ID */
  fetchPreferenceById: (id: number) => Promise<PreferencesState['selectedPreference']>;
  /** Creates a new preference */
  createPreference: (data: CreatePreferenceDto) => Promise<Preference>;
  /** Updates an existing preference */
  updatePreference: (id: number, data: UpdatePreferenceDto) => Promise<Preference>;
  /** Deletes a preference by ID */
  deletePreference: (id: number) => Promise<void>;

  // Utility actions
  /** Sets the currently selected preference */
  setSelectedPreference: (preference: PreferencesState['selectedPreference']) => void;
  /** Clears the currently selected preference */
  clearSelectedPreference: () => void;
  /** Gets a preference by ID from current state */
  getPreferenceById: (id: number) => Preference | undefined;

  // Modal management
  /** Opens the create preference modal */
  openCreateModal: () => void;
  /** Closes the create preference modal */
  closeCreateModal: () => void;
  /** Opens the edit preference modal */
  openEditModal: () => void;
  /** Closes the edit preference modal */
  closeEditModal: () => void;

  // Delete management
  /** Sets the preference ID being deleted (for confirmation) */
  setDeletingId: (id: number | null) => void;

  // Error management
  /** Clears all error states */
  clearAllErrors: () => void;
  /** Clears a specific error by operation type */
  clearError: (errorType: keyof PreferencesState['error']) => void;

  // State reset
  /** Resets entire preferences state */
  resetState: () => void;
}

/**
 * Custom hook for preferences management
 *
 * @returns Object containing preference state, loading states, error states, and action methods
 */
export const usePreferences = (): UsePreferencesReturn => {
  const dispatch = useAppDispatch();

  const preferences = useAppSelector(selectPreferences);
  const selectedPreference = useAppSelector(selectSelectedPreference);
  const loading = useAppSelector(selectPreferencesLoading);
  const error = useAppSelector(selectPreferencesError);
  const ui = useAppSelector(selectPreferencesUI);
  const isAnyLoading = useAppSelector(selectIsAnyLoading);

  // Memoized selector for getting preference by ID
  const getPreferenceById = useCallback(
    (id: number): Preference | undefined => {
      return preferences.find(preference => preference.id === id);
    },
    [preferences]
  );

  // ================================
  // Async Action Handlers
  // ================================

  const handleFetchPreferences = useCallback(
    async (): Promise<Preference[]> => {
      try {
        console.log('🔄 Hook: Fetching preferences');
        const resultAction = await dispatch(fetchPreferences());
        const result = unwrapResult(resultAction);
        console.log(`✅ Hook: Successfully fetched ${result.length} preferences`);
        return result;
      } catch (error) {
        const apiError = error as ApiError;
        console.error('❌ Hook: Failed to fetch preferences:', apiError);
        throw apiError;
      }
    },
    [dispatch]
  );

  const handleFetchPreferenceById = useCallback(
    async (id: number): Promise<PreferencesState['selectedPreference']> => {
      try {
        console.log(`🔄 Hook: Fetching preference with ID: ${id}`);
        const resultAction = await dispatch(fetchPreferenceById(id));
        const result = unwrapResult(resultAction);
        console.log(`✅ Hook: Successfully fetched preference: ${result?.name}`);
        return result;
      } catch (error) {
        const apiError = error as ApiError;
        console.error(`❌ Hook: Failed to fetch preference ${id}:`, apiError);
        throw apiError;
      }
    },
    [dispatch]
  );

  const handleCreatePreference = useCallback(
    async (data: CreatePreferenceDto): Promise<Preference> => {
      try {
        console.log('🔄 Hook: Creating preference with data:', data);
        const resultAction = await dispatch(createPreference(data));
        const result = unwrapResult(resultAction);
        console.log(`✅ Hook: Successfully created preference: ${result.name} (ID: ${result.id})`);
        return result;
      } catch (error) {
        const apiError = error as ApiError;
        console.error('❌ Hook: Failed to create preference:', apiError);
        throw apiError;
      }
    },
    [dispatch]
  );

  const handleUpdatePreference = useCallback(
    async (id: number, data: UpdatePreferenceDto): Promise<Preference> => {
      try {
        console.log(`🔄 Hook: Updating preference ${id} with data:`, data);
        const resultAction = await dispatch(updatePreference({ id, data }));
        const result = unwrapResult(resultAction);
        console.log(`✅ Hook: Successfully updated preference: ${result.name} (ID: ${result.id})`);
        return result;
      } catch (error) {
        const apiError = error as ApiError;
        console.error(`❌ Hook: Failed to update preference ${id}:`, apiError);
        throw apiError;
      }
    },
    [dispatch]
  );

  const handleDeletePreference = useCallback(
    async (id: number): Promise<void> => {
      try {
        console.log(`🔄 Hook: Deleting preference with ID: ${id}`);
        const resultAction = await dispatch(deletePreference(id));
        unwrapResult(resultAction);
        console.log(`✅ Hook: Successfully deleted preference with ID: ${id}`);
      } catch (error) {
        const apiError = error as ApiError;
        console.error(`❌ Hook: Failed to delete preference ${id}:`, apiError);
        throw apiError;
      }
    },
    [dispatch]
  );

  // ================================
  // Synchronous Action Handlers
  // ================================

  const handleSetSelectedPreference = useCallback(
    (preference: PreferencesState['selectedPreference']) => {
      console.log('🔄 Hook: Setting selected preference:', preference?.name || 'null');
      dispatch(setSelectedPreference(preference));
    },
    [dispatch]
  );

  const handleClearSelectedPreference = useCallback(() => {
    console.log('🔄 Hook: Clearing selected preference');
    dispatch(clearSelectedPreference());
  }, [dispatch]);

  const handleOpenCreateModal = useCallback(() => {
    console.log('🔄 Hook: Opening create modal');
    dispatch(openCreateModal());
  }, [dispatch]);

  const handleCloseCreateModal = useCallback(() => {
    console.log('🔄 Hook: Closing create modal');
    dispatch(closeCreateModal());
  }, [dispatch]);

  const handleOpenEditModal = useCallback(() => {
    console.log('🔄 Hook: Opening edit modal');
    dispatch(openEditModal());
  }, [dispatch]);

  const handleCloseEditModal = useCallback(() => {
    console.log('🔄 Hook: Closing edit modal');
    dispatch(closeEditModal());
  }, [dispatch]);

  const handleSetDeletingId = useCallback(
    (id: number | null) => {
      console.log(`🔄 Hook: Setting deleting ID: ${id}`);
      dispatch(setDeletingId(id));
    },
    [dispatch]
  );

  const handleClearAllErrors = useCallback(() => {
    console.log('🔄 Hook: Clearing all errors');
    dispatch(clearAllErrors());
  }, [dispatch]);

  const handleClearError = useCallback(
    (errorType: keyof PreferencesState['error']) => {
      console.log(`🔄 Hook: Clearing ${errorType} error`);
      dispatch(clearError(errorType));
    },
    [dispatch]
  );

  const handleResetState = useCallback(() => {
    console.log('🔄 Hook: Resetting preferences state');
    dispatch(resetPreferencesState());
  }, [dispatch]);

  // ================================
  // Return Memoized Object
  // ================================

  return useMemo(
    () => ({
      preferences,
      selectedPreference,
      loading,
      error,
      ui,
      isAnyLoading,

      fetchPreferences: handleFetchPreferences,
      fetchPreferenceById: handleFetchPreferenceById,
      createPreference: handleCreatePreference,
      updatePreference: handleUpdatePreference,
      deletePreference: handleDeletePreference,

      setSelectedPreference: handleSetSelectedPreference,
      clearSelectedPreference: handleClearSelectedPreference,
      getPreferenceById,

      openCreateModal: handleOpenCreateModal,
      closeCreateModal: handleCloseCreateModal,
      openEditModal: handleOpenEditModal,
      closeEditModal: handleCloseEditModal,

      setDeletingId: handleSetDeletingId,

      clearAllErrors: handleClearAllErrors,
      clearError: handleClearError,

      resetState: handleResetState,
    }),
    [
      preferences,
      selectedPreference,
      loading,
      error,
      ui,
      isAnyLoading,

      handleFetchPreferences,
      handleFetchPreferenceById,
      handleCreatePreference,
      handleUpdatePreference,
      handleDeletePreference,

      handleSetSelectedPreference,
      handleClearSelectedPreference,
      getPreferenceById,

      handleOpenCreateModal,
      handleCloseCreateModal,
      handleOpenEditModal,
      handleCloseEditModal,

      handleSetDeletingId,

      handleClearAllErrors,
      handleClearError,

      handleResetState,
    ]
  );
};

/**
 * Export the hook as default
 */
export default usePreferences;

/**
 * Type exports for external use
 */
export type { UsePreferencesReturn };
