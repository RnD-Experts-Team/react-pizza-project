/**
 * Employee Management Redux Slice
 * 
 * This file contains the Redux Toolkit slice for managing employee state,
 * including async thunks for all API operations, proper error handling,
 * and optimistic updates where appropriate.
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type {  PayloadAction } from '@reduxjs/toolkit';
import { EmployeeApiService } from '../services/api';
import {
  DEFAULT_PAGINATION,
  DEFAULT_CACHE_DURATION,
  isValidationError,
  isAuthError,
  isNetworkError,
} from '../types';
import type {
  Employee,
  EmployeesState,
  CreateEmployeeRequest,
  UpdateEmployeeRequest,
  AttachSkillRequest,
  UpdateSkillRequest,
  PaginationOptions,
  ApiErrorType,
  AuthError,
  NetworkError,
} from '../types';

// ============================================================================
// Initial State
// ============================================================================

const initialState: EmployeesState = {
  employees: [],
  currentEmployee: null,
  loading: {
    fetchAll: { isLoading: false },
    fetchById: { isLoading: false },
    create: { isLoading: false },
    update: { isLoading: false },
    delete: { isLoading: false },
    skills: { isLoading: false },
    fetchByStore: { isLoading: false },
  },
  errors: {
    fetchAll: { hasError: false },
    fetchById: { hasError: false },
    create: { hasError: false },
    update: { hasError: false },
    delete: { hasError: false },
    skills: { hasError: false },
    fetchByStore: { hasError: false },
  },
  pagination: { ...DEFAULT_PAGINATION },
  cache: {
    lastFetch: null,
    cacheDuration: DEFAULT_CACHE_DURATION,
    isStale: false,
  },
};

// ============================================================================
// Async Thunks
// ============================================================================

/**
 * Fetch all employees
 */
export const fetchAllEmployees = createAsyncThunk(
  'employees/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await EmployeeApiService.getAllEmployees();
      return response;
    } catch (error) {
      return rejectWithValue(error as ApiErrorType);
    }
  }
);

/**
 * Fetch employee by ID
 */
export const fetchEmployeeById = createAsyncThunk(
  'employees/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await EmployeeApiService.getEmployeeById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error as ApiErrorType);
    }
  }
);

/**
 * Create new employee
 */
export const createEmployee = createAsyncThunk(
  'employees/create',
  async (employeeData: CreateEmployeeRequest, { rejectWithValue }) => {
    try {
      const response = await EmployeeApiService.createEmployee(employeeData);
      return response;
    } catch (error) {
      return rejectWithValue(error as ApiErrorType);
    }
  }
);

/**
 * Update existing employee
 */
export const updateEmployee = createAsyncThunk(
  'employees/update',
  async ({ id, data }: { id: number; data: UpdateEmployeeRequest }, { rejectWithValue }) => {
    try {
      const response = await EmployeeApiService.updateEmployee(id, data);
      return { id, data: response };
    } catch (error) {
      return rejectWithValue(error as ApiErrorType);
    }
  }
);

/**
 * Delete employee
 */
export const deleteEmployee = createAsyncThunk(
  'employees/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await EmployeeApiService.deleteEmployee(id);
      return id;
    } catch (error) {
      return rejectWithValue(error as ApiErrorType);
    }
  }
);

/**
 * Fetch employees by store with pagination
 */
export const fetchEmployeesByStore = createAsyncThunk(
  'employees/fetchByStore',
  async (
    { storeId, options }: { storeId: string; options?: PaginationOptions },
    { rejectWithValue }
  ) => {
    try {
      const response = await EmployeeApiService.getEmployeesByStore(storeId, options);
      return { storeId, response, options };
    } catch (error) {
      return rejectWithValue(error as ApiErrorType);
    }
  }
);

/**
 * Attach skill to employee
 */
export const attachSkill = createAsyncThunk(
  'employees/attachSkill',
  async (
    { employeeId, skillId, data }: { employeeId: number; skillId: number; data: AttachSkillRequest },
    { rejectWithValue }
  ) => {
    try {
      await EmployeeApiService.attachSkill(employeeId, skillId, data);
      return { employeeId, skillId, rating: data.rating };
    } catch (error) {
      return rejectWithValue(error as ApiErrorType);
    }
  }
);

/**
 * Update employee skill rating
 */
export const updateSkill = createAsyncThunk(
  'employees/updateSkill',
  async (
    { employeeId, skillId, data }: { employeeId: number; skillId: number; data: UpdateSkillRequest },
    { rejectWithValue }
  ) => {
    try {
      await EmployeeApiService.updateSkill(employeeId, skillId, data);
      return { employeeId, skillId, rating: data.rating };
    } catch (error) {
      return rejectWithValue(error as ApiErrorType);
    }
  }
);

/**
 * Detach skill from employee
 */
export const detachSkill = createAsyncThunk(
  'employees/detachSkill',
  async (
    { employeeId, skillId }: { employeeId: number; skillId: number },
    { rejectWithValue }
  ) => {
    try {
      await EmployeeApiService.detachSkill(employeeId, skillId);
      return { employeeId, skillId };
    } catch (error) {
      return rejectWithValue(error as ApiErrorType);
    }
  }
);

// ============================================================================
// Helper Functions
// ============================================================================
/**
 * Parse API error for user-friendly display
 */
const parseErrorMessage = (error: ApiErrorType): string => {
  if (isValidationError(error)) {
    const firstFieldErrors = Object.values(error.errors)[0];
    return firstFieldErrors?.[0] || error.message;
  }
  
  if (isAuthError(error)) {
    switch (error.type) {
      case 'UNAUTHORIZED':
        return 'Please log in to continue';
      case 'FORBIDDEN':
        return 'You do not have permission to perform this action';
      case 'TOKEN_EXPIRED':
        return 'Your session has expired. Please log in again';
      default:
        // Type assertion to access message property
        return (error as AuthError).message;
    }
  }
  
  if (isNetworkError(error)) {
    switch (error.type) {
      case 'NETWORK_ERROR':
        return 'Network error. Please check your connection';
      case 'TIMEOUT':
        return 'Request timed out. Please try again';
      case 'CONNECTION_FAILED':
        return 'Unable to connect to server';
      default:
        // Type assertion to access message property
        return (error as NetworkError).message;
    }
  }
  
  // Handle remaining error types (ServerError, GenericError)
  return (error as ApiErrorType).message || 'An unexpected error occurred';
};

/**
 * Update pagination state from API response
 */
const updatePaginationState = (
  state: EmployeesState,
  response: any,
  storeId?: string
) => {
  if (response && typeof response === 'object' && 'current_page' in response) {
    state.pagination = {
      currentPage: response.current_page,
      totalPages: response.last_page,
      totalRecords: response.total,
      perPage: response.per_page,
      hasNextPage: response.next_page_url !== null,
      hasPrevPage: response.prev_page_url !== null,
      availablePerPageOptions: state.pagination.availablePerPageOptions,
      currentStoreId: storeId,
    };
  }
};

/**
 * Set error state helper
 */
const setErrorState = (
  state: EmployeesState,
  errorType: keyof EmployeesState['errors'],
  error: ApiErrorType
) => {
  state.errors[errorType] = {
    hasError: true,
    message: parseErrorMessage(error),
    details: error,
  };
};

/**
 * Clear error state helper
 */
const clearErrorState = (
  state: EmployeesState,
  errorType: keyof EmployeesState['errors']
) => {
  state.errors[errorType] = {
    hasError: false,
    message: undefined,
    details: undefined,
  };
};

/**
 * Set loading state helper
 */
const setLoadingState = (
  state: EmployeesState,
  loadingType: keyof EmployeesState['loading'],
  isLoading: boolean,
  operation?: string
) => {
  state.loading[loadingType] = {
    isLoading,
    operation,
  };
};

// ============================================================================
// Redux Slice
// ============================================================================

const employeesSlice = createSlice({
  name: 'employees',
  initialState,
  reducers: {
    /**
     * Clear current employee selection
     */
    clearCurrentEmployee: (state) => {
      state.currentEmployee = null;
    },

    /**
     * Clear specific error
     */
    clearError: (state, action: PayloadAction<keyof EmployeesState['errors']>) => {
      clearErrorState(state, action.payload);
    },

    /**
     * Clear all errors
     */
    clearAllErrors: (state) => {
      Object.keys(state.errors).forEach((errorType) => {
        clearErrorState(state, errorType as keyof EmployeesState['errors']);
      });
    },

    /**
     * Update cache staleness
     */
    updateCacheStatus: (state) => {
      const now = Date.now();
      state.cache.isStale = state.cache.lastFetch 
        ? (now - state.cache.lastFetch) > state.cache.cacheDuration
        : true;
    },

    /**
     * Set pagination parameters
     */
    setPaginationOptions: (
      state,
      action: PayloadAction<Partial<EmployeesState['pagination']>>
    ) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload,
      };
    },

    /**
     * Optimistic employee update (for UI responsiveness)
     */
    optimisticUpdateEmployee: (
      state,
      action: PayloadAction<{ id: number; updates: Partial<Employee> }>
    ) => {
      const { id, updates } = action.payload;
      const employeeIndex = state.employees.findIndex(emp => emp.id === id);
      
      if (employeeIndex !== -1) {
        state.employees[employeeIndex] = {
          ...state.employees[employeeIndex],
          ...updates,
        };
      }

      if (state.currentEmployee?.id === id) {
        state.currentEmployee = {
          ...state.currentEmployee,
          ...updates,
        };
      }
    },

    /**
     * Optimistic employee deletion (for UI responsiveness)
     */
    optimisticDeleteEmployee: (state, action: PayloadAction<number>) => {
      const id = action.payload;
      state.employees = state.employees.filter(emp => emp.id !== id);
      
      if (state.currentEmployee?.id === id) {
        state.currentEmployee = null;
      }
      
      // Update pagination totals
      state.pagination.totalRecords = Math.max(0, state.pagination.totalRecords - 1);
    },
  },

  extraReducers: (builder) => {
    // ========================================================================
    // Fetch All Employees
    // ========================================================================
    builder
      .addCase(fetchAllEmployees.pending, (state) => {
        setLoadingState(state, 'fetchAll', true, 'Fetching all employees');
        clearErrorState(state, 'fetchAll');
      })
      .addCase(fetchAllEmployees.fulfilled, (state, action) => {
        setLoadingState(state, 'fetchAll', false);
        state.employees = action.payload;
        state.cache.lastFetch = Date.now();
        state.cache.isStale = false;
      })
      .addCase(fetchAllEmployees.rejected, (state, action) => {
        setLoadingState(state, 'fetchAll', false);
        setErrorState(state, 'fetchAll', action.payload as ApiErrorType);
      });

    // ========================================================================
    // Fetch Employee By ID
    // ========================================================================
    builder
      .addCase(fetchEmployeeById.pending, (state) => {
        setLoadingState(state, 'fetchById', true, 'Fetching employee details');
        clearErrorState(state, 'fetchById');
      })
      .addCase(fetchEmployeeById.fulfilled, (state, action) => {
        setLoadingState(state, 'fetchById', false);
        state.currentEmployee = action.payload;
        
        // Update employee in the list if it exists
        const employeeIndex = state.employees.findIndex(emp => emp.id === action.payload.id);
        if (employeeIndex !== -1) {
          state.employees[employeeIndex] = action.payload;
        }
      })
      .addCase(fetchEmployeeById.rejected, (state, action) => {
        setLoadingState(state, 'fetchById', false);
        setErrorState(state, 'fetchById', action.payload as ApiErrorType);
        state.currentEmployee = null;
      });

    // ========================================================================
    // Create Employee
    // ========================================================================
    builder
      .addCase(createEmployee.pending, (state) => {
        setLoadingState(state, 'create', true, 'Creating new employee');
        clearErrorState(state, 'create');
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        setLoadingState(state, 'create', false);
        
        // Note: We don't automatically add to employees list since it might be filtered
        // The UI should refetch or navigate after successful creation
        
        // Update pagination totals if we're viewing a relevant store
        if (state.pagination.currentStoreId === action.payload.store_id) {
          state.pagination.totalRecords += 1;
        }
      })
      .addCase(createEmployee.rejected, (state, action) => {
        setLoadingState(state, 'create', false);
        setErrorState(state, 'create', action.payload as ApiErrorType);
      });

    // ========================================================================
    // Update Employee
    // ========================================================================
    builder
      .addCase(updateEmployee.pending, (state) => {
        setLoadingState(state, 'update', true, 'Updating employee');
        clearErrorState(state, 'update');
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        setLoadingState(state, 'update', false);
        
        const { id, data } = action.payload;
        
        // Update employee in the list
        const employeeIndex = state.employees.findIndex(emp => emp.id === id);
        if (employeeIndex !== -1) {
          state.employees[employeeIndex] = {
            ...state.employees[employeeIndex],
            ...data,
          };
        }

        // Update current employee if it's the same one
        if (state.currentEmployee?.id === id) {
          state.currentEmployee = {
            ...state.currentEmployee,
            ...data,
          };
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        setLoadingState(state, 'update', false);
        setErrorState(state, 'update', action.payload as ApiErrorType);
      });

    // ========================================================================
    // Delete Employee
    // ========================================================================
    builder
      .addCase(deleteEmployee.pending, (state) => {
        setLoadingState(state, 'delete', true, 'Deleting employee');
        clearErrorState(state, 'delete');
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        setLoadingState(state, 'delete', false);
        
        const deletedId = action.payload;
        
        // Remove employee from the list
        state.employees = state.employees.filter(emp => emp.id !== deletedId);
        
        // Clear current employee if it's the deleted one
        if (state.currentEmployee?.id === deletedId) {
          state.currentEmployee = null;
        }
        
        // Update pagination totals
        state.pagination.totalRecords = Math.max(0, state.pagination.totalRecords - 1);
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        setLoadingState(state, 'delete', false);
        setErrorState(state, 'delete', action.payload as ApiErrorType);
      });

    // ========================================================================
    // Fetch Employees By Store
    // ========================================================================
    builder
      .addCase(fetchEmployeesByStore.pending, (state) => {
        setLoadingState(state, 'fetchByStore', true, 'Fetching store employees');
        clearErrorState(state, 'fetchByStore');
      })
      .addCase(fetchEmployeesByStore.fulfilled, (state, action) => {
        setLoadingState(state, 'fetchByStore', false);
        
        const { storeId, response } = action.payload;
        
        // Update employees list with paginated data
        state.employees = response.data;
        
        // Update pagination state
        updatePaginationState(state, response, storeId);
        
        // Update cache
        state.cache.lastFetch = Date.now();
        state.cache.isStale = false;
      })
      .addCase(fetchEmployeesByStore.rejected, (state, action) => {
        setLoadingState(state, 'fetchByStore', false);
        setErrorState(state, 'fetchByStore', action.payload as ApiErrorType);
      });

    // ========================================================================
    // Attach Skill
    // ========================================================================
    builder
      .addCase(attachSkill.pending, (state) => {
        setLoadingState(state, 'skills', true, 'Attaching skill');
        clearErrorState(state, 'skills');
      })
      .addCase(attachSkill.fulfilled, (state) => {
        setLoadingState(state, 'skills', false);
        
        
        // Note: We don't automatically update the skills list since we'd need
        // the complete skill data from the server. The UI should refetch the employee.
      })
      .addCase(attachSkill.rejected, (state, action) => {
        setLoadingState(state, 'skills', false);
        setErrorState(state, 'skills', action.payload as ApiErrorType);
      });

    // ========================================================================
    // Update Skill
    // ========================================================================
    builder
      .addCase(updateSkill.pending, (state) => {
        setLoadingState(state, 'skills', true, 'Updating skill rating');
        clearErrorState(state, 'skills');
      })
      .addCase(updateSkill.fulfilled, (state, action) => {
        setLoadingState(state, 'skills', false);
        
        const { employeeId, skillId, rating } = action.payload;
        
        // Update skill rating in current employee if available
        if (state.currentEmployee?.id === employeeId) {
          const skillIndex = state.currentEmployee.skills.findIndex(s => s.id === skillId);
          if (skillIndex !== -1) {
            state.currentEmployee.skills[skillIndex].pivot.rating = rating;
          }
        }
        
        // Update skill rating in employees list
        const employeeIndex = state.employees.findIndex(emp => emp.id === employeeId);
        if (employeeIndex !== -1) {
          const skillIndex = state.employees[employeeIndex].skills.findIndex(s => s.id === skillId);
          if (skillIndex !== -1) {
            state.employees[employeeIndex].skills[skillIndex].pivot.rating = rating;
          }
        }
      })
      .addCase(updateSkill.rejected, (state, action) => {
        setLoadingState(state, 'skills', false);
        setErrorState(state, 'skills', action.payload as ApiErrorType);
      });

    // ========================================================================
    // Detach Skill
    // ========================================================================
    builder
      .addCase(detachSkill.pending, (state) => {
        setLoadingState(state, 'skills', true, 'Detaching skill');
        clearErrorState(state, 'skills');
      })
      .addCase(detachSkill.fulfilled, (state, action) => {
        setLoadingState(state, 'skills', false);
        
        const { employeeId, skillId } = action.payload;
        
        // Remove skill from current employee if available
        if (state.currentEmployee?.id === employeeId) {
          state.currentEmployee.skills = state.currentEmployee.skills.filter(s => s.id !== skillId);
        }
        
        // Remove skill from employees list
        const employeeIndex = state.employees.findIndex(emp => emp.id === employeeId);
        if (employeeIndex !== -1) {
          state.employees[employeeIndex].skills = state.employees[employeeIndex].skills.filter(s => s.id !== skillId);
        }
      })
      .addCase(detachSkill.rejected, (state, action) => {
        setLoadingState(state, 'skills', false);
        setErrorState(state, 'skills', action.payload as ApiErrorType);
      });
  },
});

// ============================================================================
// Exports
// ============================================================================

// Export actions
export const {
  clearCurrentEmployee,
  clearError,
  clearAllErrors,
  updateCacheStatus,
  setPaginationOptions,
  optimisticUpdateEmployee,
  optimisticDeleteEmployee,
} = employeesSlice.actions;

// Export reducer
export default employeesSlice.reducer;

// Export selectors
export const selectEmployees = (state: { employees: EmployeesState }) => state.employees.employees;
export const selectCurrentEmployee = (state: { employees: EmployeesState }) => state.employees.currentEmployee;
export const selectLoading = (state: { employees: EmployeesState }) => state.employees.loading;
export const selectErrors = (state: { employees: EmployeesState }) => state.employees.errors;
export const selectPagination = (state: { employees: EmployeesState }) => state.employees.pagination;
export const selectCache = (state: { employees: EmployeesState }) => state.employees.cache;

// Complex selectors
export const selectEmployeeById = (id: number) => (state: { employees: EmployeesState }) =>
  state.employees.employees.find(employee => employee.id === id);

export const selectEmployeesByStatus = (status: string) => (state: { employees: EmployeesState }) =>
  state.employees.employees.filter(employee => employee.status === status);

export const selectIsLoading = (state: { employees: EmployeesState }) =>
  Object.values(state.employees.loading).some(loading => loading.isLoading);

export const selectHasErrors = (state: { employees: EmployeesState }) =>
  Object.values(state.employees.errors).some(error => error.hasError);
