/**
 * Employment Information Management Page
 *
 * A comprehensive page for managing employment information with a data table,
 * create/edit/view dialogs, and proper integration with stores, employees, and positions.
 *
 * Features:
 * - Data table with employment information
 * - Create dialog with store/employee/position selection
 * - Edit dialog with pre-populated data
 * - View dialog for read-only details
 * - Delete confirmation with optimistic updates
 * - Responsive design with shadcn/ui components
 * - Sonner toast notifications for user feedback
 *
 * @fileoverview Employment information management page
 * @version 1.0.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import {
  Plus,
  Edit,
  Eye,
  Trash2,
  Building2,
  Users,
  Briefcase,
  DollarSign,
  AlertCircle,
  Loader2,
  RefreshCw,
  Calendar,
  UserCheck,
  CreditCard,
} from 'lucide-react';

// Import custom hooks
import { useStores } from '@/features/stores/hooks/useStores';
import { useEmployees } from '@/features/employees/hooks/useEmployees';
import { usePositions } from '@/features/positions/hooks/usePositions';

// Import Redux actions and selectors from the hooks I created
import { useEmploymentInformations } from '@/features/employmentInformation/hooks/useEmploymentInformation';

// Import types
import type {
  EmploymentInformation,
  CreateEmploymentInformationRequest,
  UpdateEmploymentInformationRequest,
  EmploymentType,
} from '@/features/employmentInformation/types';

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface CreateDialogState {
  open: boolean;
  selectedStoreId: string;
  selectedEmployeeId: string;
  selectedPositionId: string;
  paychexIds: string[];
  employmentType: EmploymentType | '';
  hiredDate: string;
  basePay: string;
  performancePay: string;
  hasUniform: boolean;
}

interface EditDialogState {
  open: boolean;
  employmentInformation: EmploymentInformation | null;
  selectedStoreId: string;
  selectedEmployeeId: string;
  selectedPositionId: string;
  paychexIds: string[];
  employmentType: EmploymentType | '';
  hiredDate: string;
  basePay: string;
  performancePay: string;
  hasUniform: boolean;
}

interface ViewDialogState {
  open: boolean;
  employmentInformation: EmploymentInformation | null;
}

interface DeleteDialogState {
  open: boolean;
  employmentInformation: EmploymentInformation | null;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const EmploymentInformationPage: React.FC = () => {
  // ==========================================================================
  // HOOKS AND STATE
  // ==========================================================================

  // Employment Information hook
  const {
    employmentInformations,
    loading,
    errors,
    actions: employmentActions,
  } = useEmploymentInformations();

  // Other hooks
  const storesHook = useStores(true, { per_page: 100 });
  const employeesHook = useEmployees();
  const positionsHook = usePositions();

  // Dialog states
  const [createDialog, setCreateDialog] = useState<CreateDialogState>({
    open: false,
    selectedStoreId: '',
    selectedEmployeeId: '',
    selectedPositionId: '',
    paychexIds: [''],
    employmentType: '',
    hiredDate: new Date().toISOString().split('T')[0],
    basePay: '0',
    performancePay: '0',
    hasUniform: false,
  });

  const [editDialog, setEditDialog] = useState<EditDialogState>({
    open: false,
    employmentInformation: null,
    selectedStoreId: '',
    selectedEmployeeId: '',
    selectedPositionId: '',
    paychexIds: [''],
    employmentType: '',
    hiredDate: new Date().toISOString().split('T')[0],
    basePay: '0',
    performancePay: '0',
    hasUniform: false,
  });

  const [viewDialog, setViewDialog] = useState<ViewDialogState>({
    open: false,
    employmentInformation: null,
  });

  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    open: false,
    employmentInformation: null,
  });

  // Loading and submitting states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStoreForEmployees, setSelectedStoreForEmployees] =
    useState<string>('');
  const [hasInitiallyFetched, setHasInitiallyFetched] = useState(false);

  // ==========================================================================
  // EFFECTS
  // ==========================================================================

  // Fetch all data on mount (only once)
  useEffect(() => {
    const fetchInitialData = async () => {
      if (hasInitiallyFetched) return;

      try {
        setHasInitiallyFetched(true);
        await employmentActions.fetchAll();
      } catch (error) {
        console.error('Failed to fetch employment information:', error);
        setHasInitiallyFetched(false); // Reset on error so it can retry
      }
    };

    fetchInitialData();
  }, [employmentActions.fetchAll, hasInitiallyFetched]);

  // Fetch positions on mount (only once)
  const fetchPositionsOnce = useCallback(async () => {
    try {
      await positionsHook.fetchPositions();
    } catch (error) {
      console.error('Failed to fetch positions:', error);
    }
  }, [positionsHook.fetchPositions]);

  useEffect(() => {
    fetchPositionsOnce();
  }, []); // Empty dependency array to run only once

  // Fetch employees when store is selected in create/edit dialog
  useEffect(() => {
    if (selectedStoreForEmployees) {
      employeesHook.actions
        .fetchEmployeesByStore(selectedStoreForEmployees, { per_page: 100 })
        .catch(console.error);
    }
  }, [selectedStoreForEmployees]);

  // Update selected store for employees when create dialog store changes
  useEffect(() => {
    if (createDialog.selectedStoreId) {
      setSelectedStoreForEmployees(createDialog.selectedStoreId);
    }
  }, [createDialog.selectedStoreId]);

  // Update selected store for employees when edit dialog store changes
  useEffect(() => {
    if (editDialog.selectedStoreId) {
      setSelectedStoreForEmployees(editDialog.selectedStoreId);
    }
  }, [editDialog.selectedStoreId]);

  // ==========================================================================
  // COMPUTED VALUES
  // ==========================================================================

  // Filter employees by selected store
  const availableEmployees = useMemo(() => {
    if (!selectedStoreForEmployees) return [];
    return employeesHook.employees.filter(
      (emp) => emp.store_id === selectedStoreForEmployees,
    );
  }, [employeesHook.employees, selectedStoreForEmployees]);

  // Main loading state
  const isMainLoading = loading.list;

  // Any operation loading
  const isAnyOperationLoading =
    loading.list ||
    loading.create ||
    loading.update ||
    loading.delete ||
    storesHook.loading ||
    positionsHook.isAnyLoading;

  // Check if there are any errors - memoized for performance
  const hasAnyError = useMemo(
    () => Object.values(errors).some((error) => error !== null),
    [errors],
  );
  const firstError = useMemo(
    () =>
      hasAnyError
        ? Object.values(errors).find((error) => error !== null)
        : null,
    [hasAnyError, errors],
  );

  // Get employment type filtered data
  const w2Employees = useMemo(
    () => employmentInformations.filter((emp) => emp.employment_type === 'W2'),
    [employmentInformations],
  );

  const contractorEmployees = useMemo(
    () =>
      employmentInformations.filter((emp) => emp.employment_type === '1099'),
    [employmentInformations],
  );

  // ==========================================================================
  // EVENT HANDLERS
  // ==========================================================================

  /**
   * Opens create dialog with fresh state
   */
  const handleOpenCreateDialog = useCallback(() => {
    setCreateDialog({
      open: true,
      selectedStoreId: '',
      selectedEmployeeId: '',
      selectedPositionId: '',
      paychexIds: [''],
      employmentType: '',
      hiredDate: new Date().toISOString().split('T')[0],
      basePay: '0',
      performancePay: '0',
      hasUniform: false,
    });
  }, []);

  /**
   * Closes create dialog
   */
  const handleCloseCreateDialog = useCallback(() => {
    setCreateDialog((prev) => ({ ...prev, open: false }));
    setSelectedStoreForEmployees('');
  }, []);

  /**
   * Opens edit dialog with existing employment information data
   */
  const handleOpenEditDialog = useCallback(
    (employmentInformation: EmploymentInformation) => {
      const hiredDate = employmentInformation.hired_date
        ? new Date(employmentInformation.hired_date).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      setEditDialog({
        open: true,
        employmentInformation,
        selectedStoreId: employmentInformation.emp_info?.store_id || '',
        selectedEmployeeId: employmentInformation.emp_info_id.toString(),
        selectedPositionId: employmentInformation.position_id?.toString() || '',
        paychexIds: employmentInformation.paychex_ids || [''],
        employmentType: employmentInformation.employment_type,
        hiredDate,
        basePay: employmentInformation.base_pay || '0',
        performancePay: employmentInformation.performance_pay || '0',
        hasUniform: employmentInformation.has_uniform,
      });
    },
    [],
  );

  /**
   * Closes edit dialog
   */
  const handleCloseEditDialog = useCallback(() => {
    setEditDialog((prev) => ({ ...prev, open: false }));
    setSelectedStoreForEmployees('');
  }, []);

  /**
   * Opens view dialog with employment information details
   */
  const handleOpenViewDialog = useCallback(
    (employmentInformation: EmploymentInformation) => {
      setViewDialog({
        open: true,
        employmentInformation,
      });
    },
    [],
  );

  /**
   * Closes view dialog
   */
  const handleCloseViewDialog = useCallback(() => {
    setViewDialog({ open: false, employmentInformation: null });
  }, []);

  /**
   * Opens delete confirmation dialog
   */
  const handleOpenDeleteDialog = useCallback(
    (employmentInformation: EmploymentInformation) => {
      setDeleteDialog({
        open: true,
        employmentInformation,
      });
    },
    [],
  );

  /**
   * Closes delete dialog
   */
  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteDialog({ open: false, employmentInformation: null });
  }, []);

  /**
   * Handles create form submission
   */
  const handleCreateSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true);

      // Validation
      if (
        !createDialog.selectedStoreId ||
        !createDialog.selectedEmployeeId ||
        !createDialog.employmentType ||
        createDialog.paychexIds.some((id) => !id.trim())
      ) {
        toast.error('Validation Error', {
          description: 'Please fill in all required fields',
        });
        return;
      }

      const requestData: CreateEmploymentInformationRequest = {
        emp_info_id: createDialog.selectedEmployeeId,
        position_id: createDialog.selectedPositionId || undefined,
        paychex_ids: createDialog.paychexIds.filter((id) => id.trim()),
        employment_type: createDialog.employmentType,
        hired_date: createDialog.hiredDate,
        base_pay: createDialog.basePay,
        performance_pay: createDialog.performancePay,
        has_uniform: createDialog.hasUniform,
      };

      // Show loading toast
      const loadingToastId = toast.loading(
        'Creating employment information...',
        {
          description: 'Please wait while we save your changes.',
        },
      );

      const result = await employmentActions.create(requestData);

      if (result) {
        // Dismiss loading toast
        toast.dismiss(loadingToastId);

        toast.success('Employment information created successfully', {
          description:
            'The new employment record has been added to the system.',
        });

        handleCloseCreateDialog();
      } else {
        throw new Error('Failed to create employment information');
      }
    } catch (error) {
      console.error('Failed to create employment information:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error('Failed to create employment information', {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [createDialog, employmentActions.create, handleCloseCreateDialog]);

  /**
   * Handles edit form submission
   */
  const handleEditSubmit = useCallback(async () => {
    if (!editDialog.employmentInformation) return;

    try {
      setIsSubmitting(true);

      // Validation
      if (
        !editDialog.selectedStoreId ||
        !editDialog.selectedEmployeeId ||
        !editDialog.employmentType ||
        editDialog.paychexIds.some((id) => !id.trim())
      ) {
        toast.error('Validation Error', {
          description: 'Please fill in all required fields',
        });
        return;
      }

      const requestData: UpdateEmploymentInformationRequest = {
        emp_info_id: editDialog.selectedEmployeeId,
        position_id: editDialog.selectedPositionId || undefined,
        paychex_ids: editDialog.paychexIds.filter((id) => id.trim()),
        employment_type: editDialog.employmentType,
        hired_date: editDialog.hiredDate,
        base_pay: editDialog.basePay,
        performance_pay: editDialog.performancePay,
        has_uniform: editDialog.hasUniform,
      };

      // Show loading toast
      const loadingToastId = toast.loading(
        'Updating employment information...',
        {
          description: 'Please wait while we save your changes.',
        },
      );

      const result = await employmentActions.update(
        editDialog.employmentInformation.id,
        requestData,
      );

      if (result) {
        // Dismiss loading toast
        toast.dismiss(loadingToastId);

        toast.success('Employment information updated successfully', {
          description: 'The employment record changes have been saved.',
        });

        handleCloseEditDialog();
      } else {
        throw new Error('Failed to update employment information');
      }
    } catch (error) {
      console.error('Failed to update employment information:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error('Failed to update employment information', {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [editDialog, employmentActions.update, handleCloseEditDialog]);

  /**
   * Handles delete confirmation
   */
  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteDialog.employmentInformation) return;

    try {
      // Show loading toast
      const loadingToastId = toast.loading(
        'Deleting employment information...',
        {
          description: 'Please wait while we remove the record.',
        },
      );

      const result = await employmentActions.delete(
        deleteDialog.employmentInformation.id,
      );

      if (result) {
        // Dismiss loading toast
        toast.dismiss(loadingToastId);

        toast.success('Employment information deleted successfully', {
          description:
            'The employment record has been removed from the system.',
        });

        handleCloseDeleteDialog();
      } else {
        throw new Error('Failed to delete employment information');
      }
    } catch (error) {
      console.error('Failed to delete employment information:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error('Failed to delete employment information', {
        description: errorMessage,
      });
    }
  }, [
    deleteDialog.employmentInformation,
    employmentActions.delete,
    handleCloseDeleteDialog,
  ]);

  /**
   * Handles refresh button click
   */
  const handleRefresh = useCallback(async () => {
    try {
      toast.info('Refreshing data...', {
        description: 'Fetching the latest employment information.',
      });

      await employmentActions.fetchAll();

      toast.success('Data refreshed successfully', {
        description: 'Employment information has been updated.',
      });
    } catch (error) {
      console.error('Failed to refresh employment information:', error);
      toast.error('Failed to refresh data', {
        description: 'Please try again later.',
      });
    }
  }, [employmentActions.fetchAll]);

  // ==========================================================================
  // HELPER FUNCTIONS
  // ==========================================================================

  /**
   * Gets store name by ID
   */
  const getStoreName = useCallback(
    (storeId: string): string => {
      const store = storesHook.stores.find((s) => s.id === storeId);
      return store?.name || storeId;
    },
    [storesHook.stores],
  );

  /**
   * Gets position name by ID
   */
  const getPositionName = useCallback(
    (positionId: number | null): string => {
      if (!positionId) return 'No Position';
      const position = positionsHook.positions.find((p) => p.id === positionId);
      return position?.name || `Position ${positionId}`;
    },
    [positionsHook.positions],
  );

  /**
   * Gets employment type badge variant
   */
  const getEmploymentTypeBadge = useCallback((type: EmploymentType) => {
    return type === 'W2' ? 'default' : 'secondary';
  }, []);

  /**
   * Gets employment type display text
   */
  const getEmploymentTypeText = useCallback((type: EmploymentType) => {
    return type === 'W2' ? 'W-2 Employee' : '1099 Contractor';
  }, []);

  /**
   * Handles adding Paychex ID input
   */
  const handleAddPaychexId = useCallback((isEdit: boolean = false) => {
    if (isEdit) {
      setEditDialog((prev) => ({
        ...prev,
        paychexIds: [...prev.paychexIds, ''],
      }));
    } else {
      setCreateDialog((prev) => ({
        ...prev,
        paychexIds: [...prev.paychexIds, ''],
      }));
    }
  }, []);

  /**
   * Handles removing Paychex ID input
   */
  const handleRemovePaychexId = useCallback(
    (index: number, isEdit: boolean = false) => {
      if (isEdit) {
        setEditDialog((prev) => ({
          ...prev,
          paychexIds: prev.paychexIds.filter((_, i) => i !== index),
        }));
      } else {
        setCreateDialog((prev) => ({
          ...prev,
          paychexIds: prev.paychexIds.filter((_, i) => i !== index),
        }));
      }
    },
    [],
  );

  /**
   * Handles updating Paychex ID input
   */
  const handleUpdatePaychexId = useCallback(
    (index: number, value: string, isEdit: boolean = false) => {
      if (isEdit) {
        setEditDialog((prev) => ({
          ...prev,
          paychexIds: prev.paychexIds.map((id, i) =>
            i === index ? value : id,
          ),
        }));
      } else {
        setCreateDialog((prev) => ({
          ...prev,
          paychexIds: prev.paychexIds.map((id, i) =>
            i === index ? value : id,
          ),
        }));
      }
    },
    [],
  );

  // ==========================================================================
  // RENDER HELPERS
  // ==========================================================================

  /**
   * Renders the main data table
   */
  const renderDataTable = () => {
    if (isMainLoading) {
      return (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-16 w-full" />
          ))}
        </div>
      );
    }

    if (employmentInformations.length === 0) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <UserCheck className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No Employment Information
            </h3>
            <p className="text-muted-foreground text-center mb-6">
              Get started by creating your first employment record
            </p>
            <Button onClick={handleOpenCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Create Employment Record
            </Button>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Store</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Employment Type</TableHead>
                <TableHead>Base Pay</TableHead>
                <TableHead>Performance Pay</TableHead>
                <TableHead>Uniform</TableHead>
                <TableHead>Hired Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employmentInformations.map((employmentInfo) => (
                <TableRow key={employmentInfo.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">
                          {employmentInfo.emp_info?.full_name ||
                            'Unknown Employee'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Status: {employmentInfo.emp_info?.status || 'Unknown'}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {getStoreName(employmentInfo.emp_info?.store_id || '')}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>{getPositionName(employmentInfo.position_id)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={getEmploymentTypeBadge(
                        employmentInfo.employment_type,
                      )}
                    >
                      {getEmploymentTypeText(employmentInfo.employment_type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>${employmentInfo.base_pay}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>${employmentInfo.performance_pay}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        employmentInfo.has_uniform ? 'default' : 'secondary'
                      }
                    >
                      {employmentInfo.has_uniform ? 'Yes' : 'No'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {employmentInfo.hired_date
                      ? new Date(employmentInfo.hired_date).toLocaleDateString()
                      : 'Not set'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenViewDialog(employmentInfo)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEditDialog(employmentInfo)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDeleteDialog(employmentInfo)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  /**
   * Renders store selection dropdown - memoized for performance
   */
  const renderStoreSelect = useCallback(
    (
      value: string,
      onValueChange: (value: string) => void,
      placeholder: string = 'Select store...',
    ) => (
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {storesHook.stores.map((store) => (
            <SelectItem key={store.id} value={store.id}>
              <div className="flex items-center space-x-2">
                <Building2 className="h-4 w-4" />
                <span>{store.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    [storesHook.stores],
  );

  /**
   * Renders employee selection dropdown - memoized for performance
   */
  const renderEmployeeSelect = useCallback(
    (
      value: string,
      onValueChange: (value: string) => void,
      disabled: boolean = false,
    ) => (
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue
            placeholder={
              disabled ? 'Select store first...' : 'Select employee...'
            }
          />
        </SelectTrigger>
        <SelectContent>
          {availableEmployees.map((employee) => (
            <SelectItem key={employee.id} value={employee.id.toString()}>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <div>
                  <span>{employee.full_name}</span>
                  <span className="text-sm text-muted-foreground ml-1">
                    ({employee.status})
                  </span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    [availableEmployees],
  );

  /**
   * Renders position selection dropdown - memoized for performance
   */
  const renderPositionSelect = useCallback(
    (value: string, onValueChange: (value: string) => void) => (
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select position (optional)..." />
        </SelectTrigger>
        <SelectContent>
          {positionsHook.positions.map((position) => (
            <SelectItem key={position.id} value={position.id.toString()}>
              <div className="flex items-center space-x-2">
                <Briefcase className="h-4 w-4" />
                <span>{position.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    ),
    [positionsHook.positions],
  );

  /**
   * Renders employment type selection dropdown - memoized for performance
   */
  const renderEmploymentTypeSelect = useCallback(
    (value: string, onValueChange: (value: string) => void) => (
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select employment type..." />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="W2">
            <Badge variant="default">W-2 Employee</Badge>
          </SelectItem>
          <SelectItem value="1099">
            <Badge variant="secondary">1099 Contractor</Badge>
          </SelectItem>
        </SelectContent>
      </Select>
    ),
    [],
  );

  /**
   * Renders Paychex IDs input fields - memoized for performance
   */
  const renderPaychexIdsFields = useCallback(
    (paychexIds: string[], isEdit: boolean = false) => (
      <div className="space-y-2">
        {paychexIds.map((id, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              value={id}
              onChange={(e) =>
                handleUpdatePaychexId(index, e.target.value, isEdit)
              }
              placeholder={`Paychex ID ${index + 1}`}
            />
            {paychexIds.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleRemovePaychexId(index, isEdit)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => handleAddPaychexId(isEdit)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Paychex ID
        </Button>
      </div>
    ),
    [handleUpdatePaychexId, handleRemovePaychexId, handleAddPaychexId],
  );

  // ==========================================================================
  // MAIN RENDER
  // ==========================================================================

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Employment Information
          </h1>
          <p className="text-muted-foreground">
            Manage employee employment details and compensation information
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isAnyOperationLoading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${isAnyOperationLoading ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
          <Button
            onClick={handleOpenCreateDialog}
            disabled={isAnyOperationLoading}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Employment Record
          </Button>
        </div>
      </div>

      {/* Error States */}
      {hasAnyError && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium">
                Error loading employment information
              </p>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{firstError}</p>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {employmentInformations.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">W-2 Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{w2Employees.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              1099 Contractors
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {contractorEmployees.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stores</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storesHook.totalStores}</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Table */}
      {renderDataTable()}

      {/* Create Dialog */}
      <Dialog
        open={createDialog.open}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseCreateDialog();
          }
        }}
      >
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Employment Record</DialogTitle>
            <DialogDescription>
              Set up employment information for an employee
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="store">Store *</Label>
                {renderStoreSelect(createDialog.selectedStoreId, (value) =>
                  setCreateDialog((prev) => ({
                    ...prev,
                    selectedStoreId: value,
                    selectedEmployeeId: '',
                  })),
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="employee">Employee *</Label>
                {renderEmployeeSelect(
                  createDialog.selectedEmployeeId,
                  (value) =>
                    setCreateDialog((prev) => ({
                      ...prev,
                      selectedEmployeeId: value,
                    })),
                  !createDialog.selectedStoreId,
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="position">Position</Label>
                {renderPositionSelect(
                  createDialog.selectedPositionId,
                  (value) =>
                    setCreateDialog((prev) => ({
                      ...prev,
                      selectedPositionId: value,
                    })),
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="employmentType">Employment Type *</Label>
                {renderEmploymentTypeSelect(
                  createDialog.employmentType,
                  (value) =>
                    setCreateDialog((prev) => ({
                      ...prev,
                      employmentType: value as EmploymentType,
                    })),
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Paychex IDs *</Label>
              {renderPaychexIdsFields(createDialog.paychexIds)}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="hiredDate">Hired Date *</Label>
                <Input
                  id="hiredDate"
                  type="date"
                  value={createDialog.hiredDate}
                  onChange={(e) =>
                    setCreateDialog((prev) => ({
                      ...prev,
                      hiredDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="basePay">Base Pay ($) *</Label>
                <Input
                  id="basePay"
                  type="number"
                  min="0"
                  step="0.01"
                  value={createDialog.basePay}
                  onChange={(e) =>
                    setCreateDialog((prev) => ({
                      ...prev,
                      basePay: e.target.value,
                    }))
                  }
                  placeholder="0.00"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="performancePay">Performance Pay ($) *</Label>
                <Input
                  id="performancePay"
                  type="number"
                  min="0"
                  step="0.01"
                  value={createDialog.performancePay}
                  onChange={(e) =>
                    setCreateDialog((prev) => ({
                      ...prev,
                      performancePay: e.target.value,
                    }))
                  }
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasUniform"
                checked={createDialog.hasUniform}
                onCheckedChange={(checked) =>
                  setCreateDialog((prev) => ({
                    ...prev,
                    hasUniform: !!checked,
                  }))
                }
              />
              <Label htmlFor="hasUniform">Employee has uniform</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseCreateDialog}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateSubmit} disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Employment Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialog.open}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseEditDialog();
          }
        }}
      >
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Employment Record</DialogTitle>
            <DialogDescription>
              Update the employment information details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="editStore">Store *</Label>
                {renderStoreSelect(editDialog.selectedStoreId, (value) =>
                  setEditDialog((prev) => ({
                    ...prev,
                    selectedStoreId: value,
                    selectedEmployeeId: '',
                  })),
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editEmployee">Employee *</Label>
                {renderEmployeeSelect(
                  editDialog.selectedEmployeeId,
                  (value) =>
                    setEditDialog((prev) => ({
                      ...prev,
                      selectedEmployeeId: value,
                    })),
                  !editDialog.selectedStoreId,
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="editPosition">Position</Label>
                {renderPositionSelect(editDialog.selectedPositionId, (value) =>
                  setEditDialog((prev) => ({
                    ...prev,
                    selectedPositionId: value,
                  })),
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editEmploymentType">Employment Type *</Label>
                {renderEmploymentTypeSelect(
                  editDialog.employmentType,
                  (value) =>
                    setEditDialog((prev) => ({
                      ...prev,
                      employmentType: value as EmploymentType,
                    })),
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Paychex IDs *</Label>
              {renderPaychexIdsFields(editDialog.paychexIds, true)}
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="editHiredDate">Hired Date *</Label>
                <Input
                  id="editHiredDate"
                  type="date"
                  value={editDialog.hiredDate}
                  onChange={(e) =>
                    setEditDialog((prev) => ({
                      ...prev,
                      hiredDate: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editBasePay">Base Pay ($) *</Label>
                <Input
                  id="editBasePay"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editDialog.basePay}
                  onChange={(e) =>
                    setEditDialog((prev) => ({
                      ...prev,
                      basePay: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editPerformancePay">
                  Performance Pay ($) *
                </Label>
                <Input
                  id="editPerformancePay"
                  type="number"
                  min="0"
                  step="0.01"
                  value={editDialog.performancePay}
                  onChange={(e) =>
                    setEditDialog((prev) => ({
                      ...prev,
                      performancePay: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="editHasUniform"
                checked={editDialog.hasUniform}
                onCheckedChange={(checked) =>
                  setEditDialog((prev) => ({ ...prev, hasUniform: !!checked }))
                }
              />
              <Label htmlFor="editHasUniform">Employee has uniform</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleCloseEditDialog}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Update Employment Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog
        open={viewDialog.open}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseViewDialog();
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Employment Information Details</DialogTitle>
            <DialogDescription>
              View employment record information
            </DialogDescription>
          </DialogHeader>
          {viewDialog.employmentInformation && (
            <div className="space-y-6 py-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Employee:</span>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {viewDialog.employmentInformation.emp_info?.full_name ||
                        'Unknown Employee'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Store:</span>
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {getStoreName(
                        viewDialog.employmentInformation.emp_info?.store_id ||
                          '',
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Position:</span>
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {getPositionName(
                        viewDialog.employmentInformation.position_id,
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Employment Type:</span>
                  <Badge
                    variant={getEmploymentTypeBadge(
                      viewDialog.employmentInformation.employment_type,
                    )}
                  >
                    {getEmploymentTypeText(
                      viewDialog.employmentInformation.employment_type,
                    )}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Paychex IDs:</span>
                  <div className="flex flex-wrap gap-1">
                    {viewDialog.employmentInformation.paychex_ids.map(
                      (id, index) => (
                        <Badge key={index} variant="outline">
                          {id}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Base Pay:</span>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>${viewDialog.employmentInformation.base_pay}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Performance Pay:</span>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>
                      ${viewDialog.employmentInformation.performance_pay}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Has Uniform:</span>
                  <Badge
                    variant={
                      viewDialog.employmentInformation.has_uniform
                        ? 'default'
                        : 'secondary'
                    }
                  >
                    {viewDialog.employmentInformation.has_uniform
                      ? 'Yes'
                      : 'No'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Hired Date:</span>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {viewDialog.employmentInformation.hired_date
                        ? new Date(
                            viewDialog.employmentInformation.hired_date,
                          ).toLocaleDateString()
                        : 'Not set'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Employee Status:</span>
                  <Badge variant="outline">
                    {viewDialog.employmentInformation.emp_info?.status ||
                      'Unknown'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Created:</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(
                      viewDialog.employmentInformation.created_at,
                    ).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Updated:</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(
                      viewDialog.employmentInformation.updated_at,
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleCloseViewDialog}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={handleCloseDeleteDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Employment Information</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this employment record? This
              action cannot be undone.
              {deleteDialog.employmentInformation && (
                <div className="mt-4 p-4 bg-muted rounded-md">
                  <p>
                    <strong>Employee:</strong>{' '}
                    {deleteDialog.employmentInformation.emp_info?.full_name ||
                      'Unknown Employee'}
                  </p>
                  <p>
                    <strong>Store:</strong>{' '}
                    {getStoreName(
                      deleteDialog.employmentInformation.emp_info?.store_id ||
                        '',
                    )}
                  </p>
                  <p>
                    <strong>Position:</strong>{' '}
                    {getPositionName(
                      deleteDialog.employmentInformation.position_id,
                    )}
                  </p>
                  <p>
                    <strong>Employment Type:</strong>{' '}
                    {getEmploymentTypeText(
                      deleteDialog.employmentInformation.employment_type,
                    )}
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteDialog}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Employment Record
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default EmploymentInformationPage;
