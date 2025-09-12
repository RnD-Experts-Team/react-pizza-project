// src/pages/SchedulePreferencesPage.tsx

/**
 * Schedule Preferences Management Page
 * 
 * A comprehensive page for managing schedule preferences with a data table,
 * create/edit/view dialogs, and proper integration with stores, employees, and preferences.
 * 
 * Features:
 * - Data table with schedule preferences
 * - Create dialog with store/employee/preference selection
 * - Edit dialog with pre-populated data
 * - View dialog for read-only details
 * - Delete confirmation with optimistic updates
 * - Responsive design with shadcn/ui components
 * - Sonner toast notifications for user feedback
 * 
 * @fileoverview Schedule preferences management page
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
import { toast } from 'sonner';
import {
  Plus,
  Edit,
  Eye,
  Trash2,
  Building2,
  Users,
  Clock,
  Briefcase,
  Calendar,
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';

// Import custom hooks - using a simpler approach that doesn't require typed hooks
import { useStores } from '@/features/stores/hooks/useStores';
import { useEmployees } from '@/features/employees/hooks/useEmployees';
import { usePreferences } from '@/features/preference/hooks/usePreferences';

// Import Redux hooks directly
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';

// Import Redux actions and selectors directly
import {
  fetchAllSchedulePreferences,
  fetchSchedulePreferenceById,
  createSchedulePreference,
  updateSchedulePreference,
  deleteSchedulePreference,
  clearErrors,
  clearError,
  setCurrentSchedulePreference,
  clearCurrentSchedulePreference,
  selectAllSchedulePreferences,
  selectCurrentSchedulePreference,
  selectSchedulePreferencesTotalCount,
  selectSchedulePreferencesLoadingStates,
  selectSchedulePreferencesErrors,
  selectIsAnySchedulePreferenceLoading,
} from '@/features/schedulePreferences/store/schedulePreferencesSlice';

// Import types
import type {
  SchedulePreference,
  CreateSchedulePreferenceRequest,
  UpdateSchedulePreferenceRequest,
  EmploymentType,
} from '@/features/schedulePreferences/types';

// =============================================================================
// TYPES AND INTERFACES
// =============================================================================

interface CreateDialogState {
  open: boolean;
  selectedStoreId: string;
  selectedEmployeeId: string;
  selectedPreferenceId: string;
  maximumHours: string;
  employmentType: EmploymentType | '';
}

interface EditDialogState {
  open: boolean;
  schedulePreference: SchedulePreference | null;
  selectedStoreId: string;
  selectedEmployeeId: string;
  selectedPreferenceId: string;
  maximumHours: string;
  employmentType: EmploymentType | '';
}

interface ViewDialogState {
  open: boolean;
  schedulePreference: SchedulePreference | null;
}

interface DeleteDialogState {
  open: boolean;
  schedulePreference: SchedulePreference | null;
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

const SchedulePreferencesPage: React.FC = () => {
  // ==========================================================================
  // HOOKS AND STATE
  // ==========================================================================

  const dispatch = useDispatch();

  // Redux selectors
  const schedulePreferences = useSelector(selectAllSchedulePreferences);
  const currentSchedulePreference = useSelector(selectCurrentSchedulePreference);
  const totalCount = useSelector(selectSchedulePreferencesTotalCount);
  const loadingStates = useSelector(selectSchedulePreferencesLoadingStates);
  const errorStates = useSelector(selectSchedulePreferencesErrors);
  const isAnyLoading = useSelector(selectIsAnySchedulePreferenceLoading);

  // Other hooks
  const storesHook = useStores(true, { per_page: 100 });
  const employeesHook = useEmployees();
  const preferencesHook = usePreferences();

  // Dialog states
  const [createDialog, setCreateDialog] = useState<CreateDialogState>({
    open: false,
    selectedStoreId: '',
    selectedEmployeeId: '',
    selectedPreferenceId: '',
    maximumHours: '8',
    employmentType: ''
  });

  const [editDialog, setEditDialog] = useState<EditDialogState>({
    open: false,
    schedulePreference: null,
    selectedStoreId: '',
    selectedEmployeeId: '',
    selectedPreferenceId: '',
    maximumHours: '8',
    employmentType: ''
  });

  const [viewDialog, setViewDialog] = useState<ViewDialogState>({
    open: false,
    schedulePreference: null
  });

  const [deleteDialog, setDeleteDialog] = useState<DeleteDialogState>({
    open: false,
    schedulePreference: null
  });

  // Loading and submitting states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedStoreForEmployees, setSelectedStoreForEmployees] = useState<string>('');

  // ==========================================================================
  // EFFECTS
  // ==========================================================================

  // Fetch all data on mount
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await dispatch(fetchAllSchedulePreferences()).unwrap();
      } catch (error) {
        console.error('Failed to fetch schedule preferences:', error);
      }
    };

    fetchInitialData();
  }, [dispatch]);

  // Fetch preferences on mount
  useEffect(() => {
    preferencesHook.fetchPreferences().catch(console.error);
  }, []);

  // Fetch employees when store is selected in create/edit dialog
  useEffect(() => {
    if (selectedStoreForEmployees) {
      employeesHook.actions.fetchEmployeesByStore(selectedStoreForEmployees, { per_page: 100 })
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
    return employeesHook.employees.filter(emp => emp.store_id === selectedStoreForEmployees);
  }, [employeesHook.employees, selectedStoreForEmployees]);

  // Main loading state
  const isMainLoading = loadingStates.fetchAll === 'loading';

  // Any operation loading
  const isAnyOperationLoading = isAnyLoading || storesHook.loading || preferencesHook.isAnyLoading;

  // Check if there are any errors
  const hasAnyError = Object.values(errorStates).some(error => error !== null);
  const firstError = hasAnyError ? Object.values(errorStates).find(error => error !== null) : null;

  // Get employment type filtered data
  const fullTimePreferences = useMemo(() => 
    schedulePreferences.filter(pref => pref.employment_type === 'FT'), 
    [schedulePreferences]
  );
  
  const partTimePreferences = useMemo(() => 
    schedulePreferences.filter(pref => pref.employment_type === 'PT'), 
    [schedulePreferences]
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
      selectedPreferenceId: '',
      maximumHours: '8',
      employmentType: ''
    });
  }, []);

  /**
   * Closes create dialog
   */
  const handleCloseCreateDialog = useCallback(() => {
    setCreateDialog(prev => ({ ...prev, open: false }));
    setSelectedStoreForEmployees('');
  }, []);

  /**
   * Opens edit dialog with existing schedule preference data
   */
  const handleOpenEditDialog = useCallback((schedulePreference: SchedulePreference) => {
    setEditDialog({
      open: true,
      schedulePreference,
      selectedStoreId: schedulePreference.emp_info.store_id,
      selectedEmployeeId: schedulePreference.emp_info_id.toString(),
      selectedPreferenceId: schedulePreference.preference_id.toString(),
      maximumHours: schedulePreference.maximum_hours.toString(),
      employmentType: schedulePreference.employment_type
    });
  }, []);

  /**
   * Closes edit dialog
   */
  const handleCloseEditDialog = useCallback(() => {
    setEditDialog(prev => ({ ...prev, open: false }));
    setSelectedStoreForEmployees('');
  }, []);

  /**
   * Opens view dialog with schedule preference details
   */
  const handleOpenViewDialog = useCallback((schedulePreference: SchedulePreference) => {
    setViewDialog({
      open: true,
      schedulePreference
    });
  }, []);

  /**
   * Closes view dialog
   */
  const handleCloseViewDialog = useCallback(() => {
    setViewDialog({ open: false, schedulePreference: null });
  }, []);

  /**
   * Opens delete confirmation dialog
   */
  const handleOpenDeleteDialog = useCallback((schedulePreference: SchedulePreference) => {
    setDeleteDialog({
      open: true,
      schedulePreference
    });
  }, []);

  /**
   * Closes delete dialog
   */
  const handleCloseDeleteDialog = useCallback(() => {
    setDeleteDialog({ open: false, schedulePreference: null });
  }, []);

  /**
   * Handles create form submission
   */
  const handleCreateSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true);

      // Validation
      if (!createDialog.selectedStoreId || !createDialog.selectedEmployeeId || 
          !createDialog.selectedPreferenceId || !createDialog.employmentType) {
        toast.error('Validation Error', {
          description: 'Please fill in all required fields',
        });
        return;
      }

      const requestData: CreateSchedulePreferenceRequest = {
        emp_info_id: parseInt(createDialog.selectedEmployeeId),
        preference_id: parseInt(createDialog.selectedPreferenceId),
        maximum_hours: parseInt(createDialog.maximumHours) || 8,
        employment_type: createDialog.employmentType
      };

      // Show loading toast
      const loadingToastId = toast.loading('Creating schedule preference...', {
        description: 'Please wait while we save your changes.',
      });

      await dispatch(createSchedulePreference(requestData)).unwrap();
      
      // Dismiss loading toast
      toast.dismiss(loadingToastId);
      
      toast.success('Schedule preference created successfully', {
        description: 'The new schedule preference has been added to the system.',
      });
      
      handleCloseCreateDialog();
    } catch (error) {
      console.error('Failed to create schedule preference:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error('Failed to create schedule preference', {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [createDialog, dispatch, handleCloseCreateDialog]);

  /**
   * Handles edit form submission
   */
  const handleEditSubmit = useCallback(async () => {
    if (!editDialog.schedulePreference) return;

    try {
      setIsSubmitting(true);

      // Validation
      if (!editDialog.selectedStoreId || !editDialog.selectedEmployeeId || 
          !editDialog.selectedPreferenceId || !editDialog.employmentType) {
        toast.error('Validation Error', {
          description: 'Please fill in all required fields',
        });
        return;
      }

      const requestData: UpdateSchedulePreferenceRequest = {
        emp_info_id: parseInt(editDialog.selectedEmployeeId),
        preference_id: parseInt(editDialog.selectedPreferenceId),
        maximum_hours: parseInt(editDialog.maximumHours) || 8,
        employment_type: editDialog.employmentType
      };

      // Show loading toast
      const loadingToastId = toast.loading('Updating schedule preference...', {
        description: 'Please wait while we save your changes.',
      });

      await dispatch(updateSchedulePreference({ id: editDialog.schedulePreference.id, data: requestData })).unwrap();
      
      // Dismiss loading toast
      toast.dismiss(loadingToastId);
      
      toast.success('Schedule preference updated successfully', {
        description: 'The schedule preference changes have been saved.',
      });
      
      handleCloseEditDialog();
    } catch (error) {
      console.error('Failed to update schedule preference:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error('Failed to update schedule preference', {
        description: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [editDialog, dispatch, handleCloseEditDialog]);

  /**
   * Handles delete confirmation
   */
  const handleDeleteConfirm = useCallback(async () => {
    if (!deleteDialog.schedulePreference) return;

    try {
      // Show loading toast
      const loadingToastId = toast.loading('Deleting schedule preference...', {
        description: 'Please wait while we remove the preference.',
      });

      await dispatch(deleteSchedulePreference({ id: deleteDialog.schedulePreference.id })).unwrap();
      
      // Dismiss loading toast
      toast.dismiss(loadingToastId);
      
      toast.success('Schedule preference deleted successfully', {
        description: 'The schedule preference has been removed from the system.',
      });
      
      handleCloseDeleteDialog();
    } catch (error) {
      console.error('Failed to delete schedule preference:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error('Failed to delete schedule preference', {
        description: errorMessage,
      });
    }
  }, [deleteDialog.schedulePreference, dispatch, handleCloseDeleteDialog]);

  /**
   * Handles refresh button click
   */
  const handleRefresh = useCallback(async () => {
    try {
      toast.info('Refreshing data...', {
        description: 'Fetching the latest schedule preferences.',
      });
      await dispatch(fetchAllSchedulePreferences()).unwrap();
      toast.success('Data refreshed successfully', {
        description: 'Schedule preferences have been updated.',
      });
    } catch (error) {
      console.error('Failed to refresh schedule preferences:', error);
      toast.error('Failed to refresh data', {
        description: 'Please try again later.',
      });
    }
  }, [dispatch]);

  // ==========================================================================
  // HELPER FUNCTIONS
  // ==========================================================================

  /**
   * Gets store name by ID
   */
  const getStoreName = useCallback((storeId: string): string => {
    const store = storesHook.stores.find(s => s.id === storeId);
    return store?.name || storeId;
  }, [storesHook.stores]);

  /**
   * Gets employment type badge variant
   */
  const getEmploymentTypeBadge = useCallback((type: EmploymentType) => {
    return type === 'FT' ? 'default' : 'secondary';
  }, []);

  /**
   * Gets employment type display text
   */
  const getEmploymentTypeText = useCallback((type: EmploymentType) => {
    return type === 'FT' ? 'Full Time' : 'Part Time';
  }, []);

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

    if (schedulePreferences.length === 0) {
      return (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Schedule Preferences</h3>
            <p className="text-muted-foreground text-center mb-6">
              Get started by creating your first schedule preference
            </p>
            <Button onClick={handleOpenCreateDialog}>
              <Plus className="h-4 w-4 mr-2" />
              Create Schedule Preference
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
                <TableHead>Preference</TableHead>
                <TableHead>Max Hours</TableHead>
                <TableHead>Employment Type</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedulePreferences.map((schedulePreference) => (
                <TableRow key={schedulePreference.id}>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{schedulePreference.emp_info.full_name}</p>
                        <p className="text-sm text-muted-foreground">
                          Status: {schedulePreference.emp_info.status}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>{getStoreName(schedulePreference.emp_info.store_id)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>{schedulePreference.preference.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{schedulePreference.maximum_hours} hours</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getEmploymentTypeBadge(schedulePreference.employment_type)}>
                      {getEmploymentTypeText(schedulePreference.employment_type)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(schedulePreference.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenViewDialog(schedulePreference)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEditDialog(schedulePreference)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDeleteDialog(schedulePreference)}
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
   * Renders store selection dropdown
   */
  const renderStoreSelect = (value: string, onValueChange: (value: string) => void, placeholder: string = "Select store...") => (
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
  );

  /**
   * Renders employee selection dropdown
   */
  const renderEmployeeSelect = (value: string, onValueChange: (value: string) => void, disabled: boolean = false) => (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={disabled ? "Select store first..." : "Select employee..."} />
      </SelectTrigger>
      <SelectContent>
        {availableEmployees.map((employee) => (
          <SelectItem key={employee.id} value={employee.id.toString()}>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <div>
                <span>{employee.full_name}</span>
                <span className="text-sm text-muted-foreground ml-1">({employee.status})</span>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  /**
   * Renders preference selection dropdown
   */
  const renderPreferenceSelect = (value: string, onValueChange: (value: string) => void) => (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select preference..." />
      </SelectTrigger>
      <SelectContent>
        {preferencesHook.preferences.map((preference) => (
          <SelectItem key={preference.id} value={preference.id.toString()}>
            <div className="flex items-center space-x-2">
              <Briefcase className="h-4 w-4" />
              <span>{preference.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  /**
   * Renders employment type selection dropdown
   */
  const renderEmploymentTypeSelect = (value: string, onValueChange: (value: string) => void) => (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select employment type..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="FT">
          <Badge variant="default">Full Time</Badge>
        </SelectItem>
        <SelectItem value="PT">
          <Badge variant="secondary">Part Time</Badge>
        </SelectItem>
      </SelectContent>
    </Select>
  );

  // ==========================================================================
  // MAIN RENDER
  // ==========================================================================

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule Preferences</h1>
          <p className="text-muted-foreground">
            Manage employee schedule preferences and work arrangements
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isAnyOperationLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isAnyOperationLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleOpenCreateDialog} disabled={isAnyOperationLoading}>
            <Plus className="h-4 w-4 mr-2" />
            Create Schedule Preference
          </Button>
        </div>
      </div>

      {/* Error States */}
      {hasAnyError && (
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p className="font-medium">Error loading schedule preferences</p>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {firstError}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Preferences</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalCount}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Full Time</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {fullTimePreferences.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Part Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {partTimePreferences.length}
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
      <Dialog open={createDialog.open} onOpenChange={handleCloseCreateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create Schedule Preference</DialogTitle>
            <DialogDescription>
              Set up a new schedule preference for an employee
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="store">Store</Label>
              {renderStoreSelect(
                createDialog.selectedStoreId,
                (value) => setCreateDialog(prev => ({ ...prev, selectedStoreId: value, selectedEmployeeId: '' }))
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="employee">Employee</Label>
              {renderEmployeeSelect(
                createDialog.selectedEmployeeId,
                (value) => setCreateDialog(prev => ({ ...prev, selectedEmployeeId: value })),
                !createDialog.selectedStoreId
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="preference">Preference</Label>
              {renderPreferenceSelect(
                createDialog.selectedPreferenceId,
                (value) => setCreateDialog(prev => ({ ...prev, selectedPreferenceId: value }))
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="maximumHours">Maximum Hours</Label>
              <Input
                id="maximumHours"
                type="number"
                min="1"
                max="24"
                value={createDialog.maximumHours}
                onChange={(e) => setCreateDialog(prev => ({ ...prev, maximumHours: e.target.value }))}
                placeholder="8"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="employmentType">Employment Type</Label>
              {renderEmploymentTypeSelect(
                createDialog.employmentType,
                (value) => setCreateDialog(prev => ({ ...prev, employmentType: value as EmploymentType }))
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseCreateDialog} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleCreateSubmit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Schedule Preference
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialog.open} onOpenChange={handleCloseEditDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Schedule Preference</DialogTitle>
            <DialogDescription>
              Update the schedule preference details
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editStore">Store</Label>
              {renderStoreSelect(
                editDialog.selectedStoreId,
                (value) => setEditDialog(prev => ({ ...prev, selectedStoreId: value, selectedEmployeeId: '' }))
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editEmployee">Employee</Label>
              {renderEmployeeSelect(
                editDialog.selectedEmployeeId,
                (value) => setEditDialog(prev => ({ ...prev, selectedEmployeeId: value })),
                !editDialog.selectedStoreId
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editPreference">Preference</Label>
              {renderPreferenceSelect(
                editDialog.selectedPreferenceId,
                (value) => setEditDialog(prev => ({ ...prev, selectedPreferenceId: value }))
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editMaximumHours">Maximum Hours</Label>
              <Input
                id="editMaximumHours"
                type="number"
                min="1"
                max="24"
                value={editDialog.maximumHours}
                onChange={(e) => setEditDialog(prev => ({ ...prev, maximumHours: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="editEmploymentType">Employment Type</Label>
              {renderEmploymentTypeSelect(
                editDialog.employmentType,
                (value) => setEditDialog(prev => ({ ...prev, employmentType: value as EmploymentType }))
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseEditDialog} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Schedule Preference
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={viewDialog.open} onOpenChange={handleCloseViewDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Schedule Preference Details</DialogTitle>
            <DialogDescription>
              View schedule preference information
            </DialogDescription>
          </DialogHeader>
          {viewDialog.schedulePreference && (
            <div className="space-y-6 py-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Employee:</span>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{viewDialog.schedulePreference.emp_info.full_name}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Store:</span>
                  <div className="flex items-center space-x-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>{getStoreName(viewDialog.schedulePreference.emp_info.store_id)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Preference:</span>
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>{viewDialog.schedulePreference.preference.name}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Maximum Hours:</span>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{viewDialog.schedulePreference.maximum_hours} hours</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Employment Type:</span>
                  <Badge variant={getEmploymentTypeBadge(viewDialog.schedulePreference.employment_type)}>
                    {getEmploymentTypeText(viewDialog.schedulePreference.employment_type)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Employee Status:</span>
                  <Badge variant="outline">
                    {viewDialog.schedulePreference.emp_info.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Created:</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(viewDialog.schedulePreference.created_at).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Updated:</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(viewDialog.schedulePreference.updated_at).toLocaleString()}
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
      <AlertDialog open={deleteDialog.open} onOpenChange={handleCloseDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Schedule Preference</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this schedule preference? This action cannot be undone.
              {deleteDialog.schedulePreference && (
                <div className="mt-4 p-4 bg-muted rounded-md">
                  <p><strong>Employee:</strong> {deleteDialog.schedulePreference.emp_info.full_name}</p>
                  <p><strong>Store:</strong> {getStoreName(deleteDialog.schedulePreference.emp_info.store_id)}</p>
                  <p><strong>Preference:</strong> {deleteDialog.schedulePreference.preference.name}</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCloseDeleteDialog}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Schedule Preference
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SchedulePreferencesPage;
