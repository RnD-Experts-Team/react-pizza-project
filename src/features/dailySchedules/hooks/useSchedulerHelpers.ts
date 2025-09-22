import { useCallback } from 'react';
import { DayPilot } from '@daypilot/daypilot-lite-react';
import type { Employee, EmployeeEventData, ViewType } from '../types/scheduler.types';
import { employeesData, storesData } from '../data/schedulerData';

/**
 * Custom hook for scheduler helper functions
 */
export const useSchedulerHelpers = (selectedStoreId: string | null) => {
  /**
   * Get filtered employees based on selected store
   */
  const getFilteredEmployees = useCallback((): Employee[] => {
    if (!selectedStoreId || selectedStoreId === 'all') {
      return employeesData;
    }
    return employeesData.filter(emp => emp.storeId === selectedStoreId);
  }, [selectedStoreId]);

  /**
   * Get date range text for display
   */
  const getDateRangeText = (currentView: ViewType, currentDate: DayPilot.Date): string => {
    switch (currentView) {
      case 'day':
        return currentDate.toString('MMMM d, yyyy');
      case 'week':
        const weekStart = currentDate.firstDayOfWeek();
        const weekEnd = weekStart.addDays(6);
        return `${weekStart.toString('MMM d')} - ${weekEnd.toString('MMM d, yyyy')}`;
      default:
        return currentDate.toString();
    }
  };

  /**
   * Reset create form to initial state
   */
  const getInitialEmployeeEventForm = (): EmployeeEventData => ({
    emp_info_id: 0,
    scheduled_start_time: '',
    scheduled_end_time: '',
    event_start_time: '',
    event_end_time: '',
    actual_start_time: null,
    actual_end_time: null,
    vci: false,
    status_id: 1,
    agree_on_exception: false,
    exception_notes: null,
  });

  /**
   * Get store name by ID
   */
  const getStoreName = (storeId: string): string => {
    return storesData.find(s => s.id === storeId)?.name || '';
  };

  /**
   * Convert DayPilot.Date to time string (HH:MM:SS format)
   */
  const convertDayPilotDateToTimeString = useCallback((date: DayPilot.Date): string => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }, []);

  /**
   * Convert time string to DayPilot.Date (using today as base date)
   */
  const convertTimeStringToDayPilotDate = useCallback((timeString: string, baseDate?: DayPilot.Date): DayPilot.Date => {
    const [hours, minutes, seconds = 0] = timeString.split(':').map(Number);
    const base = baseDate || DayPilot.Date.today();
    return base.getDatePart().addHours(hours).addMinutes(minutes).addSeconds(seconds);
  }, []);

  /**
   * Update employee event data with new start and end times
   */
  const updateEmployeeEventTimes = useCallback((
    employeeEventData: EmployeeEventData | undefined,
    newStart: DayPilot.Date,
    newEnd: DayPilot.Date
  ): EmployeeEventData => {
    const newStartTime = convertDayPilotDateToTimeString(newStart);
    const newEndTime = convertDayPilotDateToTimeString(newEnd);

    return {
      ...(employeeEventData || getInitialEmployeeEventForm()),
      scheduled_start_time: newStartTime,
      scheduled_end_time: newEndTime,
      event_start_time: newStartTime,
      event_end_time: newEndTime,
    };
  }, [convertDayPilotDateToTimeString, getInitialEmployeeEventForm]);

  /**
   * Calculate duration in hours between two times
   */
  const calculateDurationHours = useCallback((startTime: string, endTime: string): number => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
  }, []);

  /**
   * Format duration for display (e.g., "8.5 hours")
   */
  const formatDuration = useCallback((hours: number): string => {
    if (hours === 1) return '1 hour';
    if (hours < 1) {
      const minutes = Math.round(hours * 60);
      return `${minutes} minutes`;
    }
    return `${hours.toFixed(1)} hours`;
  }, []);

  return {
    getFilteredEmployees,
    getDateRangeText,
    getInitialEmployeeEventForm,
    getStoreName,
    convertDayPilotDateToTimeString,
    convertTimeStringToDayPilotDate,
    updateEmployeeEventTimes,
    calculateDurationHours,
    formatDuration
  };
};