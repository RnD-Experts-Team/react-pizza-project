import React from 'react';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getInputClassName, getLabelClassName } from '@/features/stores/utils/StoreFormUtils';
import type { CreateStoreFormData, UpdateStoreFormData } from '@/features/stores/utils/StoreFormUtils';
import type { Store } from '@/features/stores/types';

interface StoreIdFieldProps {
  mode: 'create' | 'edit';
  initialData?: Store;
  register: UseFormRegister<CreateStoreFormData | UpdateStoreFormData>;
  formErrors: FieldErrors<CreateStoreFormData | UpdateStoreFormData>;
}

export const StoreIdField: React.FC<StoreIdFieldProps> = ({
  mode,
  initialData,
  register,
  formErrors,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="id" className={getLabelClassName('normal')}>
        Store ID {mode === 'create' ? '*' : ''}
      </Label>
      <Input
        id="id"
        type="text"
        placeholder={mode === 'create' ? "Enter unique store ID" : ""}
        value={mode === 'edit' && initialData ? initialData.id : undefined}
        disabled={mode === 'edit'}
        className={getInputClassName(Boolean((formErrors as any).id), 'normal')}
        {...(mode === 'create' ? register('id' as keyof (CreateStoreFormData | UpdateStoreFormData)) : {})}
      />
      {(formErrors as any).id && (
        <p className="text-xs sm:text-sm text-destructive">{(formErrors as any).id.message}</p>
      )}
    </div>
  );
};
