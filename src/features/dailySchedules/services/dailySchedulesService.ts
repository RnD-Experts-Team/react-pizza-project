// src/features/dailySchedules/services/dailySchedulesService.ts

import { api, createRequestConfig, type ApiRequestOptions } from './api';
import {
  type ListDailySchedulesParams,
  ListDailySchedulesParamsSchema,
  type DailySchedule,
  DailyScheduleSchema,
  type DayLevelCreateBody,
  DayLevelCreateBodySchema,
  type DayLevelCreateResponse,
  DayLevelCreateResponseSchema,
  type SingleCreateBody,
  SingleCreateBodySchema,
  type SingleCreateResponse,
  SingleCreateResponseSchema,
  type SkillAttachmentBody,
  SkillAttachmentBodySchema,
  type WeeklySchedulesParams,
  WeeklySchedulesParamsSchema,
  createApiError,
} from '../types';

/**
 * LEGACY/BACK-COMPAT: List daily schedules with optional filtering
 * GET /api/daily-schedules
 * 
 * Secondary endpoint - use weekly flow for primary operations.
 * Retrieves daily schedules with optional date range and employee filtering.
 * 
 * @param params - Optional query parameters for filtering
 * @param opts - Optional request options including abort signal
 * @returns Promise resolving to array of daily schedules
 * @throws ApiError on validation failures, network errors, or server errors
 */
export const listDailySchedules = async (
  params?: ListDailySchedulesParams,
  opts?: ApiRequestOptions
): Promise<DailySchedule[]> => {
  try {
    // Validate query parameters if provided
    const validatedParams = params ? ListDailySchedulesParamsSchema.parse(params) : {};

    // Build query string
    const queryParams = new URLSearchParams();
    if (validatedParams.start_date) {
      queryParams.append('start_date', validatedParams.start_date);
    }
    if (validatedParams.end_date) {
      queryParams.append('end_date', validatedParams.end_date);
    }
    if (validatedParams.emp_info_id) {
      queryParams.append('emp_info_id', validatedParams.emp_info_id.toString());
    }

    const queryString = queryParams.toString();
    const url = queryString ? `/daily-schedules?${queryString}` : '/daily-schedules';

    // Make API request
    const response = await api.get<DailySchedule[]>(url, createRequestConfig(opts));

    // Validate each schedule in response array
    const validatedSchedules = response.data.map((schedule, index) => {
      try {
        return DailyScheduleSchema.parse(schedule);
      } catch (error) {
        throw createApiError(
          500,
          `Invalid schedule data at index ${index}`,
          undefined,
          error
        );
      }
    });

    return validatedSchedules;
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof Error && 'issues' in error) {
      throw createApiError(
        400,
        'Parameter validation failed',
        undefined,
        error
      );
    }

    // Re-throw API errors (already normalized by interceptor)
    throw error;
  }
};

/**
 * LEGACY/BACK-COMPAT: Get single daily schedule by ID
 * GET /api/daily-schedules/{id}
 * 
 * Secondary endpoint - use weekly flow for primary operations.
 * Retrieves a specific daily schedule with full details.
 * 
 * @param id - Daily schedule ID
 * @param opts - Optional request options including abort signal
 * @returns Promise resolving to daily schedule details
 * @throws ApiError on validation failures, network errors, or server errors
 */
export const getDailySchedule = async (
  id: number,
  opts?: ApiRequestOptions
): Promise<DailySchedule> => {
  try {
    // Make API request
    const response = await api.get<DailySchedule>(
      `/daily-schedules/${id}`,
      createRequestConfig(opts)
    );

    // Validate response with Zod
    const validatedSchedule = DailyScheduleSchema.parse(response.data);

    return validatedSchedule;
  } catch (error) {
    // Re-throw API errors (already normalized by interceptor)
    throw error;
  }
};

/**
 * LEGACY/BACK-COMPAT: Create multiple daily schedules for a single day
 * POST /api/daily-schedules (day-level shape)
 * 
 * Secondary endpoint - use weekly processWeeklySchedule for primary operations.
 * Creates multiple schedules for a single date with validation and summary.
 * 
 * @param body - Day-level create data with date and schedules array
 * @param opts - Optional request options including abort signal
 * @returns Promise resolving to created schedules with validation results
 * @throws ApiError on validation failures, network errors, or server errors
 */
export const createDailySchedulesDay = async (
  body: DayLevelCreateBody,
  opts?: ApiRequestOptions
): Promise<DayLevelCreateResponse> => {
  try {
    // Validate request body with Zod
    const validatedBody = DayLevelCreateBodySchema.parse(body);

    // Make API request
    const response = await api.post<DayLevelCreateResponse>(
      '/daily-schedules',
      validatedBody,
      createRequestConfig(opts)
    );

    // Validate response with Zod
    const validatedResponse = DayLevelCreateResponseSchema.parse(response.data);

    return validatedResponse;
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof Error && 'issues' in error) {
      throw createApiError(
        400,
        'Request validation failed',
        undefined,
        error
      );
    }

    // Re-throw API errors (already normalized by interceptor)
    throw error;
  }
};

/**
 * LEGACY/BACK-COMPAT: Create single daily schedule
 * POST /api/daily-schedules (single shape)
 * 
 * Secondary endpoint - use weekly processWeeklySchedule for primary operations.
 * Creates a single schedule with validation results.
 * 
 * @param body - Single create data with date and schedule details
 * @param opts - Optional request options including abort signal
 * @returns Promise resolving to created schedule with validation results
 * @throws ApiError on validation failures, network errors, or server errors
 */
export const createDailyScheduleSingle = async (
  body: SingleCreateBody,
  opts?: ApiRequestOptions
): Promise<SingleCreateResponse> => {
  try {
    // Validate request body with Zod
    const validatedBody = SingleCreateBodySchema.parse(body);

    // Make API request
    const response = await api.post<SingleCreateResponse>(
      '/daily-schedules',
      validatedBody,
      createRequestConfig(opts)
    );

    // Validate response with Zod
    const validatedResponse = SingleCreateResponseSchema.parse(response.data);

    return validatedResponse;
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof Error && 'issues' in error) {
      throw createApiError(
        400,
        'Request validation failed',
        undefined,
        error
      );
    }

    // Re-throw API errors (already normalized by interceptor)
    throw error;
  }
};

/**
 * LEGACY/BACK-COMPAT: Update existing daily schedule
 * PUT /api/daily-schedules/{id}
 * 
 * Secondary endpoint - use weekly processWeeklySchedule for primary operations.
 * Updates an existing schedule. Note: emp_info_id and date_of_day are 
 * "sometimes|required" server-side (only if provided).
 * 
 * @param id - Daily schedule ID to update
 * @param body - Update data (partial schedule data)
 * @param opts - Optional request options including abort signal
 * @returns Promise resolving to updated schedule with validation results
 * @throws ApiError on validation failures, network errors, or server errors
 */
export const updateDailySchedule = async (
  id: number,
  body: SingleCreateBody,
  opts?: ApiRequestOptions
): Promise<SingleCreateResponse> => {
  try {
    // Validate request body with Zod
    const validatedBody = SingleCreateBodySchema.parse(body);

    // Make API request
    const response = await api.put<SingleCreateResponse>(
      `/daily-schedules/${id}`,
      validatedBody,
      createRequestConfig(opts)
    );

    // Validate response with Zod
    const validatedResponse = SingleCreateResponseSchema.parse(response.data);

    return validatedResponse;
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof Error && 'issues' in error) {
      throw createApiError(
        400,
        'Request validation failed',
        undefined,
        error
      );
    }

    // Re-throw API errors (already normalized by interceptor)
    throw error;
  }
};

/**
 * LEGACY/BACK-COMPAT: Delete daily schedule
 * DELETE /api/daily-schedules/{id}
 * 
 * Secondary endpoint - use weekly processWeeklySchedule for primary operations.
 * Deletes an existing daily schedule.
 * 
 * @param id - Daily schedule ID to delete
 * @param opts - Optional request options including abort signal
 * @returns Promise resolving when deletion is complete
 * @throws ApiError on network errors or server errors
 */
export const deleteDailySchedule = async (
  id: number,
  opts?: ApiRequestOptions
): Promise<void> => {
  try {
    // Make API request
    await api.delete(`/daily-schedules/${id}`, createRequestConfig(opts));
  } catch (error) {
    // Re-throw API errors (already normalized by interceptor)
    throw error;
  }
};

/**
 * LEGACY/BACK-COMPAT: Attach skill to daily schedule
 * POST /api/daily-schedules/{dailyScheduleId}/skills/{skillId}
 * 
 * Secondary endpoint - use weekly processWeeklySchedule for primary operations.
 * Attaches a skill requirement to an existing daily schedule.
 * 
 * @param dailyScheduleId - Daily schedule ID
 * @param skillId - Skill ID to attach
 * @param body - Optional attachment data (is_required flag)
 * @param opts - Optional request options including abort signal
 * @returns Promise resolving when attachment is complete
 * @throws ApiError on validation failures, network errors, or server errors
 */
export const attachSkill = async (
  dailyScheduleId: number,
  skillId: number,
  body?: SkillAttachmentBody,
  opts?: ApiRequestOptions
): Promise<void> => {
  try {
    // Validate request body if provided
    const validatedBody = body ? SkillAttachmentBodySchema.parse(body) : {};

    // Make API request
    await api.post(
      `/daily-schedules/${dailyScheduleId}/skills/${skillId}`,
      validatedBody,
      createRequestConfig(opts)
    );
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof Error && 'issues' in error) {
      throw createApiError(
        400,
        'Request validation failed',
        undefined,
        error
      );
    }

    // Re-throw API errors (already normalized by interceptor)
    throw error;
  }
};

/**
 * LEGACY/BACK-COMPAT: Detach skill from daily schedule
 * DELETE /api/daily-schedules/{dailyScheduleId}/skills/{skillId}
 * 
 * Secondary endpoint - use weekly processWeeklySchedule for primary operations.
 * Removes a skill requirement from an existing daily schedule.
 * 
 * @param dailyScheduleId - Daily schedule ID
 * @param skillId - Skill ID to detach
 * @param opts - Optional request options including abort signal
 * @returns Promise resolving when detachment is complete
 * @throws ApiError on network errors or server errors
 */
export const detachSkill = async (
  dailyScheduleId: number,
  skillId: number,
  opts?: ApiRequestOptions
): Promise<void> => {
  try {
    // Make API request
    await api.delete(
      `/daily-schedules/${dailyScheduleId}/skills/${skillId}`,
      createRequestConfig(opts)
    );
  } catch (error) {
    // Re-throw API errors (already normalized by interceptor)
    throw error;
  }
};

/**
 * LEGACY/BACK-COMPAT: Get weekly schedules for viewing
 * GET /api/daily-schedules/weekly/{empInfoId}?date=YYYY-MM-DD[&emp_info_id=number]
 * 
 * Secondary endpoint - use weekly analysis for primary operations.
 * Note: The route param {empInfoId} is ignored by the server controller.
 * Filter by query emp_info_id parameter if needed.
 * 
 * @param params - Query parameters with date and optional employee filter
 * @param opts - Optional request options including abort signal
 * @returns Promise resolving to weekly schedule data
 * @throws ApiError on validation failures, network errors, or server errors
 */
export const getWeeklySchedules = async (
  params: WeeklySchedulesParams,
  opts?: ApiRequestOptions
): Promise<DailySchedule[]> => {
  try {
    // Validate query parameters
    const validatedParams = WeeklySchedulesParamsSchema.parse(params);

    // Build query string
    const queryParams = new URLSearchParams();
    queryParams.append('date', validatedParams.date);
    
    if (validatedParams.emp_info_id) {
      queryParams.append('emp_info_id', validatedParams.emp_info_id.toString());
    }

    // Note: Using dummy route param since server ignores it anyway
    // The actual filtering is done by the query parameters
    const response = await api.get<DailySchedule[]>(
      `/daily-schedules/weekly/0?${queryParams.toString()}`,
      createRequestConfig(opts)
    );

    // Validate each schedule in response array
    const validatedSchedules = response.data.map((schedule, index) => {
      try {
        return DailyScheduleSchema.parse(schedule);
      } catch (error) {
        throw createApiError(
          500,
          `Invalid schedule data at index ${index}`,
          undefined,
          error
        );
      }
    });

    return validatedSchedules;
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof Error && 'issues' in error) {
      throw createApiError(
        400,
        'Parameter validation failed',
        undefined,
        error
      );
    }

    // Re-throw API errors (already normalized by interceptor)
    throw error;
  }
};

/**
 * Helper function to validate single schedule data before submission
 * Performs client-side validation for legacy endpoints
 * 
 * @param body - Single schedule data to validate
 * @returns Object containing validation status and any violations found
 */
export const validateSingleScheduleData = (body: SingleCreateBody): {
  isValid: boolean;
  violations: string[];
} => {
  const violations: string[] = [];

  try {
    // Basic Zod validation
    SingleCreateBodySchema.parse(body);
  } catch (error) {
    if (error instanceof Error && 'issues' in error) {
      const zodError = error as any;
      violations.push(...zodError.issues.map((issue: any) => issue.message));
    }
  }

  return {
    isValid: violations.length === 0,
    violations,
  };
};

/**
 * Helper function to validate day-level schedule data before submission
 * Performs client-side validation for legacy day-level endpoint
 * 
 * @param body - Day-level schedule data to validate
 * @returns Object containing validation status and any violations found
 */
export const validateDayLevelScheduleData = (body: DayLevelCreateBody): {
  isValid: boolean;
  violations: string[];
} => {
  const violations: string[] = [];

  try {
    // Basic Zod validation
    DayLevelCreateBodySchema.parse(body);
  } catch (error) {
    if (error instanceof Error && 'issues' in error) {
      const zodError = error as any;
      violations.push(...zodError.issues.map((issue: any) => issue.message));
    }
  }

  // Check for employee overlapping shifts within the day
  const employeeShifts = new Map<number, Array<{ start: string; end: string }>>();

  body.schedules.forEach((schedule, index) => {
    if (!employeeShifts.has(schedule.emp_info_id)) {
      employeeShifts.set(schedule.emp_info_id, []);
    }

    const shifts = employeeShifts.get(schedule.emp_info_id)!;
    const newShift = {
      start: schedule.scheduled_start_time,
      end: schedule.scheduled_end_time,
    };

    // Check for overlaps with existing shifts
    for (const existingShift of shifts) {
      if (newShift.start < existingShift.end && newShift.end > existingShift.start) {
        violations.push(
          `Employee ${schedule.emp_info_id} has overlapping shifts (schedule index ${index})`
        );
        break;
      }
    }

    shifts.push(newShift);
  });

  return {
    isValid: violations.length === 0,
    violations,
  };
};
