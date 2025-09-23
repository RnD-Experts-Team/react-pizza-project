import { DayPilot } from '@daypilot/daypilot-lite-react';
import type { 
  ExtendedEventData, 
  EmployeeEventData 
} from '../types/scheduler.types';


interface UseEditDrawerHandlersProps {
  events: ExtendedEventData[];
  setEvents: (events: ExtendedEventData[]) => void;
  setIsEditDrawerOpen: (open: boolean) => void;
  setSelectedEvent: (event: ExtendedEventData | null) => void;
  setEditEventTitle: (title: string) => void;
  resetEditForm: () => void;
}


/**
 * Custom hook for edit drawer handlers
 * 
 * Manages all operations related to editing and deleting existing events through the edit drawer.
 * Handles form state management, event update logic, deletion workflow, and drawer lifecycle.
 * Provides a clean separation of concerns for event modification operations.
 */
export const useEditDrawerHandlers = ({
  events,
  setEvents,
  setIsEditDrawerOpen,
  setSelectedEvent,
  setEditEventTitle,
  resetEditForm
}: UseEditDrawerHandlersProps) => {


  /**
   * Handle edit drawer close
   * 
   * Performs complete cleanup when the edit drawer is closed.
   * Resets all form state and clears selected event to prevent
   * state leakage between edit operations.
   */
  const handleEditDrawerClose = () => {
    setIsEditDrawerOpen(false);      // Hide the edit drawer
    setSelectedEvent(null);          // Clear the currently selected event
    setEditEventTitle('');           // Reset event title field
    resetEditForm();                 // Reset all form fields to initial state
  };


  /**
   * Handle employee event form changes for edit
   * 
   * Generic form field update handler that maintains immutable state updates.
   * Uses functional state updates to prevent stale closure issues during editing.
   * 
   * @param field - The specific field in EmployeeEventData to update
   * @param value - The new value for the specified field
   * @param setEditEmployeeEventForm - State setter function for the edit form data
   */
  const handleEditEmployeeEventFormChange = (
    field: keyof EmployeeEventData, 
    value: any,
    setEditEmployeeEventForm: React.Dispatch<React.SetStateAction<EmployeeEventData>>
  ) => {
    // Use functional update to ensure we have the latest state
    setEditEmployeeEventForm(prev => ({
      ...prev,           // Preserve all existing form data
      [field]: value     // Update only the specified field
    }));
  };


  /**
   * Handle update event submission
   * 
   * Processes the complete event update workflow including validation,
   * time recalculation, and event object modification. Handles both cases
   * where scheduled times are modified and where they remain unchanged.
   * Updates the event in place within the events array.
   * 
   * @param selectedEvent - The event currently being edited
   * @param editEventTitle - Updated title for the event
   * @param editEmployeeEventForm - Complete updated form data
   */
  const handleUpdateEvent = (
    selectedEvent: ExtendedEventData | null,
    editEventTitle: string,
    editEmployeeEventForm: EmployeeEventData
  ) => {
    // Basic validation - ensure required data is present
    if (!selectedEvent || !editEventTitle.trim()) {
      return;
    }


    // Initialize with existing event timing
    let eventStart = selectedEvent.start;
    let eventEnd = selectedEvent.end;


    // Recalculate timing if scheduled times have been modified
    if (editEmployeeEventForm.scheduled_start_time && editEmployeeEventForm.scheduled_end_time) {
      // Extract the date portion from the existing event
      const eventDate = new Date(selectedEvent.start.toString());
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
      const startTimeFormatted = formatTimeString(editEmployeeEventForm.scheduled_start_time);
      const endTimeFormatted = formatTimeString(editEmployeeEventForm.scheduled_end_time);
      
      // Create new DayPilot.Date objects combining existing date with updated times
      eventStart = new DayPilot.Date(`${dateString}T${startTimeFormatted}`);
      eventEnd = new DayPilot.Date(`${dateString}T${endTimeFormatted}`);
    }


    // Update the events array by mapping over it and replacing the target event
    const updatedEvents = events.map(event =>
      event.id === selectedEvent.id
        ? { 
            ...event,                           // Preserve existing event properties
            text: editEventTitle.trim(),        // Update event title
            start: eventStart,                  // Apply calculated start time
            end: eventEnd,                      // Apply calculated end time
            employeeEventData: editEmployeeEventForm // Update complete form data
          }
        : event // Leave other events unchanged
    );
    setEvents(updatedEvents);
    
    // Debug logging for development and troubleshooting
    console.log('Event updated:', selectedEvent);
    console.log('Employee event form data:', editEmployeeEventForm);
    
    // Clean up and close the drawer after successful update
    handleEditDrawerClose();
  };


  /**
   * Handle delete event
   * 
   * Removes an event from the events array and performs cleanup.
   * This is a destructive operation that permanently removes the event
   * from the scheduler. The calling component should handle confirmation
   * before invoking this function.
   * 
   * @param selectedEvent - The event to be deleted
   */
  const handleDeleteEvent = (selectedEvent: ExtendedEventData | null) => {
    // Validation - ensure we have an event to delete
    if (!selectedEvent) {
      return;
    }


    // Filter out the selected event from the events array
    const updatedEvents = events.filter(event => event.id !== selectedEvent.id);
    setEvents(updatedEvents);
    
    // Debug logging for development and troubleshooting
    console.log('Event deleted:', selectedEvent.id);
    
    // Clean up and close the drawer after successful deletion
    handleEditDrawerClose();
  };


  // Return handler functions for use by the component
  return {
    handleEditDrawerClose,             // Drawer cleanup and close
    handleEditEmployeeEventFormChange, // Form field updates
    handleUpdateEvent,                 // Event modification and update
    handleDeleteEvent                  // Event deletion
  };
};
