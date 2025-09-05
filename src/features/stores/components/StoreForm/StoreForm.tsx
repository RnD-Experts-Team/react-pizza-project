/**
 * StoreForm Component
 * Reusable form component for creating and editing stores
 * Uses React Hook Form with Zod validation for optimal performance and type safety
 * ############
 */

import React, { useEffect, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import type {
  Store,
  CreateStorePayload,
  UpdateStorePayload,
} from '@/features/stores/types';

// Import schemas and utilities
import {
  createStoreSchema,
  updateStoreSchema,
  convertMetadataToArray,
  convertArrayToMetadata,
  type CreateStoreFormData,
  type UpdateStoreFormData,
  type MetadataEntry,
} from '@/features/stores/utils/StoreFormUtils';

// Import sub-components
import { StoreFormHeader } from '@/features/stores/components/StoreForm/StoreFormHeader';
import { StoreIdField } from '@/features/stores/components/StoreForm/StoreIdField';
import { StoreNameField } from '@/features/stores/components/StoreForm/StoreNameField';
import { MetadataSection } from '@/features/stores/components/StoreForm/MetadataSection';
import { ActiveStatusField } from '@/features/stores/components/StoreForm/ActiveStatusField';
import { FormActions } from '@/features/stores/components/StoreForm/FormActions';

/**
 * Props interface for the StoreForm component
 */
interface StoreFormProps {
  mode: 'create' | 'edit';
  initialData?: Store;
  onSubmit: (data: CreateStorePayload | UpdateStorePayload) => Promise<void>;
  loading?: boolean;
  error?: string | null;
}

export const StoreForm: React.FC<StoreFormProps> = ({
  mode,
  initialData,
  onSubmit,
  loading = false,
  error,
}) => {
  // Determine schema and default values based on mode
  const schema = mode === 'create' ? createStoreSchema : updateStoreSchema;
  
  const defaultValues = useMemo(() => {
    if (mode === 'edit' && initialData) {
      return {
        id: initialData.id,
        name: initialData.name,
        is_active: initialData.is_active,
        metadata: convertMetadataToArray(initialData.metadata || {}),
      };
    }
    
    return {
      ...(mode === 'create' && { id: '' }),
      name: '',
      is_active: true,
      metadata: [] as MetadataEntry[],
    };
  }, [mode, initialData]);

  // Initialize React Hook Form
  const {
    control,
    register,
    handleSubmit,
    formState: { errors: formErrors, isSubmitting },
    reset,
  } = useForm<CreateStoreFormData | UpdateStoreFormData>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onBlur',
  });

  // Field array for metadata management
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'metadata',
  });

  // Reset form when initialData changes
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      reset({
        id: initialData.id,
        name: initialData.name,
        is_active: initialData.is_active,
        metadata: convertMetadataToArray(initialData.metadata || {}),
      });
    }
  }, [mode, initialData, reset]);

  // Form submission handler
  const onFormSubmit = async (data: CreateStoreFormData | UpdateStoreFormData) => {
    try {
      const metadata = convertArrayToMetadata(data.metadata);

      if (mode === 'create') {
        const payload: CreateStorePayload = {
          id: (data as CreateStoreFormData).id,
          name: data.name,
          metadata,
          is_active: data.is_active,
        };
        await onSubmit(payload);
      } else {
        const payload: UpdateStorePayload = {
          name: data.name,
          metadata,
          is_active: data.is_active,
        };
        await onSubmit(payload);
      }
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <div className="w-full">
      <StoreFormHeader mode={mode} />

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 sm:space-y-6">
        <StoreIdField
          mode={mode}
          initialData={initialData}
          register={register}
          formErrors={formErrors}
        />

        <StoreNameField
          register={register}
          formErrors={formErrors}
        />

        <MetadataSection
          fields={fields}
          append={append}
          remove={remove}
          register={register}
          formErrors={formErrors}
          loading={loading}
          isSubmitting={isSubmitting}
        />

        <ActiveStatusField
          control={control}
        />

        <FormActions
          mode={mode}
          loading={loading}
          isSubmitting={isSubmitting}
        />
      </form>
    </div>
  );
};

export default StoreForm;
