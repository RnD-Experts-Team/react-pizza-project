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
   */
  const handleCreateDrawerClose = () => {
    setIsCreateDrawerOpen(false);
    setNewEventData(null);
    setEventTitle('');
    resetCreateForm();
  };

  /**
   * Handle employee event form changes for create
   */
  const handleEmployeeEventFormChange = (
    field: keyof EmployeeEventData, 
    value: any,
    setEmployeeEventForm: React.Dispatch<React.SetStateAction<EmployeeEventData>>
  ) => {
    setEmployeeEventForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Handle create event submission
   */
  const handleCreateEvent = (
    newEventData: NewEventData | null,
    eventTitle: string,
    employeeEventForm: EmployeeEventData
  ) => {
    if (!newEventData || !eventTitle.trim()) {
      return;
    }

    // Create base event from newEventData
    let eventStart = newEventData.start;
    let eventEnd = newEventData.end;

    // If scheduled times are provided, use them to update the event timing
    if (employeeEventForm.scheduled_start_time && employeeEventForm.scheduled_end_time) {
      const eventDate = new Date(newEventData.start.toString());
      const dateString = eventDate.toISOString().split('T')[0]; // Get YYYY-MM-DD format
      
      // Ensure time strings are in proper format (handle both HH:MM and HH:MM:SS formats)
      const formatTimeString = (timeStr: string): string => {
        const parts = timeStr.split(':');
        if (parts.length === 2) {
          return `${timeStr}:00`; // Add seconds if missing
        }
        return timeStr; // Already has seconds
      };
      
      const startTimeFormatted = formatTimeString(employeeEventForm.scheduled_start_time);
      const endTimeFormatted = formatTimeString(employeeEventForm.scheduled_end_time);
      
      // Create new DayPilot.Date objects with the scheduled times
      eventStart = new DayPilot.Date(`${dateString}T${startTimeFormatted}`);
      eventEnd = new DayPilot.Date(`${dateString}T${endTimeFormatted}`);
    }

    const newEvent: ExtendedEventData = {
      ...newEventData,
      id: `event_${Date.now()}`,
      text: eventTitle.trim(),
      start: eventStart,
      end: eventEnd,
      employeeEventData: employeeEventForm
    };

    setEvents([...events, newEvent]);
    
    console.log('Event created:', newEvent);
    console.log('Employee event form data:', employeeEventForm);
    
    handleCreateDrawerClose();
  };

  return {
    handleCreateDrawerClose,
    handleEmployeeEventFormChange,
    handleCreateEvent
  };
};