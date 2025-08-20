import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import type {
  AuthRule,
  TestAuthRuleRequest,
  TestAuthRuleResponse,
  AuthRulesFilters,
  AuthRuleFormData,
} from '../types/authRules';
import {
  fetchAuthRules,
  createAuthRule,
  testAuthRule,
  toggleRuleStatus,
  clearError,
  clearTestResult,
} from '../store/slices/authRulesSlice';

interface UseReduxAuthRulesReturn {
  // State
  authRules: AuthRule[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    lastPage: number;
    total: number;
    perPage: number;
  };
  testResult: TestAuthRuleResponse['data'] | null;
  
  // Actions
  fetchAuthRules: (filters?: AuthRulesFilters) => Promise<void>;
  createAuthRule: (data: AuthRuleFormData) => Promise<void>;
  testAuthRule: (data: TestAuthRuleRequest) => Promise<void>;
  toggleRuleStatus: (ruleId: number) => Promise<void>;
  clearError: () => void;
  clearTestResult: () => void;
  refreshRules: () => Promise<void>;
}

export const useReduxAuthRules = (): UseReduxAuthRulesReturn => {
  const dispatch = useDispatch<AppDispatch>();
  
  const {
    authRules,
    loading,
    error,
    pagination,
    testResult,
    currentFilters,
  } = useSelector((state: RootState) => state.authRules);

  const handleFetchAuthRules = useCallback(
    async (filters: AuthRulesFilters = {}) => {
      await dispatch(fetchAuthRules(filters)).unwrap();
    },
    [dispatch]
  );

  const handleCreateAuthRule = useCallback(
    async (data: AuthRuleFormData) => {
      await dispatch(createAuthRule(data)).unwrap();
    },
    [dispatch]
  );

  const handleTestAuthRule = useCallback(
    async (data: TestAuthRuleRequest) => {
      await dispatch(testAuthRule(data)).unwrap();
    },
    [dispatch]
  );

  const handleToggleRuleStatus = useCallback(
    async (ruleId: number) => {
      await dispatch(toggleRuleStatus(ruleId)).unwrap();
    },
    [dispatch]
  );

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleClearTestResult = useCallback(() => {
    dispatch(clearTestResult());
  }, [dispatch]);

  const refreshRules = useCallback(async () => {
    await dispatch(fetchAuthRules(currentFilters)).unwrap();
  }, [dispatch, currentFilters]);

  return {
    authRules,
    loading,
    error,
    pagination,
    testResult,
    fetchAuthRules: handleFetchAuthRules,
    createAuthRule: handleCreateAuthRule,
    testAuthRule: handleTestAuthRule,
    toggleRuleStatus: handleToggleRuleStatus,
    clearError: handleClearError,
    clearTestResult: handleClearTestResult,
    refreshRules,
  };
};

export default useReduxAuthRules;
