// src/features/dailySchedules/services/weeklySchedulesService.ts

import { api, createRequestConfig, type ApiRequestOptions } from './api';
import {
  type WeeklyScheduleBody,
  WeeklyScheduleBodySchema,
  type WeeklyProcessResponse,
  WeeklyProcessResponseSchema,
  type WeeklyAnalysisParams,
  WeeklyAnalysisParamsSchema,
  type WeeklyAnalysisResponse,
  WeeklyAnalysisResponseSchema,
  createApiError,
} from '../types';

/**
 * Process weekly schedule - PRIMARY WORKFLOW
 * POST /api/weekly-schedules/process
 * 
 * This is the main endpoint for creating/updating schedules using the weekly flow.
 * Handles both day-level and legacy single schedule formats within the weekly structure.
 * Performs comprehensive validation including skill coverage and hour limits.
 * 
 * @param body - Weekly schedule data containing schedules for multiple days
 * @param opts - Optional request options including abort signal
 * @returns Promise resolving to processed schedules with validation results and week summary
 * @throws ApiError on validation failures, network errors, or server errors
 */
export const processWeeklySchedule = async (
  body: WeeklyScheduleBody,
  opts?: ApiRequestOptions
): Promise<WeeklyProcessResponse> => {
  try {
    // Validate request body with Zod
    const validatedBody = WeeklyScheduleBodySchema.parse(body);

    // Make API request
    const response = await api.post<WeeklyProcessResponse>(
      '/weekly-schedules/process',
      validatedBody,
      createRequestConfig(opts)
    );

    // Validate response with Zod
    const validatedResponse = WeeklyProcessResponseSchema.parse(response.data);

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
 * Get weekly schedule analysis
 * GET /api/weekly-schedules/analysis
 * 
 * Retrieves comprehensive analysis for schedules within a work week containing the specified date.
 * Includes daily breakdowns, skill coverage analysis, and week totals.
 * Can be filtered by specific employee IDs.
 * 
 * @param params - Analysis parameters including date and optional employee filter
 * @param opts - Optional request options including abort signal
 * @returns Promise resolving to weekly analysis data with daily breakdowns
 * @throws ApiError on validation failures, network errors, or server errors
 */
export const getWeeklyScheduleAnalysis = async (
  params: WeeklyAnalysisParams,
  opts?: ApiRequestOptions
): Promise<WeeklyAnalysisResponse> => {
  try {
    // Validate query parameters with Zod
    const validatedParams = WeeklyAnalysisParamsSchema.parse(params);

    // Build query string
    const queryParams = new URLSearchParams();
    queryParams.append('date', validatedParams.date);
    
    if (validatedParams.emp_info_ids && validatedParams.emp_info_ids.length > 0) {
      validatedParams.emp_info_ids.forEach(id => {
        queryParams.append('emp_info_ids[]', id.toString());
      });
    }

    // Make API request
    const response = await api.get<WeeklyAnalysisResponse>(
      `/weekly-schedules/analysis?${queryParams.toString()}`,
      createRequestConfig(opts)
    );

    // Validate response with Zod
    const validatedResponse = WeeklyAnalysisResponseSchema.parse(response.data);

    return validatedResponse;
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
 * Helper function to validate weekly schedule data before submission
 * Performs client-side validation including business rule checks
 * 
 * @param body - Weekly schedule data to validate
 * @returns Object containing validation status and any violations found
 */
export const validateWeeklyScheduleData = (body: WeeklyScheduleBody): {
  isValid: boolean;
  violations: string[];
} => {
  const violations: string[] = [];

  try {
    // Basic Zod validation
    WeeklyScheduleBodySchema.parse(body);
  } catch (error) {
    if (error instanceof Error && 'issues' in error) {
      const zodError = error as any;
      violations.push(...zodError.issues.map((issue: any) => issue.message));
    }
  }

  // Additional business rule validations
  const dates = body.weekly_schedule.map(day => day.date_of_day);
  const uniqueDates = new Set(dates);

  if (dates.length !== uniqueDates.size) {
    violations.push('Duplicate dates found in weekly schedule');
  }

  // Check for employee overlapping shifts within each day
  body.weekly_schedule.forEach(day => {
    const daySchedules = 'schedules' in day ? day.schedules : [day];
    const employeeShifts = new Map<number, Array<{ start: string; end: string }>>();

    daySchedules.forEach(schedule => {
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
            `Employee ${schedule.emp_info_id} has overlapping shifts on ${day.date_of_day}`
          );
          break;
        }
      }

      shifts.push(newShift);
    });
  });

  return {
    isValid: violations.length === 0,
    violations,
  };
};

/**
 * Helper function to extract unique employee IDs from weekly schedule data
 * Useful for building analysis queries or validation
 * 
 * @param body - Weekly schedule data
 * @returns Array of unique employee IDs found in the schedule
 */
export const extractEmployeeIds = (body: WeeklyScheduleBody): number[] => {
  const employeeIds = new Set<number>();

  body.weekly_schedule.forEach(day => {
    if ('schedules' in day) {
      // Day-level format
      day.schedules.forEach(schedule => {
        employeeIds.add(schedule.emp_info_id);
      });
    } else {
      // Legacy single format
      employeeIds.add(day.emp_info_id);
    }
  });

  return Array.from(employeeIds);
};

/**
 * Helper function to calculate total hours for weekly schedule
 * Performs time calculations for schedule validation and reporting
 * 
 * @param body - Weekly schedule data
 * @returns Object containing total hours and per-employee breakdowns
 */
export const calculateWeeklyHours = (body: WeeklyScheduleBody): {
  totalHours: number;
  employeeHours: Record<number, number>;
} => {
  const employeeHours: Record<number, number> = {};
  let totalHours = 0;

  body.weekly_schedule.forEach(day => {
    const daySchedules = 'schedules' in day ? day.schedules : [day];

    daySchedules.forEach(schedule => {
      // Calculate hours for this schedule
      const startTime = new Date(`2000-01-01T${schedule.scheduled_start_time}`);
      const endTime = new Date(`2000-01-01T${schedule.scheduled_end_time}`);
      const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);

      if (hours > 0) {
        totalHours += hours;
        employeeHours[schedule.emp_info_id] = (employeeHours[schedule.emp_info_id] || 0) + hours;
      }
    });
  });

  return {
    totalHours,
    employeeHours,
  };
};

/**
 * Helper function to check skill coverage for weekly schedule
 * Validates that employee skills match required skills for schedules
 * 
 * @param body - Weekly schedule data (must include employee skill data)
 * @returns Object containing coverage analysis and missing skills
 */
export const checkSkillCoverage = (body: WeeklyScheduleBody): {
  fullyCovered: boolean;
  missingSkills: Array<{
    date: string;
    scheduleIndex: number;
    requiredSkills: number[];
    availableSkills: number[];
    missingSkills: number[];
  }>;
} => {
  const missingSkills: Array<{
    date: string;
    scheduleIndex: number;
    requiredSkills: number[];
    availableSkills: number[];
    missingSkills: number[];
  }> = [];

  body.weekly_schedule.forEach(day => {
    const daySchedules = 'schedules' in day ? day.schedules : [day];

    daySchedules.forEach((schedule, index) => {
      if (schedule.required_skills && schedule.required_skills.length > 0) {
        const employeeSkills = schedule.employee?.skills.map(s => s.id) || [];
        const requiredSkillIds = schedule.required_skills;
        const missing = requiredSkillIds.filter(skillId => !employeeSkills.includes(skillId));

        if (missing.length > 0) {
          missingSkills.push({
            date: day.date_of_day,
            scheduleIndex: index,
            requiredSkills: requiredSkillIds,
            availableSkills: employeeSkills,
            missingSkills: missing,
          });
        }
      }
    });
  });

  return {
    fullyCovered: missingSkills.length === 0,
    missingSkills,
  };
};
