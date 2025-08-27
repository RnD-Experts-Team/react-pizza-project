/**
 * Store Management Utilities
 * Collection of utility functions for validation, formatting, filtering,
 * and data transformation for the Store management module.
 */

import type {
  Store,
  CreateStorePayload,
  UpdateStorePayload,
  StoreMetadata,
  PaginationMeta,
} from '../types';

// ============================================================================
// Constants
// ============================================================================

export const STORE_CONSTANTS = {
  // Validation
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,
  MIN_PHONE_LENGTH: 10,
  MAX_PHONE_LENGTH: 20,
  MIN_ADDRESS_LENGTH: 5,
  MAX_ADDRESS_LENGTH: 200,
  
  // UI
  SEARCH_DEBOUNCE_MS: 500,
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
  
  // Store ID format
  STORE_ID_PATTERN: /^STORE_\d{3}$/,
  STORE_ID_FORMAT: 'STORE_XXX',
  
  // Status
  ACTIVE_STATUS: true,
  INACTIVE_STATUS: false,
} as const;

export const STORE_STATUS_LABELS = {
  [STORE_CONSTANTS.ACTIVE_STATUS]: 'Active',
  [STORE_CONSTANTS.INACTIVE_STATUS]: 'Inactive',
} as const;

// ============================================================================
// Validation Utilities
// ============================================================================

/**
 * Store validation utilities
 */
export const storeValidation = {
  /**
   * Validate store name
   */
  validateName: (name: string): { isValid: boolean; error?: string } => {
    if (!name || typeof name !== 'string') {
      return { isValid: false, error: 'Store name is required' };
    }
    
    const trimmedName = name.trim();
    
    if (trimmedName.length < STORE_CONSTANTS.MIN_NAME_LENGTH) {
      return { 
        isValid: false, 
        error: `Store name must be at least ${STORE_CONSTANTS.MIN_NAME_LENGTH} characters` 
      };
    }
    
    if (trimmedName.length > STORE_CONSTANTS.MAX_NAME_LENGTH) {
      return { 
        isValid: false, 
        error: `Store name must not exceed ${STORE_CONSTANTS.MAX_NAME_LENGTH} characters` 
      };
    }
    
    return { isValid: true };
  },

  /**
   * Validate store ID format
   */
  validateStoreId: (id: string): { isValid: boolean; error?: string } => {
    if (!id || typeof id !== 'string') {
      return { isValid: false, error: 'Store ID is required' };
    }
    
    if (!STORE_CONSTANTS.STORE_ID_PATTERN.test(id)) {
      return { 
        isValid: false, 
        error: `Store ID must follow format ${STORE_CONSTANTS.STORE_ID_FORMAT} (e.g., STORE_001)` 
      };
    }
    
    return { isValid: true };
  },

  /**
   * Validate phone number
   */
  validatePhone: (phone: string): { isValid: boolean; error?: string } => {
    if (!phone || typeof phone !== 'string') {
      return { isValid: false, error: 'Phone number is required' };
    }
    
    const cleanPhone = phone.replace(/\D/g, ''); // Remove non-digits
    
    if (cleanPhone.length < STORE_CONSTANTS.MIN_PHONE_LENGTH) {
      return { 
        isValid: false, 
        error: `Phone number must be at least ${STORE_CONSTANTS.MIN_PHONE_LENGTH} digits` 
      };
    }
    
    if (cleanPhone.length > STORE_CONSTANTS.MAX_PHONE_LENGTH) {
      return { 
        isValid: false, 
        error: `Phone number must not exceed ${STORE_CONSTANTS.MAX_PHONE_LENGTH} digits` 
      };
    }
    
    return { isValid: true };
  },

  /**
   * Validate address
   */
  validateAddress: (address: string): { isValid: boolean; error?: string } => {
    if (!address || typeof address !== 'string') {
      return { isValid: false, error: 'Address is required' };
    }
    
    const trimmedAddress = address.trim();
    
    if (trimmedAddress.length < STORE_CONSTANTS.MIN_ADDRESS_LENGTH) {
      return { 
        isValid: false, 
        error: `Address must be at least ${STORE_CONSTANTS.MIN_ADDRESS_LENGTH} characters` 
      };
    }
    
    if (trimmedAddress.length > STORE_CONSTANTS.MAX_ADDRESS_LENGTH) {
      return { 
        isValid: false, 
        error: `Address must not exceed ${STORE_CONSTANTS.MAX_ADDRESS_LENGTH} characters` 
      };
    }
    
    return { isValid: true };
  },

  /**
   * Validate complete store form data
   */
  validateStoreForm: (data: CreateStorePayload | UpdateStorePayload): { 
    isValid: boolean; 
    errors: Record<string, string> 
  } => {
    const errors: Record<string, string> = {};
    
    // Validate name
    const nameValidation = storeValidation.validateName(data.name);
    if (!nameValidation.isValid) {
      errors.name = nameValidation.error!;
    }
    
    // Validate store ID for create operations
    if ('id' in data) {
      const idValidation = storeValidation.validateStoreId(data.id);
      if (!idValidation.isValid) {
        errors.id = idValidation.error!;
      }
    }
    
    // Validate metadata
    if (!data.metadata) {
      errors.metadata = 'Store metadata is required';
    } else {
      // Validate phone
      const phoneValidation = storeValidation.validatePhone(data.metadata.phone);
      if (!phoneValidation.isValid) {
        errors.phone = phoneValidation.error!;
      }
      
      // Validate address
      const addressValidation = storeValidation.validateAddress(data.metadata.address);
      if (!addressValidation.isValid) {
        errors.address = addressValidation.error!;
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  },
};

// ============================================================================
// Formatting Utilities
// ============================================================================

/**
 * Store formatting utilities
 */
export const storeFormatting = {
  /**
   * Format store name for display
   */
  formatDisplayName: (name: string): string => {
    return name.trim().replace(/\s+/g, ' ');
  },

  /**
   * Format store name for API (clean and consistent)
   */
  formatApiName: (name: string): string => {
    return name.trim().replace(/\s+/g, ' ');
  },

  /**
   * Format phone number for display
   */
  formatPhoneDisplay: (phone: string): string => {
    const cleanPhone = phone.replace(/\D/g, '');
    
    if (cleanPhone.length === 10) {
      return `(${cleanPhone.slice(0, 3)}) ${cleanPhone.slice(3, 6)}-${cleanPhone.slice(6)}`;
    }
    
    if (cleanPhone.length === 11 && cleanPhone.startsWith('1')) {
      return `+1 (${cleanPhone.slice(1, 4)}) ${cleanPhone.slice(4, 7)}-${cleanPhone.slice(7)}`;
    }
    
    return phone; // Return original if format doesn't match
  },

  /**
   * Format phone number for API storage
   */
  formatPhoneApi: (phone: string): string => {
    return phone.replace(/\D/g, ''); // Keep only digits
  },

  /**
   * Format address for display
   */
  formatAddressDisplay: (address: string): string => {
    return address.trim().replace(/\s+/g, ' ');
  },

  /**
   * Format date for display
   */
  formatDate: (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  },

  /**
   * Format date with time for display
   */
  formatDateTime: (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  },

  /**
   * Format relative time (e.g., "2 hours ago")
   */
  formatRelativeTime: (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      
      if (diffInSeconds < 60) return 'Just now';
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
      if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
      
      return storeFormatting.formatDate(dateString);
    } catch {
      return dateString;
    }
  },

  /**
   * Format store status for display
   */
  formatStatus: (isActive: boolean): string => {
    return STORE_STATUS_LABELS[isActive];
  },

  /**
   * Format store metadata for display
   */
  formatMetadata: (metadata: StoreMetadata): string => {
    const parts = [];
    
    if (metadata.address) {
      parts.push(`Address: ${storeFormatting.formatAddressDisplay(metadata.address)}`);
    }
    
    if (metadata.phone) {
      parts.push(`Phone: ${storeFormatting.formatPhoneDisplay(metadata.phone)}`);
    }
    
    return parts.join(' | ');
  },
};

// ============================================================================
// Filtering Utilities
// ============================================================================

/**
 * Store filtering utilities
 */
export const storeFiltering = {
  /**
   * Filter stores by search term
   */
  filterBySearch: (stores: Store[], searchTerm: string): Store[] => {
    if (!searchTerm || searchTerm.trim() === '') {
      return stores;
    }
    
    const term = searchTerm.toLowerCase().trim();
    
    return stores.filter(store => 
      store.name.toLowerCase().includes(term) ||
      store.id.toLowerCase().includes(term) ||
      store.metadata.address.toLowerCase().includes(term) ||
      store.metadata.phone.includes(term)
    );
  },

  /**
   * Filter stores by status
   */
  filterByStatus: (stores: Store[], isActive?: boolean): Store[] => {
    if (isActive === undefined) {
      return stores;
    }
    
    return stores.filter(store => store.is_active === isActive);
  },

  /**
   * Filter stores by date range
   */
  filterByDateRange: (
    stores: Store[], 
    startDate?: string, 
    endDate?: string, 
    field: 'created_at' | 'updated_at' = 'created_at'
  ): Store[] => {
    if (!startDate && !endDate) {
      return stores;
    }
    
    return stores.filter(store => {
      const storeDate = new Date(store[field]);
      
      if (startDate && storeDate < new Date(startDate)) {
        return false;
      }
      
      if (endDate && storeDate > new Date(endDate)) {
        return false;
      }
      
      return true;
    });
  },

  /**
   * Apply multiple filters
   */
  applyFilters: (
    stores: Store[], 
    filters: {
      search?: string;
      isActive?: boolean;
      startDate?: string;
      endDate?: string;
      dateField?: 'created_at' | 'updated_at';
    }
  ): Store[] => {
    let filtered = stores;
    
    if (filters.search) {
      filtered = storeFiltering.filterBySearch(filtered, filters.search);
    }
    
    if (filters.isActive !== undefined) {
      filtered = storeFiltering.filterByStatus(filtered, filters.isActive);
    }
    
    if (filters.startDate || filters.endDate) {
      filtered = storeFiltering.filterByDateRange(
        filtered, 
        filters.startDate, 
        filters.endDate, 
        filters.dateField
      );
    }
    
    return filtered;
  },
};

// ============================================================================
// Sorting Utilities
// ============================================================================

export type StoreSortField = 'name' | 'id' | 'created_at' | 'updated_at' | 'is_active';
export type SortDirection = 'asc' | 'desc';

/**
 * Store sorting utilities
 */
export const storeSorting = {
  /**
   * Sort stores by name
   */
  sortByName: (stores: Store[], direction: SortDirection = 'asc'): Store[] => {
    return [...stores].sort((a, b) => {
      const comparison = a.name.localeCompare(b.name);
      return direction === 'asc' ? comparison : -comparison;
    });
  },

  /**
   * Sort stores by ID
   */
  sortById: (stores: Store[], direction: SortDirection = 'asc'): Store[] => {
    return [...stores].sort((a, b) => {
      const comparison = a.id.localeCompare(b.id);
      return direction === 'asc' ? comparison : -comparison;
    });
  },

  /**
   * Sort stores by created date
   */
  sortByCreatedAt: (stores: Store[], direction: SortDirection = 'desc'): Store[] => {
    return [...stores].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      const comparison = dateA - dateB;
      return direction === 'asc' ? comparison : -comparison;
    });
  },

  /**
   * Sort stores by updated date
   */
  sortByUpdatedAt: (stores: Store[], direction: SortDirection = 'desc'): Store[] => {
    return [...stores].sort((a, b) => {
      const dateA = new Date(a.updated_at).getTime();
      const dateB = new Date(b.updated_at).getTime();
      const comparison = dateA - dateB;
      return direction === 'asc' ? comparison : -comparison;
    });
  },

  /**
   * Sort stores by status (active first by default)
   */
  sortByStatus: (stores: Store[], direction: SortDirection = 'desc'): Store[] => {
    return [...stores].sort((a, b) => {
      const comparison = Number(a.is_active) - Number(b.is_active);
      return direction === 'asc' ? comparison : -comparison;
    });
  },

  /**
   * Generic sort function
   */
  sortBy: (stores: Store[], field: StoreSortField, direction: SortDirection = 'asc'): Store[] => {
    switch (field) {
      case 'name':
        return storeSorting.sortByName(stores, direction);
      case 'id':
        return storeSorting.sortById(stores, direction);
      case 'created_at':
        return storeSorting.sortByCreatedAt(stores, direction);
      case 'updated_at':
        return storeSorting.sortByUpdatedAt(stores, direction);
      case 'is_active':
        return storeSorting.sortByStatus(stores, direction);
      default:
        return stores;
    }
  },
};

// ============================================================================
// Data Transformation Utilities
// ============================================================================

/**
 * Store data transformation utilities
 */
export const storeTransformers = {
  /**
   * Transform store to select option format
   */
  toSelectOption: (store: Store) => ({
    value: store.id,
    label: store.name,
    store,
  }),

  /**
   * Transform stores array to select options
   */
  toSelectOptions: (stores: Store[]) => 
    stores.map(storeTransformers.toSelectOption),

  /**
   * Transform store to search result format
   */
  toSearchResult: (store: Store) => ({
    id: store.id,
    title: store.name,
    subtitle: storeFormatting.formatMetadata(store.metadata),
    status: storeFormatting.formatStatus(store.is_active),
    store,
  }),

  /**
   * Transform stores to search results
   */
  toSearchResults: (stores: Store[]) => 
    stores.map(storeTransformers.toSearchResult),

  /**
   * Transform store for form editing
   */
  toFormData: (store: Store) => ({
    id: store.id,
    name: store.name,
    address: store.metadata.address,
    phone: store.metadata.phone,
    is_active: store.is_active,
  }),

  /**
   * Transform form data to create payload
   */
  fromFormDataToCreate: (formData: {
    id: string;
    name: string;
    address: string;
    phone: string;
    is_active: boolean;
  }): CreateStorePayload => ({
    id: formData.id,
    name: storeFormatting.formatApiName(formData.name),
    metadata: {
      address: storeFormatting.formatAddressDisplay(formData.address),
      phone: storeFormatting.formatPhoneApi(formData.phone),
    },
    is_active: formData.is_active,
  }),

  /**
   * Transform form data to update payload
   */
  fromFormDataToUpdate: (formData: {
    name: string;
    address: string;
    phone: string;
    is_active?: boolean;
  }): UpdateStorePayload => ({
    name: storeFormatting.formatApiName(formData.name),
    metadata: {
      address: storeFormatting.formatAddressDisplay(formData.address),
      phone: storeFormatting.formatPhoneApi(formData.phone),
    },
    is_active: formData.is_active,
  }),
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Debounce function for search and other operations
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Generate unique store ID
 */
export const generateStoreId = (existingStores: Store[]): string => {
  const existingNumbers = existingStores
    .map(store => {
      const match = store.id.match(/^STORE_(\d{3})$/);
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter(num => num > 0);
  
  const nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;
  return `STORE_${nextNumber.toString().padStart(3, '0')}`;
};

/**
 * Parse pagination info to readable format
 */
export const parsePaginationInfo = (pagination: PaginationMeta): string => {
  const { from, to, total } = pagination;
  
  if (total === 0) {
    return 'No stores found';
  }
  
  if (total === 1) {
    return '1 store';
  }
  
  return `${from}-${to} of ${total} stores`;
};

/**
 * Calculate pagination range for display
 */
export const calculatePaginationRange = (
  currentPage: number,
  totalPages: number,
  maxVisible: number = 5
): number[] => {
  const half = Math.floor(maxVisible / 2);
  let start = Math.max(1, currentPage - half);
  let end = Math.min(totalPages, start + maxVisible - 1);
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1);
  }
  
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

/**
 * Deep clone utility for immutable updates
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;
  if (Array.isArray(obj)) return obj.map(deepClone) as unknown as T;
  
  const cloned = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  
  return cloned;
};

/**
 * Check if two stores are equal (useful for memoization)
 */
export const areStoresEqual = (store1: Store, store2: Store): boolean => {
  return (
    store1.id === store2.id &&
    store1.name === store2.name &&
    store1.is_active === store2.is_active &&
    store1.metadata.address === store2.metadata.address &&
    store1.metadata.phone === store2.metadata.phone &&
    store1.updated_at === store2.updated_at
  );
};

/**
 * Batch update utility for optimistic updates
 */
export const batchUpdateItems = <T extends { id: string }>(
  items: T[],
  updates: Partial<T>[],
  idField: keyof T = 'id' as keyof T
): T[] => {
  const updateMap = new Map(updates.map(update => [update[idField], update]));
  
  return items.map(item => {
    const update = updateMap.get(item[idField]);
    return update ? { ...item, ...update } : item;
  });
};

// ============================================================================
// Export All Utilities
// ============================================================================

export {
  STORE_STATUS_LABELS,
  type StoreSortField,
  type SortDirection,
};
