import { useState, useCallback } from 'react';
import type {
  ServiceClient,
  ServiceClientManagementState,
  ServiceClientsQueryParams,
  CreateServiceClientForm,
  RotateTokenForm,
  PaginationMeta,
  TokenDisplayData,
} from '../types/serviceClient';
import { serviceClientService } from '../services/serviceClientService';

interface UseServiceClientManagementReturn {
  state: ServiceClientManagementState;
  actions: {
    // Service Client actions
    fetchServiceClients: (params?: ServiceClientsQueryParams) => Promise<void>;
    createServiceClient: (data: CreateServiceClientForm) => Promise<TokenDisplayData | null>;
    rotateServiceToken: (id: number, data: RotateTokenForm) => Promise<TokenDisplayData | null>;
    toggleServiceStatus: (id: number) => Promise<boolean>;
    
    // Utility actions
    clearError: () => void;
    setLoading: (loading: boolean) => void;
  };
}

export const useServiceClientManagement = (): UseServiceClientManagementReturn => {
  const [state, setState] = useState<ServiceClientManagementState>({
    serviceClients: [],
    loading: false,
    error: null,
    pagination: null,
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, loading }));
  }, []);

  const setError = useCallback((error: string | null) => {
    setState(prev => ({ ...prev, error, loading: false }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Fetch service clients with pagination and search
  const fetchServiceClients = useCallback(async (params: ServiceClientsQueryParams = {}) => {
    try {
      setLoading(true);
      clearError();
      const response = await serviceClientService.getServiceClients(params);
      
      if (response.success && response.data) {
        const { data: serviceClients, ...pagination } = response.data;
        setState(prev => ({
          ...prev,
          serviceClients,
          pagination,
          loading: false,
        }));
      } else {
        setError(response.message || 'Failed to fetch service clients');
      }
    } catch (error: any) {
      console.error('Error fetching service clients:', error);
      setError(error.response?.data?.message || 'Failed to fetch service clients');
    }
  }, [setLoading, clearError, setError]);

  // Create a new service client
  const createServiceClient = useCallback(async (data: CreateServiceClientForm): Promise<TokenDisplayData | null> => {
    try {
      setLoading(true);
      clearError();
      const response = await serviceClientService.createServiceClient(data);
      
      if (response.success && response.data) {
        // Add the new service client to the list
        setState(prev => ({
          ...prev,
          serviceClients: [response.data!.service, ...prev.serviceClients],
          loading: false,
        }));
        
        return {
          token: response.data.token,
          serviceClient: response.data.service,
        };
      } else {
        setError(response.message || 'Failed to create service client');
        return null;
      }
    } catch (error: any) {
      console.error('Error creating service client:', error);
      setError(error.response?.data?.message || 'Failed to create service client');
      return null;
    }
  }, [setLoading, clearError, setError]);

  // Rotate service client token
  const rotateServiceToken = useCallback(async (id: number, data: RotateTokenForm): Promise<TokenDisplayData | null> => {
    try {
      setLoading(true);
      clearError();
      const response = await serviceClientService.rotateServiceToken(id, data);
      
      if (response.success && response.data) {
        // Update the service client in the list
        setState(prev => ({
          ...prev,
          serviceClients: prev.serviceClients.map(client => 
            client.id === id ? response.data!.service : client
          ),
          loading: false,
        }));
        
        return {
          token: response.data.token,
          serviceClient: response.data.service,
        };
      } else {
        setError(response.message || 'Failed to rotate service token');
        return null;
      }
    } catch (error: any) {
      console.error('Error rotating service token:', error);
      setError(error.response?.data?.message || 'Failed to rotate service token');
      return null;
    }
  }, [setLoading, clearError, setError]);

  // Toggle service client status
  const toggleServiceStatus = useCallback(async (id: number): Promise<boolean> => {
    try {
      setLoading(true);
      clearError();
      const response = await serviceClientService.toggleServiceStatus(id);
      
      if (response.success && response.data) {
        // Update the service client in the list
        setState(prev => ({
          ...prev,
          serviceClients: prev.serviceClients.map(client => 
            client.id === id ? response.data!.service : client
          ),
          loading: false,
        }));
        
        return true;
      } else {
        setError(response.message || 'Failed to toggle service status');
        return false;
      }
    } catch (error: any) {
      console.error('Error toggling service status:', error);
      setError(error.response?.data?.message || 'Failed to toggle service status');
      return false;
    }
  }, [setLoading, clearError, setError]);

  return {
    state,
    actions: {
      fetchServiceClients,
      createServiceClient,
      rotateServiceToken,
      toggleServiceStatus,
      clearError,
      setLoading,
    },
  };
};

export default useServiceClientManagement;