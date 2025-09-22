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
 */
const OperationSegmentationTab: React.FC<OperationSegmentationTabProps> = ({
  segmentation,
  onSegmentationChange,
  eventStartTime,
  eventEndTime
}) => {
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  /**
   * Generate a unique ID for new segments
   */
  const generateSegmentId = useCallback((): string => {
    return `segment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  /**
   * Convert time string to minutes for easier calculation
   */
  const timeToMinutes = useCallback((time: string): number => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }, []);

  /**
   * Convert minutes back to time string
   */
  const minutesToTime = useCallback((minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }, []);

  /**
   * Validate segments for overlaps and coverage
   */
  const validateSegments = useCallback((segments: OperationSegment[]): string[] => {
    const errors: string[] = [];
    
    if (segments.length === 0) {
      return errors;
    }

    // Sort segments by start time
    const sortedSegments = [...segments].sort((a, b) => 
      timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
    );

    const eventStartMinutes = timeToMinutes(eventStartTime);
    const eventEndMinutes = timeToMinutes(eventEndTime);

    // Check if first segment starts at event start
    if (timeToMinutes(sortedSegments[0].startTime) !== eventStartMinutes) {
      errors.push('First segment must start at event start time');
    }

    // Check if last segment ends at event end
    if (timeToMinutes(sortedSegments[sortedSegments.length - 1].endTime) !== eventEndMinutes) {
      errors.push('Last segment must end at event end time');
    }

    // Check for overlaps and gaps
    for (let i = 0; i < sortedSegments.length; i++) {
      const current = sortedSegments[i];
      const currentStart = timeToMinutes(current.startTime);
      const currentEnd = timeToMinutes(current.endTime);

      // Check if segment is valid (start < end)
      if (currentStart >= currentEnd) {
        errors.push(`Segment ${i + 1}: Start time must be before end time`);
      }

      // Check for gaps or overlaps with next segment
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
   */
  const updateValidation = useCallback((segments: OperationSegment[]) => {
    const errors = validateSegments(segments);
    setValidationErrors(errors);
  }, [validateSegments]);

  /**
   * Toggle segmentation enabled/disabled
   */
  const handleToggleSegmentation = useCallback((enabled: boolean) => {
    const newSegmentation: OperationSegmentation = {
      ...segmentation,
      isEnabled: enabled,
      segments: enabled ? segmentation.segments : []
    };
    onSegmentationChange(newSegmentation);
    
    if (enabled) {
      updateValidation(newSegmentation.segments);
    } else {
      setValidationErrors([]);
    }
  }, [segmentation, onSegmentationChange, updateValidation]);

  /**
   * Add a new segment
   */
  const handleAddSegment = useCallback(() => {
    const lastSegment = segmentation.segments[segmentation.segments.length - 1];
    const startTime = lastSegment ? lastSegment.endTime : eventStartTime;
    
    const newSegment: OperationSegment = {
      id: generateSegmentId(),
      startTime,
      endTime: eventEndTime,
      operationId: operationsData[0].id
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
   */
  const getOperationById = useCallback((operationId: string): Operation | undefined => {
    return operationsData.find(op => op.id === operationId);
  }, []);

  /**
   * Auto-fill segments to cover entire event duration
   */
  const handleAutoFillSegments = useCallback(() => {
    if (segmentation.segments.length === 0) {
      // Create a single segment covering the entire event
      const newSegment: OperationSegment = {
        id: generateSegmentId(),
        startTime: eventStartTime,
        endTime: eventEndTime,
        operationId: operationsData[0].id
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
   */
  const totalCoveredDuration = useMemo(() => {
    return segmentation.segments.reduce((total, segment) => {
      const duration = timeToMinutes(segment.endTime) - timeToMinutes(segment.startTime);
      return total + duration;
    }, 0);
  }, [segmentation.segments, timeToMinutes]);

  const eventDuration = useMemo(() => {
    return timeToMinutes(eventEndTime) - timeToMinutes(eventStartTime);
  }, [eventStartTime, eventEndTime, timeToMinutes]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with toggle - Responsive layout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-semibold">Operation Segmentation</h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Divide the event into time segments and assign operations to each segment
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Enable</span>
          <Switch
            checked={segmentation.isEnabled}
            onCheckedChange={handleToggleSegmentation}
          />
        </div>
      </div>

      {segmentation.isEnabled && (
        <>
          {/* Event time info - Responsive card */}
          <Card>
            <CardHeader className="pb-2 sm:pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Event Time Frame
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
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

          {/* Validation errors - Responsive */}
          {validationErrors.length > 0 && (
            <Card className="border-destructive">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-sm flex items-center gap-2 text-destructive">
                  <AlertTriangle className="h-4 w-4" />
                  Validation Errors
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-destructive">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Segments - Responsive layout */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h4 className="text-sm sm:text-md font-medium">Time Segments</h4>
              <div className="flex flex-col sm:flex-row gap-2">
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
              <div className="space-y-2 sm:space-y-3">
                {segmentation.segments.map((segment, index) => {
                  const operation = getOperationById(segment.operationId);
                  
                  return (
                    <Card key={segment.id}>
                      <CardContent className="p-3 sm:p-4">
                        {/* Mobile-first responsive layout */}
                        <div className="space-y-3">
                          {/* Segment header */}
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

                          {/* Operation select - Full width */}
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
                                {operationsData.map(operation => (
                                  <SelectItem key={operation.id} value={operation.id}>
                                    <div className="flex items-center gap-2">
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

                          {/* Operation description */}
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

            {/* Visual Event Bar */}
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
                    {/* Event bar with gradient segments */}
                    <div className="relative">
                      <div 
                        className="h-8 rounded-lg border-2 border-gray-200 overflow-hidden"
                        style={{
                          background: (() => {
                            if (segmentation.segments.length === 0) return '#f3f4f6';
                            
                            // Sort segments by start time
                            const sortedSegments = [...segmentation.segments].sort((a, b) => 
                              timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
                            );
                            
                            const eventStart = timeToMinutes(eventStartTime);
                            const eventEnd = timeToMinutes(eventEndTime);
                            const totalDuration = eventEnd - eventStart;
                            
                            if (totalDuration <= 0) return '#f3f4f6';
                            
                            const gradientStops: string[] = [];
                            
                            sortedSegments.forEach((segment, index) => {
                              const operation = getOperationById(segment.operationId);
                              const segmentStart = timeToMinutes(segment.startTime);
                              const segmentEnd = timeToMinutes(segment.endTime);
                              
                              // Calculate position as percentage
                              const startPercent = ((segmentStart - eventStart) / totalDuration) * 100;
                              const endPercent = ((segmentEnd - eventStart) / totalDuration) * 100;
                              
                              const color = operation?.color || '#94a3b8';
                              
                              // Add gradient stops for this segment
                              if (index === 0 && startPercent > 0) {
                                // Add gray area before first segment
                                gradientStops.push(`#f3f4f6 0%`);
                                gradientStops.push(`#f3f4f6 ${startPercent}%`);
                              }
                              
                              gradientStops.push(`${color} ${startPercent}%`);
                              gradientStops.push(`${color} ${endPercent}%`);
                              
                              // Check for gaps between segments
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
                                // Add gray area after last segment
                                gradientStops.push(`#f3f4f6 ${endPercent}%`);
                                gradientStops.push(`#f3f4f6 100%`);
                              }
                            });
                            
                            return `linear-gradient(to right, ${gradientStops.join(', ')})`;
                          })()
                        }}
                      />
                      
                      {/* Time labels */}
                      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                        <span className="font-mono">{eventStartTime}</span>
                        <span className="font-mono">{eventEndTime}</span>
                      </div>
                    </div>
                    
                    {/* Legend */}
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

            {/* Summary - Responsive */}
            {segmentation.segments.length > 0 && (
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm">
                    <span className="font-medium">Coverage Summary:</span>
                    <div className="flex items-center gap-2">
                      <span className={validationErrors.length === 0 ? 'text-green-600 font-mono' : 'text-destructive font-mono'}>
                        {minutesToTime(totalCoveredDuration)} / {minutesToTime(eventDuration)}
                      </span>
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