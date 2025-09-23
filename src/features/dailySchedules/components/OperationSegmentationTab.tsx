import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Trash2, Plus, Clock, AlertTriangle } from 'lucide-react';
import type { 
  OperationSegmentation, 
  OperationSegment, 
  Operation 
} from '../types/scheduler.types';
import { operationsData } from '../data/operationsData';


interface OperationSegmentationTabProps {
  segmentation: OperationSegmentation;
  onSegmentationChange: (segmentation: OperationSegmentation) => void;
  eventStartTime: string; // HH:MM format
  eventEndTime: string;   // HH:MM format
}


/**
 * OperationSegmentationTab Component
 * 
 * Allows users to create and manage operation segments within an event timeframe.
 * Provides validation to ensure segments don't overlap and cover the entire event duration.
 * Features include time validation, visual timeline representation, and responsive design.
 */
const OperationSegmentationTab: React.FC<OperationSegmentationTabProps> = ({
  segmentation,
  onSegmentationChange,
  eventStartTime,
  eventEndTime
}) => {
  // State for tracking validation errors across all segments
  const [validationErrors, setValidationErrors] = useState<string[]>([]);


  /**
   * Generate a unique ID for new segments
   * Uses timestamp and random string to ensure uniqueness
   * @returns A unique string identifier
   */
  const generateSegmentId = useCallback((): string => {
    return `segment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);


  /**
   * Convert time string to minutes for easier calculation
   * Enables mathematical operations on time values
   * @param time - Time string in HH:MM format
   * @returns Total minutes from midnight
   */
  const timeToMinutes = useCallback((time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }, []);


  /**
   * Convert minutes back to time string
   * Converts calculated minutes back to HH:MM format for display
   * @param minutes - Total minutes from midnight
   * @returns Time string in HH:MM format with leading zeros
   */
  const minutesToTime = useCallback((minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }, []);


  /**
   * Validate segments for overlaps and coverage
   * Comprehensive validation that checks for gaps, overlaps, and proper time boundaries
   * @param segments - Array of operation segments to validate
   * @returns Array of error messages, empty if all validations pass
   */
  const validateSegments = useCallback((segments: OperationSegment[]): string[] => {
    const errors: string[] = [];
    
    // No validation needed for empty segments
    if (segments.length === 0) {
      return errors;
    }


    // Sort segments by start time for sequential validation
    const sortedSegments = [...segments].sort((a, b) => 
      timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
    );


    const eventStartMinutes = timeToMinutes(eventStartTime);
    const eventEndMinutes = timeToMinutes(eventEndTime);


    // Validate that segments cover the entire event timeframe
    if (timeToMinutes(sortedSegments[0].startTime) !== eventStartMinutes) {
      errors.push('First segment must start at event start time');
    }


    if (timeToMinutes(sortedSegments[sortedSegments.length - 1].endTime) !== eventEndMinutes) {
      errors.push('Last segment must end at event end time');
    }


    // Check each segment for internal validity and continuity with adjacent segments
    for (let i = 0; i < sortedSegments.length; i++) {
      const current = sortedSegments[i];
      const currentStart = timeToMinutes(current.startTime);
      const currentEnd = timeToMinutes(current.endTime);


      // Validate individual segment time logic
      if (currentStart >= currentEnd) {
        errors.push(`Segment ${i + 1}: Start time must be before end time`);
      }


      // Check continuity with next segment (gaps or overlaps)
      if (i < sortedSegments.length - 1) {
        const next = sortedSegments[i + 1];
        const nextStart = timeToMinutes(next.startTime);


        if (currentEnd < nextStart) {
          errors.push(`Gap between segment ${i + 1} and ${i + 2}`);
        } else if (currentEnd > nextStart) {
          errors.push(`Overlap between segment ${i + 1} and ${i + 2}`);
        }
      }
    }


    return errors;
  }, [eventStartTime, eventEndTime, timeToMinutes]);


  /**
   * Update validation errors when segments change
   * Triggers validation and updates error state whenever segments are modified
   * @param segments - Current array of segments to validate
   */
  const updateValidation = useCallback((segments: OperationSegment[]) => {
    const errors = validateSegments(segments);
    setValidationErrors(errors);
  }, [validateSegments]);


  /**
   * Toggle segmentation enabled/disabled
   * Handles the master switch for operation segmentation functionality
   * @param enabled - Boolean indicating if segmentation should be enabled
   */
  const handleToggleSegmentation = useCallback((enabled: boolean) => {
    const newSegmentation: OperationSegmentation = {
      ...segmentation,
      isEnabled: enabled,
      segments: enabled ? segmentation.segments : [] // Clear segments when disabled
    };
    onSegmentationChange(newSegmentation);
    
    // Update validation state based on new enabled status
    if (enabled) {
      updateValidation(newSegmentation.segments);
    } else {
      setValidationErrors([]); // Clear validation errors when disabled
    }
  }, [segmentation, onSegmentationChange, updateValidation]);


  /**
   * Add a new segment
   * Creates a new segment starting from the end of the last segment
   * Uses the first available operation as default
   */
  const handleAddSegment = useCallback(() => {
    // Start new segment where the last one ended, or at event start if no segments exist
    const lastSegment = segmentation.segments[segmentation.segments.length - 1];
    const startTime = lastSegment ? lastSegment.endTime : eventStartTime;
    
    // Create new segment with default values
    const newSegment: OperationSegment = {
      id: generateSegmentId(),
      startTime,
      endTime: eventEndTime, // Default to event end time
      operationId: operationsData[0].id // Use first available operation
    };


    const newSegments = [...segmentation.segments, newSegment];
    const newSegmentation: OperationSegmentation = {
      ...segmentation,
      segments: newSegments
    };


    onSegmentationChange(newSegmentation);
    updateValidation(newSegments);
  }, [segmentation, eventStartTime, eventEndTime, generateSegmentId, onSegmentationChange, updateValidation]);


  /**
   * Remove a segment
   * Deletes a segment by its ID and updates validation
   * @param segmentId - Unique identifier of the segment to remove
   */
  const handleRemoveSegment = useCallback((segmentId: string) => {
    const newSegments = segmentation.segments.filter(s => s.id !== segmentId);
    const newSegmentation: OperationSegmentation = {
      ...segmentation,
      segments: newSegments
    };


    onSegmentationChange(newSegmentation);
    updateValidation(newSegments);
  }, [segmentation, onSegmentationChange, updateValidation]);


  /**
   * Update a segment
   * Modifies a specific field of a segment and triggers validation
   * @param segmentId - Unique identifier of the segment to update
   * @param field - The field name to update (startTime, endTime, or operationId)
   * @param value - The new value for the specified field
   */
  const handleUpdateSegment = useCallback((segmentId: string, field: keyof OperationSegment, value: string) => {
    const newSegments = segmentation.segments.map(segment => 
      segment.id === segmentId ? { ...segment, [field]: value } : segment
    );
    
    const newSegmentation: OperationSegmentation = {
      ...segmentation,
      segments: newSegments
    };


    onSegmentationChange(newSegmentation);
    updateValidation(newSegments);
  }, [segmentation, onSegmentationChange, updateValidation]);


  /**
   * Get operation by ID
   * Helper function to retrieve operation details from the operations data
   * @param operationId - The ID of the operation to retrieve
   * @returns The operation object or undefined if not found
   */
  const getOperationById = useCallback((operationId: string): Operation | undefined => {
    return operationsData.find(op => op.id === operationId);
  }, []);


  /**
   * Auto-fill segments to cover entire event duration
   * Convenience function that creates a single segment covering the full event timeframe
   * Only works when no segments exist to avoid overwriting user work
   */
  const handleAutoFillSegments = useCallback(() => {
    if (segmentation.segments.length === 0) {
      // Create a single segment covering the entire event duration
      const newSegment: OperationSegment = {
        id: generateSegmentId(),
        startTime: eventStartTime,
        endTime: eventEndTime,
        operationId: operationsData[0].id // Use first available operation
      };


      const newSegmentation: OperationSegmentation = {
        ...segmentation,
        segments: [newSegment]
      };


      onSegmentationChange(newSegmentation);
      updateValidation([newSegment]);
    }
  }, [segmentation, eventStartTime, eventEndTime, generateSegmentId, onSegmentationChange, updateValidation]);


  /**
   * Calculate total duration covered by segments
   * Computes the sum of all segment durations for coverage analysis
   * Memoized to avoid recalculation on every render
   */
  const totalCoveredDuration = useMemo(() => {
    return segmentation.segments.reduce((total, segment) => {
      const duration = timeToMinutes(segment.endTime) - timeToMinutes(segment.startTime);
      return total + duration;
    }, 0);
  }, [segmentation.segments, timeToMinutes]);


  /**
   * Calculate total event duration
   * Computes the total duration of the event timeframe
   * Memoized for performance optimization
   */
  const eventDuration = useMemo(() => {
    return timeToMinutes(eventEndTime) - timeToMinutes(eventStartTime);
  }, [eventStartTime, eventEndTime, timeToMinutes]);


  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with toggle - Responsive layout that stacks on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-semibold">Operation Segmentation</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Divide the event into time segments and assign operations to each segment
          </p>
        </div>
        {/* Master toggle switch for enabling/disabling segmentation */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Enable</span>
          <Switch
            checked={segmentation.isEnabled}
            onCheckedChange={handleToggleSegmentation}
          />
        </div>
      </div>


      {/* Only show segmentation controls when enabled */}
      {segmentation.isEnabled && (
        <>
          {/* Event time info - Shows the overall timeframe being segmented */}
          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Event Time Frame
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {/* Responsive time display that stacks on mobile */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-1">
                  <span className="font-medium">Start:</span> 
                  <span className="font-mono">{eventStartTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">End:</span> 
                  <span className="font-mono">{eventEndTime}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">Duration:</span> 
                  <span className="font-mono">{minutesToTime(eventDuration)}</span>
                </div>
              </div>
            </CardContent>
          </Card>


          {/* Validation errors - Displays issues with current segment configuration */}
          {validationErrors.length > 0 && (
            <Card className="border-destructive">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  Validation Errors
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {/* List all validation errors for user attention */}
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-destructive">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}


          {/* Segments management section - Main interface for creating and editing segments */}
          <div className="space-y-3 sm:space-y-4">
            {/* Section header with action buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h4 className="text-sm sm:text-md font-medium">Time Segments</h4>
              <div className="flex flex-col sm:flex-row gap-2">
                {/* Auto Fill button - only shown when no segments exist */}
                {segmentation.segments.length === 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAutoFillSegments}
                    className="text-xs sm:text-sm"
                  >
                    Auto Fill
                  </Button>
                )}
                {/* Add Segment button - always available */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddSegment}
                  className="text-xs sm:text-sm"
                >
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  Add Segment
                </Button>
              </div>
            </div>


            {/* Empty state - shown when no segments exist */}
            {segmentation.segments.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
                  <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mb-2" />
                  <p className="text-xs sm:text-sm text-muted-foreground max-w-xs">
                    No segments created yet. Add segments to divide the event time.
                  </p>
                </CardContent>
              </Card>
            ) : (
              /* Segments list - displays all created segments with editing controls */
              <div className="space-y-2 sm:space-y-3">
                {segmentation.segments.map((segment, index) => {
                  const operation = getOperationById(segment.operationId);
                  
                  return (
                    <Card key={segment.id}>
                      <CardContent className="p-3 sm:p-4">
                        {/* Mobile-first responsive layout for segment editing */}
                        <div className="space-y-3">
                          {/* Segment header with index and delete button */}
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className="text-xs">
                              Segment {index + 1}
                            </Badge>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveSegment(segment.id)}
                              className="text-destructive hover:text-destructive h-8 w-8 p-0"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                          
                          {/* Time inputs - Stack on mobile, side by side on larger screens */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs">Start Time</Label>
                              <Input
                                type="time"
                                value={segment.startTime}
                                onChange={(e) => handleUpdateSegment(segment.id, 'startTime', e.target.value)}
                                className="h-8 text-xs sm:text-sm"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">End Time</Label>
                              <Input
                                type="time"
                                value={segment.endTime}
                                onChange={(e) => handleUpdateSegment(segment.id, 'endTime', e.target.value)}
                                className="h-8 text-xs sm:text-sm"
                              />
                            </div>
                          </div>


                          {/* Operation selection dropdown - Full width for better mobile experience */}
                          <div className="space-y-1">
                            <Label className="text-xs">Operation</Label>
                            <Select
                              value={segment.operationId}
                              onValueChange={(value) => handleUpdateSegment(segment.id, 'operationId', value)}
                            >
                              <SelectTrigger className="h-8 text-xs sm:text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {/* Populate dropdown with all available operations */}
                                {operationsData.map(operation => (
                                  <SelectItem key={operation.id} value={operation.id}>
                                    <div className="flex items-center gap-2">
                                      {/* Color indicator for visual identification */}
                                      {operation.color && (
                                        <div 
                                          className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0" 
                                          style={{ backgroundColor: operation.color }}
                                        />
                                      )}
                                      <span className="text-xs sm:text-sm truncate">{operation.name}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>


                          {/* Operation description - Shows additional context about selected operation */}
                          {operation && (
                            <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded-md">
                              {operation.description}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}


            {/* Visual Event Timeline - Graphical representation of segments */}
            {segmentation.segments.length > 0 && (
              <Card>
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Event Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {/* Timeline bar with colored segments representing operations */}
                    <div className="relative">
                      <div 
                        className="h-8 rounded-lg border-2 border-gray-200 overflow-hidden"
                        style={{
                          background: (() => {
                            // Generate gradient background based on segments
                            if (segmentation.segments.length === 0) return '#f3f4f6';
                            
                            // Sort segments by start time for proper visualization
                            const sortedSegments = [...segmentation.segments].sort((a, b) => 
                              timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
                            );
                            
                            const eventStart = timeToMinutes(eventStartTime);
                            const eventEnd = timeToMinutes(eventEndTime);
                            const totalDuration = eventEnd - eventStart;
                            
                            if (totalDuration <= 0) return '#f3f4f6';
                            
                            const gradientStops: string[] = [];
                            
                            // Create gradient stops for each segment
                            sortedSegments.forEach((segment, index) => {
                              const operation = getOperationById(segment.operationId);
                              const segmentStart = timeToMinutes(segment.startTime);
                              const segmentEnd = timeToMinutes(segment.endTime);
                              
                              // Calculate position as percentage of total duration
                              const startPercent = ((segmentStart - eventStart) / totalDuration) * 100;
                              const endPercent = ((segmentEnd - eventStart) / totalDuration) * 100;
                              
                              const color = operation?.color || '#94a3b8';
                              
                              // Handle gaps before first segment
                              if (index === 0 && startPercent > 0) {
                                gradientStops.push(`#f3f4f6 0%`);
                                gradientStops.push(`#f3f4f6 ${startPercent}%`);
                              }
                              
                              // Add segment color
                              gradientStops.push(`${color} ${startPercent}%`);
                              gradientStops.push(`${color} ${endPercent}%`);
                              
                              // Handle gaps between segments
                              const nextSegment = sortedSegments[index + 1];
                              if (nextSegment) {
                                const nextStart = timeToMinutes(nextSegment.startTime);
                                const nextStartPercent = ((nextStart - eventStart) / totalDuration) * 100;
                                
                                if (nextStartPercent > endPercent) {
                                  // Add gray area for gap
                                  gradientStops.push(`#f3f4f6 ${endPercent}%`);
                                  gradientStops.push(`#f3f4f6 ${nextStartPercent}%`);
                                }
                              } else if (endPercent < 100) {
                                // Handle gap after last segment
                                gradientStops.push(`#f3f4f6 ${endPercent}%`);
                                gradientStops.push(`#f3f4f6 100%`);
                              }
                            });
                            
                            return `linear-gradient(to right, ${gradientStops.join(', ')})`;
                          })()
                        }}
                      />
                      
                      {/* Time labels at start and end of timeline */}
                      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                        <span className="font-mono">{eventStartTime}</span>
                        <span className="font-mono">{eventEndTime}</span>
                      </div>
                    </div>
                    
                    {/* Legend showing operation colors and time ranges */}
                    <div className="flex flex-wrap gap-2">
                      {segmentation.segments.map((segment) => {
                        const operation = getOperationById(segment.operationId);
                        if (!operation) return null;
                        
                        return (
                          <div key={segment.id} className="flex items-center gap-1">
                            <div 
                              className="w-3 h-3 rounded-full flex-shrink-0" 
                              style={{ backgroundColor: operation.color }}
                            />
                            <span className="text-xs text-muted-foreground">
                              {operation.name} ({segment.startTime}-{segment.endTime})
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}


            {/* Coverage Summary - Shows completion status and total time coverage */}
            {segmentation.segments.length > 0 && (
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm">
                    <span className="font-medium">Coverage Summary:</span>
                    <div className="flex items-center gap-2">
                      {/* Time coverage with color coding based on validation status */}
                      <span className={validationErrors.length === 0 ? 'text-green-600 font-mono' : 'text-destructive font-mono'}>
                        {minutesToTime(totalCoveredDuration)} / {minutesToTime(eventDuration)}
                      </span>
                      {/* Success badge when all validation passes */}
                      {validationErrors.length === 0 && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                          Complete
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
};


export default OperationSegmentationTab;
