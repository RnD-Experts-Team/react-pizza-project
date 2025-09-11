// src/features/skills/hooks/useSkills.ts
/**
 * Custom React Hook for Skills Management
 *
 * This hook provides a clean interface to interact with skill state and actions.
 * It wraps Redux Toolkit slice actions and provides typed methods for all CRUD
 * operations with automatic loading and error state management.
 */

import { useCallback, useMemo } from 'react';
import { unwrapResult } from '@reduxjs/toolkit';
import {
  // Async thunk actions
  fetchSkills,
  fetchSkillById,
  createSkill,
  updateSkill,
  deleteSkill,

  // Synchronous actions
  setSelectedSkill,
  clearSelectedSkill,
  openCreateModal,
  closeCreateModal,
  openEditModal,
  closeEditModal,
  setDeletingId,
  clearAllErrors,
  clearError,
  resetSkillsState,

  // Selectors
  selectSkills,
  selectSelectedSkill,
  selectSkillsLoading,
  selectSkillsError,
  selectSkillsUI,
  selectIsAnyLoading,
} from '../store/skillSlice';
import type {
  Skill,
  CreateSkillDto,
  UpdateSkillDto,
  SkillsState,
  ApiError,
} from '../types';

// Typed hooks - should be defined in your store/hooks.ts file
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';

type RootState = {
  skills: SkillsState;
  // add other slices as needed
};

type AppDispatch = any; // Replace with your actual AppDispatch type from store

const useAppDispatch = () => useDispatch<AppDispatch>();
const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/**
 * Interface for the return value of useSkills hook
 * Provides typed access to all skill-related state and actions
 */
interface UseSkillsReturn {
  // State
  /** Array of all loaded skills */
  skills: Skill[];
  /** Currently selected skill */
  selectedSkill: SkillsState['selectedSkill'];
  /** Loading states for each operation */
  loading: SkillsState['loading'];
  /** Error states for each operation */
  error: SkillsState['error'];
  /** UI state flags */
  ui: SkillsState['ui'];
  /** Whether any operation is currently loading */
  isAnyLoading: boolean;

  // Actions
  /** Fetches all skills */
  fetchSkills: () => Promise<Skill[]>;
  /** Fetches a single skill by ID */
  fetchSkillById: (id: number) => Promise<SkillsState['selectedSkill']>;
  /** Creates a new skill */
  createSkill: (data: CreateSkillDto) => Promise<Skill>;
  /** Updates an existing skill */
  updateSkill: (id: number, data: UpdateSkillDto) => Promise<Skill>;
  /** Deletes a skill by ID */
  deleteSkill: (id: number) => Promise<void>;

  // Utility actions
  /** Sets the currently selected skill */
  setSelectedSkill: (skill: SkillsState['selectedSkill']) => void;
  /** Clears the currently selected skill */
  clearSelectedSkill: () => void;
  /** Gets a skill by ID from current state */
  getSkillById: (id: number) => Skill | undefined;

  // Modal management
  /** Opens the create skill modal */
  openCreateModal: () => void;
  /** Closes the create skill modal */
  closeCreateModal: () => void;
  /** Opens the edit skill modal */
  openEditModal: () => void;
  /** Closes the edit skill modal */
  closeEditModal: () => void;

  // Delete management
  /** Sets the skill ID being deleted (for confirmation) */
  setDeletingId: (id: number | null) => void;

  // Error management
  /** Clears all error states */
  clearAllErrors: () => void;
  /** Clears a specific error by operation type */
  clearError: (errorType: keyof SkillsState['error']) => void;

  // State reset
  /** Resets entire skills state */
  resetState: () => void;
}

/**
 * Custom hook for skills management
 *
 * @returns Object containing skill state, loading states, error states, and action methods
 */
export const useSkills = (): UseSkillsReturn => {
  const dispatch = useAppDispatch();

  const skills = useAppSelector(selectSkills);
  const selectedSkill = useAppSelector(selectSelectedSkill);
  const loading = useAppSelector(selectSkillsLoading);
  const error = useAppSelector(selectSkillsError);
  const ui = useAppSelector(selectSkillsUI);
  const isAnyLoading = useAppSelector(selectIsAnyLoading);

  // Memoized selector for getting skill by ID
  const getSkillById = useCallback(
    (id: number): Skill | undefined => {
      return skills.find(skill => skill.id === id);
    },
    [skills]
  );

  // ================================
  // Async Action Handlers
  // ================================

  const handleFetchSkills = useCallback(
    async (): Promise<Skill[]> => {
      try {
        console.log('🔄 Hook: Fetching skills');
        const resultAction = await dispatch(fetchSkills());
        const result = unwrapResult(resultAction);
        console.log(`✅ Hook: Successfully fetched ${result.length} skills`);
        return result;
      } catch (error) {
        const apiError = error as ApiError;
        console.error('❌ Hook: Failed to fetch skills:', apiError);
        throw apiError;
      }
    },
    [dispatch]
  );

  const handleFetchSkillById = useCallback(
    async (id: number): Promise<SkillsState['selectedSkill']> => {
      try {
        console.log(`🔄 Hook: Fetching skill with ID: ${id}`);
        const resultAction = await dispatch(fetchSkillById(id));
        const result = unwrapResult(resultAction);
        console.log(`✅ Hook: Successfully fetched skill: ${result?.name}`);
        return result;
      } catch (error) {
        const apiError = error as ApiError;
        console.error(`❌ Hook: Failed to fetch skill ${id}:`, apiError);
        throw apiError;
      }
    },
    [dispatch]
  );

  const handleCreateSkill = useCallback(
    async (data: CreateSkillDto): Promise<Skill> => {
      try {
        console.log('🔄 Hook: Creating skill with data:', data);
        const resultAction = await dispatch(createSkill(data));
        const result = unwrapResult(resultAction);
        console.log(`✅ Hook: Successfully created skill: ${result.name} (ID: ${result.id})`);
        return result;
      } catch (error) {
        const apiError = error as ApiError;
        console.error('❌ Hook: Failed to create skill:', apiError);
        throw apiError;
      }
    },
    [dispatch]
  );

  const handleUpdateSkill = useCallback(
    async (id: number, data: UpdateSkillDto): Promise<Skill> => {
      try {
        console.log(`🔄 Hook: Updating skill ${id} with data:`, data);
        const resultAction = await dispatch(updateSkill({ id, data }));
        const result = unwrapResult(resultAction);
        console.log(`✅ Hook: Successfully updated skill: ${result.name} (ID: ${result.id})`);
        return result;
      } catch (error) {
        const apiError = error as ApiError;
        console.error(`❌ Hook: Failed to update skill ${id}:`, apiError);
        throw apiError;
      }
    },
    [dispatch]
  );

  const handleDeleteSkill = useCallback(
    async (id: number): Promise<void> => {
      try {
        console.log(`🔄 Hook: Deleting skill with ID: ${id}`);
        const resultAction = await dispatch(deleteSkill(id));
        unwrapResult(resultAction);
        console.log(`✅ Hook: Successfully deleted skill with ID: ${id}`);
      } catch (error) {
        const apiError = error as ApiError;
        console.error(`❌ Hook: Failed to delete skill ${id}:`, apiError);
        throw apiError;
      }
    },
    [dispatch]
  );

  // ================================
  // Synchronous Action Handlers
  // ================================

  const handleSetSelectedSkill = useCallback(
    (skill: SkillsState['selectedSkill']) => {
      console.log('🔄 Hook: Setting selected skill:', skill?.name || 'null');
      dispatch(setSelectedSkill(skill));
    },
    [dispatch]
  );

  const handleClearSelectedSkill = useCallback(() => {
    console.log('🔄 Hook: Clearing selected skill');
    dispatch(clearSelectedSkill());
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
    (errorType: keyof SkillsState['error']) => {
      console.log(`🔄 Hook: Clearing ${errorType} error`);
      dispatch(clearError(errorType));
    },
    [dispatch]
  );

  const handleResetState = useCallback(() => {
    console.log('🔄 Hook: Resetting skills state');
    dispatch(resetSkillsState());
  }, [dispatch]);

  // ================================
  // Return Memoized Object
  // ================================

  return useMemo(
    () => ({
      skills,
      selectedSkill,
      loading,
      error,
      ui,
      isAnyLoading,

      fetchSkills: handleFetchSkills,
      fetchSkillById: handleFetchSkillById,
      createSkill: handleCreateSkill,
      updateSkill: handleUpdateSkill,
      deleteSkill: handleDeleteSkill,

      setSelectedSkill: handleSetSelectedSkill,
      clearSelectedSkill: handleClearSelectedSkill,
      getSkillById,

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
      skills,
      selectedSkill,
      loading,
      error,
      ui,
      isAnyLoading,

      handleFetchSkills,
      handleFetchSkillById,
      handleCreateSkill,
      handleUpdateSkill,
      handleDeleteSkill,

      handleSetSelectedSkill,
      handleClearSelectedSkill,
      getSkillById,

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
export default useSkills;

/**
 * Type exports for external use
 */
export type { UseSkillsReturn };
