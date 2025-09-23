import React, { useRef, useCallback } from 'react';
import { DayPilot, DayPilotScheduler } from '@daypilot/daypilot-lite-react';
import type { SchedulerProps, ViewType, ViewConfig } from '../types/scheduler.types';
import { generateGradientStops, generateGradientCSS } from '../utils/eventGradientUtils';
import { operationsData } from '../data/operationsData';
import '../styles/gradientEvents.css';


/**
 * Returns configuration object for the specified view type and date
 * This function determines how the scheduler displays time and what settings to use
 * Different view types require different time scales, cell widths, and display formats
 * @param viewType - The current view mode ('day' or 'week')
 * @param date - The current date being displayed
 * @returns ViewConfig object with appropriate settings for the view type
 */
const getViewConfig = (viewType: ViewType, date: DayPilot.Date): ViewConfig => {
  switch (viewType) {
    case 'day':
      // Day view: Shows hourly breakdown for a single day with detailed time slots
      return {
        scale: 'Hour',                    // Each cell represents an hour for granular scheduling
        days: 1,                          // Show only one day for focused view
        startDate: date.getDatePart().toString(), // Start at the selected date (midnight)
        timeHeaders: [
          { groupBy: 'Hour', format: 'h tt' }            // Bottom header displays time like "10 AM"
        ],
        cellWidth: 100,                    // Each hour cell is 100px wide for readability
        businessBeginsHour: 8,            // Business hours start at 8 AM
        businessEndsHour: 20,             // Business hours end at 8 PM
        showNonBusiness: false            // Hide non-business hours to reduce clutter
      };
      
    case 'week':
      // Week view: Shows daily breakdown for seven days with broader time perspective
      return {
        scale: 'Day',                     // Each cell represents a full day
        days: 7,                          // Show seven consecutive days
        startDate: date.firstDayOfWeek().toString(), // Start at beginning of week (typically Monday)
        timeHeaders: [
          { groupBy: 'Day', format: 'M/d/yyyy' },      // Header shows date like "9/20/2025"
        ],
        cellWidth: 200,                   // Each day cell is 200px wide for weekly overview
        businessBeginsHour: 8,            // Business hours (used for styling and display)
        businessEndsHour: 20,
        showNonBusiness: false
      };
      
    default:
      // Fallback to week view if invalid type provided (defensive programming)
      return getViewConfig('week', date);
  }
};


/**
 * SchedulerCore Component
 * 
 * A standalone scheduler component that wraps DayPilot Scheduler
 * with configuration management and event handling.
 * Provides advanced features like operation segmentation visualization,
 * drag-and-drop event management, and responsive view switching.
 */
const SchedulerCore: React.FC<SchedulerProps> = ({
  resources,
  events,
  currentView,
  currentDate,
  onEventMoved,
  onEventResized,
  onTimeRangeSelected,
  onEventClick
}) => {
  // Reference to the DayPilot Scheduler instance for direct API access and control
  const schedulerRef = useRef<DayPilotScheduler>(null);


  // Get the current configuration based on current view and date
  // This determines all display and interaction settings
  const currentConfig = getViewConfig(currentView, currentDate);


  /**
   * Handle event rendering with gradient backgrounds for operation segmentation
   * This is the core visualization logic that transforms operation segments into visual gradients
   * Only applies advanced rendering in day view where segments are meaningful
   * @param args - DayPilot event render arguments containing event data and styling options
   */
  const handleBeforeEventRender = useCallback((args: any) => {
    try {
      const event = args.data;
      
      // Only apply operation segmentation visualization in day view for performance and relevance
      if (currentView === 'day' && event?.employeeEventData?.operation_segmentation) {
        // Extract start and end times from the event for gradient calculation
        const eventStart = new Date(event.start.toString());
        const eventEnd = new Date(event.end.toString());
        
        // Convert to HH:MM format for gradient utility functions
        const startTimeStr = `${eventStart.getHours().toString().padStart(2, '0')}:${eventStart.getMinutes().toString().padStart(2, '0')}`;
        const endTimeStr = `${eventEnd.getHours().toString().padStart(2, '0')}:${eventEnd.getMinutes().toString().padStart(2, '0')}`;


        // Generate gradient stops based on operation segmentation data
        const stops = generateGradientStops(
          event.employeeEventData.operation_segmentation,
          startTimeStr,
          endTimeStr
        );


        if (stops && stops.length > 1) {
          // Multiple segments - create complex gradient with segment visualization
          const gradientCSS = generateGradientCSS(stops);
          if (gradientCSS) {
            // Apply gradient styling classes and background
            args.data.cssClass = "phased-gradient";
            args.data.backColor = "transparent";
            args.data.barBackColor = "transparent";
            
            // Create a background area with gradient that doesn't interfere with text
            args.data.areas = [{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              style: `background: ${gradientCSS}; border-radius: 3px; z-index: 1;`
            }];
            
            // Calculate positioning for segment labels over their respective sections
            const eventStart = new Date(event.start.toString());
            const eventEnd = new Date(event.end.toString());
            const eventStartMinutes = eventStart.getHours() * 60 + eventStart.getMinutes();
            const eventEndMinutes = eventEnd.getHours() * 60 + eventEnd.getMinutes();
            const totalDuration = eventEndMinutes - eventStartMinutes;
            
            // Sort segments by start time to ensure proper left-to-right ordering
            const sortedSegments = [...event.employeeEventData.operation_segmentation.segments].sort((a, b) => {
              const aStart = parseInt(a.startTime.split(':')[0]) * 60 + parseInt(a.startTime.split(':')[1]);
              const bStart = parseInt(b.startTime.split(':')[0]) * 60 + parseInt(b.startTime.split(':')[1]);
              return aStart - bStart;
            });
            
            // Create segment name overlays positioned proportionally within the event
             const segmentLabels = sortedSegments.map(segment => {
               // Convert time strings to minutes for position calculation
               const segmentStartMinutes = parseInt(segment.startTime.split(':')[0]) * 60 + parseInt(segment.startTime.split(':')[1]);
               const segmentEndMinutes = parseInt(segment.endTime.split(':')[0]) * 60 + parseInt(segment.endTime.split(':')[1]);
               
               // Calculate position percentages relative to the entire event duration
               const startPercent = ((segmentStartMinutes - eventStartMinutes) / totalDuration) * 100;
               const endPercent = ((segmentEndMinutes - eventStartMinutes) / totalDuration) * 100;
               const widthPercent = endPercent - startPercent;
               
               // Get operation name from operationsData for display
               const operation = operationsData.find(op => op.id === segment.operationId);
               const operationName = operation?.name || 'Unknown';
               
               // Return positioned HTML element for the segment label
               return `<div style="position: absolute; left: ${startPercent}%; width: ${widthPercent}%; top: 0; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 600; color: #333; text-shadow: 0 0 2px rgba(255, 255, 255, 0.9); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; z-index: 15;">${operationName}</div>`;
             }).join('');
            
            // Set custom HTML content showing only segment labels (no event title)
            args.data.html = `
              <div style="position: relative; height: 100%; width: 100%;">
                ${segmentLabels}
              </div>
            `;
          }
        } else if (stops && stops.length === 1) {
          // Single segment - use solid color from the single operation
          args.data.barColor = stops[0].color;
        } else {
          // No segments or segmentation disabled - show event title with default styling
          args.data.html = `
            <div style="position: relative; height: 100%; width: 100%; display: flex; align-items: center; padding: 2px 8px;">
              <span style="color: #333; font-weight: 500; text-shadow: 0 0 2px rgba(255, 255, 255, 0.8); overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
                ${args.data.text || ''}
              </span>
            </div>
          `;
        }
      } else {
        // Week view or events without segmentation - show default styling with event title
        // This provides consistent appearance when segmentation features aren't applicable
        args.data.html = `
          <div style="position: relative; height: 100%; width: 100%; display: flex; align-items: center; padding: 2px 8px;">
            <span style="color: #333; font-weight: 500; text-shadow: 0 0 2px rgba(255, 255, 255, 0.8); overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
              ${args.data.text || ''}
            </span>
          </div>
        `;
      }
    } catch (error) {
      // Defensive error handling - log warning but don't break the UI
      console.warn('Error in onBeforeEventRender:', error);
      // Fallback to default styling if there's an error in custom rendering
    }
  }, [currentView]);


  return (
    /* Main container with responsive styling and proper borders */
    <div className="flex-1 bg-background border rounded-lg overflow-hidden">
      <DayPilotScheduler
        ref={schedulerRef}
        
        /* Data Configuration - Core data that drives the scheduler display */
        resources={resources}           // Employee/resource list for the left sidebar
        events={events}                 // Array of scheduled events to display
        
        /* View Configuration - Dynamic settings based on current view type */
        scale={currentConfig.scale}                           // Time scale (Hour/Day)
        days={currentConfig.days}                             // Number of days to show
        startDate={currentConfig.startDate}                   // Starting date/time
        timeHeaders={currentConfig.timeHeaders}               // Header format and grouping
        cellWidth={currentConfig.cellWidth}                   // Width of each time cell
        businessBeginsHour={currentConfig.businessBeginsHour} // Business hours start
        businessEndsHour={currentConfig.businessEndsHour}     // Business hours end
        
        /* Layout Configuration - Fixed visual settings for consistent appearance */
        height={600}                    // Total scheduler height in pixels
        rowHeaderWidth={200}            // Width of resource name column
        eventHeight={30}                // Height of individual event bars
        headerHeight={30}               // Height of time header row
        
        /* Interaction Configuration - Enable drag-and-drop and selection features */
        eventMoveHandling="Update"      // Allow dragging events to different times/resources
        eventResizeHandling="Update"    // Allow resizing events by dragging edges
        timeRangeSelectedHandling="Enabled"  // Allow selecting time ranges for new events
        eventClickHandling="Enabled"    // Allow clicking events for editing
        
        /* Visual Styling - Theme and appearance settings */
        theme="scheduler_default"       // Use DayPilot's default theme
        
        /* Event Handlers - Callback functions for user interactions */
        onBeforeEventRender={handleBeforeEventRender}  // Custom rendering logic
        onEventMoved={onEventMoved}                     // Handle drag-and-drop moves
        onEventResized={onEventResized}                 // Handle event resizing
        onTimeRangeSelected={onTimeRangeSelected}       // Handle time selection for new events
        onEventClick={onEventClick}                     // Handle event clicks for editing
      />
    </div>
  );
};


export default SchedulerCore;
