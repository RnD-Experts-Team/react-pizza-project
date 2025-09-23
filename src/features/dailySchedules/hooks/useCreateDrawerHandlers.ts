import { DayPilot } from '@daypilot/daypilot-lite-react';
import type { 
  ExtendedEventData, 
  NewEventData, 
  EmployeeEventData 
} from '../types/scheduler.types';


interface UseCreateDrawerHandlersProps {
  events: ExtendedEventData[];
  setEvents: (events: ExtendedEventData[]) => void;
  setIsCreateDrawerOpen: (open: boolean) => void;
  setNewEventData: (data: NewEventData | null) => void;
  setEventTitle: (title: string) => void;
  resetCreateForm: () => void;
}


/**
 * Custom hook for create drawer handlers
 * 
 * Manages all operations related to creating new events through the create drawer.
 * Handles form state management, event creation logic, and drawer lifecycle.
 * Provides a clean separation of concerns for event creation workflows.
 */
export const useCreateDrawerHandlers = ({
  events,
  setEvents,
  setIsCreateDrawerOpen,
  setNewEventData,
  setEventTitle,
  resetCreateForm
}: UseCreateDrawerHandlersProps) => {


  /**
   * Handle create drawer close
   * 
   * Performs complete cleanup when the create drawer is closed.
   * Resets all form state and clears temporary data to prevent
   * state leakage between create operations.
   */
  const handleCreateDrawerClose = () => {
    setIsCreateDrawerOpen(false);    // Hide the create drawer
    setNewEventData(null);           // Clear temporary event data from time selection
    setEventTitle('');               // Reset event title field
    resetCreateForm();               // Reset all form fields to initial state
  };


  /**
   * Handle employee event form changes for create
   * 
   * Generic form field update handler that maintains immutable state updates.
   * Uses functional state updates to prevent stale closure issues.
   * 
   * @param field - The specific field in EmployeeEventData to update
   * @param value - The new value for the specified field
   * @param setEmployeeEventForm - State setter function for the form data
   */
  const handleEmployeeEventFormChange = (
    field: keyof EmployeeEventData, 
    value: any,
    setEmployeeEventForm: React.Dispatch<React.SetStateAction<EmployeeEventData>>
  ) => {
    // Use functional update to ensure we have the latest state
    setEmployeeEventForm(prev => ({
      ...prev,           // Preserve all existing form data
      [field]: value     // Update only the specified field
    }));
  };


  /**
   * Handle create event submission
   * 
   * Processes the complete event creation workflow including validation,
   * time calculation, and event object construction. Handles both cases
   * where scheduled times are provided and where default selection times are used.
   * 
   * @param newEventData - Temporary event data from scheduler time range selection
   * @param eventTitle - User-entered title for the new event
   * @param employeeEventForm - Complete form data including times and options
   */
  const handleCreateEvent = (
    newEventData: NewEventData | null,
    eventTitle: string,
    employeeEventForm: EmployeeEventData
  ) => {
    // Basic validation - ensure required data is present
    if (!newEventData || !eventTitle.trim()) {
      return;
    }


    // Initialize with default event timing from time range selection
    let eventStart = newEventData.start;
    let eventEnd = newEventData.end;


    // Override with custom scheduled times if provided by user
    if (employeeEventForm.scheduled_start_time && employeeEventForm.scheduled_end_time) {
      // Extract the date portion from the original event selection
      const eventDate = new Date(newEventData.start.toString());
      const dateString = eventDate.toISOString().split('T')[0]; // Get YYYY-MM-DD format
      
      /**
       * Ensure time strings are in proper format for Date constructor
       * Handles both HH:MM and HH:MM:SS formats by normalizing to HH:MM:SS
       * @param timeStr - Time string in HH:MM or HH:MM:SS format
       * @returns Normalized time string in HH:MM:SS format
       */
      const formatTimeString = (timeStr: string): string => {
        const parts = timeStr.split(':');
        if (parts.length === 2) {
          return `${timeStr}:00`; // Add seconds if missing
        }
        return timeStr; // Already has seconds
      };
      
      // Normalize time strings to ensure proper Date parsing
      const startTimeFormatted = formatTimeString(employeeEventForm.scheduled_start_time);
      const endTimeFormatted = formatTimeString(employeeEventForm.scheduled_end_time);
      
      // Create new DayPilot.Date objects combining date with custom times
      eventStart = new DayPilot.Date(`${dateString}T${startTimeFormatted}`);
      eventEnd = new DayPilot.Date(`${dateString}T${endTimeFormatted}`);
    }


    // Construct the complete event object with all necessary data
    const newEvent: ExtendedEventData = {
      ...newEventData,                    // Inherit basic properties from time selection
      id: `event_${Date.now()}`,         // Generate unique ID using timestamp
      text: eventTitle.trim(),           // Use cleaned event title
      start: eventStart,                 // Calculated start time
      end: eventEnd,                     // Calculated end time
      employeeEventData: employeeEventForm // Complete form data for event details
    };


    // Add the new event to the existing events array
    setEvents([...events, newEvent]);
    
    // Debug logging for development and troubleshooting
    console.log('Event created:', newEvent);
    console.log('Employee event form data:', employeeEventForm);
    
    // Clean up and close the drawer after successful creation
    handleCreateDrawerClose();
  };


  // Return handler functions for use by the component
  return {
    handleCreateDrawerClose,           // Drawer cleanup and close
    handleEmployeeEventFormChange,     // Form field updates
    handleCreateEvent                  // Event creation and submission
  };
};
