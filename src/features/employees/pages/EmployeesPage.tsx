/**
 * Store Employees Page
 * 
 * This page displays a table of employees for a selected store with pagination,
 * search functionality, and CRUD operations. Uses shadcn/ui components and
 * Tailwind CSS for styling.
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStores } from '../../stores/hooks/useStores'; // Using the provided stores hook
import { useEmployees } from '../hooks/useEmployees';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Users,
  Building2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Employee, EmployeeStatus } from '../types';

// ============================================================================
// Component Types
// ============================================================================

interface StoreEmployeesPageProps {
  className?: string;
}

interface EmployeeTableRowProps {
  employee: Employee;
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

interface EmployeeActionsProps {
  employee: Employee;
  onView: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

// ============================================================================
// Helper Components
// ============================================================================

/**
 * Employee status badge component
 */
const EmployeeStatusBadge: React.FC<{ status: EmployeeStatus }> = ({ status }) => {
  const getStatusVariant = (status: EmployeeStatus) => {
    switch (status) {
      case 'Active':
        return 'default';
      case 'Suspension':
        return 'secondary';
      case 'Terminated':
        return 'destructive';
      case 'On Leave':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusIcon = (status: EmployeeStatus) => {
    switch (status) {
      case 'Active':
        return '🟢';
      case 'Suspension':
        return '🟡';
      case 'Terminated':
        return '🔴';
      case 'On Leave':
        return '🟠';
      default:
        return '⚪';
    }
  };

  return (
    <Badge variant={getStatusVariant(status)} className="gap-1">
      <span className="text-xs">{getStatusIcon(status)}</span>
      {status}
    </Badge>
  );
};

/**
 * Employee actions dropdown component
 */
const EmployeeActions: React.FC<EmployeeActionsProps> = ({
  employee,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open actions menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={() => onView(employee)}
          className="cursor-pointer"
        >
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onEdit(employee)}
          className="cursor-pointer"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Employee
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(employee)}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Employee
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

/**
 * Employee table row component
 */
const EmployeeTableRow: React.FC<EmployeeTableRowProps> = ({
  employee,
  onView,
  onEdit,
  onDelete,
}) => {
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  const getEmployeeAge = useCallback((dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }, []);

  return (
    <TableRow className="hover:bg-muted/50">
      <TableCell className="font-medium">
        <div className="flex flex-col">
          <span className="font-semibold">{employee.full_name}</span>
          <span className="text-xs text-muted-foreground">ID: {employee.id}</span>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="font-medium">{employee.store.name}</span>
            <span className="text-xs text-muted-foreground">#{employee.store.number}</span>
          </div>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex flex-col">
          <span>{formatDate(employee.date_of_birth)}</span>
          <span className="text-xs text-muted-foreground">
            Age: {getEmployeeAge(employee.date_of_birth)}
          </span>
        </div>
      </TableCell>
      
      <TableCell>
        <EmployeeStatusBadge status={employee.status} />
      </TableCell>
      
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {employee.has_family && (
            <Badge variant="outline" className="text-xs">
              👨‍👩‍👧‍👦 Family
            </Badge>
          )}
          {employee.has_car && (
            <Badge variant="outline" className="text-xs">
              🚗 Car
            </Badge>
          )}
          {employee.is_arabic_team && (
            <Badge variant="outline" className="text-xs">
              🗣️ Arabic
            </Badge>
          )}
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1 text-xs">
            <span className="font-medium">Skills:</span>
            <span className="text-muted-foreground">
              {employee.skills.length}
            </span>
          </div>
          {employee.employment_info && (
            <div className="flex items-center gap-1 text-xs">
              <span className="font-medium">Pay:</span>
              <span className="text-muted-foreground">
                ${employee.employment_info.base_pay}
              </span>
            </div>
          )}
        </div>
      </TableCell>
      
      <TableCell>
        <span className="text-sm text-muted-foreground">
          {formatDate(employee.created_at)}
        </span>
      </TableCell>
      
      <TableCell>
        <EmployeeActions
          employee={employee}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
};

/**
 * Loading skeleton for the employee table
 */
const EmployeeTableSkeleton: React.FC = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell><Skeleton className="h-12 w-full" /></TableCell>
          <TableCell><Skeleton className="h-8 w-32" /></TableCell>
          <TableCell><Skeleton className="h-8 w-24" /></TableCell>
          <TableCell><Skeleton className="h-6 w-16" /></TableCell>
          <TableCell><Skeleton className="h-8 w-20" /></TableCell>
          <TableCell><Skeleton className="h-8 w-24" /></TableCell>
          <TableCell><Skeleton className="h-6 w-20" /></TableCell>
          <TableCell><Skeleton className="h-8 w-8" /></TableCell>
        </TableRow>
      ))}
    </>
  );
};

/**
 * Per page selector component
 */
const PerPageSelector: React.FC<{
  currentPerPage: number;
  availableOptions: number[];
  onChange: (perPage: number) => void;
  disabled?: boolean;
}> = ({ currentPerPage, availableOptions, onChange, disabled = false }) => {
  return (
    <div className="flex items-center gap-2">
      <Label htmlFor="per-page" className="text-sm font-medium">
        Show:
      </Label>
      <Select
        value={currentPerPage.toString()}
        onValueChange={(value) => onChange(Number(value))}
        disabled={disabled}
      >
        <SelectTrigger id="per-page" className="w-20">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {availableOptions.map((option) => (
            <SelectItem key={option} value={option.toString()}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

const StoreEmployeesPage: React.FC<StoreEmployeesPageProps> = ({ className }) => {
  const navigate = useNavigate();
  
  // Local state
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  
  // Hooks - Fixed: Use per_page: 100 for stores to get all stores
  const { stores, loading: storesLoading, error: storesError } = useStores(true, {
    per_page: 100
  });
  
  const { 
    employees, 
    pagination, 
    loading, 
    errors, 
    actions 
  } = useEmployees();

  // ========================================================================
  // Computed Values - Memoized to prevent infinite re-renders
  // ========================================================================

  const selectedStore = useMemo(() => {
    return stores.find(store => store.id === selectedStoreId);
  }, [stores, selectedStoreId]);

  const isLoading = useMemo(() => {
    return loading.fetchByStore.isLoading;
  }, [loading.fetchByStore.isLoading]);

  const hasError = useMemo(() => {
    return errors.fetchByStore.hasError;
  }, [errors.fetchByStore.hasError]);

  // CRITICAL FIX: Only show employees if no error and store matches pagination context
  const validEmployees = useMemo(() => {
    // If there's an error fetching employees by store, show NO employees
    if (hasError) {
      return [];
    }
    
    // If no store is selected, show NO employees
    if (!selectedStoreId) {
      return [];
    }
    
    // If loading, keep current employees (or empty if first load)
    if (isLoading && employees.length === 0) {
      return [];
    }
    
    // Only show employees if the pagination context matches our selected store
    // This prevents showing employees from other stores or all employees
    if (pagination.currentStoreId !== selectedStoreId) {
      return [];
    }
    
    // Filter employees to only show those from the selected store as an extra safety measure
    return employees.filter(employee => employee.store_id === selectedStoreId);
  }, [employees, hasError, selectedStoreId, isLoading, pagination.currentStoreId]);

  const hasEmployees = useMemo(() => {
    return validEmployees.length > 0;
  }, [validEmployees.length]);

  // Create computed pagination info with memoization
  const paginationInfo = useMemo(() => {
    const startRecord = pagination.totalRecords > 0 
      ? ((pagination.currentPage - 1) * pagination.perPage) + 1 
      : 0;
    const endRecord = pagination.totalRecords > 0 
      ? Math.min(pagination.currentPage * pagination.perPage, pagination.totalRecords)
      : 0;
    
    const totalPagesArray = Array.from({ length: pagination.totalPages }, (_, i) => i + 1);

    return {
      ...pagination,
      startRecord,
      endRecord,
      totalPagesArray,
    };
  }, [pagination]);

  // ========================================================================
  // Effects - Fixed to prevent infinite loops and clear employees on error
  // ========================================================================

  // Fetch employees when store is selected - with proper error handling
  useEffect(() => {
    if (selectedStoreId && !isLoading) {
      // Clear previous errors before making new request
      actions.clearAllErrors();
      
      // Fetch employees by store
      actions.fetchEmployeesByStore(selectedStoreId, {
        page: 1,
        per_page: pagination.perPage,
      });
    }
  }, [selectedStoreId]); // Only depend on selectedStoreId

  // Clear employees when there's an error or when changing stores
  useEffect(() => {
    if (hasError || (!selectedStoreId && employees.length > 0)) {
      // This effect will trigger a re-render with validEmployees = []
      // which will hide the employee table
      console.log('Clearing employee display due to error or store change');
    }
  }, [hasError, selectedStoreId, employees.length]);

  // ========================================================================
  // Handlers - All memoized to prevent re-renders
  // ========================================================================

  const handleStoreChange = useCallback((storeId: string) => {
    setSelectedStoreId(storeId);
    // Clear any previous errors when changing stores
    actions.clearAllErrors();
  }, [actions]);

  const handleCreateEmployee = useCallback(() => {
    if (selectedStoreId) {
      navigate(`/employees/create?storeId=${selectedStoreId}`);
    } else {
      alert('Please select a store first');
    }
  }, [navigate, selectedStoreId]);

  const handleViewEmployee = useCallback((employee: Employee) => {
    navigate(`/employees/view/${employee.id}`);
  }, [navigate]);

  const handleEditEmployee = useCallback((employee: Employee) => {
    navigate(`/employees/edit/${employee.id}`);
  }, [navigate]);

  const handleDeleteEmployee = useCallback(async (employee: Employee) => {
    if (window.confirm(`Are you sure you want to delete ${employee.full_name}?`)) {
      const success = await actions.deleteEmployee(employee.id);
      if (success) {
        console.log('Employee deleted successfully');
      }
    }
  }, [actions]);

  const handlePerPageChange = useCallback((perPage: number) => {
    if (selectedStoreId) {
      actions.changePerPage(perPage);
    }
  }, [actions, selectedStoreId]);

  const handlePageChange = useCallback((page: number) => {
    if (selectedStoreId) {
      actions.goToPage(page);
    }
  }, [actions, selectedStoreId]);

  const handleRefresh = useCallback(() => {
    if (selectedStoreId) {
      // Clear errors before refreshing
      actions.clearAllErrors();
      actions.refreshEmployees();
    }
  }, [actions, selectedStoreId]);

  // ========================================================================
  // Render Methods - All memoized
  // ========================================================================

  const renderStoreSelector = useMemo(() => (
    <div className="flex flex-col gap-2">
      <Label htmlFor="store-select" className="text-sm font-medium">
        Select Store
      </Label>
      <Select 
        value={selectedStoreId} 
        onValueChange={handleStoreChange}
        disabled={storesLoading}
      >
        <SelectTrigger id="store-select" className="w-64">
          <SelectValue placeholder="Choose a store..." />
        </SelectTrigger>
        <SelectContent>
          {stores.map((store) => (
            <SelectItem key={store.id} value={store.id}>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                <div className="flex flex-col">
                  <span className="font-medium">{store.name}</span>
                  <span className="text-xs text-muted-foreground">
                    ID: {store.id}
                  </span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {stores.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {stores.length} store{stores.length !== 1 ? 's' : ''} available
        </p>
      )}
    </div>
  ), [selectedStoreId, handleStoreChange, storesLoading, stores]);

  const renderPaginationInfo = useMemo(() => (
    <div className="flex items-center gap-4 text-sm text-muted-foreground">
      <span>
        Showing {paginationInfo.startRecord} to {paginationInfo.endRecord} of{' '}
        {paginationInfo.totalRecords} employees
      </span>
      <PerPageSelector
        currentPerPage={paginationInfo.perPage}
        availableOptions={paginationInfo.availablePerPageOptions}
        onChange={handlePerPageChange}
        disabled={isLoading}
      />
    </div>
  ), [paginationInfo, handlePerPageChange, isLoading]);

  const renderPagination = useMemo(() => {
    if (paginationInfo.totalPages <= 1) return null;

    return (
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => handlePageChange(paginationInfo.currentPage - 1)}
              className={cn(
                !paginationInfo.hasPrevPage && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>
          
          {paginationInfo.totalPagesArray.map((page: number) => (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => handlePageChange(page)}
                isActive={page === paginationInfo.currentPage}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationNext 
              onClick={() => handlePageChange(paginationInfo.currentPage + 1)}
              className={cn(
                !paginationInfo.hasNextPage && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  }, [paginationInfo, handlePageChange]);

  const renderTableHeader = useMemo(() => (
    <div className="flex items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">
            {selectedStore ? `${selectedStore.name} Employees` : 'Store Employees'}
          </h2>
        </div>
        {selectedStoreId && (
          <Badge variant="outline" className="gap-1">
            <Building2 className="h-3 w-3" />
            {selectedStoreId}
          </Badge>
        )}
      </div>
      
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={!selectedStoreId || isLoading}
        >
          <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
          Refresh
        </Button>
        
        <Button
          onClick={handleCreateEmployee}
          disabled={!selectedStoreId}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Employee
        </Button>
      </div>
    </div>
  ), [selectedStore, selectedStoreId, handleRefresh, isLoading, handleCreateEmployee]);

  const renderEmptyState = useMemo(() => {
    if (!selectedStoreId) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Select a Store</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            Choose a store from the dropdown above to view and manage its employees.
          </p>
          {stores.length === 0 && !storesLoading && (
            <p className="text-sm text-muted-foreground">
              No stores available. Please create a store first.
            </p>
          )}
        </div>
      );
    }

    if (!hasEmployees && !isLoading && !hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Employees Found</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            {selectedStore?.name} doesn't have any employees yet. 
            Create the first employee to get started.
          </p>
          <Button onClick={handleCreateEmployee} className="gap-2">
            <Plus className="h-4 w-4" />
            Create First Employee
          </Button>
        </div>
      );
    }

    return null;
  }, [selectedStoreId, hasEmployees, isLoading, hasError, selectedStore?.name, handleCreateEmployee, stores.length, storesLoading]);

  // ========================================================================
  // Main Render
  // ========================================================================

  return (
    <div className={cn("space-y-6", className)}>
      {/* Page Header */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Store Employees</h1>
            <p className="text-muted-foreground">
              Manage employees across different store locations
            </p>
          </div>
        </div>

        {/* Store Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Store Selection</CardTitle>
            <CardDescription>
              Select a store to view and manage its employees
            </CardDescription>
          </CardHeader>
          <CardContent>
            {storesLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-3 w-32" />
              </div>
            ) : storesError ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load stores. Please refresh the page and try again.
                </AlertDescription>
              </Alert>
            ) : (
              renderStoreSelector
            )}
          </CardContent>
        </Card>
      </div>

      {/* Employees Table */}
      {selectedStoreId && (
        <Card>
          <CardHeader className="pb-4">
            {renderTableHeader}
          </CardHeader>
          <CardContent>
            {/* Error State - ALWAYS show error and NO table when there's an error */}
            {hasError && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Alert className="mb-6 max-w-md" variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    {errors.fetchByStore.message || 'Failed to load employees for this store'}
                  </AlertDescription>
                </Alert>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Unable to load employees for {selectedStore?.name || 'the selected store'}.
                  </p>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={handleRefresh}
                      disabled={isLoading}
                    >
                      <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
                      Try Again
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setSelectedStoreId('')}
                    >
                      Select Different Store
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Table or Empty State - ONLY show if no error */}
            {!hasError && (renderEmptyState || (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee</TableHead>
                        <TableHead>Store</TableHead>
                        <TableHead>Date of Birth</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Attributes</TableHead>
                        <TableHead>Details</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="w-12">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <EmployeeTableSkeleton />
                      ) : (
                        validEmployees.map((employee) => (
                          <EmployeeTableRow
                            key={employee.id}
                            employee={employee}
                            onView={handleViewEmployee}
                            onEdit={handleEditEmployee}
                            onDelete={handleDeleteEmployee}
                          />
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination - ONLY show if no error and has employees */}
                {hasEmployees && !hasError && (
                  <div className="flex items-center justify-between pt-4">
                    {renderPaginationInfo}
                    {renderPagination}
                  </div>
                )}
              </>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StoreEmployeesPage;
