import React, { useEffect, useRef, useState } from 'react';
import { DayPilot, DayPilotScheduler } from '@daypilot/daypilot-lite-react';

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
interface UserResource {
  name: string;   // Display name for the resource
  id: string;     // Unique identifier
  color: string;  // Color theme for the resource
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
  const [currentDate, setCurrentDate] = useState<DayPilot.Date>(new DayPilot.Date('2025-09-20'));

  // ================================================================================
  // STATIC DATA DEFINITIONS
  // ================================================================================

  /**
   * Static user data that defines the resources (people) in our scheduler
   * Each user becomes a row in the scheduler display
   */
  const userData: UserResource[] = [
    { name: 'John Doe', id: '1', color: '#1aaa55' },      // Green theme
    { name: 'Jane Smith', id: '2', color: '#357cd2' },    // Blue theme
    { name: 'Mike Johnson', id: '3', color: '#7fa900' },  // Olive theme
    { name: 'Sarah Wilson', id: '4', color: '#ea7a57' },  // Orange theme
    { name: 'David Brown', id: '5', color: '#00bdae' }    // Teal theme
  ];

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
    // Here you would typically update your backend/database
  };
  
  /**
   * Handles right-click on events
   * Can be used to show context menus or additional options
   * 
   * @param args - Contains the clicked event information
   */
  const onEventRightClick = (args: DayPilot.SchedulerEventRightClickArgs) => {
    console.log('Event right-clicked:', {
      eventId: args.e.data.id,
      resource: args.e.data.resource,
    });
    // Here you could show a context menu
  };

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
    // Here you would typically update your backend/database
  };

  /**
   * Handles time range selection (click and drag on empty space)
   * Allows users to create new events by selecting a time range
   * 
   * @param args - Contains the selected time range and resource
   */
  const onTimeRangeSelected = async (args: DayPilot.SchedulerTimeRangeSelectedArgs) => {
    const dp = schedulerRef.current!.control;
    
    // Show a modal prompt to get the event title
    const modal = await DayPilot.Modal.prompt('New event:', 'Event Title');
    
    // Clear the visual selection
    dp.clearSelection();
    
    // If user cancelled the modal, don't create the event
    if (modal.canceled) {
      return;
    }

    // Create a new event object
    const newEvent: ExtendedEventData = {
      id: DayPilot.guid(),            // Generate unique ID
      text: modal.result!,            // Use the entered title
      start: args.start,              // Selected start time
      end: args.end,                  // Selected end time
      resource: args.resource,        // Selected resource (row)
      barColor: '#93c47d',           // Default color for new events
    };

    // Add the new event to our state
    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    
    console.log('New event created:', newEvent);
    // Here you would typically save to your backend/database
  };

  /**
   * Handles single clicks on events
   * Allows users to edit existing events
   * 
   * @param args - Contains the clicked event information
   */
  const onEventClicked = async (args: DayPilot.SchedulerEventClickedArgs) => {
    const dp = schedulerRef.current!.control;
    
    // Show a modal prompt with current event title
    const modal = await DayPilot.Modal.prompt('Edit event:', args.e.data.text);
    
    // Clear any selection
    dp.clearSelection();
    
    // If user cancelled, don't update
    if (modal.canceled) {
      return;
    }

    // Update the event in our state
    const updatedEvents = events.map(event => 
      event.id === args.e.data.id 
        ? { ...event, text: modal.result! }
        : event
    );
    setEvents(updatedEvents);
    
    console.log('Event updated:', args.e.data);
    // Here you would typically update your backend/database
  };

  /**
   * Handles event deletion (typically via Delete key or context menu)
   * Removes the event from the scheduler
   * 
   * @param args - Contains the deleted event information
   */
  const onEventDeleted = (args: DayPilot.SchedulerEventDeletedArgs) => {
    // Remove the event from our state
    const updatedEvents = events.filter(event => event.id !== args.e.data.id);
    setEvents(updatedEvents);
    
    console.log('Event deleted:', args.e.data.id);
    // Here you would typically delete from your backend/database
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
    
    // Adjust display based on current view - less detail in month view
    const showDetails = currentView !== 'month';
    const fontSize = currentView === 'month' ? '10px' : '12px';
    
    // Generate custom HTML content if we have additional properties
    if (eventData.description || eventData.status || eventData.priority || eventData.position) {
      args.data.html = `
        <div style="padding: 3px; font-size: ${fontSize}; line-height: 1.2;">
          <div style="font-weight: bold;">${args.data.text}</div>
          ${showDetails && eventData.description ? `<div style="font-size: 10px; opacity: 0.9;">${eventData.description}</div>` : ''}
          ${showDetails && eventData.status ? `<div style="font-size: 9px;">Status: ${eventData.status}</div>` : ''}
          ${showDetails && eventData.position ? `<div style="font-size: 9px;">Position: ${eventData.position}</div>` : ''}
        </div>
      `;
    }
  };

  /**
   * Custom row header rendering - called before each resource row header is drawn
   * Adds colored indicators next to resource names
   * 
   * @param args - Contains row data and rendering options
   */
  const onBeforeRowHeaderRender = (args: DayPilot.SchedulerBeforeRowHeaderRenderArgs) => {
    // Find the user data for this row
    const user = userData.find(u => u.id === args.row.id);
    if (user) {
      // Add a colored circle next to the user name
      args.row.areas = [
        {
          left: 5,                        // Position from left edge
          top: 10,                        // Position from top edge
          width: 12,                      // Circle width
          height: 12,                     // Circle height
          backColor: user.color,          // Use user's theme color
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
   * Runs once when component mounts
   */
  useEffect(() => {
    // Convert user data to DayPilot resource format
    const dayPilotResources = userData.map(user => ({
      name: user.name,
      id: user.id
    }));

    // Set initial data
    setResources(dayPilotResources);
    setEvents(originalData);
  }, []);

  /**
   * Handle view changes - scroll to appropriate time when view or date changes
   * This improves user experience by showing relevant time periods
   */
  useEffect(() => {
    if (schedulerRef.current) {
      // Small delay to ensure the scheduler has finished rendering
      setTimeout(() => {
        // For day and week views, scroll to 8 AM to show business hours
        if (currentView === 'day' || currentView === 'week') {
          schedulerRef.current?.control.scrollTo(currentDate.toString() + 'T08:00:00');
        }
      }, 100);
    }
  }, [currentView, currentDate]);

  // ================================================================================
  // COMPONENT RENDER
  // ================================================================================

  return (
    <div className="scheduler-container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Main Title */}
      <h2 style={{ marginBottom: '20px', color: '#333' }}>
        React Scheduler with Multiple Views (DayPilot)
      </h2>
      
      {/* ============================================================================ */}
      {/* NAVIGATION AND VIEW SELECTION TOOLBAR */}
      {/* ============================================================================ */}
      <div style={{ 
        marginBottom: '20px', 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        {/* Navigation Controls - Left side of toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Previous Period Button */}
          <button 
            onClick={handlePrevious}
            style={{
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ← Previous
          </button>
          
          {/* Today Button - Highlighted to show it's important */}
          <button 
            onClick={handleToday}
            style={{
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #007bff',
              backgroundColor: '#007bff',
              color: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            Today
          </button>
          
          {/* Next Period Button */}
          <button 
            onClick={handleNext}
            style={{
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Next →
          </button>
          
          {/* Current Date Range Display */}
          <div style={{ 
            marginLeft: '20px', 
            fontSize: '16px', 
            fontWeight: 'bold',
            color: '#333'
          }}>
            {getDateRangeText()}
          </div>
        </div>

        {/* View Selection Buttons - Right side of toolbar */}
        <div style={{ display: 'flex', gap: '5px' }}>
          {/* Day View Button */}
          <button 
            onClick={() => handleViewChange('day')} 
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              backgroundColor: currentView === 'day' ? '#007bff' : 'white',
              color: currentView === 'day' ? 'white' : '#333',
              cursor: 'pointer',
              fontWeight: currentView === 'day' ? 'bold' : 'normal',
              fontSize: '14px'
            }}
          >
            Day
          </button>
          
          {/* Week View Button */}
          <button 
            onClick={() => handleViewChange('week')} 
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              backgroundColor: currentView === 'week' ? '#007bff' : 'white',
              color: currentView === 'week' ? 'white' : '#333',
              cursor: 'pointer',
              fontWeight: currentView === 'week' ? 'bold' : 'normal',
              fontSize: '14px'
            }}
          >
            Week
          </button>
          
          {/* Month View Button */}
          <button 
            onClick={() => handleViewChange('month')} 
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              backgroundColor: currentView === 'month' ? '#007bff' : 'white',
              color: currentView === 'month' ? 'white' : '#333',
              cursor: 'pointer',
              fontWeight: currentView === 'month' ? 'bold' : 'normal',
              fontSize: '14px'
            }}
          >
            Month
          </button>
        </div>
      </div>

      {/* ============================================================================ */}
      {/* INFORMATION BAR */}
      {/* ============================================================================ */}
      <div style={{ 
        marginBottom: '15px', 
        padding: '10px',
        backgroundColor: '#e7f3ff',
        borderRadius: '4px',
        fontSize: '14px',
        color: '#0066cc'
      }}>
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
        onEventRightClick={onEventRightClick}     // When event is right-clicked
        onTimeRangeSelected={onTimeRangeSelected} // When empty time is selected
        onEventClicked={onEventClicked}           // When event is clicked
        onEventDeleted={onEventDeleted}           // When event is deleted
        onBeforeEventRender={onBeforeEventRender} // Custom event rendering
        onBeforeRowHeaderRender={onBeforeRowHeaderRender} // Custom row header rendering
        
        // {/* ================================================================ */}
        /* INTERACTION SETTINGS - What users can do */
        // {/* ================================================================ */}
        eventMoveHandling="Update"                // Enable drag-drop moving
        eventResizeHandling="Update"              // Enable resizing
        timeRangeSelectedHandling="Enabled"       // Enable time range selection
        eventDeleteHandling="Update"              // Enable deletion (Delete key)
        
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
    </div>
  );
};

export default ReactScheduler;
