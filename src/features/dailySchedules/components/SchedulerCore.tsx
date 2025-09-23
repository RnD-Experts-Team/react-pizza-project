import React, { useRef, useCallback } from 'react';
import { DayPilot, DayPilotScheduler } from '@daypilot/daypilot-lite-react';
import type { SchedulerProps, ViewType, ViewConfig } from '../types/scheduler.types';
import { generateGradientStops, generateGradientCSS } from '../utils/eventGradientUtils';
import { operationsData } from '../data/operationsData';
import '../styles/gradientEvents.css';

/**
 * Returns configuration object for the specified view type and date
 * This function determines how the scheduler displays time and what settings to use
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
        cellWidth: 100,                    // Each hour cell is 100px wide
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
        cellWidth: 200,                   // Each day cell is 200px wide
        businessBeginsHour: 8,            // Business hours (for styling)
        businessEndsHour: 20,
        showNonBusiness: false
      };
      
    default:
      // Fallback to week view if invalid type provided
      return getViewConfig('week', date);
  }
};

/**
 * SchedulerCore Component
 * 
 * A standalone scheduler component that wraps DayPilot Scheduler
 * with configuration management and event handling.
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
  // Reference to the DayPilot Scheduler instance for direct control
  const schedulerRef = useRef<DayPilotScheduler>(null);

  // Get the current configuration based on current view and date
  const currentConfig = getViewConfig(currentView, currentDate);

  // Handle event rendering with gradient backgrounds
  const handleBeforeEventRender = useCallback((args: any) => {
    try {
      const event = args.data;
      
      // Only apply segmentation in day view
      if (currentView === 'day' && event?.employeeEventData?.operation_segmentation) {
        // Extract start and end times from the event
        const eventStart = new Date(event.start.toString());
        const eventEnd = new Date(event.end.toString());
        
        const startTimeStr = `${eventStart.getHours().toString().padStart(2, '0')}:${eventStart.getMinutes().toString().padStart(2, '0')}`;
        const endTimeStr = `${eventEnd.getHours().toString().padStart(2, '0')}:${eventEnd.getMinutes().toString().padStart(2, '0')}`;

        // Generate gradient stops
        const stops = generateGradientStops(
          event.employeeEventData.operation_segmentation,
          startTimeStr,
          endTimeStr
        );

        if (stops && stops.length > 1) {
          // Multiple segments - use gradient with segment names
          const gradientCSS = generateGradientCSS(stops);
          if (gradientCSS) {
            args.data.cssClass = "phased-gradient";
            args.data.backColor = "transparent";
            args.data.barBackColor = "transparent";
            
            // Create a background area that doesn't interfere with text
            args.data.areas = [{
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              style: `background: ${gradientCSS}; border-radius: 3px; z-index: 1;`
            }];
            
            // Generate segment labels positioned over their respective sections
            const eventStart = new Date(event.start.toString());
            const eventEnd = new Date(event.end.toString());
            const eventStartMinutes = eventStart.getHours() * 60 + eventStart.getMinutes();
            const eventEndMinutes = eventEnd.getHours() * 60 + eventEnd.getMinutes();
            const totalDuration = eventEndMinutes - eventStartMinutes;
            
            // Sort segments by start time
            const sortedSegments = [...event.employeeEventData.operation_segmentation.segments].sort((a, b) => {
              const aStart = parseInt(a.startTime.split(':')[0]) * 60 + parseInt(a.startTime.split(':')[1]);
              const bStart = parseInt(b.startTime.split(':')[0]) * 60 + parseInt(b.startTime.split(':')[1]);
              return aStart - bStart;
            });
            
            // Create segment name overlays
             const segmentLabels = sortedSegments.map(segment => {
               const segmentStartMinutes = parseInt(segment.startTime.split(':')[0]) * 60 + parseInt(segment.startTime.split(':')[1]);
               const segmentEndMinutes = parseInt(segment.endTime.split(':')[0]) * 60 + parseInt(segment.endTime.split(':')[1]);
               
               const startPercent = ((segmentStartMinutes - eventStartMinutes) / totalDuration) * 100;
               const endPercent = ((segmentEndMinutes - eventStartMinutes) / totalDuration) * 100;
               const widthPercent = endPercent - startPercent;
               
               // Get operation name from operationsData
               const operation = operationsData.find(op => op.id === segment.operationId);
               const operationName = operation?.name || 'Unknown';
               
               return `<div style="position: absolute; left: ${startPercent}%; width: ${widthPercent}%; top: 0; height: 100%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 600; color: #333; text-shadow: 0 0 2px rgba(255, 255, 255, 0.9); overflow: hidden; white-space: nowrap; text-overflow: ellipsis; z-index: 15;">${operationName}</div>`;
             }).join('');
            
            // Show only segment labels (no event title)
            args.data.html = `
              <div style="position: relative; height: 100%; width: 100%;">
                ${segmentLabels}
              </div>
            `;
          }
        } else if (stops && stops.length === 1) {
          // Single segment - use solid color
          args.data.barColor = stops[0].color;
        } else {
          // No segments - show event title with default styling
          args.data.html = `
            <div style="position: relative; height: 100%; width: 100%; display: flex; align-items: center; padding: 2px 8px;">
              <span style="color: #333; font-weight: 500; text-shadow: 0 0 2px rgba(255, 255, 255, 0.8); overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
                ${args.data.text || ''}
              </span>
            </div>
          `;
        }
      } else {
        // Week view or events without segmentation - show default styling with title
        args.data.html = `
          <div style="position: relative; height: 100%; width: 100%; display: flex; align-items: center; padding: 2px 8px;">
            <span style="color: #333; font-weight: 500; text-shadow: 0 0 2px rgba(255, 255, 255, 0.8); overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
              ${args.data.text || ''}
            </span>
          </div>
        `;
      }
    } catch (error) {
      console.warn('Error in onBeforeEventRender:', error);
      // Fallback to default styling if there's an error
    }
  }, [currentView]);

  return (
    <div className="flex-1 bg-background border rounded-lg overflow-hidden">
      <DayPilotScheduler
        ref={schedulerRef}
        
        // Data Configuration
        resources={resources}
        events={events}
        
        // View Configuration
        scale={currentConfig.scale}
        days={currentConfig.days}
        startDate={currentConfig.startDate}
        timeHeaders={currentConfig.timeHeaders}
        cellWidth={currentConfig.cellWidth}
        businessBeginsHour={currentConfig.businessBeginsHour}
        businessEndsHour={currentConfig.businessEndsHour}
        
        // Layout Configuration
        height={600}
        rowHeaderWidth={200}
        eventHeight={30}
        headerHeight={30}
        
        // Interaction Configuration
        eventMoveHandling="Update"
        eventResizeHandling="Update"
        timeRangeSelectedHandling="Enabled"
        eventClickHandling="Enabled"
        
        // Styling
        theme="scheduler_default"
        
        // Event Handlers
        onBeforeEventRender={handleBeforeEventRender}
        onEventMoved={onEventMoved}
        onEventResized={onEventResized}
        onTimeRangeSelected={onTimeRangeSelected}
        onEventClick={onEventClick}
      />
    </div>
  );
};

export default SchedulerCore;