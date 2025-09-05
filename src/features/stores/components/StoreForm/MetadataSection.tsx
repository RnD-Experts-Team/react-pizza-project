import React from 'react';
import type { UseFormRegister, FieldErrors, FieldArrayWithId, UseFieldArrayAppend, UseFieldArrayRemove } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';
import { MetadataEntry } from '@/features/stores/components/StoreForm/MetadataEntryFields';
import { getLabelClassName } from '@/features/stores/utils/StoreFormUtils';
import type { CreateStoreFormData, UpdateStoreFormData  } from '@/features/stores/utils/StoreFormUtils';

interface MetadataSectionProps {
  fields: FieldArrayWithId<CreateStoreFormData | UpdateStoreFormData, "metadata", "id">[];
  append: UseFieldArrayAppend<CreateStoreFormData | UpdateStoreFormData, "metadata">;
  remove: UseFieldArrayRemove;
  register: UseFormRegister<CreateStoreFormData | UpdateStoreFormData>;
  formErrors: FieldErrors<CreateStoreFormData | UpdateStoreFormData>;
  loading: boolean;
  isSubmitting: boolean;
}

export const MetadataSection: React.FC<MetadataSectionProps> = ({
  fields,
  append,
  remove,
  register,
  formErrors,
  loading,
  isSubmitting,
}) => {
  const addMetadataEntry = () => {
    append({ key: '', value: '' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className={getLabelClassName('normal')}>
          Metadata
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addMetadataEntry}
          disabled={loading || isSubmitting}
          className="text-xs sm:text-sm"
        >
          <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
          Add Metadata
        </Button>
      </div>

      {fields.length === 0 && (
        <p className="text-xs sm:text-sm text-muted-foreground">
          No metadata entries. Click "Add Metadata" to add key-value pairs.
        </p>
      )}

      {formErrors.metadata && (
        <p className="text-xs sm:text-sm text-destructive">
          {formErrors.metadata.message}
        </p>
      )}

      {fields.map((field, index) => (
        <MetadataEntry
          key={field.id}
          index={index}
          register={register}
          formErrors={formErrors}
          remove={remove}
          loading={loading}
          isSubmitting={isSubmitting}
        />
      ))}
    </div>
  );
};
