import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getInputClassName, getLabelClassName } from '@/features/stores/utils/StoreFormUtils';
import type { CreateStoreFormData, UpdateStoreFormData } from '@/features/stores/utils/StoreFormUtils';

interface StoreNameFieldProps {
  register: UseFormRegister<CreateStoreFormData | UpdateStoreFormData>;
  formErrors: FieldErrors<CreateStoreFormData | UpdateStoreFormData>;
}

export const StoreNameField: React.FC<StoreNameFieldProps> = ({
  register,
  formErrors,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="name" className={getLabelClassName('normal')}>
        Store Name *
      </Label>
      <Input
        id="name"
        type="text"
        placeholder="Enter store name"
        className={getInputClassName(Boolean(formErrors.name), 'normal')}
        {...register('name')}
      />
      {formErrors.name && (
        <p className="text-xs sm:text-sm text-destructive">{formErrors.name.message}</p>
      )}
    </div>
  );
};
