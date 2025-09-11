// src/features/preferences/store/preferencesSlice.ts

/**
 * Preferences Redux Slice
 *
 * This slice manages preference state using Redux Toolkit with createSlice
 * and createAsyncThunk for async operations. It provides comprehensive state
 * management for all CRUD operations with loading and error handling.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  Preference,
  CreatePreferenceDto,
  UpdatePreferenceDto,
  PreferencesState,
  ApiError,
  AsyncThunkConfig,
} from '../types';
import { preferenceApiService } from '../services/api';

/**
 * Initial state for the preferences slice
 * Provides default values for all state properties
 */
const initialState: PreferencesState = {
  preferences: [],
  selectedPreference: null,
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

export const fetchPreferences = createAsyncThunk<
  Preference[],
  void,
  AsyncThunkConfig
>('preferences/fetchPreferences', async (_, { rejectWithValue }) => {
  try {
    console.log('🔄 Redux: Starting fetchPreferences');
    const preferences = await preferenceApiService.getAllPreferences();
    console.log(`✅ Redux: Successfully fetched ${preferences.length} preferences`);
    return preferences;
  } catch (error) {
    const apiError = error as ApiError;
    console.error('❌ Redux: fetchPreferences failed:', apiError);
    return rejectWithValue(apiError);
  }
});

export const fetchPreferenceById = createAsyncThunk<
  Preference,
  number,
  AsyncThunkConfig
>('preferences/fetchPreferenceById', async (id, { rejectWithValue }) => {
  try {
    console.log(`🔄 Redux: Starting fetchPreferenceById for ID: ${id}`);
    const preference = await preferenceApiService.getPreferenceById(id);
    console.log(`✅ Redux: Successfully fetched preference: ${preference.name}`);
    return preference;
  } catch (error) {
    const apiError = error as ApiError;
    console.error(`❌ Redux: fetchPreferenceById failed for ID ${id}:`, apiError);
    return rejectWithValue(apiError);
  }
});

export const createPreference = createAsyncThunk<
  Preference,
  CreatePreferenceDto,
  AsyncThunkConfig
>('preferences/createPreference', async (preferenceData, { rejectWithValue }) => {
  try {
    console.log('🔄 Redux: Starting createPreference with data:', preferenceData);
    const newPreference = await preferenceApiService.createPreference(preferenceData);
    console.log(`✅ Redux: Successfully created preference: ${newPreference.name} (ID: ${newPreference.id})`);
    return newPreference;
  } catch (error) {
    const apiError = error as ApiError;
    console.error('❌ Redux: createPreference failed:', apiError);
    return rejectWithValue(apiError);
  }
});

export const updatePreference = createAsyncThunk<
  Preference,
  { id: number; data: UpdatePreferenceDto },
  AsyncThunkConfig
>('preferences/updatePreference', async ({ id, data }, { rejectWithValue }) => {
  try {
    console.log(`🔄 Redux: Starting updatePreference for ID ${id} with data:`, data);
    const updatedPreference = await preferenceApiService.updatePreference(id, data);
    console.log(`✅ Redux: Successfully updated preference: ${updatedPreference.name} (ID: ${updatedPreference.id})`);
    return updatedPreference;
  } catch (error) {
    const apiError = error as ApiError;
    console.error(`❌ Redux: updatePreference failed for ID ${id}:`, apiError);
    return rejectWithValue(apiError);
  }
});

export const deletePreference = createAsyncThunk<number, number, AsyncThunkConfig>(
  'preferences/deletePreference',
  async (id, { rejectWithValue }) => {
    try {
      console.log(`🔄 Redux: Starting deletePreference for ID: ${id}`);
      await preferenceApiService.deletePreference(id);
      console.log(`✅ Redux: Successfully deleted preference with ID: ${id}`);
      return id;
    } catch (error) {
      const apiError = error as ApiError;
      console.error(`❌ Redux: deletePreference failed for ID ${id}:`, apiError);
      return rejectWithValue(apiError);
    }
  },
);


// ================================
// Preferences Slice
// ================================

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setSelectedPreference: (
      state,
      action: PayloadAction<Preference | null>,
    ) => {
      state.selectedPreference = action.payload;
      state.error.single = null;
    },
    clearSelectedPreference: (state) => {
      state.selectedPreference = null;
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
    clearError: (state, action: PayloadAction<keyof PreferencesState['error']>) => {
      state.error[action.payload] = null;
    },
    resetPreferencesState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Preferences
      .addCase(fetchPreferences.pending, (state) => {
        state.loading.list = true;
        state.error.list = null;
      })
      .addCase(fetchPreferences.fulfilled, (state, action) => {
        state.loading.list = false;
        state.preferences = action.payload;
        state.error.list = null;
      })
      .addCase(fetchPreferences.rejected, (state, action) => {
        state.loading.list = false;
        state.error.list = action.payload?.message || 'Failed to fetch preferences';
        console.error('❌ Redux: fetchPreferences rejected:', action.payload);
      })

      // Fetch Single Preference
      .addCase(fetchPreferenceById.pending, (state) => {
        state.loading.single = true;
        state.error.single = null;
      })
      .addCase(fetchPreferenceById.fulfilled, (state, action) => {
        state.loading.single = false;
        state.selectedPreference = action.payload;
        state.error.single = null;
      })
      .addCase(fetchPreferenceById.rejected, (state, action) => {
        state.loading.single = false;
        state.selectedPreference = null;
        state.error.single = action.payload?.message || 'Failed to fetch preference';
        console.error('❌ Redux: fetchPreferenceById rejected:', action.payload);
      })

      // Create Preference
      .addCase(createPreference.pending, (state) => {
        state.loading.create = true;
        state.error.create = null;
      })
      .addCase(createPreference.fulfilled, (state, action) => {
        state.loading.create = false;
        state.error.create = null;
        state.preferences.unshift(action.payload);
        state.ui.isCreateModalOpen = false;
        state.selectedPreference = action.payload;
      })
      .addCase(createPreference.rejected, (state, action) => {
        state.loading.create = false;
        state.error.create = action.payload?.message || 'Failed to create preference';
        console.error('❌ Redux: createPreference rejected:', action.payload);
      })

      // Update Preference
      .addCase(updatePreference.pending, (state) => {
        state.loading.update = true;
        state.error.update = null;
      })
      .addCase(updatePreference.fulfilled, (state, action) => {
        state.loading.update = false;
        state.error.update = null;

        const index = state.preferences.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) {
          state.preferences[index] = action.payload;
        }

        if (state.selectedPreference?.id === action.payload.id) {
          state.selectedPreference = action.payload;
        }

        state.ui.isEditModalOpen = false;
      })
      .addCase(updatePreference.rejected, (state, action) => {
        state.loading.update = false;
        state.error.update = action.payload?.message || 'Failed to update preference';
        console.error('❌ Redux: updatePreference rejected:', action.payload);
      })

      // Delete Preference
      .addCase(deletePreference.pending, (state) => {
        state.loading.delete = true;
        state.error.delete = null;
      })
      .addCase(deletePreference.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.error.delete = null;

        const deletedId = action.payload;
        state.preferences = state.preferences.filter((p) => p.id !== deletedId);

        if (state.selectedPreference?.id === deletedId) {
          state.selectedPreference = null;
        }

        state.ui.deletingId = null;
      })
      .addCase(deletePreference.rejected, (state, action) => {
        state.loading.delete = false;
        state.error.delete = action.payload?.message || 'Failed to delete preference';
        state.ui.deletingId = null;
        console.error('❌ Redux: deletePreference rejected:', action.payload);
      });
  },
});


// ================================
// Export Actions and Selectors
// ================================

export const {
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
} = preferencesSlice.actions;

// Selectors for accessing preferences state
export const selectPreferences = (state: { preferences: PreferencesState }) =>
  state.preferences.preferences;
export const selectSelectedPreference = (state: { preferences: PreferencesState }) =>
  state.preferences.selectedPreference;
export const selectPreferencesLoading = (state: { preferences: PreferencesState }) =>
  state.preferences.loading;
export const selectPreferencesError = (state: { preferences: PreferencesState }) =>
  state.preferences.error;
export const selectPreferencesUI = (state: { preferences: PreferencesState }) =>
  state.preferences.ui;

export const selectIsAnyLoading = (state: { preferences: PreferencesState }) => {
  const loading = state.preferences.loading;
  return (
    loading.list ||
    loading.single ||
    loading.create ||
    loading.update ||
    loading.delete
  );
};

export const selectPreferenceById =
  (id: number) => (state: { preferences: PreferencesState }) =>
    state.preferences.preferences.find((preference) => preference.id === id);

// Export the reducer as default
export default preferencesSlice.reducer;

// Type export for the preferences state shape
export type { PreferencesState };
