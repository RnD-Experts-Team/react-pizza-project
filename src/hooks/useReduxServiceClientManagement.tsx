import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import type {
  ServiceClientManagementState,
  ServiceClientsQueryParams,
  CreateServiceClientForm,
  RotateTokenForm,
  TokenDisplayData,
} from '../types/serviceClient';
import {
  fetchServiceClients,
  createServiceClient,
  rotateServiceToken,
  toggleServiceStatus,
  clearError,
  setLoading,
} from '../store/slices/serviceClientSlice';

interface UseReduxServiceClientManagementReturn {
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

export const useReduxServiceClientManagement = (): UseReduxServiceClientManagementReturn => {
  const dispatch = useDispatch<AppDispatch>();
  const state = useSelector((state: RootState) => state.serviceClient);

  // Fetch service clients with pagination and search
  const fetchServiceClientsAction = useCallback(async (params: ServiceClientsQueryParams = {}) => {
    await dispatch(fetchServiceClients(params));
  }, [dispatch]);

  // Create a new service client
  const createServiceClientAction = useCallback(async (data: CreateServiceClientForm): Promise<TokenDisplayData | null> => {
    try {
      const result = await dispatch(createServiceClient(data));
      
      if (createServiceClient.fulfilled.match(result)) {
        return {
          token: result.payload.token,
          serviceClient: result.payload.service,
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error creating service client:', error);
      return null;
    }
  }, [dispatch]);

  // Rotate service client token
  const rotateServiceTokenAction = useCallback(async (id: number, data: RotateTokenForm): Promise<TokenDisplayData | null> => {
    try {
      const result = await dispatch(rotateServiceToken({ id, data }));
      
      if (rotateServiceToken.fulfilled.match(result)) {
        return {
          token: result.payload.token,
          serviceClient: result.payload.service,
        };
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error rotating service token:', error);
      return null;
    }
  }, [dispatch]);

  // Toggle service client status
  const toggleServiceStatusAction = useCallback(async (id: number): Promise<boolean> => {
    try {
      const result = await dispatch(toggleServiceStatus(id));
      return toggleServiceStatus.fulfilled.match(result);
    } catch (error) {
      console.error('Error toggling service status:', error);
      return false;
    }
  }, [dispatch]);

  // Clear error
  const clearErrorAction = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Set loading
  const setLoadingAction = useCallback((loading: boolean) => {
    dispatch(setLoading(loading));
  }, [dispatch]);

  return {
    state,
    actions: {
      fetchServiceClients: fetchServiceClientsAction,
      createServiceClient: createServiceClientAction,
      rotateServiceToken: rotateServiceTokenAction,
      toggleServiceStatus: toggleServiceStatusAction,
      clearError: clearErrorAction,
      setLoading: setLoadingAction,
    },
  };
};

export default useReduxServiceClientManagement;
