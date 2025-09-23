import React, { useState, useEffect } from 'react';
import { 
  Drawer, 
  DrawerContent, 
  DrawerFooter 
} from '../../../components/ui/drawer';
import { Button } from '../../../components/ui/button';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import type { EditDrawerProps, EmployeeEventData, OperationSegmentation } from '../types/scheduler.types';
import OperationSegmentationTab from './OperationSegmentationTab';


/**
 * EditEventDrawer Component
 * 
 * A dedicated drawer component for editing existing employee events.
 * Handles all form fields, validation, update, and delete operations.
 * Similar to CreateEventDrawer but pre-populated with existing event data.
 */
const EditEventDrawer: React.FC<EditDrawerProps> = ({
  isOpen,
  onClose,
  editingEvent,
  editEventTitle,
  onEditEventTitleChange,
  editEmployeeEventForm,
  onEditEmployeeEventFormChange,
  onEditEvent,
  onDeleteEvent,
  employees,
  statuses,
  businessBeginsHour = 8,
  businessEndsHour = 20
}) => {
  // State for managing "All Work Day" toggle functionality
  const [isAllWorkDay, setIsAllWorkDay] = useState(false);
  
  // State for managing which tab is currently active (details vs operations)
  const [activeTab, setActiveTab] = useState('details');


  // Initialize operation segmentation state with default empty configuration
  const [operationSegmentation, setOperationSegmentation] = useState<OperationSegmentation>({
    isEnabled: false,
    segments: []
  });


  /**
   * Initialize operation segmentation from existing event data
   * This effect runs when the component mounts or when the event data changes
   * It ensures the operation segmentation state reflects the current event's data
   */
  useEffect(() => {
    if (editEmployeeEventForm?.operation_segmentation) {
      // Load existing operation segmentation data
      setOperationSegmentation(editEmployeeEventForm.operation_segmentation);
    } else {
      // Reset to empty state if no segmentation data exists
      setOperationSegmentation({ isEnabled: false, segments: [] });
    }
  }, [editEmployeeEventForm?.operation_segmentation]);


  /**
   * Update employee event form field
   * Helper function to update specific fields in the employee event form
   * @param field - The field name to update
   * @param value - The new value for the field
   */
  const updateField = (field: keyof EmployeeEventData, value: any) => {
    onEditEmployeeEventFormChange(field, value);
  };


  /**
   * Handle operation segmentation changes
   * Updates both local state and the form data when operation segmentation changes
   * @param segmentation - The new operation segmentation configuration
   */
  const handleOperationSegmentationChange = (segmentation: OperationSegmentation) => {
    setOperationSegmentation(segmentation);
    // Update the form with the new segmentation data
    updateField('operation_segmentation', segmentation);
  };


  /**
   * Handle drawer close with cleanup
   * Resets local state when drawer is closed (less cleanup needed than create drawer)
   */
  const handleClose = () => {
    // Reset local UI state
    setIsAllWorkDay(false);
    setActiveTab('details');
    // Call parent's close handler
    onClose();
  };


  /**
   * Set all work day times using business hours from configuration
   * Convenience function that sets start/end times to cover the entire business day
   * Uses businessBeginsHour and businessEndsHour props for time calculation
   */
  const handleAllWorkDay = () => {
    // Format hours with leading zeros and add minutes
    const startTime = businessBeginsHour.toString().padStart(2, '0') + ':00';
    const endTime = businessEndsHour.toString().padStart(2, '0') + ':00';
    
    // Update form fields with calculated times
    updateField('scheduled_start_time', startTime);
    updateField('scheduled_end_time', endTime);
    // Mark as all work day to disable manual time editing
    setIsAllWorkDay(true);
  };


  /**
   * Validate form before submission
   * Comprehensive validation that checks required fields and logical constraints
   * @returns boolean indicating if form is valid for submission
   */
  const isFormValid = (): boolean => {
    // Check required fields
    if (!editEventTitle.trim()) return false;
    if (!editingEvent) return false;
    
    // Validate scheduled times if both are provided
    if (editEmployeeEventForm.scheduled_start_time && editEmployeeEventForm.scheduled_end_time) {
      // Create Date objects for time comparison (using arbitrary date)
      const startTime = new Date(`2000-01-01T${editEmployeeEventForm.scheduled_start_time}`);
      const endTime = new Date(`2000-01-01T${editEmployeeEventForm.scheduled_end_time}`);
      
      // Ensure start time is before end time
      if (startTime >= endTime) {
        return false;
      }
    }
    
    // Validate actual times if both are provided
    if (editEmployeeEventForm.actual_start_time && editEmployeeEventForm.actual_end_time) {
      // Create Date objects for time comparison (using arbitrary date)
      const startTime = new Date(`2000-01-01T${editEmployeeEventForm.actual_start_time}`);
      const endTime = new Date(`2000-01-01T${editEmployeeEventForm.actual_end_time}`);
      
      // Ensure start time is before end time
      if (startTime >= endTime) {
        return false;
      }
    }
    
    return true;
  };


  /**
   * Handle delete with confirmation
   * Shows a confirmation dialog before proceeding with deletion to prevent accidental data loss
   */
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      onDeleteEvent();
    }
  };


  // Early return if no event is being edited - prevents rendering empty form
  if (!editingEvent) {
    return null;
  }


  return (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent title="Edit Employee Event">
        {/* Scrollable content area with fixed height */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-4">
          {/* Event Title Input - Primary identifier for the event, pre-filled with existing title */}
          <div className="mb-6">
            <Label htmlFor="editEventTitle" className="text-sm font-medium">
              Event Title
            </Label>
            <Input
              id="editEventTitle"
              type="text"
              value={editEventTitle}
              onChange={(e) => onEditEventTitleChange(e.target.value)}
              placeholder="Enter event title..."
              className="mt-1"
              autoFocus // Automatically focus on load for better UX
            />
          </div>


          {/* Employee Information Display - Shows selected employee and existing schedule info */}
          <div className="mb-6">
            <Label className="text-sm font-medium">Employee Information</Label>
            <div className="mt-1 p-3 bg-muted rounded-md">
              <p className="text-sm">
                <strong>Employee:</strong> {employees.find(emp => emp.id === editingEvent.resource)?.name || editingEvent.resource}
              </p>
              <p className="text-sm">
                <strong>Scheduled Start:</strong> {editingEvent.start.toString()}
              </p>
              <p className="text-sm">
                <strong>Scheduled End:</strong> {editingEvent.end.toString()}
              </p>
              {/* Show event ID if available - useful for debugging and reference */}
              {editingEvent.id && (
                <p className="text-sm">
                  <strong>Event ID:</strong> {editingEvent.id}
                </p>
              )}
            </div>
          </div>


          {/* Tab Navigation - Separates basic event details from advanced operation segmentation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Event Details</TabsTrigger>
              <TabsTrigger value="operations">Operation Segmentation</TabsTrigger>
            </TabsList>


            {/* Event Details Tab - Contains all basic event information, pre-filled with existing data */}
            <TabsContent value="details" className="space-y-6 mt-6">
              {/* Scheduled Times Section - Primary time allocation for the event */}
              <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Scheduled Times</h3>
              {/* Quick action button to set full work day hours */}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAllWorkDay}
                className="text-xs"
              >
                All Work Day
              </Button>
            </div>
            {/* Two-column layout for start and end times */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editScheduledStartTime" className="text-sm">
                  Scheduled Start Time
                </Label>
                <Input
                  id="editScheduledStartTime"
                  type="time"
                  value={editEmployeeEventForm.scheduled_start_time || ''}
                  onChange={(e) => {
                    updateField('scheduled_start_time', e.target.value);
                    // Clear all work day state when manually editing
                    setIsAllWorkDay(false);
                  }}
                  disabled={isAllWorkDay} // Disable manual editing when "All Work Day" is active
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="editScheduledEndTime" className="text-sm">
                  Scheduled End Time
                </Label>
                <Input
                  id="editScheduledEndTime"
                  type="time"
                  value={editEmployeeEventForm.scheduled_end_time || ''}
                  onChange={(e) => {
                    updateField('scheduled_end_time', e.target.value);
                    // Clear all work day state when manually editing
                    setIsAllWorkDay(false);
                  }}
                  disabled={isAllWorkDay} // Disable manual editing when "All Work Day" is active
                  className="mt-1"
                />
              </div>
            </div>
          </div>


          {/* Actual Times Section - For recording what actually happened vs what was scheduled */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Actual Times</h3>
            {/* Two-column layout for actual start and end times */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="editActualStartTime" className="text-sm">
                  Actual Start Time
                </Label>
                <Input
                  id="editActualStartTime"
                  type="time"
                  value={editEmployeeEventForm.actual_start_time || ''}
                  onChange={(e) => updateField('actual_start_time', e.target.value || null)}
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
                  onChange={(e) => updateField('actual_end_time', e.target.value || null)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>


          {/* Status Selection - Dropdown for selecting event status from predefined options */}
          <div>
            <Label htmlFor="editStatusSelect" className="text-sm font-medium">
              Status
            </Label>
            <Select
              value={editEmployeeEventForm.status_id.toString()}
              onValueChange={(value) => updateField('status_id', parseInt(value))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {/* Dynamically populate status options from props */}
                {statuses.map(status => (
                  <SelectItem key={status.id} value={status.id}>
                    {status.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>


          {/* Boolean Options Section - Toggle switches for various event properties */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Options</h3>
            
            {/* VCI Toggle - Virtual ID Check option */}
            <div className="flex items-center justify-between">
              <Label htmlFor="editVciSwitch" className="text-sm">
                VCI (Virtual Id Check)
              </Label>
              <Switch
                id="editVciSwitch"
                checked={editEmployeeEventForm.vci}
                onCheckedChange={(checked) => updateField('vci', checked)}
              />
            </div>
            
            {/* Agree on Exception Toggle - For handling exceptional circumstances */}
            <div className="flex items-center justify-between">
              <Label htmlFor="editAgreeExceptionSwitch" className="text-sm">
                Agree on Exception
              </Label>
              <Switch
                id="editAgreeExceptionSwitch"
                checked={editEmployeeEventForm.agree_on_exception}
                onCheckedChange={(checked) => updateField('agree_on_exception', checked)}
              />
            </div>
          </div>


          {/* Exception Notes - Free text area for additional notes about exceptions */}
          <div>
            <Label htmlFor="editExceptionNotes" className="text-sm font-medium">
              Exception Notes
            </Label>
            <Textarea
              id="editExceptionNotes"
              value={editEmployeeEventForm.exception_notes || ''}
              onChange={(e) => updateField('exception_notes', e.target.value || null)}
              placeholder="Enter any exception notes..."
              className="mt-1 min-h-[80px]"
            />
          </div>
            </TabsContent>


            {/* Operation Segmentation Tab - Advanced feature for breaking down events into segments */}
            <TabsContent value="operations" className="space-y-6 mt-6">
              <OperationSegmentationTab
                segmentation={operationSegmentation}
                onSegmentationChange={handleOperationSegmentationChange}
                // Pass existing times from the form (may be empty strings for new events)
                eventStartTime={editEmployeeEventForm.scheduled_start_time || ''}
                eventEndTime={editEmployeeEventForm.scheduled_end_time || ''}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Fixed footer with action buttons - includes delete functionality for editing */}
        <DrawerFooter>
          <div className="flex gap-2 justify-between">
            {/* Delete button - positioned separately on the left for visual separation */}
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete Event
            </Button>
            {/* Save/Cancel buttons grouped on the right */}
            <div className="flex gap-2">
              {/* Cancel button - closes drawer without saving changes */}
              <Button
                variant="outline"
                onClick={handleClose}
              >
                Cancel
              </Button>
              {/* Update button - saves changes, disabled if form is invalid */}
              <Button
                onClick={onEditEvent}
                disabled={!isFormValid()} // Prevent submission of invalid data
              >
                Update Event
              </Button>
            </div>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};


export default EditEventDrawer;
