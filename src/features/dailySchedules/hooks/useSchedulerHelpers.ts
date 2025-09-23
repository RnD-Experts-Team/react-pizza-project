import { useCallback } from 'react';
import { DayPilot } from '@daypilot/daypilot-lite-react';
import type { Employee, EmployeeEventData, ViewType } from '../types/scheduler.types';
import { employeesData, storesData } from '../data/schedulerData';


/**
 * Custom hook for scheduler helper functions
 * 
 * Provides a collection of utility functions for data manipulation,
 * formatting, and calculations used throughout the scheduler application.
 * Uses useCallback for performance optimization to prevent unnecessary re-renders.
 * Centralizes common operations to maintain consistency across components.
 */
export const useSchedulerHelpers = (selectedStoreId: string | null) => {
  /**
   * Get filtered employees based on selected store
   * 
   * Filters the employee list to show only employees from the currently selected store.
   * When no store is selected or 'all' is selected, returns all employees.
   * Memoized to prevent unnecessary recalculations when dependencies haven't changed.
   * 
   * @returns Array of employees filtered by store selection
   */
  const getFilteredEmployees = useCallback((): Employee[] => {
    if (!selectedStoreId || selectedStoreId === 'all') {
      return employeesData; // Return all employees when no specific store is selected
    }
    // Filter employees to only include those from the selected store
    return employeesData.filter(emp => emp.storeId === selectedStoreId);
  }, [selectedStoreId]);


  /**
   * Get date range text for display
   * 
   * Formats the current date range based on the view type for user-friendly display.
   * Day view: Shows full date like "September 23, 2025"
   * Week view: Shows date range like "Sep 20 - Sep 26, 2025"
   * 
   * @param currentView - The current scheduler view type
   * @param currentDate - The current date being displayed
   * @returns Formatted date string for display in the UI
   */
  const getDateRangeText = (currentView: ViewType, currentDate: DayPilot.Date): string => {
    switch (currentView) {
      case 'day':
        // Format single day as "Month Day, Year"
        return currentDate.toString('MMMM d, yyyy');
      case 'week':
        // Calculate week boundaries and format as range
        const weekStart = currentDate.firstDayOfWeek();
        const weekEnd = weekStart.addDays(6);
        return `${weekStart.toString('MMM d')} - ${weekEnd.toString('MMM d, yyyy')}`;
      default:
        // Fallback to default date formatting
        return currentDate.toString();
    }
  };


  /**
   * Reset create form to initial state
   * 
   * Provides a fresh EmployeeEventData object with default values.
   * Used when creating new events or resetting forms to ensure clean state.
   * Centralizes default values to maintain consistency across the application.
   * 
   * @returns EmployeeEventData object with default/empty values
   */
  const getInitialEmployeeEventForm = (): EmployeeEventData => ({
    emp_info_id: 0,                    // Default employee ID (will be set later)
    scheduled_start_time: '',          // Empty scheduled start time
    scheduled_end_time: '',            // Empty scheduled end time
    event_start_time: '',              // Empty event start time
    event_end_time: '',                // Empty event end time
    actual_start_time: null,           // No actual start time initially
    actual_end_time: null,             // No actual end time initially
    vci: false,                        // VCI disabled by default
    status_id: 1,                      // Default to first status (usually "Scheduled")
    agree_on_exception: false,         // No exception agreement by default
    exception_notes: null,             // No exception notes initially
  });


  /**
   * Get store name by ID
   * 
   * Looks up a store's display name using its ID.
   * Used for displaying store names in dropdowns and labels.
   * Returns empty string if store is not found to prevent errors.
   * 
   * @param storeId - The unique identifier for the store
   * @returns The display name of the store or empty string if not found
   */
  const getStoreName = (storeId: string): string => {
    return storesData.find(s => s.id === storeId)?.name || '';
  };


  /**
   * Convert DayPilot.Date to time string (HH:MM:SS format)
   * 
   * Extracts time components from a DayPilot.Date object and formats them
   * as a standardized time string with leading zeros for consistency.
   * Memoized for performance when used in loops or frequent updates.
   * 
   * @param date - DayPilot.Date object to convert
   * @returns Time string in HH:MM:SS format (e.g., "09:30:00")
   */
  const convertDayPilotDateToTimeString = useCallback((date: DayPilot.Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }, []);


  /**
   * Convert time string to DayPilot.Date (using today as base date)
   * 
   * Combines a time string with a base date to create a full DayPilot.Date object.
   * Useful for converting form time inputs back to DayPilot format for calculations.
   * Uses today as the default base date if none is provided.
   * 
   * @param timeString - Time in HH:MM or HH:MM:SS format
   * @param baseDate - Optional base date to use (defaults to today)
   * @returns DayPilot.Date object with the specified time on the base date
   */
  const convertTimeStringToDayPilotDate = useCallback((timeString: string, baseDate?: DayPilot.Date): DayPilot.Date => {
    // Parse time components, defaulting seconds to 0 if not provided
    const [hours, minutes, seconds = 0] = timeString.split(':').map(Number);
    const base = baseDate || DayPilot.Date.today();
    // Create new date with the specified time components
    return base.getDatePart().addHours(hours).addMinutes(minutes).addSeconds(seconds);
  }, []);


  /**
   * Update employee event data with new start and end times
   * 
   * Creates an updated EmployeeEventData object with new time values while
   * preserving all other existing data. Handles both existing employee data
   * and creates new data structure if none exists.
   * 
   * @param employeeEventData - Existing employee event data (may be undefined)
   * @param newStart - New start time as DayPilot.Date
   * @param newEnd - New end time as DayPilot.Date
   * @returns Updated EmployeeEventData with new time values
   */
  const updateEmployeeEventTimes = useCallback((
    employeeEventData: EmployeeEventData | undefined,
    newStart: DayPilot.Date,
    newEnd: DayPilot.Date
  ): EmployeeEventData => {
    // Convert DayPilot dates to time strings for storage
    const newStartTime = convertDayPilotDateToTimeString(newStart);
    const newEndTime = convertDayPilotDateToTimeString(newEnd);


    return {
      // Use existing data or initialize with defaults
      ...(employeeEventData || getInitialEmployeeEventForm()),
      // Update all time-related fields with new values
      scheduled_start_time: newStartTime,
      scheduled_end_time: newEndTime,
      event_start_time: newStartTime,      // Keep event times in sync with scheduled
      event_end_time: newEndTime,
    };
  }, [convertDayPilotDateToTimeString, getInitialEmployeeEventForm]);


  /**
   * Calculate duration in hours between two times
   * 
   * Computes the time difference between start and end times and converts
   * to hours as a decimal number. Uses a fixed date (2000-01-01) to ensure
   * consistent calculation regardless of actual dates.
   * 
   * @param startTime - Start time in HH:MM or HH:MM:SS format
   * @param endTime - End time in HH:MM or HH:MM:SS format
   * @returns Duration in hours as a decimal number (e.g., 8.5 for 8 hours 30 minutes)
   */
  const calculateDurationHours = useCallback((startTime: string, endTime: string): number => {
    // Use fixed date to focus on time calculation only
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    // Convert millisecond difference to hours
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }, []);


  /**
   * Format duration for display (e.g., "8.5 hours")
   * 
   * Converts numerical duration in hours to user-friendly display text.
   * Handles special cases for singular/plural forms and sub-hour durations.
   * Provides consistent formatting throughout the application.
   * 
   * @param hours - Duration in hours as a decimal number
   * @returns Formatted duration string for display
   */
  const formatDuration = useCallback((hours: number): string => {
    if (hours === 1) return '1 hour';      // Singular form for exactly 1 hour
    if (hours < 1) {
      // Convert sub-hour durations to minutes for better readability
      const minutes = Math.round(hours * 60);
      return `${minutes} minutes`;
    }
    // Standard format for multiple hours with one decimal place
    return `${hours.toFixed(1)} hours`;
  }, []);


  // Return all utility functions for use by components
  return {
    getFilteredEmployees,              // Employee filtering by store
    getDateRangeText,                  // Date range formatting for display
    getInitialEmployeeEventForm,       // Default form values
    getStoreName,                      // Store name lookup
    convertDayPilotDateToTimeString,   // DayPilot to time string conversion
    convertTimeStringToDayPilotDate,   // Time string to DayPilot conversion
    updateEmployeeEventTimes,          // Time update utility for events
    calculateDurationHours,            // Duration calculation
    formatDuration                     // Duration formatting for display
  };
};
