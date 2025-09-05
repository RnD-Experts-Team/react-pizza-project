import React from 'react';
import type { UseFormRegister, FieldErrors, UseFieldArrayRemove } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Minus } from 'lucide-react';
import { getInputClassName, getLabelClassName } from '@/features/stores/utils/StoreFormUtils';
import type { CreateStoreFormData, UpdateStoreFormData } from '@/features/stores/utils/StoreFormUtils';

interface MetadataEntryProps {
  index: number;
  register: UseFormRegister<CreateStoreFormData | UpdateStoreFormData>;
  formErrors: FieldErrors<CreateStoreFormData | UpdateStoreFormData>;
  remove: UseFieldArrayRemove;
  loading: boolean;
  isSubmitting: boolean;
}

export const MetadataEntry: React.FC<MetadataEntryProps> = ({
  index,
  register,
  formErrors,
  remove,
  loading,
  isSubmitting,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 border border-border rounded-lg bg-card">
      <div className="space-y-2">
        <Label className={getLabelClassName('small')}>
          Key
        </Label>
        <Input
          type="text"
          placeholder="Enter key"
          className={getInputClassName(
            Boolean(formErrors.metadata?.[index]?.key),
            'small'
          )}
          {...register(`metadata.${index}.key` as const)}
        />
        {formErrors.metadata?.[index]?.key && (
          <p className="text-xs text-destructive">
            {formErrors.metadata[index].key.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className={getLabelClassName('small')}>
            Value
          </Label>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => remove(index)}
            disabled={loading || isSubmitting}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 p-1 h-auto"
          >
            <Minus className="h-3 w-3" />
          </Button>
        </div>
        <Input
          type="text"
          placeholder="Enter value"
          className={getInputClassName(
            Boolean(formErrors.metadata?.[index]?.value),
            'small'
          )}
          {...register(`metadata.${index}.value` as const)}
        />
        {formErrors.metadata?.[index]?.value && (
          <p className="text-xs text-destructive">
            {formErrors.metadata[index].value.message}
          </p>
        )}
      </div>
    </div>
  );
};
