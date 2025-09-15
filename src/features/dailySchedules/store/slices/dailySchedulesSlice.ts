// src/features/dailySchedules/store/slices/dailySchedulesSlice.ts

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../../store'; // TODO: fix import path for store
import {
  listDailySchedules as listDailySchedulesService,
  getDailySchedule as getDailyScheduleService,
  createDailySchedulesDay as createDailySchedulesDayService,
  createDailyScheduleSingle as createDailyScheduleSingleService,
  updateDailySchedule as updateDailyScheduleService,
  deleteDailySchedule as deleteDailyScheduleService,
  attachSkill as attachSkillService,
  detachSkill as detachSkillService,
  getWeeklySchedules as getWeeklySchedulesService,
} from '../../services/dailySchedulesService';
import type {
  ListDailySchedulesParams,
  DailySchedule,
  DayLevelCreateBody,
  DayLevelCreateResponse,
  SingleCreateBody,
  SingleCreateResponse,
  WeeklySchedulesParams,
  ValidationResult,
  DaySummary,
  ApiError,
} from '../../types';

/**
 * LEGACY/BACK-COMPAT: Daily schedules state interface
 * Secondary state slice - use weeklySchedulesSlice for primary operations
 */
interface DailySchedulesState {
  // Normalized entities for schedules (legacy endpoints)
  entities: Record<number, DailySchedule>;
  listIds: number[];
  
  // Last fetched list parameters (for cache management)
  lastListParams: ListDailySchedulesParams | null;
  
  // Validation results from legacy create/update operations
  lastValidationResult: ValidationResult | null;
  
  // Day summary from day-level create operations
  lastDaySummary: DaySummary | null;
  
  // Loading states for different legacy operations
  loading: {
    list: boolean;
    get: boolean;
    createDay: boolean;
    createSingle: boolean;
    update: boolean;
    delete: boolean;
    attachSkill: boolean;
    detachSkill: boolean;
    weeklyView: boolean;
  };
  
  // Error states for different legacy operations
  error: {
    list: ApiError | null;
    get: ApiError | null;
    createDay: ApiError | null;
    createSingle: ApiError | null;
    update: ApiError | null;
    delete: ApiError | null;
    attachSkill: ApiError | null;
    detachSkill: ApiError | null;
    weeklyView: ApiError | null;
  };
  
  // Currently selected schedule ID (for forms/details)
  selectedScheduleId: number | null;
  
  // Request tracking for operations
  currentRequestIds: Record<string, string | null>;
}

/**
 * Initial state for daily schedules slice (legacy)
 */
const initialState: DailySchedulesState = {
  entities: {},
  listIds: [],
  lastListParams: null,
  lastValidationResult: null,
  lastDaySummary: null,
  loading: {
    list: false,
    get: false,
    createDay: false,
    createSingle: false,
    update: false,
    delete: false,
    attachSkill: false,
    detachSkill: false,
    weeklyView: false,
  },
  error: {
    list: null,
    get: null,
    createDay: null,
    createSingle: null,
    update: null,
    delete: null,
    attachSkill: null,
    detachSkill: null,
    weeklyView: null,
  },
  selectedScheduleId: null,
  currentRequestIds: {},
};

/**
 * LEGACY THUNK: List daily schedules
 * Secondary endpoint - use weekly flow for primary operations
 */
export const listDailySchedules = createAsyncThunk<
  DailySchedule[],
  ListDailySchedulesParams | undefined,
  {
    state: RootState;
    rejectValue: ApiError;
  }
>('dailySchedules/list', async (params, { rejectWithValue, signal }) => {
  try {
    const response = await listDailySchedulesService(params, { signal });
    return response;
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error) {
      return rejectWithValue(error as ApiError);
    }
    return rejectWithValue({
      status: 0,
      message: error instanceof Error ? error.message : 'List operation failed',
      raw: error,
    } as ApiError);
  }
});

/**
 * LEGACY THUNK: Get single daily schedule
 * Secondary endpoint - use weekly flow for primary operations
 */
export const getDailySchedule = createAsyncThunk<
  DailySchedule,
  number,
  {
    state: RootState;
    rejectValue: ApiError;
  }
>('dailySchedules/get', async (id, { rejectWithValue, signal }) => {
  try {
    const response = await getDailyScheduleService(id, { signal });
    return response;
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error) {
      return rejectWithValue(error as ApiError);
    }
    return rejectWithValue({
      status: 0,
      message: error instanceof Error ? error.message : 'Get operation failed',
      raw: error,
    } as ApiError);
  }
});

/**
 * LEGACY THUNK: Create daily schedules (day-level)
 * Secondary endpoint - use weekly processWeeklySchedule for primary operations
 */
export const createDailySchedulesDay = createAsyncThunk<
  DayLevelCreateResponse,
  DayLevelCreateBody,
  {
    state: RootState;
    rejectValue: ApiError;
  }
>('dailySchedules/createDay', async (body, { rejectWithValue, signal }) => {
  try {
    const response = await createDailySchedulesDayService(body, { signal });
    return response;
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error) {
      return rejectWithValue(error as ApiError);
    }
    return rejectWithValue({
      status: 0,
      message: error instanceof Error ? error.message : 'Create day operation failed',
      raw: error,
    } as ApiError);
  }
});

/**
 * LEGACY THUNK: Create single daily schedule
 * Secondary endpoint - use weekly processWeeklySchedule for primary operations
 */
export const createDailyScheduleSingle = createAsyncThunk<
  SingleCreateResponse,
  SingleCreateBody,
  {
    state: RootState;
    rejectValue: ApiError;
  }
>('dailySchedules/createSingle', async (body, { rejectWithValue, signal }) => {
  try {
    const response = await createDailyScheduleSingleService(body, { signal });
    return response;
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error) {
      return rejectWithValue(error as ApiError);
    }
    return rejectWithValue({
      status: 0,
      message: error instanceof Error ? error.message : 'Create single operation failed',
      raw: error,
    } as ApiError);
  }
});

/**
 * LEGACY THUNK: Update daily schedule
 * Secondary endpoint - use weekly processWeeklySchedule for primary operations
 */
export const updateDailySchedule = createAsyncThunk<
  SingleCreateResponse,
  { id: number; body: SingleCreateBody },
  {
    state: RootState;
    rejectValue: ApiError;
  }
>('dailySchedules/update', async ({ id, body }, { rejectWithValue, signal }) => {
  try {
    const response = await updateDailyScheduleService(id, body, { signal });
    return response;
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error) {
      return rejectWithValue(error as ApiError);
    }
    return rejectWithValue({
      status: 0,
      message: error instanceof Error ? error.message : 'Update operation failed',
      raw: error,
    } as ApiError);
  }
});

/**
 * LEGACY THUNK: Delete daily schedule
 * Secondary endpoint - use weekly processWeeklySchedule for primary operations
 */
export const deleteDailySchedule = createAsyncThunk<
  number,
  number,
  {
    state: RootState;
    rejectValue: ApiError;
  }
>('dailySchedules/delete', async (id, { rejectWithValue, signal }) => {
  try {
    await deleteDailyScheduleService(id, { signal });
    return id; // Return the deleted ID for state cleanup
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error) {
      return rejectWithValue(error as ApiError);
    }
    return rejectWithValue({
      status: 0,
      message: error instanceof Error ? error.message : 'Delete operation failed',
      raw: error,
    } as ApiError);
  }
});

/**
 * LEGACY THUNK: Attach skill to daily schedule
 * Secondary endpoint - use weekly processWeeklySchedule for primary operations
 */
export const attachSkill = createAsyncThunk<
  { dailyScheduleId: number; skillId: number },
  { dailyScheduleId: number; skillId: number; isRequired?: boolean },
  {
    state: RootState;
    rejectValue: ApiError;
  }
>('dailySchedules/attachSkill', async ({ dailyScheduleId, skillId, isRequired }, { rejectWithValue, signal }) => {
  try {
    const body = isRequired !== undefined ? { is_required: isRequired } : undefined;
    await attachSkillService(dailyScheduleId, skillId, body, { signal });
    return { dailyScheduleId, skillId };
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error) {
      return rejectWithValue(error as ApiError);
    }
    return rejectWithValue({
      status: 0,
      message: error instanceof Error ? error.message : 'Attach skill operation failed',
      raw: error,
    } as ApiError);
  }
});

/**
 * LEGACY THUNK: Detach skill from daily schedule
 * Secondary endpoint - use weekly processWeeklySchedule for primary operations
 */
export const detachSkill = createAsyncThunk<
  { dailyScheduleId: number; skillId: number },
  { dailyScheduleId: number; skillId: number },
  {
    state: RootState;
    rejectValue: ApiError;
  }
>('dailySchedules/detachSkill', async ({ dailyScheduleId, skillId }, { rejectWithValue, signal }) => {
  try {
    await detachSkillService(dailyScheduleId, skillId, { signal });
    return { dailyScheduleId, skillId };
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error) {
      return rejectWithValue(error as ApiError);
    }
    return rejectWithValue({
      status: 0,
      message: error instanceof Error ? error.message : 'Detach skill operation failed',
      raw: error,
    } as ApiError);
  }
});

/**
 * LEGACY THUNK: Get weekly schedules for viewing
 * Secondary endpoint - use weekly analysis for primary operations
 */
export const getWeeklySchedules = createAsyncThunk<
  DailySchedule[],
  WeeklySchedulesParams,
  {
    state: RootState;
    rejectValue: ApiError;
  }
>('dailySchedules/getWeekly', async (params, { rejectWithValue, signal }) => {
  try {
    const response = await getWeeklySchedulesService(params, { signal });
    return response;
  } catch (error) {
    if (error && typeof error === 'object' && 'status' in error) {
      return rejectWithValue(error as ApiError);
    }
    return rejectWithValue({
      status: 0,
      message: error instanceof Error ? error.message : 'Weekly view operation failed',
      raw: error,
    } as ApiError);
  }
});

/**
 * LEGACY/BACK-COMPAT: Daily schedules slice
 * Secondary slice - use weeklySchedulesSlice for primary operations
 * Provides thin wrapper functionality for backward compatibility
 */
export const dailySchedulesSlice = createSlice({
  name: 'dailySchedules',
  initialState,
  reducers: {
    /**
     * Clear all errors
     */
    clearErrors: (state) => {
      Object.keys(state.error).forEach(key => {
        state.error[key as keyof typeof state.error] = null;
      });
    },
    
    /**
     * Clear specific operation error
     */
    clearOperationError: (state, action: PayloadAction<keyof DailySchedulesState['error']>) => {
      state.error[action.payload] = null;
    },
    
    /**
     * Clear validation result
     */
    clearValidationResult: (state) => {
      state.lastValidationResult = null;
    },
    
    /**
     * Clear day summary
     */
    clearDaySummary: (state) => {
      state.lastDaySummary = null;
    },
    
    /**
     * Set selected schedule ID
     */
    setSelectedSchedule: (state, action: PayloadAction<number | null>) => {
      state.selectedScheduleId = action.payload;
    },
    
    /**
     * Reset entire state to initial values
     */
    resetState: () => initialState,
    
    /**
     * Manually add/update schedule entity (for optimistic updates)
     */
    upsertScheduleEntity: (state, action: PayloadAction<DailySchedule>) => {
      const schedule = action.payload;
      state.entities[schedule.id] = schedule;
      if (!state.listIds.includes(schedule.id)) {
        state.listIds.push(schedule.id);
      }
    },
    
    /**
     * Remove schedule entity from state
     */
    removeScheduleEntity: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      delete state.entities[id];
      state.listIds = state.listIds.filter(scheduleId => scheduleId !== id);
      if (state.selectedScheduleId === id) {
        state.selectedScheduleId = null;
      }
    },
  },
  extraReducers: (builder) => {
    // List daily schedules
    builder
      .addCase(listDailySchedules.pending, (state, action) => {
        state.loading.list = true;
        state.error.list = null;
        state.currentRequestIds.list = action.meta.requestId;
      })
      .addCase(listDailySchedules.fulfilled, (state, action) => {
        const { requestId } = action.meta;
        
        if (state.loading.list && state.currentRequestIds.list === requestId) {
          state.loading.list = false;
          state.currentRequestIds.list = null;
          
          // Update normalized entities
          const schedules = action.payload;
          state.entities = {};
          state.listIds = [];
          
          schedules.forEach(schedule => {
            state.entities[schedule.id] = schedule;
            state.listIds.push(schedule.id);
          });
          
          state.error.list = null;
        }
      })
      .addCase(listDailySchedules.rejected, (state, action) => {
        const { requestId } = action.meta;
        
        if (state.loading.list && state.currentRequestIds.list === requestId) {
          state.loading.list = false;
          state.currentRequestIds.list = null;
          state.error.list = action.payload || { status: 0, message: 'List failed' } as ApiError;
        }
      });

    // Get single daily schedule
    builder
      .addCase(getDailySchedule.pending, (state) => {
        state.loading.get = true;
        state.error.get = null;
      })
      .addCase(getDailySchedule.fulfilled, (state, action) => {
        state.loading.get = false;
        const schedule = action.payload;
        state.entities[schedule.id] = schedule;
        if (!state.listIds.includes(schedule.id)) {
          state.listIds.push(schedule.id);
        }
        state.error.get = null;
      })
      .addCase(getDailySchedule.rejected, (state, action) => {
        state.loading.get = false;
        state.error.get = action.payload || { status: 0, message: 'Get failed' } as ApiError;
      });

    // Create day-level schedules
    builder
      .addCase(createDailySchedulesDay.pending, (state) => {
        state.loading.createDay = true;
        state.error.createDay = null;
      })
      .addCase(createDailySchedulesDay.fulfilled, (state, action) => {
        state.loading.createDay = false;
        const response = action.payload;
        
        // Update entities with created schedules
        response.data.forEach(schedule => {
          state.entities[schedule.id] = schedule;
          if (!state.listIds.includes(schedule.id)) {
            state.listIds.push(schedule.id);
          }
        });
        
        // Store validation result and day summary
        state.lastValidationResult = response.validation_result;
        state.lastDaySummary = response.day_summary;
        state.error.createDay = null;
      })
      .addCase(createDailySchedulesDay.rejected, (state, action) => {
        state.loading.createDay = false;
        state.error.createDay = action.payload || { status: 0, message: 'Create day failed' } as ApiError;
      });

    // Create single schedule
    builder
      .addCase(createDailyScheduleSingle.pending, (state) => {
        state.loading.createSingle = true;
        state.error.createSingle = null;
      })
      .addCase(createDailyScheduleSingle.fulfilled, (state, action) => {
        state.loading.createSingle = false;
        const response = action.payload;
        
        // Update entity with created schedule
        const schedule = response.data;
        state.entities[schedule.id] = schedule;
        if (!state.listIds.includes(schedule.id)) {
          state.listIds.push(schedule.id);
        }
        
        // Store validation result
        state.lastValidationResult = response.validation_result;
        state.error.createSingle = null;
      })
      .addCase(createDailyScheduleSingle.rejected, (state, action) => {
        state.loading.createSingle = false;
        state.error.createSingle = action.payload || { status: 0, message: 'Create single failed' } as ApiError;
      });

    // Update schedule
    builder
      .addCase(updateDailySchedule.pending, (state) => {
        state.loading.update = true;
        state.error.update = null;
      })
      .addCase(updateDailySchedule.fulfilled, (state, action) => {
        state.loading.update = false;
        const response = action.payload;
        
        // Update entity
        const schedule = response.data;
        state.entities[schedule.id] = schedule;
        
        // Store validation result
        state.lastValidationResult = response.validation_result;
        state.error.update = null;
      })
      .addCase(updateDailySchedule.rejected, (state, action) => {
        state.loading.update = false;
        state.error.update = action.payload || { status: 0, message: 'Update failed' } as ApiError;
      });

    // Delete schedule
    builder
      .addCase(deleteDailySchedule.pending, (state) => {
        state.loading.delete = true;
        state.error.delete = null;
      })
      .addCase(deleteDailySchedule.fulfilled, (state, action) => {
        state.loading.delete = false;
        const deletedId = action.payload;
        
        // Remove from state
        delete state.entities[deletedId];
        state.listIds = state.listIds.filter(id => id !== deletedId);
        
        if (state.selectedScheduleId === deletedId) {
          state.selectedScheduleId = null;
        }
        
        state.error.delete = null;
      })
      .addCase(deleteDailySchedule.rejected, (state, action) => {
        state.loading.delete = false;
        state.error.delete = action.payload || { status: 0, message: 'Delete failed' } as ApiError;
      });

    // Attach skill
    builder
      .addCase(attachSkill.pending, (state) => {
        state.loading.attachSkill = true;
        state.error.attachSkill = null;
      })
      .addCase(attachSkill.fulfilled, (state) => {
        state.loading.attachSkill = false;
        // Note: Would need to refresh schedule data to see skill attachment
        // In a real app, you might want to refetch the schedule or optimistically update
        state.error.attachSkill = null;
      })
      .addCase(attachSkill.rejected, (state, action) => {
        state.loading.attachSkill = false;
        state.error.attachSkill = action.payload || { status: 0, message: 'Attach skill failed' } as ApiError;
      });

    // Detach skill
    builder
      .addCase(detachSkill.pending, (state) => {
        state.loading.detachSkill = true;
        state.error.detachSkill = null;
      })
      .addCase(detachSkill.fulfilled, (state) => {
        state.loading.detachSkill = false;
        // Note: Would need to refresh schedule data to see skill detachment
        state.error.detachSkill = null;
      })
      .addCase(detachSkill.rejected, (state, action) => {
        state.loading.detachSkill = false;
        state.error.detachSkill = action.payload || { status: 0, message: 'Detach skill failed' } as ApiError;
      });

    // Get weekly schedules (view only)
    builder
      .addCase(getWeeklySchedules.pending, (state) => {
        state.loading.weeklyView = true;
        state.error.weeklyView = null;
      })
      .addCase(getWeeklySchedules.fulfilled, (state, action) => {
        state.loading.weeklyView = false;
        
        // Update entities with weekly data
        const schedules = action.payload;
        schedules.forEach(schedule => {
          state.entities[schedule.id] = schedule;
          if (!state.listIds.includes(schedule.id)) {
            state.listIds.push(schedule.id);
          }
        });
        
        state.error.weeklyView = null;
      })
      .addCase(getWeeklySchedules.rejected, (state, action) => {
        state.loading.weeklyView = false;
        state.error.weeklyView = action.payload || { status: 0, message: 'Weekly view failed' } as ApiError;
      });
  },
});

// Export actions
export const {
  clearErrors,
  clearOperationError,
  clearValidationResult,
  clearDaySummary,
  setSelectedSchedule,
  resetState,
  upsertScheduleEntity,
  removeScheduleEntity,
} = dailySchedulesSlice.actions;

// LEGACY selectors - marked as secondary
export const selectDailySchedules = (state: RootState) => state.dailySchedules;

export const selectAllDailySchedules = (state: RootState) => 
  state.dailySchedules.listIds.map(id => state.dailySchedules.entities[id]);

export const selectDailyScheduleById = (state: RootState, id: number) => 
  state.dailySchedules.entities[id];

export const selectSelectedSchedule = (state: RootState) => 
  state.dailySchedules.selectedScheduleId ? 
    state.dailySchedules.entities[state.dailySchedules.selectedScheduleId] : 
    null;

export const selectLastValidationResult = (state: RootState) => 
  state.dailySchedules.lastValidationResult;

export const selectLastDaySummary = (state: RootState) => 
  state.dailySchedules.lastDaySummary;

export const selectDailySchedulesLoading = (state: RootState) => 
  state.dailySchedules.loading;

export const selectDailySchedulesErrors = (state: RootState) => 
  state.dailySchedules.error;

// Export reducer
export default dailySchedulesSlice.reducer;
