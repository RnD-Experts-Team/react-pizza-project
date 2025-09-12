/**
 * Employee Management Custom Hook
 * 
 * This file provides a comprehensive React hook that encapsulates all employee-related
 * state management and operations, providing a clean interface for components.
 */

import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store'; // Adjust path based on your store setup
import {
  // Async thunks
  fetchAllEmployees,
  fetchEmployeeById,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  fetchEmployeesByStore,
  attachSkill,
  updateSkill,
  detachSkill,
  // Sync actions
  clearCurrentEmployee,
  clearError,
  clearAllErrors,
  updateCacheStatus,
  setPaginationOptions,
  optimisticDeleteEmployee,
  // Selectors
  selectEmployees,
  selectCurrentEmployee,
  selectLoading,
  selectErrors,
  selectPagination,
  selectCache,
  selectIsLoading,
  selectHasErrors,
} from '../store/employeesSlice';
import type {
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  AttachSkillRequest,
  UpdateSkillRequest,
  PaginationOptions,
  UseEmployeesReturn,
  Employee,
  EmployeesState,
} from '../types';

// ============================================================================
// Hook Implementation
// ============================================================================

/**
 * Custom hook for managing employee operations
 * 
 * Provides a complete interface for employee CRUD operations, pagination,
 * skill management, and state management with proper error handling and loading states.
 * 
 * @returns UseEmployeesReturn object with state and actions
 */
export const useEmployees = (): UseEmployeesReturn => {
  const dispatch = useDispatch<AppDispatch>();

  // ========================================================================
  // State Selectors
  // ========================================================================

  const employees = useSelector((state: RootState) => selectEmployees(state));
  const currentEmployee = useSelector((state: RootState) => selectCurrentEmployee(state));
  const loading = useSelector((state: RootState) => selectLoading(state));
  const errors = useSelector((state: RootState) => selectErrors(state));
  const pagination = useSelector((state: RootState) => selectPagination(state));
  const cache = useSelector((state: RootState) => selectCache(state));
  const isLoading = useSelector((state: RootState) => selectIsLoading(state));
  const hasErrors = useSelector((state: RootState) => selectHasErrors(state));

  // ========================================================================
  // Core CRUD Operations
  // ========================================================================

  /**
   * Fetch all employees
   */
  const fetchAllEmployeesAction = useCallback(async (): Promise<void> => {
    try {
      await dispatch(fetchAllEmployees()).unwrap();
    } catch (error) {
      // Error is already handled by the slice
      console.error('Failed to fetch all employees:', error);
    }
  }, [dispatch]);

  /**
   * Fetch employee by ID
   */
  const fetchEmployeeByIdAction = useCallback(async (id: number): Promise<void> => {
    try {
      await dispatch(fetchEmployeeById(id)).unwrap();
    } catch (error) {
      console.error(`Failed to fetch employee ${id}:`, error);
    }
  }, [dispatch]);

  /**
   * Create new employee
   */
  const createEmployeeAction = useCallback(async (
    data: CreateEmployeeRequest
  ): Promise<Employee | null> => {
    try {
      const result = await dispatch(createEmployee(data)).unwrap();
      return result as Employee;
    } catch (error) {
      console.error('Failed to create employee:', error);
      return null;
    }
  }, [dispatch]);

  /**
   * Update existing employee
   */
  const updateEmployeeAction = useCallback(async (
    id: number,
    data: UpdateEmployeeRequest
  ): Promise<Employee | null> => {
    try {
      const result = await dispatch(updateEmployee({ id, data })).unwrap();
      return result.data as Employee;
    } catch (error) {
      console.error(`Failed to update employee ${id}:`, error);
      return null;
    }
  }, [dispatch]);

  /**
   * Delete employee with optimistic update
   */
  const deleteEmployeeAction = useCallback(async (id: number): Promise<boolean> => {
    try {
      // Optimistic update for immediate UI feedback
      dispatch(optimisticDeleteEmployee(id));
      
      await dispatch(deleteEmployee(id)).unwrap();
      return true;
    } catch (error) {
      console.error(`Failed to delete employee ${id}:`, error);
      // Note: In a real app, you might want to revert the optimistic update here
      // by refetching the data or restoring the employee to the list
      return false;
    }
  }, [dispatch]);

  // ========================================================================
  // Store-specific Operations with Pagination
  // ========================================================================

  /**
   * Fetch employees by store with pagination support
   */
  const fetchEmployeesByStoreAction = useCallback(async (
    storeId: string,
    options?: PaginationOptions
  ): Promise<void> => {
    try {
      await dispatch(fetchEmployeesByStore({ storeId, options })).unwrap();
    } catch (error) {
      console.error(`Failed to fetch employees for store ${storeId}:`, error);
    }
  }, [dispatch]);

  // ========================================================================
  // Pagination Control Methods
  // ========================================================================

  /**
   * Change items per page and reset to first page
   */
  const changePerPage = useCallback(async (perPage: number): Promise<void> => {
    if (!pagination.currentStoreId) {
      console.warn('Cannot change per page: no current store selected');
      return;
    }

    // Update pagination state
    dispatch(setPaginationOptions({ perPage, currentPage: 1 }));

    // Refetch with new per_page setting
    await fetchEmployeesByStoreAction(pagination.currentStoreId, {
      page: 1,
      per_page: perPage,
    });
  }, [dispatch, pagination.currentStoreId, fetchEmployeesByStoreAction]);

  /**
   * Navigate to specific page
   */
  const goToPage = useCallback(async (page: number): Promise<void> => {
    if (!pagination.currentStoreId) {
      console.warn('Cannot navigate to page: no current store selected');
      return;
    }

    if (page < 1 || page > pagination.totalPages) {
      console.warn(`Invalid page number: ${page}. Valid range: 1-${pagination.totalPages}`);
      return;
    }

    // Update pagination state
    dispatch(setPaginationOptions({ currentPage: page }));

    // Refetch with new page
    await fetchEmployeesByStoreAction(pagination.currentStoreId, {
      page,
      per_page: pagination.perPage,
    });
  }, [dispatch, pagination.currentStoreId, pagination.totalPages, pagination.perPage, fetchEmployeesByStoreAction]);

  /**
   * Navigate to next page
   */
  const nextPage = useCallback(async (): Promise<void> => {
    if (pagination.hasNextPage) {
      await goToPage(pagination.currentPage + 1);
    }
  }, [pagination.hasNextPage, pagination.currentPage, goToPage]);

  /**
   * Navigate to previous page
   */
  const prevPage = useCallback(async (): Promise<void> => {
    if (pagination.hasPrevPage) {
      await goToPage(pagination.currentPage - 1);
    }
  }, [pagination.hasPrevPage, pagination.currentPage, goToPage]);

  // ========================================================================
  // Skill Management Operations
  // ========================================================================

  /**
   * Attach skill to employee
   */
  const attachSkillAction = useCallback(async (
    employeeId: number,
    skillId: number,
    data: AttachSkillRequest
  ): Promise<boolean> => {
    try {
      await dispatch(attachSkill({ employeeId, skillId, data })).unwrap();
      
      // Refetch employee data to get updated skills
      await fetchEmployeeByIdAction(employeeId);
      
      return true;
    } catch (error) {
      console.error(`Failed to attach skill ${skillId} to employee ${employeeId}:`, error);
      return false;
    }
  }, [dispatch, fetchEmployeeByIdAction]);

  /**
   * Update employee skill rating
   */
  const updateSkillAction = useCallback(async (
    employeeId: number,
    skillId: number,
    data: UpdateSkillRequest
  ): Promise<boolean> => {
    try {
      await dispatch(updateSkill({ employeeId, skillId, data })).unwrap();
      return true;
    } catch (error) {
      console.error(`Failed to update skill ${skillId} for employee ${employeeId}:`, error);
      return false;
    }
  }, [dispatch]);

  /**
   * Detach skill from employee
   */
  const detachSkillAction = useCallback(async (
    employeeId: number,
    skillId: number
  ): Promise<boolean> => {
    try {
      await dispatch(detachSkill({ employeeId, skillId })).unwrap();
      return true;
    } catch (error) {
      console.error(`Failed to detach skill ${skillId} from employee ${employeeId}:`, error);
      return false;
    }
  }, [dispatch]);

  // ========================================================================
  // Utility Methods
  // ========================================================================

  /**
   * Clear current employee selection
   */
  const clearCurrentEmployeeAction = useCallback((): void => {
    dispatch(clearCurrentEmployee());
  }, [dispatch]);

  /**
   * Clear specific error
   */
  const clearErrorAction = useCallback((errorType: keyof EmployeesState['errors']): void => {
    dispatch(clearError(errorType));
  }, [dispatch]);

  /**
   * Clear all errors
   */
  const clearAllErrorsAction = useCallback((): void => {
    dispatch(clearAllErrors());
  }, [dispatch]);

  /**
   * Refresh current employees data
   */
  const refreshEmployees = useCallback(async (): Promise<void> => {
    if (pagination.currentStoreId) {
      // Refresh store employees with current pagination
      await fetchEmployeesByStoreAction(pagination.currentStoreId, {
        page: pagination.currentPage,
        per_page: pagination.perPage,
      });
    } else {
      // Refresh all employees
      await fetchAllEmployeesAction();
    }
  }, [
    pagination.currentStoreId,
    pagination.currentPage,
    pagination.perPage,
    fetchEmployeesByStoreAction,
    fetchAllEmployeesAction,
  ]);

  // ========================================================================
  // Cache Management
  // ========================================================================

  /**
   * Check if data is stale and needs refresh
   */
  const checkCacheStatus = useCallback((): void => {
    dispatch(updateCacheStatus());
  }, [dispatch]);

  /**
   * Auto-refresh stale data on mount or when cache becomes stale
   */
  useEffect(() => {
    checkCacheStatus();
    
    if (cache.isStale && employees.length === 0) {
      // Auto-fetch data if cache is stale and no data is loaded
      fetchAllEmployeesAction();
    }
  }, [cache.isStale, employees.length, checkCacheStatus, fetchAllEmployeesAction]);

  // ========================================================================
  // Memoized Computed Values
  // ========================================================================

  /**
   * Memoized pagination info for UI display
   */
  const paginationInfo = useMemo(() => ({
    ...pagination,
    isFirstPage: pagination.currentPage === 1,
    isLastPage: pagination.currentPage === pagination.totalPages,
    totalPagesArray: Array.from({ length: pagination.totalPages }, (_, i) => i + 1),
    startRecord: ((pagination.currentPage - 1) * pagination.perPage) + 1,
    endRecord: Math.min(pagination.currentPage * pagination.perPage, pagination.totalRecords),
  }), [pagination]);

  /**
   * Memoized loading status summary
   */
  const loadingStatus = useMemo(() => ({
    ...loading,
    isAnyLoading: isLoading,
    activeOperations: Object.entries(loading)
      .filter(([, state]) => state.isLoading)
      .map(([operation, state]) => ({ operation, description: state.operation })),
  }), [loading, isLoading]);

  /**
   * Memoized error status summary
   */
  const errorStatus = useMemo(() => ({
    ...errors,
    hasAnyError: hasErrors,
    activeErrors: Object.entries(errors)
      .filter(([, state]) => state.hasError)
      .map(([operation, state]) => ({ operation, message: state.message, details: state.details })),
  }), [errors, hasErrors]);

  // ========================================================================
  // Return Hook Interface
  // ========================================================================

  return {
    // State
    employees,
    currentEmployee,
    loading: loadingStatus,
    errors: errorStatus,
    pagination: paginationInfo,

    // Actions
    actions: {
      // Core CRUD operations
      fetchAllEmployees: fetchAllEmployeesAction,
      fetchEmployeeById: fetchEmployeeByIdAction,
      createEmployee: createEmployeeAction,
      updateEmployee: updateEmployeeAction,
      deleteEmployee: deleteEmployeeAction,

      // Store-specific operations with pagination
      fetchEmployeesByStore: fetchEmployeesByStoreAction,

      // Pagination control methods
      changePerPage,
      goToPage,
      nextPage,
      prevPage,

      // Skill management operations
      attachSkill: attachSkillAction,
      updateSkill: updateSkillAction,
      detachSkill: detachSkillAction,

      // Utility methods
      clearCurrentEmployee: clearCurrentEmployeeAction,
      clearError: clearErrorAction,
      clearAllErrors: clearAllErrorsAction,
      refreshEmployees,
    },
  };
};

// ============================================================================
// Additional Utility Hooks
// ============================================================================

/**
 * Hook for accessing specific employee by ID
 */
export const useEmployee = (id: number) => {
  const { employees, currentEmployee, actions } = useEmployees();
  
  const employee = useMemo(() => {
    return employees.find(emp => emp.id === id) || 
           (currentEmployee?.id === id ? currentEmployee : null);
  }, [employees, currentEmployee, id]);

  const fetchEmployee = useCallback(() => {
    return actions.fetchEmployeeById(id);
  }, [actions, id]);

  return {
    employee,
    fetchEmployee,
    isLoading: useSelector((state: RootState) => state.employees.loading.fetchById.isLoading),
    error: useSelector((state: RootState) => state.employees.errors.fetchById),
  };
};

/**
 * Hook for employees filtered by status
 */
export const useEmployeesByStatus = (status: string) => {
  const { employees } = useEmployees();
  
  const filteredEmployees = useMemo(() => {
    return employees.filter(employee => employee.status === status);
  }, [employees, status]);

  return {
    employees: filteredEmployees,
    count: filteredEmployees.length,
  };
};

/**
 * Hook for store-specific employee management
 */
export const useStoreEmployees = (storeId: string) => {
  const hook = useEmployees();
  
  const fetchStoreEmployees = useCallback((options?: PaginationOptions) => {
    return hook.actions.fetchEmployeesByStore(storeId, options);
  }, [hook.actions, storeId]);

  const storeEmployees = useMemo(() => {
    return hook.employees.filter(emp => emp.store_id === storeId);
  }, [hook.employees, storeId]);

  return {
    ...hook,
    storeEmployees,
    fetchStoreEmployees,
    isCurrentStore: hook.pagination.currentStoreId === storeId,
  };
};

export default useEmployees;
