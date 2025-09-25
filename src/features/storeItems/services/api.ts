// services/pizzaStore.service.ts

import axios, {
  type AxiosInstance,
  type AxiosResponse,
  AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios';
import {
  type PizzaStoreItemsResponse,
  ApiError,
  type PizzaStoreConfig,
  type CacheConfig,
  type StoreValidationResult,
  isApiError,
} from '../types';

/**
 * Default configuration for the pizza store service
 * Can be overridden during service initialization
 */
const DEFAULT_CONFIG: PizzaStoreConfig = {
  baseUrl: 'https://testapipizza.pnefoods.com/api',
  timeout: 10000, // 10 seconds
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  enableLogging: process.env.NODE_ENV === 'development',
};

/**
 * Default cache configuration
 * Optimizes API calls and improves performance
 */
const DEFAULT_CACHE_CONFIG: CacheConfig = {
  itemsCacheDuration: 5 * 60 * 1000, // 5 minutes
  maxCachedStores: 10,
  persistToStorage: true,
};

/**
 * Interface for cached store data
 * Used internally for caching mechanism
 */
interface CachedStoreData {
  data: PizzaStoreItemsResponse;
  timestamp: number;
  storeId: string;
}

/**
 * Pizza Store Service Class
 * Handles all API interactions for pizza store data
 * Implements caching, error handling, and request/response interceptors
 */
export class PizzaStoreService {
  private axiosInstance: AxiosInstance;
  private config: PizzaStoreConfig;
  private cacheConfig: CacheConfig;
  private cache: Map<string, CachedStoreData> = new Map();
  private abortControllers: Map<string, AbortController> = new Map();

  /**
   * Initialize the pizza store service
   * @param config - Optional configuration overrides
   * @param cacheConfig - Optional cache configuration overrides
   */
  constructor(
    config: Partial<PizzaStoreConfig> = {},
    cacheConfig: Partial<CacheConfig> = {}
  ) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.cacheConfig = { ...DEFAULT_CACHE_CONFIG, ...cacheConfig };
    
    this.axiosInstance = this.createAxiosInstance();
    this.setupInterceptors();
    this.initializeCache();
  }

  /**
   * Create and configure the Axios instance
   * Sets up base configuration and default headers
   */
  private createAxiosInstance(): AxiosInstance {
    const instance = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: this.config.defaultHeaders,
    });

    return instance;
  }

  /**
   * Setup request and response interceptors
   * Handles logging, error transformation, and request enhancement
   */
  private setupInterceptors(): void {
    // Request interceptor
    this.axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        // Add timestamp to prevent caching issues
        if (config.params) {
          config.params._t = Date.now();
        } else {
          config.params = { _t: Date.now() };
        }

        // Log request in development
        if (this.config.enableLogging) {
          console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
            params: config.params,
            headers: config.headers,
          });
        }

        return config;
      },
      (error: AxiosError) => {
        if (this.config.enableLogging) {
          console.error('[API Request Error]', error);
        }
        return Promise.reject(this.transformError(error));
      }
    );

    // Response interceptor
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Log response in development
        if (this.config.enableLogging) {
          console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
            status: response.status,
            data: response.data,
          });
        }

        return response;
      },
      (error: AxiosError) => {
        if (this.config.enableLogging) {
          console.error('[API Response Error]', error);
        }
        return Promise.reject(this.transformError(error));
      }
    );
  }

  /**
   * Initialize cache from localStorage if persistence is enabled
   */
  private initializeCache(): void {
    if (!this.cacheConfig.persistToStorage) return;

    try {
      const cachedData = localStorage.getItem('pizzaStoreCache');
      if (cachedData) {
        const parsed = JSON.parse(cachedData) as Record<string, CachedStoreData>;
        Object.entries(parsed).forEach(([key, value]) => {
          // Only load non-expired cache entries
          if (this.isCacheValid(value.timestamp)) {
            this.cache.set(key, value);
          }
        });
      }
    } catch (error) {
      console.warn('Failed to load cache from localStorage:', error);
    }
  }

  /**
   * Persist cache to localStorage
   */
  private persistCache(): void {
    if (!this.cacheConfig.persistToStorage) return;

    try {
      const cacheObject = Object.fromEntries(this.cache.entries());
      localStorage.setItem('pizzaStoreCache', JSON.stringify(cacheObject));
    } catch (error) {
      console.warn('Failed to persist cache to localStorage:', error);
    }
  }

  /**
   * Check if cached data is still valid
   * @param timestamp - Cache timestamp to validate
   */
  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.cacheConfig.itemsCacheDuration;
  }

  /**
   * Transform Axios errors into standardized ApiError format
   * @param error - Axios error to transform
   */
  private transformError(error: AxiosError): ApiError {
    if (error.response) {
      // Server responded with error status
      const message = this.extractErrorMessage(error.response.data) || error.message;
      return new ApiError(
        message,
        error.response.status,
        `HTTP_${error.response.status}`,
        {
          statusText: error.response.statusText,
          data: error.response.data,
        }
      );
    } else if (error.request) {
      // Request was made but no response received
      return new ApiError(
        'Network error - please check your connection',
        0,
        'NETWORK_ERROR'
      );
    } else {
      // Something else happened
      return new ApiError(
        error.message || 'Request setup error',
        undefined,
        'REQUEST_ERROR'
      );
    }
  }

  /**
   * Extract error message from various error response formats
   * @param data - Response data that might contain error information
   */
  private extractErrorMessage(data: unknown): string {
    if (typeof data === 'string') return data;
    if (typeof data === 'object' && data !== null) {
      const errorObj = data as Record<string, unknown>;
      return (
        (errorObj.message as string) ||
        (errorObj.error as string) ||
        (errorObj.detail as string) ||
        ''
      );
    }
    return '';
  }

  /**
   * Validate store ID format and structure
   * @param storeId - Store ID to validate
   */
  private validateStoreId(storeId: string): StoreValidationResult {
    if (!storeId || typeof storeId !== 'string') {
      return {
        isValid: false,
        error: 'Store ID is required and must be a string',
      };
    }

    const trimmedStoreId = storeId.trim();
    if (trimmedStoreId.length === 0) {
      return {
        isValid: false,
        error: 'Store ID cannot be empty',
      };
    }

    // Basic format validation (adjust pattern as needed)
    const storeIdPattern = /^[\w-]+$/;
    if (!storeIdPattern.test(trimmedStoreId)) {
      return {
        isValid: false,
        error: 'Store ID contains invalid characters',
      };
    }

    return {
      isValid: true,
      normalizedStoreId: trimmedStoreId,
    };
  }

  /**
   * Clean up expired cache entries
   */
  private cleanupCache(): void {
    const expiredKeys: string[] = [];

    this.cache.forEach((value, key) => {
      if (!this.isCacheValid(value.timestamp)) {
        expiredKeys.push(key);
      }
    });

    expiredKeys.forEach(key => this.cache.delete(key));

    // Limit cache size
    if (this.cache.size > this.cacheConfig.maxCachedStores) {
      const sortedEntries = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp);
      
      const entriesToRemove = sortedEntries.slice(0, this.cache.size - this.cacheConfig.maxCachedStores);
      entriesToRemove.forEach(([key]) => this.cache.delete(key));
    }

    this.persistCache();
  }

  /**
   * Cancel ongoing request for a specific store
   * @param storeId - Store ID to cancel request for
   */
  public cancelRequest(storeId: string): void {
    const controller = this.abortControllers.get(storeId);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(storeId);
    }
  }

  /**
   * Fetch items for a specific pizza store
   * @param storeId - Store ID to fetch items for
   * @param forceRefresh - Whether to bypass cache and force fresh data
   * @returns Promise resolving to store items response
   */
  public async fetchStoreItems(
    storeId: string,
    forceRefresh = false
  ): Promise<PizzaStoreItemsResponse> {
    // Validate store ID
    const validation = this.validateStoreId(storeId);
    if (!validation.isValid) {
      throw new ApiError(validation.error || 'Invalid store ID', 400, 'INVALID_STORE_ID');
    }

    const normalizedStoreId = validation.normalizedStoreId!;

    // Check cache first (unless force refresh is requested)
    if (!forceRefresh) {
      const cachedData = this.cache.get(normalizedStoreId);
      if (cachedData && this.isCacheValid(cachedData.timestamp)) {
        if (this.config.enableLogging) {
          console.log(`[Cache Hit] Store items for ${normalizedStoreId}`);
        }
        return cachedData.data;
      }
    }

    // Cancel any existing request for this store
    this.cancelRequest(normalizedStoreId);

    // Create new abort controller
    const abortController = new AbortController();
    this.abortControllers.set(normalizedStoreId, abortController);

    try {
      const response = await this.axiosInstance.get<PizzaStoreItemsResponse>(
        `/dspr-items/${normalizedStoreId}`,
        {
          signal: abortController.signal,
        }
      );

      // Validate response structure
      if (!response.data || typeof response.data !== 'object') {
        throw new ApiError('Invalid response format from server', 500, 'INVALID_RESPONSE');
      }

      const responseData = response.data;

      // Basic response validation
      if (!responseData.store || !Array.isArray(responseData.items)) {
        throw new ApiError('Response missing required fields', 500, 'MISSING_FIELDS');
      }

      // Cache the successful response
      const cacheEntry: CachedStoreData = {
        data: responseData,
        timestamp: Date.now(),
        storeId: normalizedStoreId,
      };

      this.cache.set(normalizedStoreId, cacheEntry);
      this.cleanupCache();

      return responseData;
    } catch (error) {
      // Don't throw errors for cancelled requests
      if (axios.isCancel(error)) {
        throw new ApiError('Request was cancelled', 0, 'REQUEST_CANCELLED');
      }

      // Re-throw if it's already an ApiError
      if (isApiError(error)) {
        throw error;
      }

      // Transform and throw unknown errors
      throw this.transformError(error as AxiosError);
    } finally {
      // Clean up abort controller
      this.abortControllers.delete(normalizedStoreId);
    }
  }

  /**
   * Clear all cached data
   */
  public clearCache(): void {
    this.cache.clear();
    if (this.cacheConfig.persistToStorage) {
      localStorage.removeItem('pizzaStoreCache');
    }
  }

  /**
   * Clear cache for a specific store
   * @param storeId - Store ID to clear cache for
   */
  public clearStoreCache(storeId: string): void {
    const validation = this.validateStoreId(storeId);
    if (validation.isValid && validation.normalizedStoreId) {
      this.cache.delete(validation.normalizedStoreId);
      this.persistCache();
    }
  }

  /**
   * Get cache statistics for debugging
   */
  public getCacheStats(): {
    size: number;
    entries: Array<{ storeId: string; timestamp: number; age: number }>;
  } {
    const now = Date.now();
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.values()).map(entry => ({
        storeId: entry.storeId,
        timestamp: entry.timestamp,
        age: now - entry.timestamp,
      })),
    };
  }

  /**
   * Update service configuration
   * @param newConfig - Partial configuration to update
   */
  public updateConfig(newConfig: Partial<PizzaStoreConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // Recreate axios instance with new config
    this.axiosInstance = this.createAxiosInstance();
    this.setupInterceptors();
  }

  /**
   * Get current service configuration
   */
  public getConfig(): PizzaStoreConfig {
    return { ...this.config };
  }
}

/**
 * Create and export a default instance of the pizza store service
 * Can be imported and used directly throughout the application
 */
export const pizzaStoreService = new PizzaStoreService();

/**
 * Export the service class for custom instantiation
 * Useful for testing or when different configurations are needed
 */
export default PizzaStoreService;
