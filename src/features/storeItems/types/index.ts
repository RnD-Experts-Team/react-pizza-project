// types/pizza.types.ts

/**
 * Base interface for API responses with common fields
 * This ensures consistent error handling and response structure
 */
export interface BaseApiResponse {
  /** HTTP status code or custom status indicator */
  status?: number;
  /** Error message if the request failed */
  error?: string;
  /** Additional metadata about the response */
  metadata?: Record<string, unknown>;
}

/**
 * Represents a single menu item from the pizza shop
 * Contains the core item information returned by the API
 */
export interface MenuItem {
  /** Unique identifier for the menu item */
  item_id: string;
  /** Display name of the menu item */
  menu_item_name: string;
}

/**
 * Response structure for the DSPR items endpoint
 * Extends BaseApiResponse for consistent error handling
 */
export interface PizzaStoreItemsResponse extends BaseApiResponse {
  /** Store identifier that was queried */
  store: string;
  /** Total number of items available for this store */
  count: number;
  /** Array of menu items available at this store */
  items: MenuItem[];
}

/**
 * Loading states for async operations
 * Used across different slices for consistent state management
 */
export const LOADING_STATES = {
  IDLE: 'idle',
  PENDING: 'pending',
  FULFILLED: 'fulfilled',
  REJECTED: 'rejected',
} as const;

/**
 * Type representing the current loading state of async operations
 */
export type LoadingState = typeof LOADING_STATES[keyof typeof LOADING_STATES];

/**
 * Generic error class for API failures
 * Provides detailed error information for better debugging
 * Using a class instead of interface to work with verbatimModuleSyntax
 */
export class ApiError extends Error {
  /** HTTP status code */
  public status?: number;
  /** Error code for programmatic handling */
  public code?: string;
  /** Additional error details */
  public details?: Record<string, unknown>;
  /** Timestamp when the error occurred */
  public timestamp: string;

  constructor(
    message: string,
    status?: number,
    code?: string,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();

    // Ensure proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  /**
   * Create an ApiError from an unknown error
   */
  static fromError(error: unknown, defaultMessage = 'An unknown error occurred'): ApiError {
    if (error instanceof ApiError) {
      return error;
    }

    if (error instanceof Error) {
      return new ApiError(error.message);
    }

    if (typeof error === 'string') {
      return new ApiError(error);
    }

    return new ApiError(defaultMessage);
  }

  /**
   * Convert to a plain object for serialization
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      code: this.code,
      details: this.details,
      timestamp: this.timestamp,
    };
  }
}

/**
 * State structure for pizza store items slice
 * Manages loading states, data, and error handling
 */
export interface PizzaStoreItemsState {
  /** Current loading state */
  loadingState: LoadingState;
  /** Store items data by store ID for caching */
  itemsByStore: Record<string, MenuItem[]>;
  /** Store metadata (count, last updated, etc.) */
  storeMetadata: Record<string, {
    count: number;
    lastFetched: string;
    storeId: string;
  }>;
  /** Current error state */
  error: ApiError | null;
  /** Currently selected/active store ID */
  currentStoreId: string | null;
}

/**
 * Parameters for fetching store items
 * Used in thunks and service functions
 */
export interface FetchStoreItemsParams {
  /** Store ID to fetch items for */
  storeId: string;
  /** Optional force refresh flag to bypass cache */
  forceRefresh?: boolean;
}

/**
 * Menu item categories based on naming patterns
 * Helps with filtering and organizing the menu
 */
export const MENU_ITEM_CATEGORIES = {
  PIZZA: 'pizza',
  DEEP_DISH: 'deep_dish',
  STUFFED_CRUST: 'stuffed_crust',
  THIN_CRUST: 'thin_crust',
  BREADSTICKS: 'breadsticks',
  WINGS: 'wings',
  BEVERAGES: 'beverages',
  DESSERTS: 'desserts',
  SIDES: 'sides',
  FEES: 'fees',
  OTHER: 'other',
} as const;

/**
 * Type representing menu item categories
 */
export type MenuItemCategory = typeof MENU_ITEM_CATEGORIES[keyof typeof MENU_ITEM_CATEGORIES];

/**
 * Filtered/processed menu item for display purposes
 * Used when we need to transform API data for UI consumption
 */
export interface ProcessedMenuItem extends MenuItem {
  /** Category derived from item name analysis */
  category?: MenuItemCategory;
  /** Whether this item is currently available */
  isAvailable?: boolean;
  /** Display priority for sorting */
  displayOrder?: number;
}

/**
 * Filter options for menu items
 * Used in UI components for filtering functionality
 */
export interface MenuItemFilter {
  /** Filter by category */
  category?: MenuItemCategory;
  /** Search term for item names */
  searchTerm?: string;
  /** Show only available items */
  availableOnly?: boolean;
}

/**
 * Available sort fields for menu items
 */
export const MENU_ITEM_SORT_FIELDS = {
  NAME: 'menu_item_name',
  ID: 'item_id',
  DISPLAY_ORDER: 'displayOrder',
} as const;

/**
 * Available sort directions
 */
export const SORT_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc',
} as const;

/**
 * Type representing available sort fields
 */
export type MenuItemSortField = typeof MENU_ITEM_SORT_FIELDS[keyof typeof MENU_ITEM_SORT_FIELDS];

/**
 * Type representing sort directions
 */
export type SortDirection = typeof SORT_DIRECTIONS[keyof typeof SORT_DIRECTIONS];

/**
 * Sorting options for menu items
 * Provides flexible sorting capabilities
 */
export interface MenuItemSort {
  /** Field to sort by */
  field: MenuItemSortField;
  /** Sort direction */
  direction: SortDirection;
}

/**
 * Configuration for the pizza store service
 * Allows for flexible API configuration
 */
export interface PizzaStoreConfig {
  /** Base URL for the API */
  baseUrl: string;
  /** Default timeout for requests in milliseconds */
  timeout: number;
  /** Default headers to include with requests */
  defaultHeaders: Record<string, string>;
  /** Whether to enable request/response logging */
  enableLogging: boolean;
}

/**
 * Cache configuration for store items
 * Helps optimize API calls and improve performance
 */
export interface CacheConfig {
  /** How long to cache store items (in milliseconds) */
  itemsCacheDuration: number;
  /** Maximum number of stores to cache */
  maxCachedStores: number;
  /** Whether to persist cache to localStorage */
  persistToStorage: boolean;
}

/**
 * Hook return type for usePizzaStoreItems
 * Provides typed interface for the custom hook
 */
export interface UsePizzaStoreItemsReturn {
  /** Current items for the specified store */
  items: MenuItem[];
  /** Current loading state */
  isLoading: boolean;
  /** Current error state */
  error: ApiError | null;
  /** Function to fetch items for a store */
  fetchItems: (storeId: string, forceRefresh?: boolean) => Promise<void>;
  /** Function to clear current error */
  clearError: () => void;
  /** Function to filter items */
  filterItems: (filter: MenuItemFilter) => MenuItem[];
  /** Function to sort items */
  sortItems: (sort: MenuItemSort) => MenuItem[];
  /** Whether data exists for the current store */
  hasData: boolean;
  /** Metadata for the current store */
  storeMetadata: PizzaStoreItemsState['storeMetadata'][string] | null;
  
  // Additional helper methods
  /** Function to clear items for a specific store */
  clearStoreItems: (storeId: string) => void;
  /** Function to clear all cached items */
  clearAllItems: () => void;
  /** Function to set current store ID */
  setCurrentStoreId: (storeId: string | null) => void;
  /** Function to clear cache for a specific store */
  clearStoreCache: (storeId: string) => Promise<void>;
  /** Function to get enhanced items with category information */
  getEnhancedItems: () => Array<MenuItem & { category: string; isAvailable: boolean }>;
  /** Function to categorize a single menu item */
  categorizeItem: (item: MenuItem) => string;
  
  // State information
  /** Current loading state */
  loadingState: LoadingState;
  /** Currently selected store ID */
  currentStoreId: string | null;
  /** Target store ID being used by the hook */
  targetStoreId: string | null;
}


/**
 * Utility type for async thunk states
 * Provides consistent typing for Redux Toolkit async thunks
 */
export type AsyncThunkState<T> = {
  data: T | null;
  loading: LoadingState;
  error: ApiError | null;
};

/**
 * Type for store validation result
 * Used to validate store IDs before making API calls
 */
export interface StoreValidationResult {
  /** Whether the store ID is valid */
  isValid: boolean;
  /** Error message if invalid */
  error?: string;
  /** Normalized store ID */
  normalizedStoreId?: string;
}

/**
 * Type guard to check if an error is an ApiError
 * Helps with type narrowing in error handling
 */
export const isApiError = (error: unknown): error is ApiError => {
  return error instanceof ApiError;
};

/**
 * Helper function to check if a value is a valid loading state
 */
export const isValidLoadingState = (value: string): value is LoadingState => {
  return Object.values(LOADING_STATES).includes(value as LoadingState);
};

/**
 * Helper function to check if a value is a valid menu item category
 */
export const isValidMenuItemCategory = (value: string): value is MenuItemCategory => {
  return Object.values(MENU_ITEM_CATEGORIES).includes(value as MenuItemCategory);
};

/**
 * Helper function to check if a value is a valid sort field
 */
export const isValidSortField = (value: string): value is MenuItemSortField => {
  return Object.values(MENU_ITEM_SORT_FIELDS).includes(value as MenuItemSortField);
};

/**
 * Helper function to check if a value is a valid sort direction
 */
export const isValidSortDirection = (value: string): value is SortDirection => {
  return Object.values(SORT_DIRECTIONS).includes(value as SortDirection);
};
