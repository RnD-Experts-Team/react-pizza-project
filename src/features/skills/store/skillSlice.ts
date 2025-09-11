// src/features/skills/store/skillsSlice.ts
/**
 * Skills Redux Slice
 *
 * This slice manages the skill state using Redux Toolkit with createSlice
 * and createAsyncThunk for async operations. It provides comprehensive state
 * management for all CRUD operations with proper loading and error handling.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  Skill,
  SkillWithEmpInfos,
  CreateSkillDto,
  UpdateSkillDto,
  SkillsState,
  ApiError,
  AsyncThunkConfig,
} from '../types';
import { skillApiService } from '../services/api';

/**
 * Initial state for the skills slice
 * Provides default values for all state properties
 */
const initialState: SkillsState = {
  skills: [],
  // Updated to accept either SkillWithEmpInfos or Skill to fix emp_infos issue
  selectedSkill: null,
  loading: {
    list: false,
    single: false,
    create: false,
    update: false,
    delete: false,
  },
  error: {
    list: null,
    single: null,
    create: null,
    update: null,
    delete: null,
  },
  ui: {
    isCreateModalOpen: false,
    isEditModalOpen: false,
    deletingId: null,
  },
};

// ================================
// Async Thunk Actions
// ================================

export const fetchSkills = createAsyncThunk<Skill[], void, AsyncThunkConfig>(
  'skills/fetchSkills',
  async (_, { rejectWithValue }) => {
    try {
      console.log('🔄 Redux: Starting fetchSkills');
      const skills = await skillApiService.getAllSkills();
      console.log(`✅ Redux: Successfully fetched ${skills.length} skills`);
      return skills;
    } catch (error) {
      const apiError = error as ApiError;
      console.error('❌ Redux: fetchSkills failed:', apiError);
      return rejectWithValue(apiError);
    }
  },
);

export const fetchSkillById = createAsyncThunk<
  SkillWithEmpInfos,
  number,
  AsyncThunkConfig
>('skills/fetchSkillById', async (id, { rejectWithValue }) => {
  try {
    console.log(`🔄 Redux: Starting fetchSkillById for ID: ${id}`);
    const skill = await skillApiService.getSkillById(id);
    console.log(`✅ Redux: Successfully fetched skill: ${skill.name}`);
    return skill;
  } catch (error) {
    const apiError = error as ApiError;
    console.error(`❌ Redux: fetchSkillById failed for ID ${id}:`, apiError);
    return rejectWithValue(apiError);
  }
});

export const createSkill = createAsyncThunk<
  Skill,
  CreateSkillDto,
  AsyncThunkConfig
>('skills/createSkill', async (skillData, { rejectWithValue }) => {
  try {
    console.log('🔄 Redux: Starting createSkill with data:', skillData);
    const newSkill = await skillApiService.createSkill(skillData);
    console.log(
      `✅ Redux: Successfully created skill: ${newSkill.name} (ID: ${newSkill.id})`,
    );
    return newSkill;
  } catch (error) {
    const apiError = error as ApiError;
    console.error('❌ Redux: createSkill failed:', apiError);
    return rejectWithValue(apiError);
  }
});

export const updateSkill = createAsyncThunk<
  Skill,
  { id: number; data: UpdateSkillDto },
  AsyncThunkConfig
>('skills/updateSkill', async ({ id, data }, { rejectWithValue }) => {
  try {
    console.log(`🔄 Redux: Starting updateSkill for ID ${id} with data:`, data);
    const updatedSkill = await skillApiService.updateSkill(id, data);
    console.log(
      `✅ Redux: Successfully updated skill: ${updatedSkill.name} (ID: ${updatedSkill.id})`,
    );
    return updatedSkill;
  } catch (error) {
    const apiError = error as ApiError;
    console.error(`❌ Redux: updateSkill failed for ID ${id}:`, apiError);
    return rejectWithValue(apiError);
  }
});

export const deleteSkill = createAsyncThunk<number, number, AsyncThunkConfig>(
  'skills/deleteSkill',
  async (id, { rejectWithValue }) => {
    try {
      console.log(`🔄 Redux: Starting deleteSkill for ID: ${id}`);
      await skillApiService.deleteSkill(id);
      console.log(`✅ Redux: Successfully deleted skill with ID: ${id}`);
      return id;
    } catch (error) {
      const apiError = error as ApiError;
      console.error(`❌ Redux: deleteSkill failed for ID ${id}:`, apiError);
      return rejectWithValue(apiError);
    }
  },
);

// ================================
// Skills Slice
// ================================

const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {
    setSelectedSkill: (
      state,
      action: PayloadAction<SkillWithEmpInfos | Skill | null>,
    ) => {
      state.selectedSkill = action.payload;
      state.error.single = null;
    },
    clearSelectedSkill: (state) => {
      state.selectedSkill = null;
      state.error.single = null;
    },
    openCreateModal: (state) => {
      state.ui.isCreateModalOpen = true;
      state.error.create = null;
    },
    closeCreateModal: (state) => {
      state.ui.isCreateModalOpen = false;
      state.error.create = null;
    },
    openEditModal: (state) => {
      state.ui.isEditModalOpen = true;
      state.error.update = null;
    },
    closeEditModal: (state) => {
      state.ui.isEditModalOpen = false;
      state.error.update = null;
    },
    setDeletingId: (state, action: PayloadAction<number | null>) => {
      state.ui.deletingId = action.payload;
      if (action.payload === null) {
        state.error.delete = null;
      }
    },
    clearAllErrors: (state) => {
      state.error = {
        list: null,
        single: null,
        create: null,
        update: null,
        delete: null,
      };
    },
    clearError: (state, action: PayloadAction<keyof SkillsState['error']>) => {
      state.error[action.payload] = null;
    },
    resetSkillsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Skills
      .addCase(fetchSkills.pending, (state) => {
        state.loading.list = true;
        state.error.list = null;
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.loading.list = false;
        state.skills = action.payload;
        state.error.list = null;
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.loading.list = false;
        state.error.list = action.payload?.message || 'Failed to fetch skills';
        console.error('❌ Redux: fetchSkills rejected:', action.payload);
      })

      // Fetch Single Skill
      .addCase(fetchSkillById.pending, (state) => {
        state.loading.single = true;
        state.error.single = null;
      })
      .addCase(fetchSkillById.fulfilled, (state, action) => {
        state.loading.single = false;
        state.selectedSkill = action.payload;
        state.error.single = null;
      })
      .addCase(fetchSkillById.rejected, (state, action) => {
        state.loading.single = false;
        state.selectedSkill = null;
        state.error.single = action.payload?.message || 'Failed to fetch skill';
        console.error('❌ Redux: fetchSkillById rejected:', action.payload);
      })

      // Create Skill
      .addCase(createSkill.pending, (state) => {
        state.loading.create = true;
        state.error.create = null;
      })
      .addCase(createSkill.fulfilled, (state, action) => {
        state.loading.create = false;
        state.error.create = null;
        // Add new skill and set selectedSkill with emp_infos defaulted to empty array
        state.skills.unshift(action.payload);
        state.ui.isCreateModalOpen = false;
        state.selectedSkill = { ...action.payload, emp_infos: [] };
      })
      .addCase(createSkill.rejected, (state, action) => {
        state.loading.create = false;
        state.error.create =
          action.payload?.message || 'Failed to create skill';
        console.error('❌ Redux: createSkill rejected:', action.payload);
      })

      // Update Skill
      .addCase(updateSkill.pending, (state) => {
        state.loading.update = true;
        state.error.update = null;
      })
      .addCase(updateSkill.fulfilled, (state, action) => {
        state.loading.update = false;
        state.error.update = null;

        const index = state.skills.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) {
          state.skills[index] = action.payload;
        }

        if (state.selectedSkill?.id === action.payload.id) {
          if ('emp_infos' in state.selectedSkill) {
            state.selectedSkill = {
              ...action.payload,
              emp_infos: state.selectedSkill.emp_infos,
            };
          } else {
            state.selectedSkill = {
              ...action.payload,
              emp_infos: [],
            };
          }
        }

        state.ui.isEditModalOpen = false;
      })
      .addCase(updateSkill.rejected, (state, action) => {
        state.loading.update = false;
        state.error.update =
          action.payload?.message || 'Failed to update skill';
        console.error('❌ Redux: updateSkill rejected:', action.payload);
      })

      // Delete Skill
      .addCase(deleteSkill.pending, (state) => {
        state.loading.delete = true;
        state.error.delete = null;
      })
      .addCase(deleteSkill.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.error.delete = null;

        const deletedId = action.payload;
        state.skills = state.skills.filter((s) => s.id !== deletedId);

        if (state.selectedSkill?.id === deletedId) {
          state.selectedSkill = null;
        }

        state.ui.deletingId = null;
      })
      .addCase(deleteSkill.rejected, (state, action) => {
        state.loading.delete = false;
        state.error.delete =
          action.payload?.message || 'Failed to delete skill';
        state.ui.deletingId = null;
        console.error('❌ Redux: deleteSkill rejected:', action.payload);
      });
  },
});

// ================================
// Export Actions and Selectors
// ================================

export const {
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
} = skillsSlice.actions;

// Selectors for accessing skills state in a typed way
export const selectSkills = (state: { skills: SkillsState }) =>
  state.skills.skills;
export const selectSelectedSkill = (state: { skills: SkillsState }) =>
  state.skills.selectedSkill;
export const selectSkillsLoading = (state: { skills: SkillsState }) =>
  state.skills.loading;
export const selectSkillsError = (state: { skills: SkillsState }) =>
  state.skills.error;
export const selectSkillsUI = (state: { skills: SkillsState }) =>
  state.skills.ui;

export const selectIsAnyLoading = (state: { skills: SkillsState }) => {
  const loading = state.skills.loading;
  return (
    loading.list ||
    loading.single ||
    loading.create ||
    loading.update ||
    loading.delete
  );
};

export const selectSkillById =
  (id: number) => (state: { skills: SkillsState }) =>
    state.skills.skills.find((skill) => skill.id === id);

// Export the reducer as default
export default skillsSlice.reducer;

// Type export for the skills state shape
export type { SkillsState };
