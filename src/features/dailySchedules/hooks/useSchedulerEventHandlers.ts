import { DayPilot } from '@daypilot/daypilot-lite-react';
import type { 
  ViewType, 
  ExtendedEventData, 
  NewEventData 
} from '../types/scheduler.types';

interface UseSchedulerEventHandlersProps {
  currentView: ViewType;
  currentDate: DayPilot.Date;
  events: ExtendedEventData[];
  setCurrentView: (view: ViewType) => void;
  setCurrentDate: (date: DayPilot.Date) => void;
  setSelectedStoreId: (storeId: string | null) => void;
  setEvents: (events: ExtendedEventData[]) => void;
  setNewEventData: (data: NewEventData | null) => void;
  setIsCreateDrawerOpen: (open: boolean) => void;
  setSelectedEvent: (event: ExtendedEventData | null) => void;
  setIsEditDrawerOpen: (open: boolean) => void;
  setEventTitle: (title: string) => void;
  setEditEventTitle: (title: string) => void;
  resetCreateForm: () => void;
  resetEditForm: () => void;
  // Add helper functions for time calculations
  updateEmployeeEventTimes: (employeeEventData: any, newStart: DayPilot.Date, newEnd: DayPilot.Date) => any;
  convertDayPilotDateToTimeString: (date: DayPilot.Date) => string;
}

/**
 * Custom hook for scheduler main event handlers
 */
export const useSchedulerEventHandlers = ({
  currentView,
  currentDate,
  events,
  setCurrentView,
  setCurrentDate,
  setSelectedStoreId,
  setEvents,
  setNewEventData,
  setIsCreateDrawerOpen,
  setSelectedEvent,
  setIsEditDrawerOpen,
  setEventTitle,
  setEditEventTitle,
  resetCreateForm,
  resetEditForm,
  updateEmployeeEventTimes,
  convertDayPilotDateToTimeString
}: UseSchedulerEventHandlersProps) => {

  /**
   * Handle view changes (day/week)
   */
  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
  };

  /**
   * Navigate to previous period
   */
  const handlePrevious = () => {
    switch (currentView) {
      case 'day':
        setCurrentDate(currentDate.addDays(-1));
        break;
      case 'week':
        setCurrentDate(currentDate.addDays(-7));
        break;
    }
  };

  /**
   * Navigate to next period
   */
  const handleNext = () => {
    switch (currentView) {
      case 'day':
        setCurrentDate(currentDate.addDays(1));
        break;
      case 'week':
        setCurrentDate(currentDate.addDays(7));
        break;
    }
  };

  /**
   * Navigate to today
   */
  const handleToday = () => {
    setCurrentDate(DayPilot.Date.today());
  };

  /**
   * Handle store selection change
   */
  const handleStoreChange = (storeId: string) => {
    setSelectedStoreId(storeId === 'all' ? null : storeId);
  };

  /**
   * Handle time range selection for creating new events
   */
  const handleTimeRangeSelected = (args: DayPilot.SchedulerTimeRangeSelectedArgs) => {
    const eventData: NewEventData = {
      start: args.start,
      end: args.end,
      resource: String(args.resource)
    };

    setNewEventData(eventData);
    setEventTitle('');
    resetCreateForm();
    setIsCreateDrawerOpen(true);
  };

  /**
   * Handle event click for editing
   */
  const handleEventClick = (args: DayPilot.SchedulerEventClickArgs) => {
    const event = args.e.data as ExtendedEventData;
    setSelectedEvent(event);
    setEditEventTitle(event.text || '');
    setIsEditDrawerOpen(true);
    resetEditForm();
  };

  /**
   * Handle event move with precise time updates
   */
  const handleEventMove = (args: DayPilot.SchedulerEventMovedArgs) => {
    const eventId = args.e.id();
    const newStart = args.newStart;
    const newEnd = args.newEnd;
    const newResource = String(args.newResource);
    
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        // Update the basic event properties
        const updatedEvent = { 
          ...event, 
          start: newStart, 
          end: newEnd, 
          resource: newResource 
        };

        // Update employeeEventData with precise time calculations
        if (event.employeeEventData) {
          updatedEvent.employeeEventData = updateEmployeeEventTimes(
            event.employeeEventData,
            newStart,
            newEnd
          );
        }

        // Log the time update for debugging
        console.log('Event moved:', {
          eventId,
          newStartTime: convertDayPilotDateToTimeString(newStart),
          newEndTime: convertDayPilotDateToTimeString(newEnd),
          employeeEventData: updatedEvent.employeeEventData
        });

        return updatedEvent;
      }
      return event;
    });
    
    setEvents(updatedEvents);
  };

  /**
   * Handle event resize with precise time updates
   */
  const handleEventResize = (args: DayPilot.SchedulerEventResizedArgs) => {
    const eventId = args.e.id();
    const newStart = args.newStart;
    const newEnd = args.newEnd;
    
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        // Update the basic event properties
        const updatedEvent = { 
          ...event, 
          start: newStart, 
          end: newEnd 
        };

        // Update employeeEventData with precise time calculations
        if (event.employeeEventData) {
          updatedEvent.employeeEventData = updateEmployeeEventTimes(
            event.employeeEventData,
            newStart,
            newEnd
          );
        }

        // Log the time update for debugging
        console.log('Event resized:', {
          eventId,
          newStartTime: convertDayPilotDateToTimeString(newStart),
          newEndTime: convertDayPilotDateToTimeString(newEnd),
          employeeEventData: updatedEvent.employeeEventData
        });

        return updatedEvent;
      }
      return event;
    });
    
    setEvents(updatedEvents);
  };

  return {
    handleViewChange,
    handlePrevious,
    handleNext,
    handleToday,
    handleStoreChange,
    handleTimeRangeSelected,
    handleEventClick,
    handleEventMove,
    handleEventResize
  };
};