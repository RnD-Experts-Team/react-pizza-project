import { z } from 'zod';
import type { StoreMetadata } from '@/features/stores/types';

// ============================================================================
// Zod Schema Definitions
// ============================================================================

/**
 * Metadata entry schema for key-value pairs
 */
const metadataEntrySchema = z.object({
  key: z.string().min(1, 'Key is required').min(2, 'Key must be at least 2 characters'),
  value: z.string().min(1, 'Value is required'),
});

/**
 * Base store form schema with common fields
 */
const baseStoreSchema = z.object({
  name: z.string().min(1, 'Store name is required').min(2, 'Store name must be at least 2 characters'),
  is_active: z.boolean(),
  metadata: z.array(metadataEntrySchema).refine(
    (entries) => {
      const keys = entries.map(entry => entry.key.toLowerCase());
      return keys.length === new Set(keys).size;
    },
    { message: 'Duplicate metadata keys are not allowed' }
  ),
});

/**
 * Schema for creating a new store
 */
export const createStoreSchema = baseStoreSchema.extend({
  id: z.string().min(1, 'Store ID is required').min(3, 'Store ID must be at least 3 characters'),
});

/**
 * Schema for updating an existing store
 */
export const updateStoreSchema = baseStoreSchema.extend({
  id: z.string().min(1, 'Store ID is required'),
});

// ============================================================================
// TypeScript Types
// ============================================================================

/**
 * Form data type for creating a store
 */
export type CreateStoreFormData = z.infer<typeof createStoreSchema>;

/**
 * Form data type for updating a store
 */
export type UpdateStoreFormData = z.infer<typeof updateStoreSchema>;

/**
 * Metadata entry interface for form handling
 */
export interface MetadataEntry {
  key: string;
  value: string;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Converts Store metadata object to form metadata array
 */
export const convertMetadataToArray = (metadata: StoreMetadata): MetadataEntry[] => {
  return Object.entries(metadata).map(([key, value]) => ({
    key,
    value: String(value),
  }));
};

/**
 * Converts form metadata array to Store metadata object
 */
export const convertArrayToMetadata = (metadataArray: MetadataEntry[]): StoreMetadata => {
  return metadataArray.reduce((acc, { key, value }) => {
    if (key.trim() && value.trim()) {
      acc[key.trim()] = value.trim();
    }
    return acc;
  }, {} as StoreMetadata);
};

// ============================================================================
// Tailwind Classes
// ============================================================================

export const inputClasses = {
  base: "w-full bg-background text-foreground border-input focus:ring-ring",
  error: "border-destructive focus:ring-destructive",
  small: "text-xs sm:text-sm",
  normal: "text-sm sm:text-base"
};

export const labelClasses = {
  base: "font-medium text-foreground",
  small: "text-xs sm:text-sm",
  normal: "text-sm sm:text-base"
};

export const buttonClasses = {
  responsive: "text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
};

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Helper function to get input classes with error state
 */
export const getInputClassName = (hasError: boolean, size: 'small' | 'normal' = 'normal') => {
  return `${inputClasses.base} ${inputClasses[size]} ${hasError ? inputClasses.error : ''}`;
};

/**
 * Helper function to get label classes
 */
export const getLabelClassName = (size: 'small' | 'normal' = 'normal') => {
  return `${labelClasses.base} ${labelClasses[size]}`;
};
