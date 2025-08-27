// src/features/serviceClients/hooks/useServiceClients.ts

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store'; // Adjust path to your store types
import type {
  UseServiceClientsReturn,
  CreateServiceClientRequest,
  RotateTokenRequest,
  GetServiceClientsParams,
  ServiceClient,
} from '../types';
import {
  fetchServiceClients,
  createServiceClient,
  rotateServiceToken,
  toggleServiceStatus,
  selectClient,
  clearErrors,
  clearLastCreatedToken,
  selectServiceClients,
  selectPagination,
  selectLoadingStates,
  selectErrorStates,
  selectSelectedClient,
  selectLastCreatedToken,
} from '../store/serviceClientsSlice';

/**
 * Custom hook for managing service clients
 * Provides a clean interface for all service client operations
 * 
 * @returns Object containing state and action functions
 */
export const useServiceClients = (): UseServiceClientsReturn => {
  const dispatch = useDispatch<AppDispatch>();

  // Select state from Redux store
  const clients = useSelector((state: RootState) => selectServiceClients(state));
  const pagination = useSelector((state: RootState) => selectPagination(state));
  const loading = useSelector((state: RootState) => selectLoadingStates(state));
  const errors = useSelector((state: RootState) => selectErrorStates(state));
  const selectedClient = useSelector((state: RootState) => selectSelectedClient(state));
  const lastCreatedToken = useSelector((state: RootState) => selectLastCreatedToken(state));

  /**
   * Fetch service clients with optional parameters
   * 
   * @param params - Optional query parameters for pagination and search
   */
  const fetchClients = useCallback(
    async (params?: GetServiceClientsParams): Promise<void> => {
      try {
        await dispatch(fetchServiceClients(params)).unwrap();
      } catch (error) {
        // Error is already handled in the slice and stored in state
        console.error('Failed to fetch service clients:', error);
      }
    },
    [dispatch]
  );

  /**
   * Create a new service client
   * 
   * @param data - Service client data
   * @returns Promise resolving to the new token or null if failed
   */
  const createClient = useCallback(
    async (data: CreateServiceClientRequest): Promise<string | null> => {
      try {
        const result = await dispatch(createServiceClient(data)).unwrap();
        return result.token;
      } catch (error) {
        // Error is already handled in the slice and stored in state
        console.error('Failed to create service client:', error);
        return null;
      }
    },
    [dispatch]
  );

  /**
   * Rotate a service client's token
   * 
   * @param clientId - ID of the service client
   * @param data - Optional token rotation data (e.g., expiration date)
   * @returns Promise resolving to the new token or null if failed
   */
  const rotateToken = useCallback(
    async (clientId: number, data?: RotateTokenRequest): Promise<string | null> => {
      try {
        const result = await dispatch(rotateServiceToken({ clientId, data })).unwrap();
        return result.token;
      } catch (error) {
        // Error is already handled in the slice and stored in state
        console.error('Failed to rotate service token:', error);
        return null;
      }
    },
    [dispatch]
  );

  /**
   * Toggle a service client's active status
   * 
   * @param clientId - ID of the service client
   * @returns Promise resolving to true if successful, false if failed
   */
  const toggleStatus = useCallback(
    async (clientId: number): Promise<boolean> => {
      try {
        await dispatch(toggleServiceStatus(clientId)).unwrap();
        return true;
      } catch (error) {
        // Error is already handled in the slice and stored in state
        console.error('Failed to toggle service status:', error);
        return false;
      }
    },
    [dispatch]
  );

  /**
   * Select a service client for detailed view or operations
   * 
   * @param client - Service client to select or null to clear selection
   */
  const selectClientAction = useCallback(
    (client: ServiceClient | null): void => {
      dispatch(selectClient(client));
    },
    [dispatch]
  );

  /**
   * Clear all error states
   */
  const clearAllErrors = useCallback((): void => {
    dispatch(clearErrors());
  }, [dispatch]);

  /**
   * Clear the last created token (for security)
   */
  const clearToken = useCallback((): void => {
    dispatch(clearLastCreatedToken());
  }, [dispatch]);

  // Return the complete hook interface
  return {
    // State
    clients,
    pagination,
    loading,
    errors,
    selectedClient,
    lastCreatedToken,
    
    // Actions
    fetchClients,
    createClient,
    rotateToken,
    toggleStatus,
    selectClient: selectClientAction,
    clearErrors: clearAllErrors,
    clearLastCreatedToken: clearToken,
  };
};

/**
 * Hook for getting a specific service client by ID
 * Useful for detail views or when you need a specific client
 * 
 * @param clientId - ID of the service client to retrieve
 * @returns ServiceClient object or undefined if not found
 */
export const useServiceClient = (clientId: number): ServiceClient | undefined => {
  return useSelector((state: RootState) => 
    selectServiceClients(state).find(client => client.id === clientId)
  );
};

/**
 * Hook for checking if any service client operation is in progress
 * Useful for showing global loading states
 * 
 * @returns Boolean indicating if any operation is loading
 */
export const useServiceClientsLoading = (): boolean => {
  return useSelector((state: RootState) => {
    const loading = selectLoadingStates(state);
    return loading.fetching || loading.creating || loading.rotating || loading.toggling;
  });
};

/**
 * Hook for checking if there are any service client errors
 * Useful for showing global error states
 * 
 * @returns Boolean indicating if there are any errors
 */
export const useServiceClientsErrors = (): boolean => {
  return useSelector((state: RootState) => {
    const errors = selectErrorStates(state);
    return !!(errors.fetch || errors.create || errors.rotate || errors.toggle);
  });
};

/**
 * Hook for getting the current pagination state
 * Useful for pagination components
 * 
 * @returns Pagination metadata or null if not available
 */
export const useServiceClientsPagination = () => {
  return useSelector((state: RootState) => selectPagination(state));
};

/**
 * Hook for getting service clients with built-in search and filtering
 * Provides client-side filtering when server-side search is not sufficient
 * 
 * @param searchTerm - Optional search term to filter clients
 * @returns Filtered array of service clients
 */
export const useFilteredServiceClients = (searchTerm?: string): ServiceClient[] => {
  return useSelector((state: RootState) => {
    const clients = selectServiceClients(state);
    
    if (!searchTerm || searchTerm.trim() === '') {
      return clients;
    }
    
    const lowercaseSearch = searchTerm.toLowerCase();
    return clients.filter(client =>
      client.name.toLowerCase().includes(lowercaseSearch) ||
      client.notes.toLowerCase().includes(lowercaseSearch)
    );
  });
};

/**
 * Hook for getting service clients grouped by status
 * Useful for dashboard views or status-based filtering
 * 
 * @returns Object containing active and inactive clients
 */
export const useServiceClientsByStatus = (): {
  active: ServiceClient[];
  inactive: ServiceClient[];
} => {
  return useSelector((state: RootState) => {
    const clients = selectServiceClients(state);
    
    return {
      active: clients.filter(client => client.is_active),
      inactive: clients.filter(client => !client.is_active),
    };
  });
};

/**
 * Hook for getting service clients sorted by various criteria
 * Provides client-side sorting capabilities
 * 
 * @param sortBy - Field to sort by
 * @param sortOrder - Sort order (asc or desc)
 * @returns Sorted array of service clients
 */
export const useSortedServiceClients = (
  sortBy: keyof ServiceClient = 'created_at',
  sortOrder: 'asc' | 'desc' = 'desc'
): ServiceClient[] => {
  return useSelector((state: RootState) => {
    const clients = selectServiceClients(state);
    
    return [...clients].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Handle null values
      if (aValue === null && bValue === null) return 0;
      if (aValue === null) return sortOrder === 'asc' ? -1 : 1;
      if (bValue === null) return sortOrder === 'asc' ? 1 : -1;
      
      // Handle different data types
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) {
        return sortOrder === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });
  });
};

// Export default hook for convenience
export default useServiceClients;
