import type { OperationSegmentation } from '../types/scheduler.types';
import { operationsData } from '../data/operationsData';

/**
 * Convert time string (HH:MM) to minutes since midnight
 */
const timeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Get operation by ID from operations data
 */
const getOperationById = (operationId: string) => {
  return operationsData.find(op => op.id === operationId);
};

/**
 * Generate gradient stops for DayPilot event rendering
 * @param segmentation - The operation segmentation data
 * @param eventStartTime - Event start time in HH:MM format
 * @param eventEndTime - Event end time in HH:MM format
 * @returns Array of gradient stops with percentage and color
 */
export const generateGradientStops = (
  segmentation: OperationSegmentation | undefined,
  eventStartTime: string,
  eventEndTime: string
): { pct: number; color: string }[] => {
  // If no segmentation or not enabled, return single stop
  if (!segmentation || !segmentation.isEnabled || segmentation.segments.length === 0) {
    return [{ pct: 0, color: '#94a3b8' }];
  }

  // If only one segment, return single color
  if (segmentation.segments.length === 1) {
    const operation = getOperationById(segmentation.segments[0].operationId);
    return [{ pct: 0, color: operation?.color || '#94a3b8' }];
  }

  // Sort segments by start time
  const sortedSegments = [...segmentation.segments].sort((a, b) => 
    timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
  );

  const eventStart = timeToMinutes(eventStartTime);
  const eventEnd = timeToMinutes(eventEndTime);
  const totalDuration = eventEnd - eventStart;

  if (totalDuration <= 0) {
    return [{ pct: 0, color: '#94a3b8' }];
  }

  const stops: { pct: number; color: string }[] = [];
  
  sortedSegments.forEach((segment, index) => {
    const operation = getOperationById(segment.operationId);
    const segmentStart = timeToMinutes(segment.startTime);
    const segmentEnd = timeToMinutes(segment.endTime);
    
    // Calculate position as percentage
    const startPercent = Math.max(0, ((segmentStart - eventStart) / totalDuration) * 100);
    const endPercent = Math.min(100, ((segmentEnd - eventStart) / totalDuration) * 100);
    
    const color = operation?.color || '#94a3b8';
    
    // Add stop at the start of this segment
    if (index === 0 && startPercent > 0) {
      // Add gray area before first segment
      stops.push({ pct: 0, color: '#f3f4f6' });
      stops.push({ pct: startPercent, color: '#f3f4f6' });
    }
    
    stops.push({ pct: startPercent, color });
    
    // Check for gaps between segments
    const nextSegment = sortedSegments[index + 1];
    if (nextSegment) {
      const nextStart = timeToMinutes(nextSegment.startTime);
      const nextStartPercent = ((nextStart - eventStart) / totalDuration) * 100;
      
      if (nextStartPercent > endPercent) {
        // End current segment
        stops.push({ pct: endPercent, color });
        // Add gray gap
        stops.push({ pct: endPercent, color: '#f3f4f6' });
        stops.push({ pct: nextStartPercent, color: '#f3f4f6' });
      } else {
        // Segments are adjacent, just continue to next
        stops.push({ pct: endPercent, color });
      }
    } else {
      // Last segment
      if (endPercent < 100) {
        stops.push({ pct: endPercent, color });
        stops.push({ pct: endPercent, color: '#f3f4f6' });
        stops.push({ pct: 100, color: '#f3f4f6' });
      } else {
        stops.push({ pct: 100, color });
      }
    }
  });

  return stops;
};

/**
 * Generate linear gradient CSS from gradient stops
 * @param stops - Array of gradient stops
 * @returns CSS linear gradient string
 */
export const generateGradientCSS = (stops: { pct: number; color: string }[]): string => {
  if (stops.length === 1) {
    return stops[0].color;
  }
  
  const gradientStops = stops.map(s => `${s.color} ${s.pct}%`).join(', ');
  return `linear-gradient(to right, ${gradientStops})`;
};

/**
 * Update event with gradient background based on operation segmentation
 * @param event - The event data to update
 * @returns Updated event with gradient barColor
 */
export const applyEventGradient = (event: any): any => {
  if (!event.employeeEventData?.operation_segmentation) {
    return event;
  }

  // Extract start and end times from the event
  const eventStart = new Date(event.start.toString());
  const eventEnd = new Date(event.end.toString());
  
  const startTimeStr = `${eventStart.getHours().toString().padStart(2, '0')}:${eventStart.getMinutes().toString().padStart(2, '0')}`;
  const endTimeStr = `${eventEnd.getHours().toString().padStart(2, '0')}:${eventEnd.getMinutes().toString().padStart(2, '0')}`;

  const gradient = generateGradientStops(
    event.employeeEventData.operation_segmentation,
    startTimeStr,
    endTimeStr
  );

  return {
    ...event,
    barColor: gradient.length > 0 ? generateGradientCSS(gradient) : event.barColor
  };
};