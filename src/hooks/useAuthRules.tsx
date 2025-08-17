import { useState, useEffect, useCallback } from 'react';
import type {
  AuthRule,
  AuthRulesResponse,
  CreateAuthRulePathDSLRequest,
  CreateAuthRuleRouteNameRequest,
  TestAuthRuleRequest,
  TestAuthRuleResponse,
  AuthRulesFilters,
  AuthRuleFormData,
} from '../types/authRules';
import authRulesService from '../services/authRulesService';

interface UseAuthRulesReturn {
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

export const useAuthRules = (): UseAuthRulesReturn => {
  const [authRules, setAuthRules] = useState<AuthRule[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<TestAuthRuleResponse['data'] | null>(null);
  const [currentFilters, setCurrentFilters] = useState<AuthRulesFilters>({});
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 15,
  });

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearTestResult = useCallback(() => {
    setTestResult(null);
  }, []);

  const fetchAuthRules = useCallback(async (filters: AuthRulesFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      setCurrentFilters(filters);
      
      const response = await authRulesService.getAllAuthRules(filters);
      
      if (response.success) {
        setAuthRules(response.data.data);
        setPagination({
          currentPage: response.data.current_page,
          lastPage: response.data.last_page,
          total: response.data.total,
          perPage: response.data.per_page,
        });
      } else {
        throw new Error('Failed to fetch auth rules');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching auth rules');
    } finally {
      setLoading(false);
    }
  }, []);

  const createAuthRule = useCallback(async (data: AuthRuleFormData) => {
    try {
      setLoading(true);
      setError(null);

      let response;
      if (data.rule_type === 'path_dsl') {
        const requestData: CreateAuthRulePathDSLRequest = {
          service: data.service,
          method: data.method,
          path_dsl: data.path_dsl!,
          permissions_any: data.permissions_any.length > 0 ? data.permissions_any : undefined,
          permissions_all: data.permissions_all.length > 0 ? data.permissions_all : undefined,
          roles_any: data.roles_any.length > 0 ? data.roles_any : undefined,
          priority: data.priority,
          is_active: data.is_active,
        };
        response = await authRulesService.createAuthRulePathDSL(requestData);
      } else {
        const requestData: CreateAuthRuleRouteNameRequest = {
          service: data.service,
          method: data.method,
          route_name: data.route_name!,
          permissions_any: data.permissions_any.length > 0 ? data.permissions_any : undefined,
          permissions_all: data.permissions_all.length > 0 ? data.permissions_all : undefined,
          roles_any: data.roles_any.length > 0 ? data.roles_any : undefined,
          priority: data.priority,
          is_active: data.is_active,
        };
        response = await authRulesService.createAuthRuleRouteName(requestData);
      }

      if (response.success) {
        // Refresh the rules list
        await fetchAuthRules(currentFilters);
      } else {
        throw new Error('Failed to create auth rule');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while creating auth rule');
      throw err; // Re-throw to allow form handling
    } finally {
      setLoading(false);
    }
  }, [fetchAuthRules, currentFilters]);

  const testAuthRule = useCallback(async (data: TestAuthRuleRequest) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authRulesService.testAuthRule(data);
      
      if (response.success) {
        setTestResult(response.data);
      } else {
        throw new Error('Failed to test auth rule');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while testing auth rule');
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleRuleStatus = useCallback(async (ruleId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authRulesService.toggleAuthRuleStatus(ruleId);
      
      if (response.success) {
        // Update the rule in the current list
        setAuthRules(prevRules => 
          prevRules.map(rule => 
            rule.id === ruleId 
              ? { ...rule, is_active: response.data.rule.is_active }
              : rule
          )
        );
      } else {
        throw new Error('Failed to toggle rule status');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while toggling rule status');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshRules = useCallback(async () => {
    await fetchAuthRules(currentFilters);
  }, [fetchAuthRules, currentFilters]);

  // Initial load
  useEffect(() => {
    fetchAuthRules();
  }, [fetchAuthRules]);

  return {
    authRules,
    loading,
    error,
    pagination,
    testResult,
    fetchAuthRules,
    createAuthRule,
    testAuthRule,
    toggleRuleStatus,
    clearError,
    clearTestResult,
    refreshRules,
  };
};

export default useAuthRules;