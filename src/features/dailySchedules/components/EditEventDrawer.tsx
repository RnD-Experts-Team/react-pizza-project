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
  const [isAllWorkDay, setIsAllWorkDay] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  // Initialize operation segmentation state
  const [operationSegmentation, setOperationSegmentation] = useState<OperationSegmentation>({
    isEnabled: false,
    segments: []
  });

  // Initialize operation segmentation from existing event data
  useEffect(() => {
    if (editEmployeeEventForm?.operation_segmentation) {
      setOperationSegmentation(editEmployeeEventForm.operation_segmentation);
    } else {
      setOperationSegmentation({ isEnabled: false, segments: [] });
    }
  }, [editEmployeeEventForm?.operation_segmentation]);

  /**
   * Update employee event form field
   */
  const updateField = (field: keyof EmployeeEventData, value: any) => {
    onEditEmployeeEventFormChange(field, value);
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
    if (!editEventTitle.trim()) return false;
    if (!editingEvent) return false;
    
    // Validate scheduled times if provided
    if (editEmployeeEventForm.scheduled_start_time && editEmployeeEventForm.scheduled_end_time) {
      const startTime = new Date(`2000-01-01T${editEmployeeEventForm.scheduled_start_time}`);
      const endTime = new Date(`2000-01-01T${editEmployeeEventForm.scheduled_end_time}`);
      
      if (startTime >= endTime) {
        return false;
      }
    }
    
    // Validate actual times if provided
    if (editEmployeeEventForm.actual_start_time && editEmployeeEventForm.actual_end_time) {
      const startTime = new Date(`2000-01-01T${editEmployeeEventForm.actual_start_time}`);
      const endTime = new Date(`2000-01-01T${editEmployeeEventForm.actual_end_time}`);
      
      if (startTime >= endTime) {
        return false;
      }
    }
    
    return true;
  };

  /**
   * Handle delete with confirmation
   */
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      onDeleteEvent();
    }
  };

  if (!editingEvent) {
    return null;
  }

  return (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent title="Edit Employee Event">
        <div className="max-h-[70vh] overflow-y-auto px-6 py-4">
          {/* Event Title */}
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
              autoFocus
            />
          </div>

          {/* Employee Info Display */}
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
              {editingEvent.id && (
                <p className="text-sm">
                  <strong>Event ID:</strong> {editingEvent.id}
                </p>
              )}
            </div>
          </div>

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
                <Label htmlFor="editScheduledStartTime" className="text-sm">
                  Scheduled Start Time
                </Label>
                <Input
                  id="editScheduledStartTime"
                  type="time"
                  value={editEmployeeEventForm.scheduled_start_time || ''}
                  onChange={(e) => {
                    updateField('scheduled_start_time', e.target.value);
                    setIsAllWorkDay(false);
                  }}
                  disabled={isAllWorkDay}
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

          {/* Status Selection */}
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
              <Label htmlFor="editVciSwitch" className="text-sm">
                VCI (Virtual Id Check)
              </Label>
              <Switch
                id="editVciSwitch"
                checked={editEmployeeEventForm.vci}
                onCheckedChange={(checked) => updateField('vci', checked)}
              />
            </div>
            
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

          {/* Exception Notes */}
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

            <TabsContent value="operations" className="space-y-6 mt-6">
              <OperationSegmentationTab
                segmentation={operationSegmentation}
                onSegmentationChange={handleOperationSegmentationChange}
                eventStartTime={editEmployeeEventForm.scheduled_start_time || ''}
                eventEndTime={editEmployeeEventForm.scheduled_end_time || ''}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <DrawerFooter>
          <div className="flex gap-2 justify-between">
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete Event
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                onClick={onEditEvent}
                disabled={!isFormValid()}
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