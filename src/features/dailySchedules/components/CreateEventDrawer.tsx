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
  const [isAllWorkDay, setIsAllWorkDay] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  // Initialize operation segmentation state
  const [operationSegmentation, setOperationSegmentation] = useState<OperationSegmentation>({
    isEnabled: false,
    segments: []
  });

  /**
   * Update employee event form field
   */
  const updateField = (field: keyof EmployeeEventData, value: any) => {
    onEmployeeEventFormChange(field, value);
  };

  /**
   * Handle operation segmentation changes
   */
  const handleOperationSegmentationChange = (segmentation: OperationSegmentation) => {
    setOperationSegmentation(segmentation);
    updateField('operation_segmentation', segmentation);
  };

  /**
   * Handle drawer close with cleanup
   */
  const handleClose = () => {
    setIsAllWorkDay(false);
    setActiveTab('details');
    setOperationSegmentation({ isEnabled: false, segments: [] });
    onClose();
  };

  /**
   * Set all work day times using business hours from configuration
   */
  const handleAllWorkDay = () => {
    const startTime = businessBeginsHour.toString().padStart(2, '0') + ':00';
    const endTime = businessEndsHour.toString().padStart(2, '0') + ':00';
    
    updateField('scheduled_start_time', startTime);
    updateField('scheduled_end_time', endTime);
    setIsAllWorkDay(true);
  };

  /**
   * Validate form before submission
   */
  const isFormValid = (): boolean => {
    if (!eventTitle.trim()) return false;
    if (!newEventData) return false;
    
    // Validate scheduled times if provided
    if (employeeEventForm.scheduled_start_time && employeeEventForm.scheduled_end_time) {
      const startTime = new Date(`2000-01-01T${employeeEventForm.scheduled_start_time}`);
      const endTime = new Date(`2000-01-01T${employeeEventForm.scheduled_end_time}`);
      
      if (startTime >= endTime) {
        return false;
      }
    }
    
    // Validate actual times if provided
    if (employeeEventForm.actual_start_time && employeeEventForm.actual_end_time) {
      const startTime = new Date(`2000-01-01T${employeeEventForm.actual_start_time}`);
      const endTime = new Date(`2000-01-01T${employeeEventForm.actual_end_time}`);
      
      if (startTime >= endTime) {
        return false;
      }
    }
    
    return true;
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent title="Create New Employee Event">
        <div className="max-h-[70vh] overflow-y-auto px-6 py-4">
          {/* Event Title */}
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
              autoFocus
            />
          </div>

          {/* Employee Info Display */}
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

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Event Details</TabsTrigger>
              <TabsTrigger value="operations">Operation Segmentation</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-6 mt-6">
              {/* Scheduled Times */}
              <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-foreground">Scheduled Times</h3>
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
                    setIsAllWorkDay(false);
                  }}
                  disabled={isAllWorkDay}
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
                    setIsAllWorkDay(false);
                  }}
                  disabled={isAllWorkDay}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Actual Times */}
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">Actual Times</h3>
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

          {/* Status Selection */}
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
                {statuses.map(status => (
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
                VCI (Virtual Id Check)
              </Label>
              <Switch
                id="vciSwitch"
                checked={employeeEventForm.vci}
                onCheckedChange={(checked) => updateField('vci', checked)}
              />
            </div>
            
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

          {/* Exception Notes */}
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

            <TabsContent value="operations" className="mt-6">
              <OperationSegmentationTab
                segmentation={operationSegmentation}
                onSegmentationChange={handleOperationSegmentationChange}
                eventStartTime={employeeEventForm.scheduled_start_time || '08:00'}
                eventEndTime={employeeEventForm.scheduled_end_time || '17:00'}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <DrawerFooter>
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              onClick={onCreateEvent}
              disabled={!isFormValid()}
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