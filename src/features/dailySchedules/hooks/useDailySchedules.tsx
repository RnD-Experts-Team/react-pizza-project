// src/features/dailySchedules/hooks/useDailySchedules.ts

import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm, type UseFormReturn, type FieldPath, type FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AppDispatch, RootState } from '../../../store'; // TODO: fix import path for store
import {
  listDailySchedules,
  getDailySchedule,
  createDailySchedulesDay,
  createDailyScheduleSingle,
  updateDailySchedule,
  deleteDailySchedule,
  attachSkill,
  detachSkill,
  getWeeklySchedules,
  clearErrors,
  clearOperationError,
  clearValidationResult,
  clearDaySummary,
  setSelectedSchedule,
  selectAllDailySchedules,
  selectSelectedSchedule,
  selectLastValidationResult,
  selectLastDaySummary,
  selectDailySchedulesLoading,
  selectDailySchedulesErrors,
} from '../store/slices/dailySchedulesSlice';
import {
  type ListDailySchedulesParams,
  type DayLevelCreateBody,
  DayLevelCreateBodySchema,
  type SingleCreateBody,
  SingleCreateBodySchema,
  type WeeklySchedulesParams,
  type ValidationResult,
  type DaySummary,
  type ApiError,
  type FormFieldErrors,
} from '../types';

/**
 * LEGACY/BACK-COMPAT: List daily schedules hook
 * Secondary endpoint - use weekly flow for primary operations
 */
export const useListDailySchedules = () => {
  const dispatch = useDispatch<AppDispatch>();
  const schedules = useSelector(selectAllDailySchedules);
  const loading = useSelector((state: RootState) => selectDailySchedulesLoading(state).list);
  const error = useSelector((state: RootState) => selectDailySchedulesErrors(state).list);

  const run = useCallback(async (params?: ListDailySchedulesParams) => {
    try {
      const result = await dispatch(listDailySchedules(params)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearOperationError('list'));
  }, [dispatch]);

  return useMemo(() => ({
    run,
    loading,
    error,
    data: schedules,
    clearError,
  }), [run, loading, error, schedules, clearError]);
};

/**
 * LEGACY/BACK-COMPAT: Get single daily schedule hook
 * Secondary endpoint - use weekly flow for primary operations
 */
export const useGetDailySchedule = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => selectDailySchedulesLoading(state).get);
  const error = useSelector((state: RootState) => selectDailySchedulesErrors(state).get);

  const run = useCallback(async (id: number) => {
    try {
      const result = await dispatch(getDailySchedule(id)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearOperationError('get'));
  }, [dispatch]);

  return useMemo(() => ({
    run,
    loading,
    error,
    clearError,
  }), [run, loading, error, clearError]);
};

/**
 * LEGACY/BACK-COMPAT: Create daily schedules (day-level) hook
 * Secondary endpoint - use weekly processWeeklySchedule for primary operations
 */
export const useCreateDailySchedulesDay = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => selectDailySchedulesLoading(state).createDay);
  const error = useSelector((state: RootState) => selectDailySchedulesErrors(state).createDay);
  const validationResult = useSelector(selectLastValidationResult);
  const daySummary = useSelector(selectLastDaySummary);

  const run = useCallback(async (body: DayLevelCreateBody) => {
    try {
      const result = await dispatch(createDailySchedulesDay(body)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearOperationError('createDay'));
  }, [dispatch]);

  const clearValidation = useCallback(() => {
    dispatch(clearValidationResult());
  }, [dispatch]);

  const clearSummary = useCallback(() => {
    dispatch(clearDaySummary());
  }, [dispatch]);

  return useMemo(() => ({
    run,
    loading,
    error,
    validationResult,
    daySummary,
    clearError,
    clearValidation,
    clearSummary,
  }), [run, loading, error, validationResult, daySummary, clearError, clearValidation, clearSummary]);
};

/**
 * LEGACY/BACK-COMPAT: Create single daily schedule hook
 * Secondary endpoint - use weekly processWeeklySchedule for primary operations
 */
export const useCreateDailyScheduleSingle = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => selectDailySchedulesLoading(state).createSingle);
  const error = useSelector((state: RootState) => selectDailySchedulesErrors(state).createSingle);
  const validationResult = useSelector(selectLastValidationResult);

  const run = useCallback(async (body: SingleCreateBody) => {
    try {
      const result = await dispatch(createDailyScheduleSingle(body)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearOperationError('createSingle'));
  }, [dispatch]);

  const clearValidation = useCallback(() => {
    dispatch(clearValidationResult());
  }, [dispatch]);

  return useMemo(() => ({
    run,
    loading,
    error,
    validationResult,
    clearError,
    clearValidation,
  }), [run, loading, error, validationResult, clearError, clearValidation]);
};

/**
 * LEGACY/BACK-COMPAT: Update daily schedule hook
 * Secondary endpoint - use weekly processWeeklySchedule for primary operations
 */
export const useUpdateDailySchedule = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => selectDailySchedulesLoading(state).update);
  const error = useSelector((state: RootState) => selectDailySchedulesErrors(state).update);
  const validationResult = useSelector(selectLastValidationResult);

  const run = useCallback(async (id: number, body: SingleCreateBody) => {
    try {
      const result = await dispatch(updateDailySchedule({ id, body })).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearOperationError('update'));
  }, [dispatch]);

  const clearValidation = useCallback(() => {
    dispatch(clearValidationResult());
  }, [dispatch]);

  return useMemo(() => ({
    run,
    loading,
    error,
    validationResult,
    clearError,
    clearValidation,
  }), [run, loading, error, validationResult, clearError, clearValidation]);
};

/**
 * LEGACY/BACK-COMPAT: Delete daily schedule hook
 * Secondary endpoint - use weekly processWeeklySchedule for primary operations
 */
export const useDeleteDailySchedule = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => selectDailySchedulesLoading(state).delete);
  const error = useSelector((state: RootState) => selectDailySchedulesErrors(state).delete);

  const run = useCallback(async (id: number) => {
    try {
      const result = await dispatch(deleteDailySchedule(id)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearOperationError('delete'));
  }, [dispatch]);

  return useMemo(() => ({
    run,
    loading,
    error,
    clearError,
  }), [run, loading, error, clearError]);
};

/**
 * LEGACY/BACK-COMPAT: Attach skill to schedule hook
 * Secondary endpoint - use weekly processWeeklySchedule for primary operations
 */
export const useAttachSkill = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => selectDailySchedulesLoading(state).attachSkill);
  const error = useSelector((state: RootState) => selectDailySchedulesErrors(state).attachSkill);

  const run = useCallback(async (
    dailyScheduleId: number,
    skillId: number,
    isRequired?: boolean
  ) => {
    try {
      const result = await dispatch(attachSkill({
        dailyScheduleId,
        skillId,
        isRequired,
      })).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearOperationError('attachSkill'));
  }, [dispatch]);

  return useMemo(() => ({
    run,
    loading,
    error,
    clearError,
  }), [run, loading, error, clearError]);
};

/**
 * LEGACY/BACK-COMPAT: Detach skill from schedule hook
 * Secondary endpoint - use weekly processWeeklySchedule for primary operations
 */
export const useDetachSkill = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => selectDailySchedulesLoading(state).detachSkill);
  const error = useSelector((state: RootState) => selectDailySchedulesErrors(state).detachSkill);

  const run = useCallback(async (dailyScheduleId: number, skillId: number) => {
    try {
      const result = await dispatch(detachSkill({
        dailyScheduleId,
        skillId,
      })).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearOperationError('detachSkill'));
  }, [dispatch]);

  return useMemo(() => ({
    run,
    loading,
    error,
    clearError,
  }), [run, loading, error, clearError]);
};

/**
 * LEGACY/BACK-COMPAT: Get weekly schedules (view only) hook
 * Secondary endpoint - use weekly analysis for primary operations
 */
export const useGetWeeklySchedules = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector((state: RootState) => selectDailySchedulesLoading(state).weeklyView);
  const error = useSelector((state: RootState) => selectDailySchedulesErrors(state).weeklyView);
  const schedules = useSelector(selectAllDailySchedules);

  const run = useCallback(async (params: WeeklySchedulesParams) => {
    try {
      const result = await dispatch(getWeeklySchedules(params)).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  }, [dispatch]);

  const clearError = useCallback(() => {
    dispatch(clearOperationError('weeklyView'));
  }, [dispatch]);

  return useMemo(() => ({
    run,
    loading,
    error,
    data: schedules,
    clearError,
  }), [run, loading, error, schedules, clearError]);
};

/**
 * LEGACY/BACK-COMPAT: Single schedule form hook
 * Secondary form - use weekly form for primary operations
 */
export const useSingleScheduleForm = (
  defaultValues?: Partial<SingleCreateBody>,
  options: {
    onSuccess?: (data: any) => void;
    onError?: (error: ApiError) => void;
  } = {}
): UseFormReturn<SingleCreateBody> & {
  submitHandler: (data: SingleCreateBody) => Promise<void>;
  updateHandler: (id: number, data: SingleCreateBody) => Promise<void>;
  isSubmitting: boolean;
  submitError: ApiError | null;
  validationResult: ValidationResult | null;
  mapServerErrors: (error: ApiError) => void;
  clearSubmitError: () => void;
} => {
  const { onSuccess, onError } = options;
  const createHook = useCreateDailyScheduleSingle();
  const updateHook = useUpdateDailySchedule();

  // Determine which operation is active
  const isSubmitting = createHook.loading || updateHook.loading;
  const submitError = createHook.error || updateHook.error;
  const validationResult = createHook.validationResult || updateHook.validationResult;

  // Initialize form with Zod resolver
  const form = useForm<SingleCreateBody>({
    resolver: zodResolver(SingleCreateBodySchema),
    defaultValues: {
      date_of_day: '',
      emp_info_id: 0,
      scheduled_start_time: '',
      scheduled_end_time: '',
      status_id: 0,
      ...defaultValues,
    },
    mode: 'onChange',
  });

  const { setError, clearErrors } = form;

  // Submit handler for create
  const submitHandler = useCallback(async (data: SingleCreateBody) => {
    try {
      clearErrors();
      createHook.clearError();

      const result = await createHook.run(data);

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      const apiError = error as ApiError;

      if (apiError.fieldErrors) {
        mapServerErrorsToForm(apiError.fieldErrors, setError);
      }

      if (onError) {
        onError(apiError);
      }
    }
  }, [createHook, clearErrors, onSuccess, onError, setError]);

  // Update handler
  const updateHandler = useCallback(async (id: number, data: SingleCreateBody) => {
    try {
      clearErrors();
      updateHook.clearError();

      const result = await updateHook.run(id, data);

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      const apiError = error as ApiError;

      if (apiError.fieldErrors) {
        mapServerErrorsToForm(apiError.fieldErrors, setError);
      }

      if (onError) {
        onError(apiError);
      }
    }
  }, [updateHook, clearErrors, onSuccess, onError, setError]);

  // Helper to manually map server errors to form fields
  const mapServerErrors = useCallback((apiError: ApiError) => {
    if (apiError.fieldErrors) {
      mapServerErrorsToForm(apiError.fieldErrors, setError);
    }
  }, [setError]);

  // Clear error helper
  const clearSubmitError = useCallback(() => {
    createHook.clearError();
    updateHook.clearError();
  }, [createHook, updateHook]);

  return useMemo(() => ({
    ...form,
    submitHandler,
    updateHandler,
    isSubmitting,
    submitError,
    validationResult,
    mapServerErrors,
    clearSubmitError,
  }), [
    form,
    submitHandler,
    updateHandler,
    isSubmitting,
    submitError,
    validationResult,
    mapServerErrors,
    clearSubmitError,
  ]);
};

/**
 * LEGACY/BACK-COMPAT: Day-level schedule form hook
 * Secondary form - use weekly form for primary operations
 */
export const useDayLevelScheduleForm = (
  defaultValues?: Partial<DayLevelCreateBody>,
  options: {
    onSuccess?: (data: any) => void;
    onError?: (error: ApiError) => void;
  } = {}
): UseFormReturn<DayLevelCreateBody> & {
  submitHandler: (data: DayLevelCreateBody) => Promise<void>;
  isSubmitting: boolean;
  submitError: ApiError | null;
  validationResult: ValidationResult | null;
  daySummary: DaySummary | null;
  mapServerErrors: (error: ApiError) => void;
  clearSubmitError: () => void;
} => {
  const { onSuccess, onError } = options;
  const { run, loading, error, validationResult, daySummary, clearError } = useCreateDailySchedulesDay();

  // Initialize form with Zod resolver
  const form = useForm<DayLevelCreateBody>({
    resolver: zodResolver(DayLevelCreateBodySchema),
    defaultValues: {
      date_of_day: '',
      schedules: [],
      ...defaultValues,
    },
    mode: 'onChange',
  });

  const { setError, clearErrors } = form;

  // Submit handler
  const submitHandler = useCallback(async (data: DayLevelCreateBody) => {
    try {
      clearErrors();
      clearError();

      const result = await run(data);

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      const apiError = error as ApiError;

      if (apiError.fieldErrors) {
        mapServerErrorsToForm(apiError.fieldErrors, setError);
      }

      if (onError) {
        onError(apiError);
      }
    }
  }, [run, clearError, clearErrors, onSuccess, onError, setError]);

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
    validationResult,
    daySummary,
    mapServerErrors,
    clearSubmitError: clearError,
  }), [
    form,
    submitHandler,
    loading,
    error,
    validationResult,
    daySummary,
    mapServerErrors,
    clearError,
  ]);
};

/**
 * LEGACY/BACK-COMPAT: Daily schedule management hook
 * Provides utilities for working with individual schedules
 */
export const useDailyScheduleManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectedSchedule = useSelector(selectSelectedSchedule);
  const allSchedules = useSelector(selectAllDailySchedules);

  // Set selected schedule
  const selectSchedule = useCallback((id: number | null) => {
    dispatch(setSelectedSchedule(id));
  }, [dispatch]);

  // Clear all errors
  const clearAllErrors = useCallback(() => {
    dispatch(clearErrors());
  }, [dispatch]);

  // Get schedule by ID
  const getScheduleById = useCallback((id: number) => {
    return allSchedules.find(schedule => schedule.id === id);
  }, [allSchedules]);

  // Get schedules by employee
  const getSchedulesByEmployee = useCallback((empInfoId: number) => {
    return allSchedules.filter(schedule => schedule.emp_info_id === empInfoId);
  }, [allSchedules]);

  // Get schedules by date
  const getSchedulesByDate = useCallback((date: string) => {
    return allSchedules.filter(schedule => {
      // Extract date from ISO datetime
      const scheduleDate = new Date(schedule.date_of_day).toISOString().split('T')[0];
      return scheduleDate === date;
    });
  }, [allSchedules]);

  return useMemo(() => ({
    selectedSchedule,
    allSchedules,
    selectSchedule,
    clearAllErrors,
    getScheduleById,
    getSchedulesByEmployee,
    getSchedulesByDate,
  }), [
    selectedSchedule,
    allSchedules,
    selectSchedule,
    clearAllErrors,
    getScheduleById,
    getSchedulesByEmployee,
    getSchedulesByDate,
  ]);
};

/**
 * Helper function to map server field errors to React Hook Form
 * Reused from weekly hooks with proper typing
 */
const mapServerErrorsToForm = <TFieldValues extends FieldValues>(
  fieldErrors: FormFieldErrors,
  setError: UseFormReturn<TFieldValues>['setError']
) => {
  Object.entries(fieldErrors).forEach(([fieldPath, messages]) => {
    try {
      const formFieldPath = fieldPath as FieldPath<TFieldValues>;
      
      setError(formFieldPath, {
        type: 'server',
        message: Array.isArray(messages) ? messages[0] : messages,
      });
    } catch (error) {
      console.warn(`Unable to map server error for field: ${fieldPath}`, error);
    }
  });
};

/**
 * Type-safe server error mapping utility for legacy forms
 */
export const mapLegacyApiErrorsToForm = <TFieldValues extends FieldValues>(
  apiError: ApiError,
  setError: UseFormReturn<TFieldValues>['setError']
): void => {
  if (apiError.fieldErrors) {
    mapServerErrorsToForm(apiError.fieldErrors, setError);
  }
};
