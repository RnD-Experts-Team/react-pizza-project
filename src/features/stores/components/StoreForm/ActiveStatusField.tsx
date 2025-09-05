import React from 'react';
import { Controller } from 'react-hook-form';
import type { Control } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { getLabelClassName } from '@/features/stores/utils/StoreFormUtils';
import type { CreateStoreFormData, UpdateStoreFormData } from '@/features/stores/utils/StoreFormUtils';

interface ActiveStatusFieldProps {
  control: Control<CreateStoreFormData | UpdateStoreFormData>;
}

export const ActiveStatusField: React.FC<ActiveStatusFieldProps> = ({ control }) => {
  return (
    <div className="flex items-center space-x-2 sm:space-x-3 py-2">
      <Controller
        name="is_active"
        control={control}
        render={({ field }) => (
          <Switch
            id="is_active"
            checked={field.value}
            onCheckedChange={field.onChange}
            className="data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
          />
        )}
      />
      <Label
        htmlFor="is_active"
        className={`${getLabelClassName('normal')} cursor-pointer`}
      >
        Store is active
      </Label>
    </div>
  );
};
