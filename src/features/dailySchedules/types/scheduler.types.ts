import { DayPilot } from '@daypilot/daypilot-lite-react';

// ================================================================================
// TYPE DEFINITIONS AND INTERFACES
// ================================================================================

/**
 * Extended interface that builds upon DayPilot's EventData
 * Adds custom properties for enhanced event functionality
 */
export interface ExtendedEventData extends DayPilot.EventData {
  description?: string;    // Additional event description
  status?: string;        // Event status (Confirmed, Tentative, etc.)
  priority?: string;      // Priority level (High, Medium, Low)
  position?: string;      // Custom position field
  text2?: string;         // Secondary text field
  start2?: string | DayPilot.Date;  // Secondary start time
  end2?: string | DayPilot.Date;    // Secondary end time
  text3?: string;         // Tertiary text field
  start3?: string | DayPilot.Date;  // Tertiary start time
  end3?: string | DayPilot.Date;    // Tertiary end time
  // Employee event data fields
  employeeEventData?: EmployeeEventData;
}

/**
 * Interface for status data
 * Represents a status with id and name for the status dropdown
 */
export interface Status {
  id: string;
  name: string;
}

/**
 * Interface for operation data
 * Represents an operation that can be assigned to time segments
 */
export interface Operation {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

/**
 * Interface for operation time segment
 * Represents a time segment within an event with an assigned operation
 */
export interface OperationSegment {
  id: string;
  startTime: string; // HH:MM format
  endTime: string;   // HH:MM format
  operationId: string;
  operation?: Operation; // Populated operation data
}

/**
 * Interface for operation segmentation data
 * Contains all segments for an event
 */
export interface OperationSegmentation {
  segments: OperationSegment[];
  isEnabled: boolean;
}

/**
 * Interface for employee event data
 * Represents the data structure for creating employee events
 */
export interface EmployeeEventData {
  emp_info_id: number;
  scheduled_start_time: string;
  scheduled_end_time: string;
  event_start_time: string;
  event_end_time: string;
  actual_start_time: string | null;
  actual_end_time: string | null;
  vci: boolean;
  status_id: number;
  agree_on_exception: boolean;
  exception_notes: string | null;
  operation_segmentation?: OperationSegmentation;
}

/**
 * Interface for store data
 * Represents a store with id and name
 */
export interface Store {
  id: string;
  name: string;
}

/**
 * Interface for employee data
 * Represents an employee with id, name, and store association
 */
export interface Employee {
  id: string;
  name: string;
  storeId: string;
  color: string;  // Color theme for the employee
}

/**
 * Available view types for the scheduler
 * Each provides different time granularity and display options
 */
export type ViewType = 'day' | 'week';

/**
 * Scale types supported by DayPilot Scheduler
 * Determines the smallest time unit displayed
 */
export type ScaleType = 'Hour' | 'Day' | 'Week' | 'CellDuration';

/**
 * Group by types for time headers
 * Controls how time is grouped and displayed in headers
 */
export type GroupByType = 'Day' | 'Hour' | 'Week' | 'Year';

/**
 * Configuration object for different view types
 * Contains all the settings needed to render a specific view
 */
export interface ViewConfig {
  scale: ScaleType;           // Primary time scale
  days: number;               // Number of days to display
  startDate: string;          // Starting date for the view
  timeHeaders: Array<{        // Header configuration
    groupBy: GroupByType;     // How to group time periods
    format?: string;          // Display format for the header
  }>;
  cellWidth: number;          // Width of each time cell in pixels
  businessBeginsHour?: number; // Start of business hours
  businessEndsHour?: number;   // End of business hours
  showNonBusiness?: boolean;   // Whether to show non-business hours
}

/**
 * Interface for new event data when creating events
 */
export interface NewEventData {
  start: DayPilot.Date;
  end: DayPilot.Date;
  resource: string;
}

/**
 * Props interface for the scheduler component
 */
export interface SchedulerProps {
  resources: DayPilot.ResourceData[];
  events: ExtendedEventData[];
  currentView: ViewType;
  currentDate: DayPilot.Date;
  onEventMoved: (args: DayPilot.SchedulerEventMovedArgs) => void;
  onEventResized: (args: DayPilot.SchedulerEventResizedArgs) => void;
  onTimeRangeSelected: (args: DayPilot.SchedulerTimeRangeSelectedArgs) => void;
  onEventClick: (args: DayPilot.SchedulerEventClickArgs) => void;
}

/**
 * Props interface for the create drawer component
 */
export interface CreateDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  newEventData: NewEventData | null;
  eventTitle: string;
  onEventTitleChange: (title: string) => void;
  employeeEventForm: EmployeeEventData;
  onEmployeeEventFormChange: (field: keyof EmployeeEventData, value: any) => void;
  onCreateEvent: () => void;
  employees: Employee[];
  statuses: Status[];
  businessBeginsHour?: number;
  businessEndsHour?: number;
}

/**
 * Props interface for the edit drawer component
 */
export interface EditDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  editingEvent: ExtendedEventData | null;
  editEventTitle: string;
  onEditEventTitleChange: (title: string) => void;
  editEmployeeEventForm: EmployeeEventData;
  onEditEmployeeEventFormChange: (field: keyof EmployeeEventData, value: any) => void;
  onEditEvent: () => void;
  onDeleteEvent: () => void;
  employees: Employee[];
  statuses: Status[];
  businessBeginsHour?: number;
  businessEndsHour?: number;
}