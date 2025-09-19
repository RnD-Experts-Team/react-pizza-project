import React, { useEffect, useRef, useState } from 'react';
import { DayPilot, DayPilotScheduler } from '@daypilot/daypilot-lite-react';
import { 
  Drawer, 
  DrawerContent, 
  DrawerFooter 
} from './ui/drawer';
import { Button } from './ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// ================================================================================
// TYPE DEFINITIONS AND INTERFACES
// ================================================================================

/**
 * Extended interface that builds upon DayPilot's EventData
 * Adds custom properties for enhanced event functionality
 */
interface ExtendedEventData extends DayPilot.EventData {
  description?: string;    // Additional event description
  status?: string;        // Event status (Confirmed, Tentative, etc.)
  priority?: string;      // Priority level (High, Medium, Low)
  position?: string;      // Custom position field
  text2?: string;         // Secondary text field
  start2?: string | DayPilot.Date;  // Secondary start time
  end2?: string | DayPilot.Date;    // Secondary end time
  text3?: string;         // Tertiary text field
  start3?: string | DayPilot.Date;  // Tertiary start time
  end3?: string | DayPilot.Date;    // Tertiary end time
}

/**
 * Interface for user resource data
 * Represents each row/resource in the scheduler
 */
// interface UserResource {
//   name: string;   // Display name for the resource
//   id: string;     // Unique identifier
//   color: string;  // Color theme for the resource
// }

/**
 * Interface for status data
 * Represents a status with id and name for the status dropdown
 */
interface Status {
  id: string;
  name: string;
}

/**
 * Interface for employee event data
 * Represents the data structure for creating employee events
 */
interface EmployeeEventData {
  emp_info_id: number;
  scheduled_start_time: string;
  scheduled_end_time: string;
  actual_start_time: string | null;
  actual_end_time: string | null;
  vci: boolean;
  status_id: number;
  agree_on_exception: boolean;
  exception_notes: string | null;
}

/**
 * Interface for store data
 * Represents a store with id and name
 */
interface Store {
  id: string;
  name: string;
}
/**
 * Interface for employee data
 * Represents an employee with id, name, and store association
 */
interface Employee {
  id: string;
  name: string;
  storeId: string;
  color: string;  // Color theme for the employee
}

/**
 * Available view types for the scheduler
 * Each provides different time granularity and display options
 */
type ViewType = 'day' | 'week' | 'month';

/**
 * Scale types supported by DayPilot Scheduler
 * Determines the smallest time unit displayed
 */
type ScaleType = 'Hour' | 'Day' | 'Week' | 'CellDuration';

/**
 * Group by types for time headers
 * Controls how time is grouped and displayed in headers
 */
type GroupByType = 'Day' | 'Hour' | 'Week' | 'Month' | 'Year';

/**
 * Configuration object for different view types
 * Contains all the settings needed to render a specific view
 */
interface ViewConfig {
  scale: ScaleType;           // Primary time scale
  days: number;               // Number of days to display
  startDate: string;          // Starting date for the view
  timeHeaders: Array<{        // Header configuration
    groupBy: GroupByType;     // How to group time periods
    format?: string;          // Display format for the header
  }>;
  cellWidth: number;          // Width of each time cell in pixels
  businessBeginsHour?: number; // Start of business hours
  businessEndsHour?: number;   // End of business hours
  showNonBusiness?: boolean;   // Whether to show non-business hours
}

// ================================================================================
// MAIN COMPONENT
// ================================================================================

const ReactScheduler: React.FC = () => {
  // Reference to the DayPilot Scheduler instance for direct control
  const schedulerRef = useRef<DayPilotScheduler>(null);

  // ================================================================================
  // STATE MANAGEMENT
  // ================================================================================

  // Resources (rows) displayed in the scheduler - each represents a person/asset
  const [resources, setResources] = useState<DayPilot.ResourceData[]>([]);
  
  // Events (appointments/bookings) displayed on the timeline
  const [events, setEvents] = useState<ExtendedEventData[]>([]);
  
  // Current view mode (day/week/month) - affects time scale and display
  const [currentView, setCurrentView] = useState<ViewType>('week');
  
  // Current date being displayed - center point of the view
  const [currentDate, setCurrentDate] = useState<DayPilot.Date>(DayPilot.Date.today());

  // Selected store for filtering employees
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');

  // Drawer state for event creation
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newEventData, setNewEventData] = useState<{
    start: DayPilot.Date;
    end: DayPilot.Date;
    resource: string;
  } | null>(null);
  const [eventTitle, setEventTitle] = useState('');

  // Enhanced employee event form state
  const [employeeEventForm, setEmployeeEventForm] = useState<EmployeeEventData>({
    emp_info_id: 0,
    scheduled_start_time: '',
    scheduled_end_time: '',
    actual_start_time: null,
    actual_end_time: null,
    vci: false,
    status_id: 1,
    agree_on_exception: false,
    exception_notes: null,
  });

  // Drawer state for event editing
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<ExtendedEventData | null>(null);
  const [editEventTitle, setEditEventTitle] = useState('');

  // Enhanced employee event form state for editing
  const [editEmployeeEventForm, setEditEmployeeEventForm] = useState<EmployeeEventData>({
    emp_info_id: 0,
    scheduled_start_time: '',
    scheduled_end_time: '',
    actual_start_time: null,
    actual_end_time: null,
    vci: false,
    status_id: 1,
    agree_on_exception: false,
    exception_notes: null,
  });

  // ================================================================================
  // STATIC DATA DEFINITIONS
  // ================================================================================

  /**
   * Static status data for the status dropdown
   */
  const statusesData: Status[] = [
    { id: '1', name: 'Scheduled' },
    { id: '2', name: 'In Progress' },
    { id: '3', name: 'Completed' },
    { id: '4', name: 'Cancelled' },
    { id: '5', name: 'No Show' },
    { id: '6', name: 'Late' },
    { id: '7', name: 'Early Departure' }
  ];

  /**
   * Static stores data
   */
  const storesData: Store[] = [
    { id: '1', name: 'Downtown Store' },
    { id: '2', name: 'Mall Location' },
    { id: '3', name: 'Airport Branch' },
    { id: '4', name: 'Suburban Plaza' },
    { id: '5', name: 'City Center' }
  ];

  /**
   * Static employees data with store associations
   */
  const employeesData: Employee[] = [
    { id: '1', name: 'John Doe', storeId: '1', color: '#1aaa55' },
    { id: '2', name: 'Jane Smith', storeId: '1', color: '#357cd2' },
    { id: '3', name: 'Mike Johnson', storeId: '2', color: '#7fa900' },
    { id: '4', name: 'Sarah Wilson', storeId: '2', color: '#ea7a57' },
    { id: '5', name: 'David Brown', storeId: '3', color: '#00bdae' },
    { id: '6', name: 'Emily Davis', storeId: '3', color: '#ff6b6b' },
    { id: '7', name: 'Robert Miller', storeId: '4', color: '#4ecdc4' },
    { id: '8', name: 'Lisa Anderson', storeId: '4', color: '#45b7d1' },
    { id: '9', name: 'Tom Wilson', storeId: '5', color: '#96ceb4' },
    { id: '10', name: 'Anna Garcia', storeId: '5', color: '#feca57' }
  ];

  /**
   * Static user data that defines the resources (people) in our scheduler
   * Each user becomes a row in the scheduler display
   * @deprecated - This will be replaced by filtered employees based on selected store
   */
  // const userData: UserResource[] = [
  //   { name: 'John Doe', id: '1', color: '#1aaa55' },      // Green theme
  //   { name: 'Jane Smith', id: '2', color: '#357cd2' },    // Blue theme
  //   { name: 'Mike Johnson', id: '3', color: '#7fa900' },  // Olive theme
  //   { name: 'Sarah Wilson', id: '4', color: '#ea7a57' },  // Orange theme
  //   { name: 'David Brown', id: '5', color: '#00bdae' }    // Teal theme
  // ];

  /**
   * Sample event data with extended properties
   * These events will be displayed on the timeline
   */
  const originalData: ExtendedEventData[] = [
    {
      id: '1',
      text: 'Conference Meeting',
      start: '2025-09-20T10:00:00',
      end: '2025-09-20T11:30:00',
      resource: '1',                    // Links to John Doe
      barColor: '#1aaa55',             // Matches user color
      description: 'Important quarterly meeting',
      status: 'Confirmed',
      priority: 'High',
      position: 'Close'
    },
    {
      id: '2',
      text: 'Team Standup',
      start: '2025-09-21T09:00:00',
      end: '2025-09-21T11:30:00',
      resource: '2',                    // Links to Jane Smith
      barColor: '#357cd2',
      description: 'Daily team synchronization',
      status: 'Tentative',
      priority: 'Medium'
    },
    {
      id: '3',
      text: 'Project Review',
      start: '2025-09-22T14:00:00',
      end: '2025-09-22T16:00:00',
      resource: '3',                    // Links to Mike Johnson
      barColor: '#7fa900',
      description: 'Review project milestones',
      status: 'Confirmed',
      priority: 'High'
    },
    {
      id: '4',
      text: 'Training Session',
      start: '2025-09-23T10:00:00',
      end: '2025-09-23T12:00:00',
      resource: '4',                    // Links to Sarah Wilson
      barColor: '#ea7a57',
      description: 'Team training session',
      status: 'Confirmed',
      priority: 'Medium'
    },
    {
      id: '5',
      text: 'Client Presentation',
      start: '2025-09-24T15:30:00',
      end: '2025-09-24T17:00:00',
      resource: '5',                    // Links to David Brown
      barColor: '#00bdae',
      description: 'Present final deliverables to client',
      status: 'Confirmed',
      priority: 'High'
    },
    {
      id: '6',
      text: 'Planning Meeting',
      start: '2025-09-25T11:00:00',
      end: '2025-09-25T12:00:00',
      resource: '1',                    // Another event for John Doe
      barColor: '#1aaa55',
      description: 'Sprint planning session',
      status: 'Confirmed',
      priority: 'Medium'
    }
  ];

  // ================================================================================
  // VIEW CONFIGURATION LOGIC
  // ================================================================================

  /**
   * Returns configuration object for the specified view type and date
   * This function determines how the scheduler displays time and what settings to use
   * 
   * @param viewType - The type of view (day, week, month)
   * @param date - The current date to center the view around
   * @returns ViewConfig object with all necessary settings
   */
  const getViewConfig = (viewType: ViewType, date: DayPilot.Date): ViewConfig => {
    switch (viewType) {
      case 'day':
        // Day view: Shows hourly breakdown for a single day
        return {
          scale: 'Hour',                    // Each cell represents an hour
          days: 1,                          // Show only one day
          startDate: date.getDatePart().toString(), // Start at the selected date
          timeHeaders: [
            { groupBy: 'Hour', format: 'h tt' }            // Bottom header: "10 AM"
          ],
          cellWidth: 100,                    // Each hour cell is 60px wide
          businessBeginsHour: 8,            // Business hours start at 8 AM
          businessEndsHour: 20,             // Business hours end at 8 PM
          showNonBusiness: false            // Hide non-business hours
        };
        
      case 'week':
        // Week view: Shows daily breakdown for seven days
        return {
          scale: 'Day',                     // Each cell represents a day
          days: 7,                          // Show seven days
          startDate: date.firstDayOfWeek().toString(), // Start at beginning of week
          timeHeaders: [
            { groupBy: 'Day', format: 'M/d/yyyy' },      // Header: "9/20/2025"
          ],
          cellWidth: 200,                   // Each day cell is 150px wide
          businessBeginsHour: 8,            // Business hours (for styling)
          businessEndsHour: 20,
          showNonBusiness: false
        };
        
      case 'month':
        // Month view: Shows daily breakdown for entire month
        return {
          scale: 'Day',                     // Each cell represents a day
          days: date.daysInMonth(),         // Show all days in the month
          startDate: date.firstDayOfMonth().toString(), // Start at beginning of month
          timeHeaders: [
            { groupBy: 'Day', format: 'd' }              // Bottom header: "1", "2", "3"...
          ],
          cellWidth: 100,                    // Each day cell is 25px wide
          businessBeginsHour: 0,            // Show full 24-hour days
          businessEndsHour: 24,
          showNonBusiness: true             // Show all hours
        };
        
      default:
        // Fallback to week view if invalid type provided
        return getViewConfig('week', date);
    }
  };

  // Get the current configuration based on current view and date
  const currentConfig = getViewConfig(currentView, currentDate);

  // ================================================================================
  // USER INTERACTION HANDLERS
  // ================================================================================

  /**
   * Handles view type changes (Day/Week/Month buttons)
   * Updates the current view state which triggers a re-render
   */
  const handleViewChange = (viewType: ViewType) => {
    setCurrentView(viewType);
  };

  /**
   * Navigates to the previous time period
   * The amount depends on current view (1 day, 1 week, or 1 month)
   */
  const handlePrevious = () => {
    let newDate: DayPilot.Date;
    switch (currentView) {
      case 'day':
        newDate = currentDate.addDays(-1);    // Go back one day
        break;
      case 'week':
        newDate = currentDate.addDays(-7);    // Go back one week
        break;
      case 'month':
        newDate = currentDate.addMonths(-1);  // Go back one month
        break;
      default:
        newDate = currentDate.addDays(-7);    // Default to week
    }
    setCurrentDate(newDate);
  };

  /**
   * Navigates to the next time period
   * The amount depends on current view (1 day, 1 week, or 1 month)
   */
  const handleNext = () => {
    let newDate: DayPilot.Date;
    switch (currentView) {
      case 'day':
        newDate = currentDate.addDays(1);     // Go forward one day
        break;
      case 'week':
        newDate = currentDate.addDays(7);     // Go forward one week
        break;
      case 'month':
        newDate = currentDate.addMonths(1);   // Go forward one month
        break;
      default:
        newDate = currentDate.addDays(7);     // Default to week
    }
    setCurrentDate(newDate);
  };

  /**
   * Navigates to today's date
   * Resets the view to show the current date
   */
  const handleToday = () => {
    setCurrentDate(DayPilot.Date.today());
  };

  /**
   * Handles store selection change
   * Updates the selected store and filters employees accordingly
   */
  const handleStoreChange = (storeId: string) => {
    setSelectedStoreId(storeId === 'all' ? '' : storeId);
  };

  // Filter employees based on selected store
  const getFilteredEmployees = () => {
    if (!selectedStoreId) {
      return employeesData;
    }
    return employeesData.filter(employee => employee.storeId === selectedStoreId);
  };

  // ================================================================================
  // DISPLAY FORMATTING HELPERS
  // ================================================================================

  /**
   * Generates human-readable text for the current date range
   * Format varies based on current view type
   * 
   * @returns Formatted string representing the visible date range
   */
  const getDateRangeText = (): string => {
    const config = getViewConfig(currentView, currentDate);
    const startDate = new DayPilot.Date(config.startDate);
    
    switch (currentView) {
      case 'day':
        // "Friday, September 20, 2025"
        return startDate.toString('dddd, MMMM d, yyyy');
      case 'week':
        // "Sep 20 - Sep 26, 2025"
        const endDate = startDate.addDays(6);
        return `${startDate.toString('MMM d')} - ${endDate.toString('MMM d, yyyy')}`;
      case 'month':
        // "September 2025"
        return startDate.toString('MMMM yyyy');
      default:
        return '';
    }
  };

  // ================================================================================
  // DAYPILOT EVENT HANDLERS
  // ================================================================================

  /**
   * Handles event drag-and-drop moving
   * Called when user drags an event to a new time/resource
   * 
   * @param args - Contains event data and new position information
   */
  const onEventMoved = (args: DayPilot.SchedulerEventMovedArgs) => {
    console.log('Event moved:', {
      eventId: args.e.data.id,
      newStart: args.newStart,        // New start time
      newEnd: args.newEnd,            // New end time
      newResource: args.newResource   // New resource (row) ID
    });
    //TODO:
    // do something here 
  };
  
  /**
   * Handles right-click on events
   * Can be used to show context menus or additional options
   * 
   * @param args - Contains the clicked event information
   */
  // const onEventRightClick = (args: DayPilot.SchedulerEventRightClickArgs) => {
  //   console.log('Event right-clicked:', {
  //     eventId: args.e.data.id,
  //     resource: args.e.data.resource,
  //   });
  //   // Here you could show a context menu
  // };

  /**
   * Handles event resizing (dragging the edges to change duration)
   * Called when user drags the left or right edge of an event
   * 
   * @param args - Contains event data and new timing information
   */
  const onEventResized = (args: DayPilot.SchedulerEventResizedArgs) => {
    console.log('Event resized:', {
      eventId: args.e.data.id,
      newStart: args.newStart,        // New start time
      newEnd: args.newEnd             // New end time
    });
    //TODO:
    // do something here
  };

  /**
   * Handles time range selection (click and drag on empty space)
   * Allows users to create new events by selecting a time range
   * 
   * @param args - Contains the selected time range and resource
   */
  const onTimeRangeSelected = async (args: DayPilot.SchedulerTimeRangeSelectedArgs) => {
    const dp = schedulerRef.current!.control;
    
    // Clear the visual selection
    dp.clearSelection();
    
    // Store the selection data and open the drawer
    setNewEventData({
      start: args.start,
      end: args.end,
      resource: args.resource.toString()
    });
    setEventTitle('');
    setIsDrawerOpen(true);
  };

  // Validation function for employee event form
  const validateEmployeeEventForm = (): boolean => {
    if (!eventTitle.trim()) {
      console.warn('Event title is required');
      return false;
    }
    
    if (!newEventData) {
      console.warn('Event data is missing');
      return false;
    }

    // Validate actual times if provided
    if (employeeEventForm.actual_start_time && employeeEventForm.actual_end_time) {
      const startTime = new Date(`2000-01-01T${employeeEventForm.actual_start_time}`);
      const endTime = new Date(`2000-01-01T${employeeEventForm.actual_end_time}`);
      
      if (startTime >= endTime) {
        console.warn('Actual start time must be before actual end time');
        return false;
      }
    }

    return true;
  };

  // Handle event creation from drawer
  const handleCreateEvent = () => {
    if (!validateEmployeeEventForm() || !newEventData) {
      return;
    }

    // Get the selected employee info
    const selectedEmployee = getFilteredEmployees().find(emp => emp.id === newEventData.resource);
    
    // Create the employee event data
    const employeeEvent: EmployeeEventData = {
      emp_info_id: parseInt(newEventData.resource), // Use resource ID as emp_info_id
      scheduled_start_time: newEventData.start.toString('HH:mm:ss'),
      scheduled_end_time: newEventData.end.toString('HH:mm:ss'),
      actual_start_time: employeeEventForm.actual_start_time,
      actual_end_time: employeeEventForm.actual_end_time,
      vci: employeeEventForm.vci,
      status_id: employeeEventForm.status_id,
      agree_on_exception: employeeEventForm.agree_on_exception,
      exception_notes: employeeEventForm.exception_notes,
    };

    // Create a new event object for the scheduler
    const newEvent: ExtendedEventData = {
      id: DayPilot.guid(),            // Generate unique ID
      text: eventTitle.trim(),        // Use the entered title
      start: newEventData.start,      // Selected start time
      end: newEventData.end,          // Selected end time
      resource: newEventData.resource, // Selected resource (row)
      barColor: selectedEmployee?.color || '#93c47d', // Use employee color or default
    };

    // Add the new event to our state
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    
    console.log('New employee event created:', employeeEvent);
    console.log('New scheduler event created:', newEvent);
    
    // Close drawer and reset form
    setIsDrawerOpen(false);
    setNewEventData(null);
    setEventTitle('');
    resetEmployeeEventForm();
    
    // Here you would typically send employeeEvent to your backend
  };

  // Reset employee event form to default values
  const resetEmployeeEventForm = () => {
    setEmployeeEventForm({
      emp_info_id: 0,
      scheduled_start_time: '',
      scheduled_end_time: '',
      actual_start_time: null,
      actual_end_time: null,
      vci: false,
      status_id: 1,
      agree_on_exception: false,
      exception_notes: null,
    });
  };

  // Initialize employee event form when drawer opens
  useEffect(() => {
    if (isDrawerOpen && newEventData) {
      // Set default values when creating a new event
      setEmployeeEventForm({
        emp_info_id: parseInt(newEventData.resource),
        scheduled_start_time: newEventData.start.toString('HH:mm:ss'),
        scheduled_end_time: newEventData.end.toString('HH:mm:ss'),
        actual_start_time: null,
        actual_end_time: null,
        vci: false,
        status_id: 1, // Default to 'Scheduled'
        agree_on_exception: false,
        exception_notes: null,
      });
    }
  }, [isDrawerOpen, newEventData]);

  // Initialize edit employee event form when edit drawer opens
  useEffect(() => {
    if (isEditDrawerOpen && editingEvent) {
      // Set values from existing event for editing
      setEditEmployeeEventForm({
        emp_info_id: typeof editingEvent.resource === 'number' ? editingEvent.resource : parseInt(editingEvent.resource?.toString() || '0'),
        scheduled_start_time: editingEvent.start?.toString('HH:mm:ss') || '',
        scheduled_end_time: editingEvent.end?.toString('HH:mm:ss') || '',
        actual_start_time: null, // These would come from backend data
        actual_end_time: null,
        vci: false, // These would come from backend data
        status_id: 1, // Default to 'Scheduled'
        agree_on_exception: false,
        exception_notes: null,
      });
      setEditEventTitle(editingEvent.text || '');
    }
  }, [isEditDrawerOpen, editingEvent]);

  // Handle drawer close
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setNewEventData(null);
    setEventTitle('');
    resetEmployeeEventForm();
  };

  // Update employee event form field
  const updateEmployeeEventForm = (field: keyof EmployeeEventData, value: any) => {
    setEmployeeEventForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Reset edit employee event form to default values
  const resetEditEmployeeEventForm = () => {
    setEditEmployeeEventForm({
      emp_info_id: 0,
      scheduled_start_time: '',
      scheduled_end_time: '',
      actual_start_time: null,
      actual_end_time: null,
      vci: false,
      status_id: 1,
      agree_on_exception: false,
      exception_notes: null,
    });
  };

  // Update edit employee event form field
  const updateEditEmployeeEventForm = (field: keyof EmployeeEventData, value: any) => {
    setEditEmployeeEventForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle event editing from drawer
  const handleEditEvent = () => {
    if (!editingEvent || !editEventTitle.trim()) {
      return;
    }

    // Update the event in our state
    const updatedEvents = events.map(event => 
      event.id === editingEvent.id 
        ? { ...event, text: editEventTitle.trim() }
        : event
    );
    setEvents(updatedEvents);
    
    console.log('Event updated:', editingEvent);
    console.log('Employee event form data:', editEmployeeEventForm);
    
    // Here you would typically update your backend/database with both event and employee data
    // Example API call structure:
    // await updateEmployeeEvent(editingEvent.id, {
    //   title: editEventTitle.trim(),
    //   ...editEmployeeEventForm
    // });
    
    // Close drawer and reset form
    setIsEditDrawerOpen(false);
    setEditingEvent(null);
    setEditEventTitle('');
    resetEditEmployeeEventForm();
  };

  // Handle edit drawer close
  // const handleEditDrawerClose = () => {
  //   setIsEditDrawerOpen(false);
  //   setEditingEvent(null);
  //   setEditEventTitle('');
  //   resetEditEmployeeEventForm();
  // };

  // Handle event deletion from drawer
  const handleDeleteEvent = () => {
    if (!editingEvent) {
      return;
    }

    // Remove the event from our state
    const updatedEvents = events.filter(event => event.id !== editingEvent.id);
    setEvents(updatedEvents);
    
    console.log('Event deleted:', editingEvent.id);
    
    // Close drawer and reset form
    setIsEditDrawerOpen(false);
    setEditingEvent(null);
    setEditEventTitle('');
    
    // Here you would typically delete from your backend/database
  };

  /**
   * Handles single clicks on events
   * Allows users to edit existing events using a drawer interface
   * 
   * @param args - Contains the clicked event information
   */
  const onEventClicked = async (args: DayPilot.SchedulerEventClickedArgs) => {
    const dp = schedulerRef.current!.control;
    
    // Clear any selection
    dp.clearSelection();
    
    // Set up the editing state
    setEditingEvent(args.e.data as ExtendedEventData);
    setEditEventTitle(args.e.data.text || '');
    setIsEditDrawerOpen(true);
    
    console.log('Event clicked for editing:', args.e.data);
  };

  // ================================================================================
  // CUSTOM RENDERING HANDLERS
  // ================================================================================

  /**
   * Custom event rendering - called before each event is drawn
   * Allows customization of event appearance and content
   * 
   * @param args - Contains event data and rendering options
   */
  const onBeforeEventRender = (args: DayPilot.SchedulerBeforeEventRenderArgs) => {
    const eventData = args.data as ExtendedEventData;
    
    // Apply custom colors if specified
    if (eventData.barColor) {
      args.data.backColor = eventData.barColor;     // Background color
      args.data.borderColor = 'darker';             // Border color
      args.data.fontColor = 'white';                // Text color
    }
    
    // Add rounded corners styling
    args.data.cssClass = 'rounded-event';
    
    // Adjust display based on current view - less detail in month view
    const showDetails = currentView !== 'month';
    const fontSize = currentView === 'month' ? '10px' : '12px';
    
    // Generate custom HTML content with centered text and rounded styling
    if (eventData.description || eventData.status || eventData.priority || eventData.position) {
      args.data.html = `
        <div style="
          padding: 3px; 
          font-size: ${fontSize}; 
          line-height: 1.2;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          text-align: center;
          border-radius: 8px;
          overflow: hidden;
        ">
          <div style="font-weight: bold;">${args.data.text}</div>
          ${showDetails && eventData.description ? `<div style="font-size: 10px; opacity: 0.9;">${eventData.description}</div>` : ''}
          ${showDetails && eventData.status ? `<div style="font-size: 9px;">Status: ${eventData.status}</div>` : ''}
          ${showDetails && eventData.position ? `<div style="font-size: 9px;">Position: ${eventData.position}</div>` : ''}
        </div>
      `;
    } else {
      // For events without additional details, still apply centered styling
      args.data.html = `
        <div style="
          padding: 3px; 
          font-size: ${fontSize}; 
          line-height: 1.2;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          border-radius: 8px;
          overflow: hidden;
        ">
          <div style="font-weight: bold;">${args.data.text}</div>
        </div>
      `;
    }
    
    // Apply border radius directly to the event element
    args.data.cssClass = "rounded-event";
  };

  /**
   * Custom row header rendering - called before each resource row header is drawn
   * Adds colored indicators next to resource names
   * 
   * @param args - Contains row data and rendering options
   */
  const onBeforeRowHeaderRender = (args: DayPilot.SchedulerBeforeRowHeaderRenderArgs) => {
    // Find the corresponding employee data
    const filteredEmployees = getFilteredEmployees();
    const employee = filteredEmployees.find(emp => emp.id === args.row.id);
    
    if (employee) {
      // Add a colored circle indicator next to the name
      args.row.areas = [
        {
          left: 5,                        // Position from left edge
          top: 10,                        // Position from top edge
          width: 12,                      // Circle width
          height: 12,                     // Circle height
          backColor: employee.color,      // Use employee's theme color
          style: 'border-radius: 50%;'    // Make it circular
        }
      ];
    }
  };

  // ================================================================================
  // COMPONENT LIFECYCLE EFFECTS
  // ================================================================================

  /**
   * Initialize the component with resource and event data
   * Runs once when component mounts and when store selection changes
   */
  useEffect(() => {
    // Get filtered employees based on selected store
    const filteredEmployees = getFilteredEmployees();
    
    // Convert employee data to DayPilot resource format
    const dayPilotResources = filteredEmployees.map(employee => ({
      name: employee.name,
      id: employee.id
    }));

    // Set resources and events
    setResources(dayPilotResources);
    setEvents(originalData.filter(event => 
      filteredEmployees.some(emp => emp.id === event.resource)
    ));
  }, [selectedStoreId]); // Re-run when store selection changes

  // Handle view changes - scroll to appropriate time when view or date changes
  // This improves user experience by showing relevant time periods
  useEffect(() => {
    if (schedulerRef.current) {
      // Small delay to ensure the scheduler has finished rendering
      setTimeout(() => {
        // For day and week views, scroll to 8 AM to show business hours
        if (currentView === 'day' || currentView === 'week') {
          // Create a proper date with 8 AM time
          const scrollDate = new DayPilot.Date(currentDate).addHours(8);
          schedulerRef.current?.control.scrollTo(scrollDate);
        }
      }, 100);
    }
  }, [currentView, currentDate]);

  // ================================================================================
  // COMPONENT RENDER
  // ================================================================================

  return (
    <div className="p-5 font-sans">
      {/* Main Title */}
      <h2 className="mb-5 text-2xl font-bold text-foreground">
        React Scheduler with Multiple Views (DayPilot)
      </h2>
      
      {/* ============================================================================ */}
      {/* NAVIGATION AND VIEW SELECTION TOOLBAR */}
      {/* ============================================================================ */}
      <div className="mb-5 flex items-center justify-between rounded-lg bg-muted p-4 shadow-sm">
        {/* Navigation Controls - Left side of toolbar */}
        <div className="flex items-center gap-2.5">
          {/* Previous Period Button */}
          <Button 
            onClick={handlePrevious}
            variant="outline"
            size="sm"
            className="text-sm"
          >
            ← Previous
          </Button>
          
          {/* Today Button - Highlighted to show it's important */}
          <Button 
            onClick={handleToday}
            variant="default"
            size="sm"
            className="font-bold"
          >
            Today
          </Button>
          
          {/* Next Period Button */}
          <Button 
            onClick={handleNext}
            variant="outline"
            size="sm"
            className="text-sm"
          >
            Next →
          </Button>
          
          {/* Current Date Range Display */}
          <div className="ml-5 text-base font-bold text-foreground">
            {getDateRangeText()}
          </div>
        </div>

        {/* View Selection Buttons - Right side of toolbar */}
        <div className="flex gap-1">
          {/* Day View Button */}
          <Button 
            onClick={() => handleViewChange('day')} 
            variant={currentView === 'day' ? 'default' : 'outline'}
            size="sm"
            className="px-4"
          >
            Day
          </Button>
          
          {/* Week View Button */}
          <Button 
            onClick={() => handleViewChange('week')} 
            variant={currentView === 'week' ? 'default' : 'outline'}
            size="sm"
            className="px-4"
          >
            Week
          </Button>
          
          {/* Month View Button */}
          <Button 
            onClick={() => handleViewChange('month')} 
            variant={currentView === 'month' ? 'default' : 'outline'}
            size="sm"
            className="px-4"
          >
            Month
          </Button>
        </div>
      </div>

      {/* ============================================================================ */}
      {/* STORE SELECTION */}
      {/* ============================================================================ */}
      <div className="mb-4 flex items-center gap-4 rounded-lg bg-card border border-border p-4 shadow-sm">
        <Label htmlFor="storeSelect" className="text-sm font-medium text-card-foreground whitespace-nowrap">
          Select Store:
        </Label>
        <Select
          value={selectedStoreId || 'all'}
          onValueChange={handleStoreChange}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="All Stores" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stores</SelectItem>
            {storesData.map(store => (
              <SelectItem key={store.id} value={store.id}>
                {store.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedStoreId && (
          <span className="text-sm text-muted-foreground">
            Showing employees from: <span className="font-medium text-primary">{storesData.find(s => s.id === selectedStoreId)?.name}</span>
          </span>
        )}
      </div>

      {/* ============================================================================ */}
      {/* INFORMATION BAR */}
      {/* ============================================================================ */}
      <div className="mb-4 rounded bg-primary-50 p-2.5 text-sm text-primary-700">
        <strong>Current View:</strong> {currentView.charAt(0).toUpperCase() + currentView.slice(1)} 
        {/* Show business hours info for day/week views */}
        {(currentView === 'day' || currentView === 'week') && 
          ' • Business hours: 8 AM - 8 PM'
        }
        {/* Show full day info for month view */}
        {currentView === 'month' && 
          ' • Full day view'
        }
      </div>

      {/* ============================================================================ */}
      {/* MAIN SCHEDULER COMPONENT */}
      {/* ============================================================================ */}
      <DayPilotScheduler
        ref={schedulerRef}
        
        // {/* ================================================================ */}
        /* CORE TIMELINE CONFIGURATION - Based on current view settings */
        // {/* ================================================================ */}
        startDate={currentConfig.startDate}        // When to start the timeline
        days={currentConfig.days}                  // How many days to show
        scale={currentConfig.scale}                // Time scale (Hour/Day/Week)
        timeHeaders={currentConfig.timeHeaders}    // Header configuration
        cellWidth={currentConfig.cellWidth}        // Width of each time cell
        
        // {/* ================================================================ */}
        /* BUSINESS HOURS CONFIGURATION - Affects visual styling */
        // {/* ================================================================ */}
        businessBeginsHour={currentConfig.businessBeginsHour}  // Start of business day
        businessEndsHour={currentConfig.businessEndsHour}      // End of business day
        
        // {/* ================================================================ */}
        /* DATA BINDING - Connect our state to the scheduler */
        // {/* ================================================================ */}
        resources={resources}                      // Rows (people/resources)
        events={events}                           // Events (appointments/bookings)
        
        // {/* ================================================================ */}
        /* EVENT HANDLERS - Handle user interactions */
        // {/* ================================================================ */}
        onEventMoved={onEventMoved}               // When event is drag-dropped
        onEventResized={onEventResized}           // When event is resized
        // onEventRightClick={onEventRightClick}     // When event is right-clicked
        onTimeRangeSelected={onTimeRangeSelected} // When empty time is selected
        onEventClicked={onEventClicked}           // When event is clicked
        onBeforeEventRender={onBeforeEventRender} // Custom event rendering
        onBeforeRowHeaderRender={onBeforeRowHeaderRender} // Custom row header rendering
        
        // {/* ================================================================ */}
        /* INTERACTION SETTINGS - What users can do */
        // {/* ================================================================ */}
        eventMoveHandling="Update"                // Enable drag-drop moving
        eventResizeHandling="Update"              // Enable resizing
        timeRangeSelectedHandling="Enabled"       // Enable time range selection
        eventDeleteHandling="Disabled"            // Disable default deletion (no 'x' button)
        
        // {/* ================================================================ */}
        /* VISUAL STYLING AND LAYOUT */
        // {/* ================================================================ */}
        theme="scheduler_default"                 // Built-in theme
        height={650}                              // Total height in pixels
        width="100%"                              // Full width
        eventHeight={currentView === 'month' ? 30 : 50}  // Event bar height
        headerHeight={30}                         // Time header height
        rowHeaderWidth={120}                      // Resource name column width
      />

      {/* Employee Event Creation Drawer */}
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <DrawerContent title="Create New Employee Event">
          <div className="space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Event Title */}
            <div>
              <Label htmlFor="eventTitle" className="text-sm font-medium">
                Event Title
              </Label>
              <Input
                id="eventTitle"
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="Enter event title..."
                className="mt-1"
                autoFocus
              />
            </div>

            {/* Event Info Display */}
            {newEventData && (
              <div className="bg-muted/50 p-3 rounded-md space-y-2">
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong className="text-foreground">Employee:</strong> {getFilteredEmployees().find(emp => emp.id === newEventData.resource)?.name || newEventData.resource}</p>
                  <p><strong className="text-foreground">Scheduled Start:</strong> {newEventData.start.toString()}</p>
                  <p><strong className="text-foreground">Scheduled End:</strong> {newEventData.end.toString()}</p>
                </div>
              </div>
            )}

            {/* Actual Times Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Actual Times</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="actualStartTime" className="text-sm">
                    Actual Start Time
                  </Label>
                  <Input
                    id="actualStartTime"
                    type="time"
                    value={employeeEventForm.actual_start_time || ''}
                    onChange={(e) => updateEmployeeEventForm('actual_start_time', e.target.value || null)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="actualEndTime" className="text-sm">
                    Actual End Time
                  </Label>
                  <Input
                    id="actualEndTime"
                    type="time"
                    value={employeeEventForm.actual_end_time || ''}
                    onChange={(e) => updateEmployeeEventForm('actual_end_time', e.target.value || null)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Status Selection */}
            <div>
              <Label htmlFor="statusSelect" className="text-sm font-medium">
                Status
              </Label>
              <Select
                value={employeeEventForm.status_id.toString()}
                onValueChange={(value) => updateEmployeeEventForm('status_id', parseInt(value))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusesData.map(status => (
                    <SelectItem key={status.id} value={status.id}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Boolean Options */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Options</h3>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="vciSwitch" className="text-sm">
                  VCI (Video Call Interview)
                </Label>
                <Switch
                  id="vciSwitch"
                  checked={employeeEventForm.vci}
                  onCheckedChange={(checked) => updateEmployeeEventForm('vci', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="agreeExceptionSwitch" className="text-sm">
                  Agree on Exception
                </Label>
                <Switch
                  id="agreeExceptionSwitch"
                  checked={employeeEventForm.agree_on_exception}
                  onCheckedChange={(checked) => updateEmployeeEventForm('agree_on_exception', checked)}
                />
              </div>
            </div>

            {/* Exception Notes */}
            <div>
              <Label htmlFor="exceptionNotes" className="text-sm font-medium">
                Exception Notes
              </Label>
              <Textarea
                id="exceptionNotes"
                value={employeeEventForm.exception_notes || ''}
                onChange={(e) => updateEmployeeEventForm('exception_notes', e.target.value || null)}
                placeholder="Enter any exception notes..."
                className="mt-1 min-h-[80px]"
              />
            </div>
          </div>
          
          <DrawerFooter>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={handleDrawerClose}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateEvent}
                disabled={!eventTitle.trim()}
              >
                Create Event
              </Button>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Event Editing Drawer */}
      <Drawer open={isEditDrawerOpen} onOpenChange={setIsEditDrawerOpen}>
        <DrawerContent title="Edit Employee Event">
          <div className="max-h-[70vh] overflow-y-auto px-6 py-4 space-y-6">
            {/* Event Title */}
            <div>
              <Label htmlFor="editEventTitle" className="text-sm font-medium">
                Event Title
              </Label>
              <Input
                id="editEventTitle"
                type="text"
                value={editEventTitle}
                onChange={(e) => setEditEventTitle(e.target.value)}
                placeholder="Enter event title..."
                className="mt-1"
                autoFocus
              />
            </div>

            {/* Employee Info Display */}
            <div>
              <Label className="text-sm font-medium">Employee Information</Label>
              <div className="mt-1 p-3 bg-muted rounded-md">
                <p className="text-sm">
                  <strong>Employee:</strong> {getFilteredEmployees().find(emp => emp.id === editingEvent?.resource)?.name || editingEvent?.resource}
                </p>
                <p className="text-sm">
                  <strong>Scheduled Start:</strong> {editingEvent?.start?.toString()}
                </p>
                <p className="text-sm">
                  <strong>Scheduled End:</strong> {editingEvent?.end?.toString()}
                </p>
              </div>
            </div>

            {/* Actual Times */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Actual Times</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editActualStartTime" className="text-sm">
                    Actual Start Time
                  </Label>
                  <Input
                    id="editActualStartTime"
                    type="time"
                    value={editEmployeeEventForm.actual_start_time || ''}
                    onChange={(e) => updateEditEmployeeEventForm('actual_start_time', e.target.value || null)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="editActualEndTime" className="text-sm">
                    Actual End Time
                  </Label>
                  <Input
                    id="editActualEndTime"
                    type="time"
                    value={editEmployeeEventForm.actual_end_time || ''}
                    onChange={(e) => updateEditEmployeeEventForm('actual_end_time', e.target.value || null)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Status Selection */}
            <div>
              <Label htmlFor="editStatusSelect" className="text-sm font-medium">
                Status
              </Label>
              <Select
                value={editEmployeeEventForm.status_id.toString()}
                onValueChange={(value) => updateEditEmployeeEventForm('status_id', parseInt(value))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusesData.map(status => (
                    <SelectItem key={status.id} value={status.id}>
                      {status.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Boolean Options */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-foreground">Options</h3>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="editVciSwitch" className="text-sm">
                  VCI (Video Call Interview)
                </Label>
                <Switch
                  id="editVciSwitch"
                  checked={editEmployeeEventForm.vci}
                  onCheckedChange={(checked) => updateEditEmployeeEventForm('vci', checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="editAgreeExceptionSwitch" className="text-sm">
                  Agree on Exception
                </Label>
                <Switch
                  id="editAgreeExceptionSwitch"
                  checked={editEmployeeEventForm.agree_on_exception}
                  onCheckedChange={(checked) => updateEditEmployeeEventForm('agree_on_exception', checked)}
                />
              </div>
            </div>

            {/* Exception Notes */}
            <div>
              <Label htmlFor="editExceptionNotes" className="text-sm font-medium">
                Exception Notes
              </Label>
              <Textarea
                id="editExceptionNotes"
                value={editEmployeeEventForm.exception_notes || ''}
                onChange={(e) => updateEditEmployeeEventForm('exception_notes', e.target.value || null)}
                placeholder="Enter any exception notes..."
                className="mt-1 min-h-[80px]"
              />
            </div>
          </div>
          
          <DrawerFooter>
            <div className="flex gap-2 justify-between">
              <Button
                variant="destructive"
                onClick={handleDeleteEvent}
              >
                Delete Event
              </Button>
              <div className="flex gap-2">
                <Button
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleEditEvent}
                  disabled={!editEventTitle.trim()}
                >
                  Update Event
                </Button>
              </div>
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default ReactScheduler;
      