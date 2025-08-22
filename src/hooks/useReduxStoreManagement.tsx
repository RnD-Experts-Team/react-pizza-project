import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store';
import type {
  StoreManagementState,
  StoresQueryParams,
  Store,
  StoreUser,
  StoreRole,
  CreateStoreForm,
  UpdateStoreForm
} from '../types/storeManagement';
import {
  fetchStores,
  fetchStoreById,
  createStore,
  updateStore,
  fetchStoreUsers,
  fetchStoreRoles,
  clearError,
  setCurrentStore,
  clearStoreUsers,
  clearStoreRoles
} from '../store/slices/storeManagementSlice';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

interface UseStoreManagementReturn {
  state: StoreManagementState;
  actions: {
    // Store actions
    fetchStores: (params?: StoresQueryParams) => Promise<void>;
    fetchStoreById: (storeId: string) => Promise<Store | null>;
    createStore: (storeData: CreateStoreForm) => Promise<boolean>;
    updateStore: (storeId: string, storeData: UpdateStoreForm) => Promise<boolean>;
    
    // Store users and roles
    fetchStoreUsers: (storeId: string) => Promise<StoreUser[]>;
    fetchStoreRoles: (storeId: string) => Promise<StoreRole[]>;
    
    // Utility actions
    clearError: () => void;
    setCurrentStore: (storeId: string | null) => void;
    clearStoreUsers: () => void;
    clearStoreRoles: () => void;
    setLoading: (loading: boolean) => void;
  };
}

export const useStoreManagement = (): UseStoreManagementReturn => {
  const dispatch = useAppDispatch();
  const state = useAppSelector(state => state.storeManagement);

  // Store actions
  const fetchStoresCb = useCallback(async (params?: StoresQueryParams) => {
    await dispatch(fetchStores(params || {}));
  }, [dispatch]);

  const fetchStoreByIdCb = useCallback(async (storeId: string): Promise<Store | null> => {
    const resultAction = await dispatch(fetchStoreById(storeId));
    if (fetchStoreById.fulfilled.match(resultAction)) {
      return resultAction.payload.data?.store || null;
    }
    return null;
  }, [dispatch]);

  const createStoreCb = useCallback(async (storeData: CreateStoreForm): Promise<boolean> => {
    const resultAction = await dispatch(createStore(storeData));
    return createStore.fulfilled.match(resultAction);
  }, [dispatch]);

  const updateStoreCb = useCallback(async (storeId: string, storeData: UpdateStoreForm): Promise<boolean> => {
    const resultAction = await dispatch(updateStore({ storeId, storeData }));
    return updateStore.fulfilled.match(resultAction);
  }, [dispatch]);

  // Store users and roles
  const fetchStoreUsersCb = useCallback(async (storeId: string): Promise<StoreUser[]> => {
    const resultAction = await dispatch(fetchStoreUsers(storeId));
    if (fetchStoreUsers.fulfilled.match(resultAction)) {
      return resultAction.payload.data?.users || [];
    }
    return [];
  }, [dispatch]);

  const fetchStoreRolesCb = useCallback(async (storeId: string): Promise<StoreRole[]> => {
    const resultAction = await dispatch(fetchStoreRoles(storeId));
    if (fetchStoreRoles.fulfilled.match(resultAction)) {
      return resultAction.payload.data?.roles || [];
    }
    return [];
  }, [dispatch]);

  // Utility actions
  const clearErrorCb = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const setCurrentStoreCb = useCallback((storeId: string | null) => {
    dispatch(setCurrentStore(storeId));
  }, [dispatch]);

  const clearStoreUsersCb = useCallback(() => {
    dispatch(clearStoreUsers());
  }, [dispatch]);

  const clearStoreRolesCb = useCallback(() => {
    dispatch(clearStoreRoles());
  }, [dispatch]);

  const setLoadingCb = useCallback((loading: boolean) => {
    // For consistency with the original hook, we provide this but it's not needed
    // since Redux manages loading state automatically through async thunks
    console.warn('setLoading is not needed with Redux - loading state is managed automatically');
  }, []);

  return {
    state,
    actions: {
      // Store actions
      fetchStores: fetchStoresCb,
      fetchStoreById: fetchStoreByIdCb,
      createStore: createStoreCb,
      updateStore: updateStoreCb,
      
      // Store users and roles
      fetchStoreUsers: fetchStoreUsersCb,
      fetchStoreRoles: fetchStoreRolesCb,
      
      // Utility actions
      clearError: clearErrorCb,
      setCurrentStore: setCurrentStoreCb,
      clearStoreUsers: clearStoreUsersCb,
      clearStoreRoles: clearStoreRolesCb,
      setLoading: setLoadingCb
    }
  };
};

export default useStoreManagement;