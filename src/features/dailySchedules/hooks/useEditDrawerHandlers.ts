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
   */
  const handleEditDrawerClose = () => {
    setIsEditDrawerOpen(false);
    setSelectedEvent(null);
    setEditEventTitle('');
    resetEditForm();
  };

  /**
   * Handle employee event form changes for edit
   */
  const handleEditEmployeeEventFormChange = (
    field: keyof EmployeeEventData, 
    value: any,
    setEditEmployeeEventForm: React.Dispatch<React.SetStateAction<EmployeeEventData>>
  ) => {
    setEditEmployeeEventForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Handle update event submission
   */
  const handleUpdateEvent = (
    selectedEvent: ExtendedEventData | null,
    editEventTitle: string,
    editEmployeeEventForm: EmployeeEventData
  ) => {
    if (!selectedEvent || !editEventTitle.trim()) {
      return;
    }

    // Calculate new event timing if scheduled times are provided
    let eventStart = selectedEvent.start;
    let eventEnd = selectedEvent.end;

    if (editEmployeeEventForm.scheduled_start_time && editEmployeeEventForm.scheduled_end_time) {
      const eventDate = new Date(selectedEvent.start.toString());
      const dateString = eventDate.toISOString().split('T')[0]; // Get YYYY-MM-DD format
      
      // Ensure time strings are in proper format (handle both HH:MM and HH:MM:SS formats)
      const formatTimeString = (timeStr: string): string => {
        const parts = timeStr.split(':');
        if (parts.length === 2) {
          return `${timeStr}:00`; // Add seconds if missing
        }
        return timeStr; // Already has seconds
      };
      
      const startTimeFormatted = formatTimeString(editEmployeeEventForm.scheduled_start_time);
      const endTimeFormatted = formatTimeString(editEmployeeEventForm.scheduled_end_time);
      
      // Create new DayPilot.Date objects with the scheduled times
      eventStart = new DayPilot.Date(`${dateString}T${startTimeFormatted}`);
      eventEnd = new DayPilot.Date(`${dateString}T${endTimeFormatted}`);
    }

    const updatedEvents = events.map(event =>
      event.id === selectedEvent.id
        ? { 
            ...event, 
            text: editEventTitle.trim(),
            start: eventStart,
            end: eventEnd,
            employeeEventData: editEmployeeEventForm
          }
        : event
    );
    setEvents(updatedEvents);
    
    console.log('Event updated:', selectedEvent);
    console.log('Employee event form data:', editEmployeeEventForm);
    
    handleEditDrawerClose();
  };

  /**
   * Handle delete event
   */
  const handleDeleteEvent = (selectedEvent: ExtendedEventData | null) => {
    if (!selectedEvent) {
      return;
    }

    const updatedEvents = events.filter(event => event.id !== selectedEvent.id);
    setEvents(updatedEvents);
    
    console.log('Event deleted:', selectedEvent.id);
    
    handleEditDrawerClose();
  };

  return {
    handleEditDrawerClose,
    handleEditEmployeeEventFormChange,
    handleUpdateEvent,
    handleDeleteEvent
  };
};