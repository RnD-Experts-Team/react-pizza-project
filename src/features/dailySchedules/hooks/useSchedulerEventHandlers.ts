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
  // Helper functions for time calculations and data transformation
  updateEmployeeEventTimes: (employeeEventData: any, newStart: DayPilot.Date, newEnd: DayPilot.Date) => any;
  convertDayPilotDateToTimeString: (date: DayPilot.Date) => string;
}


/**
 * Custom hook for scheduler main event handlers
 * 
 * Manages all user interactions with the scheduler including navigation,
 * view changes, event manipulation (create/edit/move/resize), and store filtering.
 * Provides a centralized location for all scheduler interaction logic
 * with proper state management and data synchronization.
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
   * 
   * Switches between different scheduler view modes.
   * Each view mode has different time granularity and display characteristics.
   * 
   * @param view - The view type to switch to ('day' or 'week')
   */
  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
  };


  /**
   * Navigate to previous period
   * 
   * Moves the scheduler to the previous time period based on current view.
   * Day view: moves back 1 day
   * Week view: moves back 7 days (1 week)
   */
  const handlePrevious = () => {
    switch (currentView) {
      case 'day':
        setCurrentDate(currentDate.addDays(-1));  // Go to previous day
        break;
      case 'week':
        setCurrentDate(currentDate.addDays(-7));  // Go to previous week
        break;
    }
  };


  /**
   * Navigate to next period
   * 
   * Moves the scheduler to the next time period based on current view.
   * Day view: moves forward 1 day
   * Week view: moves forward 7 days (1 week)
   */
  const handleNext = () => {
    switch (currentView) {
      case 'day':
        setCurrentDate(currentDate.addDays(1));   // Go to next day
        break;
      case 'week':
        setCurrentDate(currentDate.addDays(7));   // Go to next week
        break;
    }
  };


  /**
   * Navigate to today
   * 
   * Resets the scheduler to display the current date.
   * Useful for quickly returning to the present after navigating through time.
   */
  const handleToday = () => {
    setCurrentDate(DayPilot.Date.today());
  };


  /**
   * Handle store selection change
   * 
   * Filters the scheduler data to show only employees from the selected store.
   * Handles the special case of 'all' which shows employees from all stores.
   * 
   * @param storeId - The ID of the selected store, or 'all' for no filtering
   */
  const handleStoreChange = (storeId: string) => {
    setSelectedStoreId(storeId === 'all' ? null : storeId);
  };


  /**
   * Handle time range selection for creating new events
   * 
   * Triggered when user selects a time range on the scheduler (click and drag).
   * Creates temporary event data and opens the create drawer for user input.
   * Resets any existing form data to ensure clean state for new event creation.
   * 
   * @param args - DayPilot time range selection arguments containing start, end, and resource
   */
  const handleTimeRangeSelected = (args: DayPilot.SchedulerTimeRangeSelectedArgs) => {
    // Create temporary event data from the user's time selection
    const eventData: NewEventData = {
      start: args.start,                    // Selected start time
      end: args.end,                        // Selected end time
      resource: String(args.resource)       // Selected employee/resource
    };


    // Set up create drawer state
    setNewEventData(eventData);             // Store temporary event data
    setEventTitle('');                      // Reset event title field
    resetCreateForm();                      // Reset all form fields to defaults
    setIsCreateDrawerOpen(true);           // Open the create drawer
  };


  /**
   * Handle event click for editing
   * 
   * Triggered when user clicks on an existing event in the scheduler.
   * Opens the edit drawer with the selected event's data pre-populated.
   * Prepares the edit form with current event information.
   * 
   * @param args - DayPilot event click arguments containing event data
   */
  const handleEventClick = (args: DayPilot.SchedulerEventClickArgs) => {
    // Extract event data from the click arguments
    const event = args.e.data as ExtendedEventData;
    
    // Set up edit drawer state
    setSelectedEvent(event);                // Store the event being edited
    setEditEventTitle(event.text || '');    // Pre-populate title field
    setIsEditDrawerOpen(true);              // Open the edit drawer
    resetEditForm();                        // Reset form to prevent stale data
  };


  /**
   * Handle event move with precise time updates
   * 
   * Triggered when user drags an event to a new time or resource.
   * Updates both the visual event properties and underlying employee event data
   * with precise time calculations to maintain data consistency.
   * 
   * @param args - DayPilot event moved arguments containing new position data
   */
  const handleEventMove = (args: DayPilot.SchedulerEventMovedArgs) => {
    // Extract movement details
    const eventId = args.e.id();
    const newStart = args.newStart;
    const newEnd = args.newEnd;
    const newResource = String(args.newResource);
    
    // Update the events array with new position data
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        // Update the basic event display properties
        const updatedEvent = { 
          ...event, 
          start: newStart,              // New start time from drag operation
          end: newEnd,                  // New end time from drag operation
          resource: newResource         // New resource/employee assignment
        };


        // Update underlying employee event data with precise time calculations
        if (event.employeeEventData) {
          updatedEvent.employeeEventData = updateEmployeeEventTimes(
            event.employeeEventData,
            newStart,
            newEnd
          );
        }


        // Debug logging for development and troubleshooting
        console.log('Event moved:', {
          eventId,
          newStartTime: convertDayPilotDateToTimeString(newStart),
          newEndTime: convertDayPilotDateToTimeString(newEnd),
          employeeEventData: updatedEvent.employeeEventData
        });


        return updatedEvent;
      }
      return event; // Leave other events unchanged
    });
    
    // Apply the updates to the scheduler
    setEvents(updatedEvents);
  };


  /**
   * Handle event resize with precise time updates
   * 
   * Triggered when user drags the start or end edge of an event to change duration.
   * Updates both the visual event properties and underlying employee event data
   * with precise time calculations to maintain data consistency.
   * 
   * @param args - DayPilot event resized arguments containing new time bounds
   */
  const handleEventResize = (args: DayPilot.SchedulerEventResizedArgs) => {
    // Extract resize details
    const eventId = args.e.id();
    const newStart = args.newStart;
    const newEnd = args.newEnd;
    
    // Update the events array with new duration data
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        // Update the basic event display properties
        const updatedEvent = { 
          ...event, 
          start: newStart,              // New start time from resize operation
          end: newEnd                   // New end time from resize operation
        };


        // Update underlying employee event data with precise time calculations
        if (event.employeeEventData) {
          updatedEvent.employeeEventData = updateEmployeeEventTimes(
            event.employeeEventData,
            newStart,
            newEnd
          );
        }


        // Debug logging for development and troubleshooting
        console.log('Event resized:', {
          eventId,
          newStartTime: convertDayPilotDateToTimeString(newStart),
          newEndTime: convertDayPilotDateToTimeString(newEnd),
          employeeEventData: updatedEvent.employeeEventData
        });


        return updatedEvent;
      }
      return event; // Leave other events unchanged
    });
    
    // Apply the updates to the scheduler
    setEvents(updatedEvents);
  };


  // Return all handler functions for use by the component
  return {
    handleViewChange,           // View mode switching (day/week)
    handlePrevious,            // Navigate to previous time period
    handleNext,                // Navigate to next time period
    handleToday,               // Navigate to current date
    handleStoreChange,         // Store filtering
    handleTimeRangeSelected,   // Create new event from time selection
    handleEventClick,          // Edit existing event
    handleEventMove,           // Drag and drop event repositioning
    handleEventResize          // Event duration modification
  };
};
