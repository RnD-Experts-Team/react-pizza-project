// src/features/dailySchedules/store/slices/weeklySchedulesSlice.ts

import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../../../store'; // TODO: fix import path for store
import {
  processWeeklySchedule as processWeeklyScheduleService,
  getWeeklyScheduleAnalysis as getWeeklyScheduleAnalysisService,
} from '../../services/weeklySchedulesService';
import type {
  WeeklyScheduleBody,
  WeeklyProcessResponse,
  WeeklyAnalysisParams,
  WeeklyAnalysisResponse,
  DailySchedule,
  WeekSummary,
  WeeklyValidationResult,
  WeeklyAnalysisData,
  ApiError,
} from '../../types';

/**
 * Weekly schedules state interface
 * PRIMARY state slice for schedule management
 */
interface WeeklySchedulesState {
  // Normalized entities for schedules
  entities: Record<number, DailySchedule>;
  ids: number[];
  
  // Week summary and validation results from the primary workflow
  weekSummary: WeekSummary | null;
  validationResult: WeeklyValidationResult | null;
  
  // Analysis data for reporting and insights
  analysis: WeeklyAnalysisData | null;
  
  // Loading states for different operations
  loading: {
    processing: boolean;
    analysis: boolean;
  };
  
  // Error states for different operations
  error: {
    processing: ApiError | null;
    analysis: ApiError | null;
  };
  
  // Request tracking
  currentRequestId: string | null;
}

/**
 * Initial state for weekly schedules slice
 */
const initialState: WeeklySchedulesState = {
  entities: {},
  ids: [],
  weekSummary: null,
  validationResult: null,
  analysis: null,
  loading: {
    processing: false,
    analysis: false,
  },
  error: {
    processing: null,
    analysis: null,
  },
  currentRequestId: null,
};

/**
 * PRIMARY THUNK: Process weekly schedule
 * Creates/updates schedules using the main weekly workflow
 * Handles validation, skill coverage, and hour limit checks
 */
export const processWeeklySchedule = createAsyncThunk<
  WeeklyProcessResponse,
  WeeklyScheduleBody,
  {
    state: RootState;
    rejectValue: ApiError;
  }
>('weeklySchedules/process', async (body, { rejectWithValue, signal }) => {
  try {
    const response = await processWeeklyScheduleService(body, { signal });
    return response;
  } catch (error) {
    // Handle ApiError instances
    if (error && typeof error === 'object' && 'status' in error) {
      return rejectWithValue(error as ApiError);
    }
    
    // Handle other errors
    return rejectWithValue({
      status: 0,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      raw: error,
    } as ApiError);
  }
});

/**
 * THUNK: Get weekly schedule analysis
 * Retrieves comprehensive analysis and reporting data for a work week
 */
export const getWeeklyScheduleAnalysis = createAsyncThunk<
  WeeklyAnalysisResponse,
  WeeklyAnalysisParams,
  {
    state: RootState;
    rejectValue: ApiError;
  }
>('weeklySchedules/getAnalysis', async (params, { rejectWithValue, signal }) => {
  try {
    const response = await getWeeklyScheduleAnalysisService(params, { signal });
    return response;
  } catch (error) {
    // Handle ApiError instances
    if (error && typeof error === 'object' && 'status' in error) {
      return rejectWithValue(error as ApiError);
    }
    
    // Handle other errors
    return rejectWithValue({
      status: 0,
      message: error instanceof Error ? error.message : 'An unexpected error occurred',
      raw: error,
    } as ApiError);
  }
});

/**
 * Weekly schedules slice - PRIMARY for schedule management
 * Handles the main workflow for creating, updating, and analyzing schedules
 */
export const weeklySchedulesSlice = createSlice({
  name: 'weeklySchedules',
  initialState,
  reducers: {
    /**
     * Clear all errors
     */
    clearErrors: (state) => {
      state.error.processing = null;
      state.error.analysis = null;
    },
    
    /**
     * Clear processing error specifically
     */
    clearProcessingError: (state) => {
      state.error.processing = null;
    },
    
    /**
     * Clear analysis error specifically
     */
    clearAnalysisError: (state) => {
      state.error.analysis = null;
    },
    
    /**
     * Clear validation result (useful for form resets)
     */
    clearValidationResult: (state) => {
      state.validationResult = null;
    },
    
    /**
     * Clear week summary
     */
    clearWeekSummary: (state) => {
      state.weekSummary = null;
    },
    
    /**
     * Clear analysis data
     */
    clearAnalysis: (state) => {
      state.analysis = null;
    },
    
    /**
     * Reset entire state to initial values
     */
    resetState: () => initialState,
    
    /**
     * Update a single schedule entity (for optimistic updates)
     */
    updateScheduleEntity: (state, action: PayloadAction<DailySchedule>) => {
      const schedule = action.payload;
      state.entities[schedule.id] = schedule;
      if (!state.ids.includes(schedule.id)) {
        state.ids.push(schedule.id);
      }
    },
    
    /**
     * Remove a schedule entity
     */
    removeScheduleEntity: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      delete state.entities[id];
      state.ids = state.ids.filter(scheduleId => scheduleId !== id);
    },
  },
  extraReducers: (builder) => {
    // Process weekly schedule thunk
    builder
      .addCase(processWeeklySchedule.pending, (state, action) => {
        state.loading.processing = true;
        state.error.processing = null;
        state.currentRequestId = action.meta.requestId;
      })
      .addCase(processWeeklySchedule.fulfilled, (state, action) => {
        const { requestId } = action.meta;
        
        if (state.loading.processing && state.currentRequestId === requestId) {
          state.loading.processing = false;
          state.currentRequestId = null;
          
          const response = action.payload;
          
          // Update normalized entities with new/updated schedules
          const schedules = response.data.schedules;
          schedules.forEach(schedule => {
            state.entities[schedule.id] = schedule;
            if (!state.ids.includes(schedule.id)) {
              state.ids.push(schedule.id);
            }
          });
          
          // Store week summary and validation results
          state.weekSummary = response.data.week_summary;
          state.validationResult = response.validation_result;
          
          // Clear processing error on success
          state.error.processing = null;
        }
      })
      .addCase(processWeeklySchedule.rejected, (state, action) => {
        const { requestId } = action.meta;
        
        if (state.loading.processing && state.currentRequestId === requestId) {
          state.loading.processing = false;
          state.currentRequestId = null;
          
          // Store error information
          state.error.processing = action.payload || {
            status: 0,
            message: 'Processing failed',
          } as ApiError;
        }
      });

    // Get weekly analysis thunk
    builder
      .addCase(getWeeklyScheduleAnalysis.pending, (state) => {
        state.loading.analysis = true;
        state.error.analysis = null;
      })
      .addCase(getWeeklyScheduleAnalysis.fulfilled, (state, action) => {
        state.loading.analysis = false;
        state.analysis = action.payload.data;
        state.error.analysis = null;
      })
      .addCase(getWeeklyScheduleAnalysis.rejected, (state, action) => {
        state.loading.analysis = false;
        state.error.analysis = action.payload || {
          status: 0,
          message: 'Analysis failed',
        } as ApiError;
      });
  },
});

// Export actions
export const {
  clearErrors,
  clearProcessingError,
  clearAnalysisError,
  clearValidationResult,
  clearWeekSummary,
  clearAnalysis,
  resetState,
  updateScheduleEntity,
  removeScheduleEntity,
} = weeklySchedulesSlice.actions;

// Selectors for accessing state
export const selectWeeklySchedules = (state: RootState) => state.weeklySchedules;

export const selectAllSchedules = (state: RootState) => 
  state.weeklySchedules.ids.map(id => state.weeklySchedules.entities[id]);

export const selectScheduleById = (state: RootState, id: number) => 
  state.weeklySchedules.entities[id];

export const selectSchedulesByEmployeeId = (state: RootState, empInfoId: number) =>
  state.weeklySchedules.ids
    .map(id => state.weeklySchedules.entities[id])
    .filter(schedule => schedule.emp_info_id === empInfoId);

export const selectWeekSummary = (state: RootState) => 
  state.weeklySchedules.weekSummary;

export const selectValidationResult = (state: RootState) => 
  state.weeklySchedules.validationResult;

export const selectWeeklyAnalysis = (state: RootState) => 
  state.weeklySchedules.analysis;

export const selectProcessingState = (state: RootState) => ({
  loading: state.weeklySchedules.loading.processing,
  error: state.weeklySchedules.error.processing,
});

export const selectAnalysisState = (state: RootState) => ({
  loading: state.weeklySchedules.loading.analysis,
  error: state.weeklySchedules.error.analysis,
});

// Validation-specific selectors
export const selectValidationViolations = (state: RootState) => 
  state.weeklySchedules.validationResult?.violations || [];

export const selectIsValidationPassing = (state: RootState) => 
  state.weeklySchedules.validationResult?.valid ?? true;

export const selectHasValidationViolations = (state: RootState) => {
  const violations = selectValidationViolations(state);
  return violations.length > 0;
};

export const selectSkillCoverageIssues = (state: RootState) => {
  const validationResult = state.weeklySchedules.validationResult;
  if (!validationResult?.skill_coverage) return {};
  
  return Object.entries(validationResult.skill_coverage)
    .filter(([, coverage]) => !coverage.fully_covered)
    .reduce((acc, [date, coverage]) => {
      acc[date] = coverage;
      return acc;
    }, {} as Record<string, any>);
};

export const selectHoursViolations = (state: RootState) => {
  const validationResult = state.weeklySchedules.validationResult;
  if (!validationResult?.hours_summary) return {};
  
  return Object.entries(validationResult.hours_summary)
    .filter(([, summary]) => summary.is_over_limit)
    .reduce((acc, [empId, summary]) => {
      acc[empId] = summary;
      return acc;
    }, {} as Record<string, any>);
};

// Week summary selectors
export const selectWeekTotalHours = (state: RootState) => 
  state.weeklySchedules.weekSummary?.total_hours || 0;

export const selectWeekUniqueEmployees = (state: RootState) => 
  state.weeklySchedules.weekSummary?.unique_employees || 0;

export const selectWeekValidationStatus = (state: RootState) => 
  state.weeklySchedules.weekSummary?.validation_status || 'passed';

// Analysis selectors
export const selectDailyAnalysis = (state: RootState, date: string) => 
  state.weeklySchedules.analysis?.daily_analysis[date];

export const selectWeekTotals = (state: RootState) => 
  state.weeklySchedules.analysis?.week_totals;

// Loading and error selectors for UI
export const selectIsProcessing = (state: RootState) => 
  state.weeklySchedules.loading.processing;

export const selectIsLoadingAnalysis = (state: RootState) => 
  state.weeklySchedules.loading.analysis;

export const selectProcessingError = (state: RootState) => 
  state.weeklySchedules.error.processing;

export const selectAnalysisError = (state: RootState) => 
  state.weeklySchedules.error.analysis;

export const selectHasAnyError = (state: RootState) => 
  Boolean(state.weeklySchedules.error.processing || state.weeklySchedules.error.analysis);

export const selectIsAnyLoading = (state: RootState) => 
  state.weeklySchedules.loading.processing || state.weeklySchedules.loading.analysis;

// Export reducer
export default weeklySchedulesSlice.reducer;
