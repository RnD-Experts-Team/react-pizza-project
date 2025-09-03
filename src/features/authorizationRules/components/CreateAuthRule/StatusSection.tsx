import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface StatusSectionProps {
  isActive: boolean;
  onActiveChange: (checked: boolean) => void;
}

export const StatusSection: React.FC<StatusSectionProps> = ({
  isActive,
  onActiveChange,
}) => {
  return (
    <div className="flex flex-row items-center justify-between rounded-lg border p-2 sm:p-3">
      <div className="space-y-0.5">
        <Label className="text-sm sm:text-base">Active Rule</Label>
        <div className="text-xs sm:text-sm text-muted-foreground">
          Enable this rule immediately
        </div>
      </div>
      <Switch checked={isActive} onCheckedChange={onActiveChange} />
    </div>
  );
};