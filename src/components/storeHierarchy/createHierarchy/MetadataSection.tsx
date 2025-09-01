import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Textarea } from '../../ui/textarea';
import { cn } from '../../../lib/utils';

interface MetadataSectionProps {
  createdBy: string;
  reason: string;
  validationErrors: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const MetadataSection: React.FC<MetadataSectionProps> = ({
  createdBy,
  reason,
  validationErrors,
  onInputChange
}) => {
  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-base sm:text-lg text-foreground">Metadata</CardTitle>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Additional information about this hierarchy relationship
        </p>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6 pt-0 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-2">
            <Label htmlFor="created_by" className="text-sm font-medium text-foreground">Created By</Label>
            <Input
              id="created_by"
              name="created_by"
              type="text"
              value={createdBy}
              onChange={onInputChange}
              placeholder="Enter creator name"
              className={cn(
                "text-sm sm:text-base",
                validationErrors.created_by && 'border-destructive'
              )}
            />
            {validationErrors.created_by && (
              <p className="text-xs sm:text-sm text-destructive">{validationErrors.created_by}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-sm font-medium text-foreground">Reason (Optional)</Label>
            <Textarea
              id="reason"
              name="reason"
              value={reason}
              onChange={onInputChange}
              placeholder="e.g., Store manager manages assistant manager"
              className={cn(
                "text-sm sm:text-base min-h-[80px] sm:min-h-[100px]",
                validationErrors.reason && 'border-destructive'
              )}
              rows={3}
            />
            {validationErrors.reason && (
              <p className="text-xs sm:text-sm text-destructive">{validationErrors.reason}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetadataSection;