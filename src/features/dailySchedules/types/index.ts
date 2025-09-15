// src/features/dailySchedules/types/index.ts

import { z } from 'zod';

// Helper schemas for common patterns
export const TimeStringSchema = z.string().regex(
  /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
  'Time must be in HH:MM:SS format'
);

export const DateOnlySchema = z.string().regex(
  /^\d{4}-\d{2}-\d{2}$/,
  'Date must be in YYYY-MM-DD format'
);

export const ISODateSchema = z.string().datetime();

// Base entity schemas matching server responses
export const SkillPivotSchema = z.object({
  emp_info_id: z.number().optional(),
  daily_schedule_id: z.number().optional(),
  skill_id: z.number(),
  rating: z.string().optional(),
  is_required: z.boolean().optional(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const SkillSchema = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  created_at: ISODateSchema,
  updated_at: ISODateSchema,
  pivot: SkillPivotSchema.optional(),
});

export const StatusSchema = z.object({
  id: z.number(),
  description: z.string(),
  slug: z.string(),
  created_at: ISODateSchema,
  updated_at: ISODateSchema,
});

export const EmpInfoSchema = z.object({
  id: z.number(),
  store_id: z.string(),
  full_name: z.string(),
  date_of_birth: ISODateSchema,
  has_family: z.boolean(),
  has_car: z.boolean(),
  is_arabic_team: z.boolean(),
  notes: z.string().nullable(),
  status: z.string(),
  created_at: ISODateSchema,
  updated_at: ISODateSchema,
  skills: z.array(SkillSchema).optional(), // Present in analysis responses
});

export const DailyScheduleSchema = z.object({
  id: z.number(),
  date_of_day: ISODateSchema, // Server returns ISO format like "2025-09-15T00:00:00.000000Z"
  emp_info_id: z.number(),
  scheduled_start_time: TimeStringSchema,
  scheduled_end_time: TimeStringSchema,
  actual_start_time: TimeStringSchema.nullable(),
  actual_end_time: TimeStringSchema.nullable(),
  vci: z.boolean().nullable(),
  status_id: z.number(),
  agree_on_exception: z.boolean(),
  exception_notes: z.string().nullable(),
  scheduled_hours: z.number().optional(),
  created_at: ISODateSchema,
  updated_at: ISODateSchema,
  emp_info: EmpInfoSchema,
  status: StatusSchema,
  required_skills: z.array(SkillSchema),
});

export const ValidationResultSchema = z.object({
  valid: z.boolean(),
  violations: z.array(z.string()),
});

export const DaySummarySchema = z.object({
  date: DateOnlySchema,
  total_schedules: z.number(),
  unique_employees: z.number(),
  total_hours: z.number(),
  schedules_with_exceptions: z.number(),
  required_skills: z.array(z.number()),
  available_skills: z.array(z.number()),
  skill_coverage_complete: z.boolean(),
});

// Weekly flow schemas
export const SkillCoverageSchema = z.object({
  required_skills: z.array(z.number()),
  available_skills: z.array(z.number()),
  missing_skills: z.array(z.number()),
  fully_covered: z.boolean(),
});

export const HoursSummarySchema = z.object({
  employee_name: z.string(),
  total_scheduled_hours: z.number(),
  max_weekly_hours: z.number(),
  hours_remaining: z.number(),
  is_over_limit: z.boolean(),
});

export const WeekSummarySchema = z.object({
  week_start: DateOnlySchema,
  week_end: DateOnlySchema,
  total_schedules: z.number(),
  unique_employees: z.number(),
  employees_scheduled: z.number(),
  unique_dates: z.number(),
  total_hours: z.number(),
  validation_status: z.enum(['passed', 'failed']),
  total_violations: z.number(),
  skill_coverage_summary: z.record(z.string(), SkillCoverageSchema),
  hours_summary: z.record(z.string(), HoursSummarySchema),
  conflicts_summary: z.array(z.unknown()), // Server defines this as unknown[]
});

export const WeeklyValidationResultSchema = z.object({
  valid: z.boolean(),
  violations: z.array(z.string()),
  skill_coverage: z.record(z.string(), SkillCoverageSchema),
  hours_summary: z.record(z.string(), HoursSummarySchema),
  conflicts: z.array(z.unknown()),
});

// Request payload schemas
export const DailyScheduleCreateItemSchema = z.object({
  emp_info_id: z.number(),
  scheduled_start_time: TimeStringSchema,
  scheduled_end_time: TimeStringSchema,
  status_id: z.number(),
  actual_start_time: TimeStringSchema.optional(),
  actual_end_time: TimeStringSchema.optional(),
  vci: z.boolean().nullable().optional(),
  agree_on_exception: z.boolean().optional(),
  exception_notes: z.string().optional(),
  required_skills: z.array(z.number()).optional(),
}).superRefine((data, ctx) => {
  // Validate that end time is after start time
  if (data.scheduled_end_time <= data.scheduled_start_time) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'End time must be after start time',
      path: ['scheduled_end_time'],
    });
  }
});

// Employee data for weekly requests (optional but used for skill validation)
export const EmployeeDataSchema = z.object({
  id: z.number(),
  skills: z.array(z.object({ id: z.number() })),
  employment_info: z.object({
    max_weekly_hours: z.number(),
  }).optional(),
});

// Extended schema for weekly requests that includes employee data
export const DailyScheduleCreateItemWithEmployeeSchema = DailyScheduleCreateItemSchema.extend({
  employee: EmployeeDataSchema.optional(),
});

// Legacy single create schema for POST /api/daily-schedules (single shape)
export const SingleCreateBodySchema = z.object({
  date_of_day: DateOnlySchema,
}).merge(DailyScheduleCreateItemSchema);

// Day-level create schema for POST /api/daily-schedules (day-level shape)
export const DayLevelCreateBodySchema = z.object({
  date_of_day: DateOnlySchema,
  schedules: z.array(DailyScheduleCreateItemSchema),
});

// Weekly request schemas
export const WeeklyScheduleDaySchema = z.union([
  // Day-level shape
  z.object({
    date_of_day: DateOnlySchema,
    schedules: z.array(DailyScheduleCreateItemWithEmployeeSchema),
  }),
  // Legacy single shape
  z.object({
    date_of_day: DateOnlySchema,
    employee: EmployeeDataSchema.optional(),
  }).merge(DailyScheduleCreateItemSchema),
]);

export const WeeklyScheduleBodySchema = z.object({
  weekly_schedule: z.array(WeeklyScheduleDaySchema).superRefine((days, ctx) => {
    // Validate that all dates fall within the same 7-day work week
    if (days.length === 0) return;
    
    const dates = days.map(day => new Date(day.date_of_day));
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
    const dayDiff = (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (dayDiff > 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'All dates must fall within a 7-day work week',
        path: ['weekly_schedule'],
      });
    }
  }),
});

// Analysis schemas
export const DayAnalysisSchema = z.object({
  date: DateOnlySchema,
  total_schedules: z.number(),
  total_employees: z.number(),
  total_hours: z.number(),
  required_skills: z.array(z.number()),
  available_skills: z.array(z.number()),
  missing_skills: z.array(z.number()),
  skill_coverage_complete: z.boolean(),
  schedules: z.array(DailyScheduleSchema),
});

export const WeekTotalsSchema = z.object({
  total_hours: z.number(),
  total_actual_hours: z.number(),
  schedules_with_exceptions: z.number(),
});

export const WeeklyAnalysisDataSchema = z.object({
  week_start: DateOnlySchema,
  week_end: DateOnlySchema,
  total_schedules: z.number(),
  unique_employees: z.number(),
  daily_analysis: z.record(z.string(), DayAnalysisSchema),
  week_totals: WeekTotalsSchema,
});

// Response schemas
export const SingleCreateResponseSchema = z.object({
  data: DailyScheduleSchema,
  validation_result: ValidationResultSchema,
});

export const DayLevelCreateResponseSchema = z.object({
  data: z.array(DailyScheduleSchema),
  validation_result: ValidationResultSchema,
  day_summary: DaySummarySchema,
});

export const WeeklyProcessResponseSchema = z.object({
  success: z.literal(true),
  message: z.string(),
  data: z.object({
    schedules: z.array(DailyScheduleSchema),
    week_summary: WeekSummarySchema,
  }),
  validation_result: WeeklyValidationResultSchema,
});

export const WeeklyAnalysisResponseSchema = z.object({
  success: z.literal(true),
  data: WeeklyAnalysisDataSchema,
});

// Query parameter schemas
export const ListDailySchedulesParamsSchema = z.object({
  start_date: DateOnlySchema.optional(),
  end_date: DateOnlySchema.optional(),
  emp_info_id: z.number().optional(),
});

export const WeeklySchedulesParamsSchema = z.object({
  date: DateOnlySchema,
  emp_info_id: z.number().optional(),
});

export const WeeklyAnalysisParamsSchema = z.object({
  date: DateOnlySchema,
  emp_info_ids: z.array(z.number()).optional(),
});

export const SkillAttachmentBodySchema = z.object({
  is_required: z.boolean().optional(),
});

// Error handling schemas
export const ApiErrorSchema = z.object({
  status: z.number(),
  message: z.string(),
  fieldErrors: z.record(z.string(), z.array(z.string())).optional(),
  raw: z.unknown().optional(),
});

// Form schemas for client-side validation
export const WeeklyScheduleFormSchema = z.object({
  weekly_schedule: z.array(
    z.object({
      date_of_day: DateOnlySchema,
      schedules: z.array(
        DailyScheduleCreateItemSchema.extend({
          // Additional client-side validation
          employee_id: z.number(), // For form selection
          employee_skills: z.array(z.number()).optional(), // For skill coverage validation
        })
      ).superRefine((schedules, ctx) => {
        // Client-side validation: no overlapping shifts per employee
        const employeeSchedules = new Map<number, Array<{ start: string; end: string }>>();
        
        for (const schedule of schedules) {
          if (!employeeSchedules.has(schedule.emp_info_id)) {
            employeeSchedules.set(schedule.emp_info_id, []);
          }
          
          const empSchedules = employeeSchedules.get(schedule.emp_info_id)!;
          const newSchedule = {
            start: schedule.scheduled_start_time,
            end: schedule.scheduled_end_time,
          };
          
          // Check for overlap with existing schedules for this employee
          for (const existing of empSchedules) {
            if (
              (newSchedule.start < existing.end && newSchedule.end > existing.start)
            ) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: 'Employee cannot have overlapping shifts on the same day',
                path: [schedules.indexOf(schedule)],
              });
              return;
            }
          }
          
          empSchedules.push(newSchedule);
        }
      }),
    })
  ).superRefine((days, ctx) => {
    // Ensure all dates are within the same work week
    if (days.length === 0) return;
    
    const dates = days.map(day => new Date(day.date_of_day));
    const minDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map(d => d.getTime())));
    const dayDiff = (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
    
    if (dayDiff > 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'All dates must fall within a 7-day work week',
        path: ['weekly_schedule'],
      });
    }
  }),
});

// TypeScript type exports using z.infer
export type TimeString = z.infer<typeof TimeStringSchema>;
export type DateOnly = z.infer<typeof DateOnlySchema>;
export type ISODate = z.infer<typeof ISODateSchema>;

export type SkillPivot = z.infer<typeof SkillPivotSchema>;
export type Skill = z.infer<typeof SkillSchema>;
export type Status = z.infer<typeof StatusSchema>;
export type EmpInfo = z.infer<typeof EmpInfoSchema>;
export type DailySchedule = z.infer<typeof DailyScheduleSchema>;
export type ValidationResult = z.infer<typeof ValidationResultSchema>;
export type DaySummary = z.infer<typeof DaySummarySchema>;
export type SkillCoverage = z.infer<typeof SkillCoverageSchema>;
export type HoursSummary = z.infer<typeof HoursSummarySchema>;
export type WeekSummary = z.infer<typeof WeekSummarySchema>;
export type WeeklyValidationResult = z.infer<typeof WeeklyValidationResultSchema>;

export type DailyScheduleCreateItem = z.infer<typeof DailyScheduleCreateItemSchema>;
export type EmployeeData = z.infer<typeof EmployeeDataSchema>;
export type DailyScheduleCreateItemWithEmployee = z.infer<typeof DailyScheduleCreateItemWithEmployeeSchema>;

export type SingleCreateBody = z.infer<typeof SingleCreateBodySchema>;
export type DayLevelCreateBody = z.infer<typeof DayLevelCreateBodySchema>;
export type WeeklyScheduleDay = z.infer<typeof WeeklyScheduleDaySchema>;
export type WeeklyScheduleBody = z.infer<typeof WeeklyScheduleBodySchema>;

export type DayAnalysis = z.infer<typeof DayAnalysisSchema>;
export type WeekTotals = z.infer<typeof WeekTotalsSchema>;
export type WeeklyAnalysisData = z.infer<typeof WeeklyAnalysisDataSchema>;

export type SingleCreateResponse = z.infer<typeof SingleCreateResponseSchema>;
export type DayLevelCreateResponse = z.infer<typeof DayLevelCreateResponseSchema>;
export type WeeklyProcessResponse = z.infer<typeof WeeklyProcessResponseSchema>;
export type WeeklyAnalysisResponse = z.infer<typeof WeeklyAnalysisResponseSchema>;

export type ListDailySchedulesParams = z.infer<typeof ListDailySchedulesParamsSchema>;
export type WeeklySchedulesParams = z.infer<typeof WeeklySchedulesParamsSchema>;
export type WeeklyAnalysisParams = z.infer<typeof WeeklyAnalysisParamsSchema>;
export type SkillAttachmentBody = z.infer<typeof SkillAttachmentBodySchema>;

export type ApiError = z.infer<typeof ApiErrorSchema>;
export type WeeklyScheduleForm = z.infer<typeof WeeklyScheduleFormSchema>;

// Utility type for form field errors mapping
export type FormFieldErrors = Record<string, string[]>;

// Helper function to create ApiError instances
export const createApiError = (
  status: number,
  message: string,
  fieldErrors?: Record<string, string[]>,
  raw?: unknown
): ApiError => ({
  status,
  message,
  fieldErrors,
  raw,
});

// Helper to validate time format and ordering
export const validateTimeRange = (start: string, end: string): boolean => {
  try {
    TimeStringSchema.parse(start);
    TimeStringSchema.parse(end);
    return end > start;
  } catch {
    return false;
  }
};

// Helper to check if dates are in same work week
export const areDatesInSameWorkWeek = (dates: string[]): boolean => {
  if (dates.length === 0) return true;
  
  const parsedDates = dates.map(date => new Date(date));
  const minDate = new Date(Math.min(...parsedDates.map(d => d.getTime())));
  const maxDate = new Date(Math.max(...parsedDates.map(d => d.getTime())));
  const dayDiff = (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);
  
  return dayDiff <= 6;
};
