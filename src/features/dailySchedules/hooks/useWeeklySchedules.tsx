// src/features/dailySchedules/hooks/useWeeklySchedules.ts

import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, type UseFormReturn, type FieldPath, type FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AppDispatch } from '../../../store'; // TODO: fix import path for store
import {
  processWeeklySchedule,
  getWeeklyScheduleAnalysis,
  clearProcessingError,
  clearAnalysisError,
  clearValidationResult,
  selectProcessingState,
  selectAnalysisState,
  selectWeekSummary,
  selectValidationResult,
  selectWeeklyAnalysis,
  selectValidationViolations,
  selectIsValidationPassing,
  selectHasValidationViolations,
  selectSkillCoverageIssues,
  selectHoursViolations,
} from '../store/slices/weeklySchedulesSlice';
import {
  type WeeklyScheduleBody,
  type WeeklyScheduleForm,
  WeeklyScheduleFormSchema,
  type WeeklyAnalysisParams,
  type ApiError,
  type FormFieldErrors,
} from '../types';

/**
 * PRIMARY HOOK: Process weekly schedule
 * Main hook for creating/updating schedules using the weekly flow
 * Provides comprehensive error handling and validation result management
 */
export const useProcessWeeklySchedule = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector(selectProcessingState);
  const weekSummary = useSelector(selectWeekSummary);
  const validationResult = useSelector(selectValidationResult);

  // Memoized run function to prevent unnecessary re-renders
  const run = useCallback(async (body: WeeklyScheduleBody) => {
    try {
      const result = await dispatch(processWeeklySchedule(body)).unwrap();
      return result;
    } catch (error) {
      // Error is already stored in Redux state via rejected action
      throw error;
    }
  }, [dispatch]);

  // Helper to clear processing error
  const clearError = useCallback(() => {
    dispatch(clearProcessingError());
  }, [dispatch]);

  // Helper to clear validation result
  const clearValidation = useCallback(() => {
    dispatch(clearValidationResult());
  }, [dispatch]);

  return useMemo(() => ({
    run,
    loading,
    error,
    data: weekSummary,
    validationResult,
    clearError,
    clearValidation,
  }), [run, loading, error, weekSummary, validationResult, clearError, clearValidation]);
};

/**
 * PRIMARY HOOK: Weekly schedule analysis
 * Hook for retrieving comprehensive weekly analysis and reporting data
 * Supports automatic refetching and parameter-based caching
 */
export const useWeeklyAnalysis = (
  filters: WeeklyAnalysisParams,
  options: {
    enabled?: boolean;
    refetchOnMount?: boolean;
  } = {}
) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector(selectAnalysisState);
  const analysis = useSelector(selectWeeklyAnalysis);

  const { enabled = true, refetchOnMount = false } = options;

  // Memoized fetch function
  const fetchAnalysis = useCallback(async () => {
    if (!enabled) return;
    
    try {
      const result = await dispatch(getWeeklyScheduleAnalysis(filters)).unwrap();
      return result;
    } catch (error) {
      // Error is already stored in Redux state
      throw error;
    }
  }, [dispatch, filters, enabled]);

  // Auto-fetch on mount or when filters change
  const refetch = useCallback(() => {
    return fetchAnalysis();
  }, [fetchAnalysis]);

  // Helper to clear analysis error
  const clearError = useCallback(() => {
    dispatch(clearAnalysisError());
  }, [dispatch]);

  // Auto-fetch logic
  useMemo(() => {
    if (enabled && (refetchOnMount || !analysis)) {
      fetchAnalysis();
    }
  }, [enabled, refetchOnMount, analysis, fetchAnalysis]);

  return useMemo(() => ({
    data: analysis,
    loading,
    error,
    refetch,
    clearError,
  }), [analysis, loading, error, refetch, clearError]);
};

/**
 * React Hook Form integration for weekly schedule creation
 * Provides form state management with Zod validation and server error mapping
 */
export const useWeeklyScheduleForm = (
  defaultValues?: Partial<WeeklyScheduleForm>,
  options: {
    onSuccess?: (data: any) => void;
    onError?: (error: ApiError) => void;
    transformSubmitData?: (data: WeeklyScheduleForm) => WeeklyScheduleBody;
  } = {}
): UseFormReturn<WeeklyScheduleForm> & {
  submitHandler: (data: WeeklyScheduleForm) => Promise<void>;
  isSubmitting: boolean;
  submitError: ApiError | null;
  validationViolations: string[];
  hasViolations: boolean;
  mapServerErrors: (error: ApiError) => void;
  clearSubmitError: () => void;
} => {
  const { onSuccess, onError, transformSubmitData } = options;
  const { run, loading, error,  clearError } = useProcessWeeklySchedule();

  // Initialize form with Zod resolver
  const form = useForm<WeeklyScheduleForm>({
    resolver: zodResolver(WeeklyScheduleFormSchema),
    defaultValues: {
      weekly_schedule: [],
      ...defaultValues,
    },
    mode: 'onChange', // Validate on change for better UX
  });

  const { setError, clearErrors } = form;

  // Get validation violations from successful submissions
  const validationViolations = useSelector(selectValidationViolations);
  const hasViolations = useSelector(selectHasValidationViolations);

  // Submit handler that integrates with Redux
  const submitHandler = useCallback(async (data: WeeklyScheduleForm) => {
    try {
      // Clear previous errors
      clearErrors();
      clearError();

      // Transform form data if needed
      const submitData = transformSubmitData ? transformSubmitData(data) : (data as WeeklyScheduleBody);

      // Submit to server
      const result = await run(submitData);

      // Handle success
      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      const apiError = error as ApiError;

      // Map field errors to form
      if (apiError.fieldErrors) {
        mapServerErrorsToForm(apiError.fieldErrors, setError);
      }

      // Handle error callback
      if (onError) {
        onError(apiError);
      }
    }
  }, [run, clearError, clearErrors, transformSubmitData, onSuccess, onError, setError]);

  // Helper to manually map server errors to form fields
  const mapServerErrors = useCallback((apiError: ApiError) => {
    if (apiError.fieldErrors) {
      mapServerErrorsToForm(apiError.fieldErrors, setError);
    }
  }, [setError]);

  return useMemo(() => ({
    ...form,
    submitHandler,
    isSubmitting: loading,
    submitError: error,
    validationViolations,
    hasViolations,
    mapServerErrors,
    clearSubmitError: clearError,
  }), [
    form,
    submitHandler,
    loading,
    error,
    validationViolations,
    hasViolations,
    mapServerErrors,
    clearError,
  ]);
};

/**
 * Hook for validation-specific data and helpers
 * Provides easy access to validation violations and business rule issues
 */
export const useWeeklyValidation = () => {
  const validationResult = useSelector(selectValidationResult);
  const violations = useSelector(selectValidationViolations);
  const isValid = useSelector(selectIsValidationPassing);
  const hasViolations = useSelector(selectHasValidationViolations);
  const skillCoverageIssues = useSelector(selectSkillCoverageIssues);
  const hoursViolations = useSelector(selectHoursViolations);

  // Helper to check if specific violation exists
  const hasViolationType = useCallback((violationText: string) => {
    return violations.some(violation => 
      violation.toLowerCase().includes(violationText.toLowerCase())
    );
  }, [violations]);

  // Helper to get violations by category
  const getViolationsByCategory = useCallback(() => {
    const categories = {
      skills: violations.filter(v => v.toLowerCase().includes('skill')),
      hours: violations.filter(v => v.toLowerCase().includes('hour')),
      schedule: violations.filter(v => v.toLowerCase().includes('schedule') || v.toLowerCase().includes('overlap')),
      other: violations.filter(v => 
        !v.toLowerCase().includes('skill') && 
        !v.toLowerCase().includes('hour') && 
        !v.toLowerCase().includes('schedule') &&
        !v.toLowerCase().includes('overlap')
      ),
    };
    return categories;
  }, [violations]);

  return useMemo(() => ({
    validationResult,
    violations,
    isValid,
    hasViolations,
    skillCoverageIssues,
    hoursViolations,
    hasViolationType,
    getViolationsByCategory,
  }), [
    validationResult,
    violations,
    isValid,
    hasViolations,
    skillCoverageIssues,
    hoursViolations,
    hasViolationType,
    getViolationsByCategory,
  ]);
};

/**
 * Helper hook for form field management with optimized re-renders
 * Provides utilities for dynamic form arrays and field validation
 */
export const useWeeklyScheduleFields = (form: UseFormReturn<WeeklyScheduleForm>) => {
  const { control, watch, setValue, trigger } = form;

  // Watch all weekly schedule data for calculations
  const weeklyScheduleData = watch('weekly_schedule');

  // Helper to add a new day to the schedule
  const addDay = useCallback((date: string) => {
    const currentSchedule = weeklyScheduleData || [];
    const newDay = {
      date_of_day: date,
      schedules: [],
    };
    
    setValue('weekly_schedule', [...currentSchedule, newDay]);
    trigger('weekly_schedule'); // Trigger validation
  }, [weeklyScheduleData, setValue, trigger]);

  // Helper to remove a day from the schedule
  const removeDay = useCallback((dayIndex: number) => {
    const currentSchedule = weeklyScheduleData || [];
    const updatedSchedule = currentSchedule.filter((_, index) => index !== dayIndex);
    
    setValue('weekly_schedule', updatedSchedule);
    trigger('weekly_schedule');
  }, [weeklyScheduleData, setValue, trigger]);

  // Helper to add a schedule to a specific day
  const addScheduleToDay = useCallback((dayIndex: number, schedule: any) => {
    const currentSchedule = weeklyScheduleData || [];
    const updatedSchedule = [...currentSchedule];
    
    if (updatedSchedule[dayIndex] && 'schedules' in updatedSchedule[dayIndex]) {
      updatedSchedule[dayIndex] = {
        ...updatedSchedule[dayIndex],
        schedules: [...(updatedSchedule[dayIndex] as any).schedules, schedule],
      };
    }
    
    setValue('weekly_schedule', updatedSchedule);
    trigger(`weekly_schedule.${dayIndex}.schedules`);
  }, [weeklyScheduleData, setValue, trigger]);

  // Calculate totals for UI display
  const totals = useMemo(() => {
    if (!weeklyScheduleData) return { totalHours: 0, totalSchedules: 0, uniqueEmployees: 0 };

    let totalHours = 0;
    let totalSchedules = 0;
    const employeeIds = new Set<number>();

    weeklyScheduleData.forEach(day => {
      const schedules = 'schedules' in day ? day.schedules : [day];
      
      schedules.forEach(schedule => {
        totalSchedules++;
        employeeIds.add(schedule.emp_info_id);
        
        // Calculate hours
        const start = new Date(`2000-01-01T${schedule.scheduled_start_time}`);
        const end = new Date(`2000-01-01T${schedule.scheduled_end_time}`);
        const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
        
        if (hours > 0) {
          totalHours += hours;
        }
      });
    });

    return {
      totalHours,
      totalSchedules,
      uniqueEmployees: employeeIds.size,
    };
  }, [weeklyScheduleData]);

  return useMemo(() => ({
    control,
    weeklyScheduleData,
    addDay,
    removeDay,
    addScheduleToDay,
    totals,
  }), [control, weeklyScheduleData, addDay, removeDay, addScheduleToDay, totals]);
};

/**
 * Helper function to map server field errors to React Hook Form
 * Converts Laravel-style field errors to react-hook-form setError calls
 * Fixed TypeScript typing issues with generic constraints
 */
const mapServerErrorsToForm = <TFieldValues extends FieldValues>(
  fieldErrors: FormFieldErrors,
  setError: UseFormReturn<TFieldValues>['setError']
) => {
  Object.entries(fieldErrors).forEach(([fieldPath, messages]) => {
    try {
      // Convert dot notation field paths to react-hook-form format
      // Cast to FieldPath to satisfy TypeScript constraints
      const formFieldPath = fieldPath as FieldPath<TFieldValues>;
      
      setError(formFieldPath, {
        type: 'server',
        message: Array.isArray(messages) ? messages[0] : messages,
      });
    } catch (error) {
      // If field path doesn't exist in form schema, log and continue
      console.warn(`Unable to map server error for field: ${fieldPath}`, error);
    }
  });
};

/**
 * Default transform function for converting form data to API format
 * Handles the differences between form structure and API expectations
 */
export const defaultTransformSubmitData = (data: WeeklyScheduleForm): WeeklyScheduleBody => {
  return {
    weekly_schedule: data.weekly_schedule.map(day => ({
      date_of_day: day.date_of_day,
      schedules: day.schedules.map(({ employee_id, employee_skills, ...schedule }) => ({
        ...schedule,
        // Map form fields back to API format
        // Remove client-only fields like employee_id and employee_skills
      })),
    })),
  };
};

/**
 * Type-safe server error mapping utility function
 * Can be used outside of the hook context for manual error handling
 */
export const mapApiErrorsToForm = <TFieldValues extends FieldValues>(
  apiError: ApiError,
  setError: UseFormReturn<TFieldValues>['setError']
): void => {
  if (apiError.fieldErrors) {
    mapServerErrorsToForm(apiError.fieldErrors, setError);
  }
};

/**
 * Helper function to create field path strings that are type-safe
 * Useful for programmatic field error setting
 */
export const createFieldPath = <TFieldValues extends FieldValues>(
  path: string
): FieldPath<TFieldValues> => {
  return path as FieldPath<TFieldValues>;
};

/**
 * Utility hook for handling server validation errors with React Hook Form
 * Provides a reusable pattern for error mapping across different forms
 */
export const useServerErrorMapping = <TFieldValues extends FieldValues>(
  form: UseFormReturn<TFieldValues>
) => {
  const { setError, clearErrors } = form;

  const mapErrors = useCallback((apiError: ApiError) => {
    mapApiErrorsToForm(apiError, setError);
  }, [setError]);

  const clearAllErrors = useCallback(() => {
    clearErrors();
  }, [clearErrors]);

  return useMemo(() => ({
    mapErrors,
    clearAllErrors,
  }), [mapErrors, clearAllErrors]);
};
