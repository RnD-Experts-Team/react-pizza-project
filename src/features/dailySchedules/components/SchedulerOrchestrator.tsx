import React, { useEffect, useState } from 'react';
import { DayPilot } from '@daypilot/daypilot-lite-react';


// Import our modular components for separation of concerns
import SchedulerCore from './SchedulerCore';
import CreateEventDrawer from './CreateEventDrawer';
import EditEventDrawer from './EditEventDrawer';


// Import UI components for consistent interface elements
import MainTitle from './ui/MainTitle';
import NavigationToolbar from './ui/NavigationToolbar';
import StoreSelection from './ui/StoreSelection';
import InformationBar from './ui/InformationBar';


// Import custom hooks for business logic separation
import { useSchedulerHelpers } from '../hooks/useSchedulerHelpers';
import { useSchedulerEventHandlers } from '../hooks/useSchedulerEventHandlers';
import { useCreateDrawerHandlers } from '../hooks/useCreateDrawerHandlers';
import { useEditDrawerHandlers } from '../hooks/useEditDrawerHandlers';


// Import static data sources
import { statusesData, storesData, originalEventData } from '../data/schedulerData';


// Import TypeScript type definitions
import type { 
  ExtendedEventData, 
  ViewType, 
  EmployeeEventData,
  NewEventData,
  ViewConfig
} from '../types/scheduler.types';


/**
 * SchedulerOrchestrator Component
 * 
 * Main component that orchestrates all scheduler functionality.
 * Manages state, coordinates between sub-components, and handles business logic.
 * Acts as the central hub for all scheduler operations and data flow coordination.
 * Implements a clean separation of concerns with custom hooks handling specific domains.
 */
const SchedulerOrchestrator: React.FC = () => {
  // ================================================================================
  // STATE MANAGEMENT
  // ================================================================================


  // Core scheduler state - manages the fundamental data and view configuration
  const [resources, setResources] = useState<DayPilot.ResourceData[]>([]); // Employee/resource list for scheduler
  const [events, setEvents] = useState<ExtendedEventData[]>([]); // All scheduled events
  const [currentView, setCurrentView] = useState<ViewType>('week'); // Current view mode (day/week)
  const [currentDate, setCurrentDate] = useState<DayPilot.Date>(DayPilot.Date.today()); // Date being displayed
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null); // Currently selected store filter


  // Create drawer state - manages new event creation workflow
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false); // Controls drawer visibility
  const [newEventData, setNewEventData] = useState<NewEventData | null>(null); // Temporary event data from time selection
  const [eventTitle, setEventTitle] = useState(''); // Title for new event
  const [employeeEventForm, setEmployeeEventForm] = useState<EmployeeEventData>({ // Form data for new event
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


  // Edit drawer state - manages existing event editing workflow
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false); // Controls edit drawer visibility
  const [selectedEvent, setSelectedEvent] = useState<ExtendedEventData | null>(null); // Event being edited
  const [editEventTitle, setEditEventTitle] = useState(''); // Title for event being edited
  const [editEmployeeEventForm, setEditEmployeeEventForm] = useState<EmployeeEventData>({ // Form data for editing
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


  // ================================================================================
  // HOOKS
  // ================================================================================


  // Helper functions hook - provides utility functions for data manipulation and formatting
  const { 
    getFilteredEmployees,    // Gets employees filtered by selected store
    getDateRangeText,        // Formats date range for display
    getInitialEmployeeEventForm, // Provides default form values
    getStoreName,            // Gets store name by ID
    updateEmployeeEventTimes, // Updates event times in form
    convertDayPilotDateToTimeString, // Converts DayPilot dates to time strings
  } = useSchedulerHelpers(selectedStoreId);


  /**
   * Get current view configuration for business hours and display settings
   * Determines how the scheduler displays time and what settings to use
   * @param viewType - The current view mode ('day' or 'week')
   * @param date - The current date being displayed
   * @returns ViewConfig object with appropriate settings
   */
  const getViewConfig = (viewType: ViewType, date: DayPilot.Date): ViewConfig => {
    switch (viewType) {
      case 'day':
        // Day view configuration - focused on hourly scheduling
        return {
          scale: 'Hour',                // Each cell represents an hour
          days: 1,                      // Show single day
          startDate: date.getDatePart().toString(), // Start at selected date
          timeHeaders: [
            { groupBy: 'Hour', format: 'h tt' } // Display hours like "10 AM"
          ],
          cellWidth: 100,               // Width of each hour cell
          businessBeginsHour: 8,        // Business day starts at 8 AM
          businessEndsHour: 20,         // Business day ends at 8 PM
          showNonBusiness: false        // Hide non-business hours
        };
        
      case 'week':
        // Week view configuration - broader time perspective
        return {
          scale: 'Day',                 // Each cell represents a day
          days: 7,                      // Show full week
          startDate: date.firstDayOfWeek().toString(), // Start at week beginning
          timeHeaders: [
            { groupBy: 'Day', format: 'M/d/yyyy' }, // Display dates like "9/20/2025"
          ],
          cellWidth: 200,               // Width of each day cell
          businessBeginsHour: 8,        // Business hours for styling
          businessEndsHour: 20,
          showNonBusiness: false
        };
        
      default:
        // Fallback to week view for invalid types
        return getViewConfig('week', date);
    }
  };


  // Get current business hours from view configuration for drawer components
  const currentViewConfig = getViewConfig(currentView, currentDate);


  /**
   * Reset create form to initial state
   * Clears all form data when creating new events
   */
  const resetCreateForm = () => {
    setEmployeeEventForm(getInitialEmployeeEventForm());
  };


  /**
   * Reset edit form to initial state
   * Clears all form data when closing edit operations
   */
  const resetEditForm = () => {
    setEditEmployeeEventForm(getInitialEmployeeEventForm());
  };


  // Event handlers hook - manages all scheduler interactions and user actions
  const eventHandlers = useSchedulerEventHandlers({
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
  });


  // Create drawer handlers hook - manages new event creation workflow
  const createDrawerHandlers = useCreateDrawerHandlers({
    events,
    setEvents,
    setIsCreateDrawerOpen,
    setNewEventData,
    setEventTitle,
    resetCreateForm
  });


  // Edit drawer handlers hook - manages existing event editing workflow
  const editDrawerHandlers = useEditDrawerHandlers({
    events,
    setEvents,
    setIsEditDrawerOpen,
    setSelectedEvent,
    setEditEventTitle,
    resetEditForm
  });


  // ================================================================================
  // FORM HANDLERS
  // ================================================================================


  /**
   * Handle employee event form changes for create drawer
   * Updates form state when user modifies fields in the create event form
   * @param field - The form field being updated
   * @param value - The new value for the field
   */
  const handleEmployeeEventFormChange = (field: keyof EmployeeEventData, value: any) => {
    createDrawerHandlers.handleEmployeeEventFormChange(field, value, setEmployeeEventForm);
  };


  /**
   * Handle employee event form changes for edit drawer
   * Updates form state when user modifies fields in the edit event form
   * @param field - The form field being updated
   * @param value - The new value for the field
   */
  const handleEditEmployeeEventFormChange = (field: keyof EmployeeEventData, value: any) => {
    editDrawerHandlers.handleEditEmployeeEventFormChange(field, value, setEditEmployeeEventForm);
  };


  /**
   * Handle create event submission
   * Processes form data and creates a new event in the scheduler
   */
  const handleCreateEvent = () => {
    createDrawerHandlers.handleCreateEvent(newEventData, eventTitle, employeeEventForm);
  };


  /**
   * Handle update event submission
   * Processes form data and updates an existing event in the scheduler
   */
  const handleUpdateEvent = () => {
    editDrawerHandlers.handleUpdateEvent(selectedEvent, editEventTitle, editEmployeeEventForm);
  };


  /**
   * Handle delete event
   * Removes an existing event from the scheduler after confirmation
   */
  const handleDeleteEvent = () => {
    editDrawerHandlers.handleDeleteEvent(selectedEvent);
  };


  // ================================================================================
  // EFFECTS
  // ================================================================================


  /**
   * Initialize edit form with selected event data
   * Populates the edit form when an event is selected for editing
   * Ensures form reflects current event state
   */
  useEffect(() => {
    if (selectedEvent && selectedEvent.employeeEventData) {
      setEditEmployeeEventForm(selectedEvent.employeeEventData);
    }
  }, [selectedEvent]);


  /**
   * Initialize resources and events based on store selection
   * Updates the scheduler data when store filter changes
   * Filters employees and events to show only relevant data
   */
  useEffect(() => {
    // Get employees filtered by selected store
    const filteredEmployees = getFilteredEmployees();
    
    // Convert employee data to DayPilot resource format
    const dayPilotResources = filteredEmployees.map(employee => ({
      name: employee.name,
      id: employee.id
    }));


    // Update scheduler resources
    setResources(dayPilotResources);
    
    // Filter events to show only those for filtered employees
    setEvents(originalEventData.filter(event => 
      filteredEmployees.some(emp => emp.id === event.resource)
    ));
  }, [selectedStoreId, getFilteredEmployees]);


  // ================================================================================
  // RENDER
  // ================================================================================


  return (
    <div className="p-5 font-sans">
      {/* Application header with main title */}
      <MainTitle />
      
      {/* Navigation controls for date/view changes */}
      <NavigationToolbar
        currentView={currentView}
        dateRangeText={getDateRangeText(currentView, currentDate)}
        onPrevious={eventHandlers.handlePrevious}
        onNext={eventHandlers.handleNext}
        onToday={eventHandlers.handleToday}
        onViewChange={eventHandlers.handleViewChange}
      />


      {/* Store filtering dropdown */}
      <StoreSelection
        selectedStoreId={selectedStoreId}
        stores={storesData}
        onStoreChange={eventHandlers.handleStoreChange}
        getStoreName={getStoreName}
      />


      {/* Contextual information about current view */}
      <InformationBar currentView={currentView} />


      {/* Main scheduler display component */}
      <SchedulerCore
        resources={resources}
        events={events}
        currentView={currentView}
        currentDate={currentDate}
        onTimeRangeSelected={eventHandlers.handleTimeRangeSelected}
        onEventClick={eventHandlers.handleEventClick}
        onEventMoved={eventHandlers.handleEventMove}
        onEventResized={eventHandlers.handleEventResize}
      />


      {/* Modal drawer for creating new events */}
      <CreateEventDrawer
        isOpen={isCreateDrawerOpen}
        onClose={createDrawerHandlers.handleCreateDrawerClose}
        newEventData={newEventData}
        eventTitle={eventTitle}
        onEventTitleChange={setEventTitle}
        employeeEventForm={employeeEventForm}
        onEmployeeEventFormChange={handleEmployeeEventFormChange}
        onCreateEvent={handleCreateEvent}
        employees={getFilteredEmployees()}
        statuses={statusesData}
        businessBeginsHour={currentViewConfig.businessBeginsHour}
        businessEndsHour={currentViewConfig.businessEndsHour}
      />


      {/* Modal drawer for editing existing events */}
      <EditEventDrawer
        isOpen={isEditDrawerOpen}
        onClose={editDrawerHandlers.handleEditDrawerClose}
        editingEvent={selectedEvent}
        editEventTitle={editEventTitle}
        onEditEventTitleChange={setEditEventTitle}
        editEmployeeEventForm={editEmployeeEventForm}
        onEditEmployeeEventFormChange={handleEditEmployeeEventFormChange}
        onEditEvent={handleUpdateEvent}
        onDeleteEvent={handleDeleteEvent}
        employees={getFilteredEmployees()}
        statuses={statusesData}
        businessBeginsHour={currentViewConfig.businessBeginsHour}
        businessEndsHour={currentViewConfig.businessEndsHour}
      />
    </div>
  );
};


export default SchedulerOrchestrator;
