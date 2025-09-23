import React, { useState } from 'react';
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
import type { CreateDrawerProps, EmployeeEventData, OperationSegmentation } from '../types/scheduler.types';
import OperationSegmentationTab from './OperationSegmentationTab';


/**
 * CreateEventDrawer Component
 * 
 * A dedicated drawer component for creating new employee events.
 * Handles all form fields, validation, and submission logic.
 * Supports both basic event details and advanced operation segmentation features.
 */
const CreateEventDrawer: React.FC<CreateDrawerProps> = ({
  isOpen,
  onClose,
  newEventData,
  eventTitle,
  onEventTitleChange,
  employeeEventForm,
  onEmployeeEventFormChange,
  onCreateEvent,
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
   * Update employee event form field
   * Helper function to update specific fields in the employee event form
   * @param field - The field name to update
   * @param value - The new value for the field
   */
  const updateField = (field: keyof EmployeeEventData, value: any) => {
    onEmployeeEventFormChange(field, value);
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
   * Resets all local state when drawer is closed to ensure clean state for next use
   */
  const handleClose = () => {
    // Reset all local state to defaults
    setIsAllWorkDay(false);
    setActiveTab('details');
    setOperationSegmentation({ isEnabled: false, segments: [] });
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
    if (!eventTitle.trim()) return false;
    if (!newEventData) return false;
    
    // Validate scheduled times if both are provided
    if (employeeEventForm.scheduled_start_time && employeeEventForm.scheduled_end_time) {
      // Create Date objects for time comparison (using arbitrary date)
      const startTime = new Date(`2000-01-01T${employeeEventForm.scheduled_start_time}`);
      const endTime = new Date(`2000-01-01T${employeeEventForm.scheduled_end_time}`);
      
      // Ensure start time is before end time
      if (startTime >= endTime) {
        return false;
      }
    }
    
    // Validate actual times if both are provided
    if (employeeEventForm.actual_start_time && employeeEventForm.actual_end_time) {
      // Create Date objects for time comparison (using arbitrary date)
      const startTime = new Date(`2000-01-01T${employeeEventForm.actual_start_time}`);
      const endTime = new Date(`2000-01-01T${employeeEventForm.actual_end_time}`);
      
      // Ensure start time is before end time
      if (startTime >= endTime) {
        return false;
      }
    }
    
    return true;
  };


  return (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent title="Create New Employee Event">
        {/* Scrollable content area with fixed height */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-4">
          {/* Event Title Input - Primary identifier for the event */}
          <div className="mb-6">
            <Label htmlFor="eventTitle" className="text-sm font-medium">
              Event Title
            </Label>
            <Input
              id="eventTitle"
              type="text"
              value={eventTitle}
              onChange={(e) => onEventTitleChange(e.target.value)}
              placeholder="Enter event title..."
              className="mt-1"
              autoFocus // Automatically focus on load for better UX
            />
          </div>


          {/* Employee Information Display - Shows selected employee and basic schedule info */}
          {newEventData && (
            <div className="mb-6">
              <Label className="text-sm font-medium">Employee Information</Label>
              <div className="mt-1 p-3 bg-muted rounded-md">
                <p className="text-sm">
                  <strong>Employee:</strong> {employees.find(emp => emp.id === newEventData.resource)?.name || newEventData.resource}
                </p>
                <p className="text-sm">
                  <strong>Scheduled Start:</strong> {newEventData.start.toString()}
                </p>
                <p className="text-sm">
                  <strong>Scheduled End:</strong> {newEventData.end.toString()}
                </p>
              </div>
            </div>
          )}


          {/* Tab Navigation - Separates basic event details from advanced operation segmentation */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Event Details</TabsTrigger>
              <TabsTrigger value="operations">Operation Segmentation</TabsTrigger>
            </TabsList>


            {/* Event Details Tab - Contains all basic event information */}
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
                <Label htmlFor="scheduledStartTime" className="text-sm">
                  Scheduled Start Time
                </Label>
                <Input
                  id="scheduledStartTime"
                  type="time"
                  value={employeeEventForm.scheduled_start_time || ''}
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
                <Label htmlFor="scheduledEndTime" className="text-sm">
                  Scheduled End Time
                </Label>
                <Input
                  id="scheduledEndTime"
                  type="time"
                  value={employeeEventForm.scheduled_end_time || ''}
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
                <Label htmlFor="actualStartTime" className="text-sm">
                  Actual Start Time
                </Label>
                <Input
                  id="actualStartTime"
                  type="time"
                  value={employeeEventForm.actual_start_time || ''}
                  onChange={(e) => updateField('actual_start_time', e.target.value || null)}
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
                  onChange={(e) => updateField('actual_end_time', e.target.value || null)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>


          {/* Status Selection - Dropdown for selecting event status from predefined options */}
          <div>
            <Label htmlFor="statusSelect" className="text-sm font-medium">
              Status
            </Label>
            <Select
              value={employeeEventForm.status_id.toString()}
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
              <Label htmlFor="vciSwitch" className="text-sm">
                VCI (Virtual Id Check)
              </Label>
              <Switch
                id="vciSwitch"
                checked={employeeEventForm.vci}
                onCheckedChange={(checked) => updateField('vci', checked)}
              />
            </div>
            
            {/* Agree on Exception Toggle - For handling exceptional circumstances */}
            <div className="flex items-center justify-between">
              <Label htmlFor="agreeExceptionSwitch" className="text-sm">
                Agree on Exception
              </Label>
              <Switch
                id="agreeExceptionSwitch"
                checked={employeeEventForm.agree_on_exception}
                onCheckedChange={(checked) => updateField('agree_on_exception', checked)}
              />
            </div>
          </div>


          {/* Exception Notes - Free text area for additional notes about exceptions */}
          <div>
            <Label htmlFor="exceptionNotes" className="text-sm font-medium">
              Exception Notes
            </Label>
            <Textarea
              id="exceptionNotes"
              value={employeeEventForm.exception_notes || ''}
              onChange={(e) => updateField('exception_notes', e.target.value || null)}
              placeholder="Enter any exception notes..."
              className="mt-1 min-h-[80px]"
            />
          </div>
            </TabsContent>


            {/* Operation Segmentation Tab - Advanced feature for breaking down events into segments */}
            <TabsContent value="operations" className="mt-6">
              <OperationSegmentationTab
                segmentation={operationSegmentation}
                onSegmentationChange={handleOperationSegmentationChange}
                // Pass default times if not set, using standard business hours
                eventStartTime={employeeEventForm.scheduled_start_time || '08:00'}
                eventEndTime={employeeEventForm.scheduled_end_time || '17:00'}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Fixed footer with action buttons */}
        <DrawerFooter>
          <div className="flex gap-2 justify-end">
            {/* Cancel button - closes drawer without saving */}
            <Button
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            {/* Submit button - creates the event, disabled if form is invalid */}
            <Button
              onClick={onCreateEvent}
              disabled={!isFormValid()} // Prevent submission of invalid data
            >
              Create Event
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};


export default CreateEventDrawer;
