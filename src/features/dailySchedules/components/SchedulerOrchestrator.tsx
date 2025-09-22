import React, { useEffect, useState } from 'react';
import { DayPilot } from '@daypilot/daypilot-lite-react';

// Import our modular components
import SchedulerCore from './SchedulerCore';
import CreateEventDrawer from './CreateEventDrawer';
import EditEventDrawer from './EditEventDrawer';

// Import UI components
import MainTitle from './ui/MainTitle';
import NavigationToolbar from './ui/NavigationToolbar';
import StoreSelection from './ui/StoreSelection';
import InformationBar from './ui/InformationBar';

// Import hooks
import { useSchedulerHelpers } from '../hooks/useSchedulerHelpers';
import { useSchedulerEventHandlers } from '../hooks/useSchedulerEventHandlers';
import { useCreateDrawerHandlers } from '../hooks/useCreateDrawerHandlers';
import { useEditDrawerHandlers } from '../hooks/useEditDrawerHandlers';

// Import data
import { statusesData, storesData, originalEventData } from '../data/schedulerData';

// Import types
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
 */
const SchedulerOrchestrator: React.FC = () => {
  // ================================================================================
  // STATE MANAGEMENT
  // ================================================================================

  // Core scheduler state
  const [resources, setResources] = useState<DayPilot.ResourceData[]>([]);
  const [events, setEvents] = useState<ExtendedEventData[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('week');
  const [currentDate, setCurrentDate] = useState<DayPilot.Date>(DayPilot.Date.today());
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  // Create drawer state
  const [isCreateDrawerOpen, setIsCreateDrawerOpen] = useState(false);
  const [newEventData, setNewEventData] = useState<NewEventData | null>(null);
  const [eventTitle, setEventTitle] = useState('');
  const [employeeEventForm, setEmployeeEventForm] = useState<EmployeeEventData>({
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

  // Edit drawer state
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ExtendedEventData | null>(null);
  const [editEventTitle, setEditEventTitle] = useState('');
  const [editEmployeeEventForm, setEditEmployeeEventForm] = useState<EmployeeEventData>({
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

  // Helper functions hook
  const { 
    getFilteredEmployees, 
    getDateRangeText, 
    getInitialEmployeeEventForm, 
    getStoreName,
    updateEmployeeEventTimes,
    convertDayPilotDateToTimeString,
  } = useSchedulerHelpers(selectedStoreId);

  // Get current view configuration for business hours
  const getViewConfig = (viewType: ViewType, date: DayPilot.Date): ViewConfig => {
    switch (viewType) {
      case 'day':
        return {
          scale: 'Hour',
          days: 1,
          startDate: date.getDatePart().toString(),
          timeHeaders: [
            { groupBy: 'Hour', format: 'h tt' }
          ],
          cellWidth: 100,
          businessBeginsHour: 8,
          businessEndsHour: 20,
          showNonBusiness: false
        };
        
      case 'week':
        return {
          scale: 'Day',
          days: 7,
          startDate: date.firstDayOfWeek().toString(),
          timeHeaders: [
            { groupBy: 'Day', format: 'M/d/yyyy' },
          ],
          cellWidth: 200,
          businessBeginsHour: 8,
          businessEndsHour: 20,
          showNonBusiness: false
        };
        
      default:
        return getViewConfig('week', date);
    }
  };

  // Get current business hours from view configuration
  const currentViewConfig = getViewConfig(currentView, currentDate);

  // Reset form functions
  const resetCreateForm = () => {
    setEmployeeEventForm(getInitialEmployeeEventForm());
  };

  const resetEditForm = () => {
    setEditEmployeeEventForm(getInitialEmployeeEventForm());
  };

  // Event handlers hook
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

  // Create drawer handlers hook
  const createDrawerHandlers = useCreateDrawerHandlers({
    events,
    setEvents,
    setIsCreateDrawerOpen,
    setNewEventData,
    setEventTitle,
    resetCreateForm
  });

  // Edit drawer handlers hook
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
   * Handle employee event form changes for create
   */
  const handleEmployeeEventFormChange = (field: keyof EmployeeEventData, value: any) => {
    createDrawerHandlers.handleEmployeeEventFormChange(field, value, setEmployeeEventForm);
  };

  /**
   * Handle employee event form changes for edit
   */
  const handleEditEmployeeEventFormChange = (field: keyof EmployeeEventData, value: any) => {
    editDrawerHandlers.handleEditEmployeeEventFormChange(field, value, setEditEmployeeEventForm);
  };

  /**
   * Handle create event submission
   */
  const handleCreateEvent = () => {
    createDrawerHandlers.handleCreateEvent(newEventData, eventTitle, employeeEventForm);
  };

  /**
   * Handle update event submission
   */
  const handleUpdateEvent = () => {
    editDrawerHandlers.handleUpdateEvent(selectedEvent, editEventTitle, editEmployeeEventForm);
  };

  /**
   * Handle delete event
   */
  const handleDeleteEvent = () => {
    editDrawerHandlers.handleDeleteEvent(selectedEvent);
  };

  // ================================================================================
  // EFFECTS
  // ================================================================================

  /**
   * Initialize edit form with selected event data
   */
  useEffect(() => {
    if (selectedEvent && selectedEvent.employeeEventData) {
      setEditEmployeeEventForm(selectedEvent.employeeEventData);
    }
  }, [selectedEvent]);

  /**
   * Initialize resources and events based on store selection
   */
  useEffect(() => {
    const filteredEmployees = getFilteredEmployees();
    
    const dayPilotResources = filteredEmployees.map(employee => ({
      name: employee.name,
      id: employee.id
    }));

    setResources(dayPilotResources);
    setEvents(originalEventData.filter(event => 
      filteredEmployees.some(emp => emp.id === event.resource)
    ));
  }, [selectedStoreId, getFilteredEmployees]);

  // ================================================================================
  // RENDER
  // ================================================================================

  return (
    <div className="p-5 font-sans">
      {/* Main Title */}
      <MainTitle />
      
      {/* Navigation and View Selection Toolbar */}
      <NavigationToolbar
        currentView={currentView}
        dateRangeText={getDateRangeText(currentView, currentDate)}
        onPrevious={eventHandlers.handlePrevious}
        onNext={eventHandlers.handleNext}
        onToday={eventHandlers.handleToday}
        onViewChange={eventHandlers.handleViewChange}
      />

      {/* Store Selection */}
      <StoreSelection
        selectedStoreId={selectedStoreId}
        stores={storesData}
        onStoreChange={eventHandlers.handleStoreChange}
        getStoreName={getStoreName}
      />

      {/* Information Bar */}
      <InformationBar currentView={currentView} />

      {/* Main Scheduler Component */}
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

      {/* Create Event Drawer */}
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

      {/* Edit Event Drawer */}
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