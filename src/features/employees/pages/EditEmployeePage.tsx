/**
 * Edit Employee Page
 * 
 * This page provides a form for editing existing employees with pre-populated data,
 * validation, and proper error handling. Uses shadcn/ui components
 * and React Hook Form for form management.
 */

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useStores } from '../../stores/hooks/useStores';
import { useEmployees } from '../hooks/useEmployees';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Save,
  User,
  Building2,
  Users,
  Car,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Loader2,
  Eye,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { UpdateEmployeeRequest, EmployeeStatus, Employee } from '../types';

// ============================================================================
// Form Schema and Types
// ============================================================================

const editEmployeeSchema = z.object({
  store_id: z.string().min(1, 'Store selection is required'),
  full_name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  date_of_birth: z.string()
    .min(1, 'Date of birth is required')
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 16;
      }
      return age >= 16;
    }, 'Employee must be at least 16 years old')
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      return birthDate <= today;
    }, 'Date of birth cannot be in the future'),
  has_family: z.boolean(),
  has_car: z.boolean(),
  is_arabic_team: z.boolean(),
  notes: z.string().optional(),
  status: z.enum(['Active', 'Suspension', 'Terminated', 'On Leave']),
});

// Create the form data type directly from the schema
type EditEmployeeFormData = z.infer<typeof editEmployeeSchema>;

interface EditEmployeePageProps {
  className?: string;
}

// ============================================================================
// Helper Components
// ============================================================================

/**
 * Status selector with visual indicators
 */
const StatusSelector: React.FC<{
  value: EmployeeStatus;
  onChange: (value: EmployeeStatus) => void;
  disabled?: boolean;
}> = ({ value, onChange, disabled }) => {
  const getStatusInfo = (status: EmployeeStatus) => {
    switch (status) {
      case 'Active':
        return { icon: '🟢', color: 'text-green-600', description: 'Employee is actively working' };
      case 'Suspension':
        return { icon: '🟡', color: 'text-yellow-600', description: 'Employee is temporarily suspended' };
      case 'Terminated':
        return { icon: '🔴', color: 'text-red-600', description: 'Employee is no longer with the company' };
      case 'On Leave':
        return { icon: '🟠', color: 'text-orange-600', description: 'Employee is on temporary leave' };
      default:
        return { icon: '⚪', color: 'text-gray-600', description: 'Unknown status' };
    }
  };

  const statuses: EmployeeStatus[] = ['Active', 'Suspension', 'Terminated', 'On Leave'];

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue>
          {value && (
            <div className="flex items-center gap-2">
              <span>{getStatusInfo(value).icon}</span>
              <span>{value}</span>
            </div>
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {statuses.map((status) => {
          const info = getStatusInfo(status);
          return (
            <SelectItem key={status} value={status}>
              <div className="flex items-center gap-2">
                <span>{info.icon}</span>
                <div className="flex flex-col">
                  <span className="font-medium">{status}</span>
                  <span className="text-xs text-muted-foreground">
                    {info.description}
                  </span>
                </div>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};

/**
 * Employee info display component
 */
const EmployeeInfo: React.FC<{ employee: Employee }> = ({ employee }) => {
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
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
    <div className="rounded-lg bg-muted/50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <User className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium">Current Employee Information</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <span className="font-medium">Employee ID:</span>
          <span className="ml-2 text-muted-foreground">{employee.id}</span>
        </div>
        <div>
          <span className="font-medium">Current Age:</span>
          <span className="ml-2 text-muted-foreground">{getEmployeeAge(employee.date_of_birth)} years old</span>
        </div>
        <div>
          <span className="font-medium">Skills:</span>
          <span className="ml-2 text-muted-foreground">{employee.skills.length} skill(s)</span>
        </div>
        <div>
          <span className="font-medium">Created:</span>
          <span className="ml-2 text-muted-foreground">{formatDate(employee.created_at)}</span>
        </div>
        <div>
          <span className="font-medium">Last Updated:</span>
          <span className="ml-2 text-muted-foreground">{formatDate(employee.updated_at)}</span>
        </div>
        {employee.employment_info && (
          <div>
            <span className="font-medium">Base Pay:</span>
            <span className="ml-2 text-muted-foreground">${employee.employment_info.base_pay}</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

const EditEmployeePage: React.FC<EditEmployeePageProps> = ({ className }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const employeeId = id ? parseInt(id, 10) : null;

  // Local state for form submission and data management
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [hasInitialFetch, setHasInitialFetch] = useState(false);

  // Hooks
  const { stores, loading: storesLoading, error: storesError } = useStores(true, {
    per_page: 100
  });
  
  const { 
    currentEmployee, 
    loading, 
    errors, 
    actions 
  } = useEmployees();

  // ========================================================================
  // Form setup with proper validation
  // ========================================================================

  const form = useForm<EditEmployeeFormData>({
    resolver: zodResolver(editEmployeeSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      store_id: '',
      full_name: '',
      date_of_birth: '',
      has_family: false,
      has_car: false,
      is_arabic_team: false,
      notes: '',
      status: 'Active',
    },
  });

  // ========================================================================
  // Memoized callbacks to prevent re-renders
  // ========================================================================

  const fetchEmployeeData = useCallback(() => {
    if (employeeId && !hasInitialFetch && !loading.fetchById.isLoading) {
      console.log('Initiating employee fetch for ID:', employeeId);
      setHasInitialFetch(true);
      actions.fetchEmployeeById(employeeId);
    }
  }, [employeeId, hasInitialFetch, loading.fetchById.isLoading, actions]);

  // ========================================================================
  // Computed Values - FIXED with null safety
  // ========================================================================

  const selectedStore = useMemo(() => {
    const storeId = form.watch('store_id');
    return stores.find(store => store.id === storeId);
  }, [stores, form.watch('store_id')]);

  const isFormValid = useMemo(() => {
    const formState = form.formState;
    const values = form.getValues();
    
    const hasRequiredFields = 
      values.store_id && 
      values.full_name && 
      values.date_of_birth && 
      values.status;
    
    return formState.isValid && hasRequiredFields && isDataLoaded && !isSubmitting;
  }, [form.formState, isDataLoaded, isSubmitting, form]);

  const hasChanges = useMemo(() => {
    return form.formState.isDirty && isDataLoaded;
  }, [form.formState.isDirty, isDataLoaded]);

  // Check if we have the correct employee data - FIXED with null safety
  const hasCorrectEmployee = useMemo(() => {
    return currentEmployee !== null && currentEmployee.id === employeeId;
  }, [currentEmployee, employeeId]);

  // ========================================================================
  // Effects - FIXED to prevent infinite loops
  // ========================================================================

  // Fetch employee data on mount - ONLY ONCE
  useEffect(() => {
    fetchEmployeeData();
  }, [employeeId]); // Only depend on employeeId

  // Populate form when employee data is loaded - FIXED with null safety
  useEffect(() => {
    if (hasCorrectEmployee && currentEmployee && !isDataLoaded) {
      console.log('Populating form with employee data:', currentEmployee);
      
      const formData = {
        store_id: currentEmployee.store_id,
        full_name: currentEmployee.full_name,
        date_of_birth: currentEmployee.date_of_birth,
        has_family: currentEmployee.has_family,
        has_car: currentEmployee.has_car,
        is_arabic_team: currentEmployee.is_arabic_team,
        notes: currentEmployee.notes || '',
        status: currentEmployee.status,
      };

      // Reset form with fetched data
      form.reset(formData);
      setIsDataLoaded(true);
      console.log('Form populated and data loaded set to true');
    }
  }, [hasCorrectEmployee, currentEmployee, isDataLoaded, form]);

  // Clear errors when form changes
  useEffect(() => {
    const subscription = form.watch(() => {
      if (submitError) {
        setSubmitError(null);
      }
      if (submitSuccess) {
        setSubmitSuccess(false);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, submitError, submitSuccess]);

  // Reset state when employee ID changes
  useEffect(() => {
    setIsDataLoaded(false);
    setHasInitialFetch(false);
    setSubmitError(null);
    setSubmitSuccess(false);
  }, [employeeId]);

  // ========================================================================
  // Handlers - FIXED with null safety
  // ========================================================================

  const handleSubmit = async (data: EditEmployeeFormData) => {
    if (!employeeId) return;

    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      const requestData: UpdateEmployeeRequest = {
        store_id: data.store_id,
        full_name: data.full_name.trim(),
        date_of_birth: data.date_of_birth,
        has_family: data.has_family,
        has_car: data.has_car,
        is_arabic_team: data.is_arabic_team,
        notes: data.notes?.trim() || undefined,
        status: data.status,
      };

      console.log('Updating employee with data:', requestData);

      const result = await actions.updateEmployee(employeeId, requestData);

      if (result) {
        setSubmitSuccess(true);
        
        setTimeout(() => {
          navigate(`/employees`, {
            replace: true,
            state: { 
              message: `Employee "${data.full_name}" updated successfully` 
            }
          });
        }, 1500);
      } else {
        throw new Error('Failed to update employee');
      }
    } catch (error: any) {
      console.error('Error updating employee:', error);
      setSubmitError(
        error?.message || 
        'Failed to update employee. Please check your information and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = useCallback(() => {
    if (employeeId) {
      navigate(`/employees`);
    } else {
      navigate('/employees');
    }
  }, [navigate, employeeId]);

  const handleReset = useCallback(() => {
    // FIXED: Added null check for currentEmployee
    if (currentEmployee) {
      const formData = {
        store_id: currentEmployee.store_id,
        full_name: currentEmployee.full_name,
        date_of_birth: currentEmployee.date_of_birth,
        has_family: currentEmployee.has_family,
        has_car: currentEmployee.has_car,
        is_arabic_team: currentEmployee.is_arabic_team,
        notes: currentEmployee.notes || '',
        status: currentEmployee.status,
      };
      form.reset(formData);
    }
    setSubmitError(null);
    setSubmitSuccess(false);
  }, [currentEmployee, form]);

  const handleViewEmployee = useCallback(() => {
    if (employeeId) {
      navigate(`/employees/${employeeId}`);
    }
  }, [navigate, employeeId]);

  // ========================================================================
  // Render Methods - FIXED with null safety
  // ========================================================================

  const renderPageHeader = () => (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">
            Edit Employee
          </h1>
          <p className="text-muted-foreground">
            {/* FIXED: Added null safety check */}
            {hasCorrectEmployee && currentEmployee ? 
              `Editing: ${currentEmployee.full_name}` : 
              'Update employee information'
            }
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {hasCorrectEmployee && currentEmployee && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewEmployee}
            className="gap-2"
          >
            <Eye className="h-4 w-4" />
            View Details
          </Button>
        )}
      </div>
    </div>
  );

  const renderFormActions = () => (
    <div className="flex items-center gap-4">
      <Button
        type="button"
        variant="outline"
        onClick={handleCancel}
        disabled={isSubmitting}
      >
        Cancel
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={handleReset}
        disabled={isSubmitting || !hasChanges}
      >
        Reset Changes
      </Button>
      <Button
        type="submit"
        disabled={!isFormValid || !hasChanges}
        className="gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Updating...
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            Update Employee
          </>
        )}
      </Button>
    </div>
  );

  // ========================================================================
  // Loading and Error States
  // ========================================================================

  if (!employeeId) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate('/employees/store')} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Employees
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Invalid employee ID. Please select a valid employee to edit.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show loading while fetching data
  if (loading.fetchById.isLoading || storesLoading || !isDataLoaded) {
    return (
      <div className={cn("space-y-6", className)}>
        {renderPageHeader()}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (errors.fetchById.hasError) {
    return (
      <div className={cn("space-y-6", className)}>
        {renderPageHeader()}
        <Card>
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {errors.fetchById.message || 'Failed to load employee data. Please try again.'}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // FIXED: Better null check that TypeScript understands
  if (!hasCorrectEmployee || !currentEmployee) {
    return (
      <div className={cn("space-y-6", className)}>
        {renderPageHeader()}
        <Card>
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Employee not found. The employee may have been deleted or you may not have permission to view it.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (storesError) {
    return (
      <div className={cn("space-y-6", className)}>
        {renderPageHeader()}
        <Card>
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load stores. Please refresh the page and try again.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // At this point, TypeScript knows currentEmployee is not null
  // because we've already returned early if it was null above

  // ========================================================================
  // Main Render
  // ========================================================================

  return (
    <div className={cn("space-y-6", className)}>
      {renderPageHeader()}

      {/* Success Message */}
      {submitSuccess && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Employee updated successfully! Redirecting to employee details...
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {submitError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      {/* Unsaved Changes Warning */}
      {hasChanges && !submitSuccess && (
        <Alert>
          <Clock className="h-4 w-4" />
          <AlertDescription>
            You have unsaved changes. Don't forget to update the employee before leaving this page.
          </AlertDescription>
        </Alert>
      )}

      {/* Current Employee Info - FIXED: currentEmployee is guaranteed to be non-null here */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Current Employee Information</CardTitle>
          <CardDescription>
            Review the current employee details before making changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmployeeInfo employee={currentEmployee} />
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Update the employee's personal and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Store Selection */}
              <FormField
                control={form.control}
                name="store_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Store Assignment</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a store..." />
                        </SelectTrigger>
                      </FormControl>
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
                    <FormDescription>
                      Choose which store this employee is assigned to
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Selected Store Info */}
              {selectedStore && (
                <div className="rounded-lg bg-muted/50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Selected Store</span>
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold">{selectedStore.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Store ID: {selectedStore.id}
                    </p>
                    {selectedStore.metadata?.address && (
                      <p className="text-sm text-muted-foreground">
                        📍 {selectedStore.metadata.address}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <Separator />

              {/* Full Name */}
              <FormField
                control={form.control}
                name="full_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter employee's full name"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Update the employee's complete name (first and last name)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date of Birth */}
              <FormField
                control={form.control}
                name="date_of_birth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="date"
                        disabled={isSubmitting}
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </FormControl>
                    <FormDescription>
                      Employee must be at least 16 years old
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employment Status</FormLabel>
                    <FormControl>
                      <StatusSelector
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Update the employment status for this employee
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Employee Attributes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Employee Attributes
              </CardTitle>
              <CardDescription>
                Update additional information about the employee's circumstances and capabilities
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Has Family */}
              <FormField
                control={form.control}
                name="has_family"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center gap-2">
                        👨‍👩‍👧‍👦 Has Family
                      </FormLabel>
                      <FormDescription>
                        Employee has family responsibilities that may affect scheduling
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Has Car */}
              <FormField
                control={form.control}
                name="has_car"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center gap-2">
                        <Car className="h-4 w-4" />
                        Has Car
                      </FormLabel>
                      <FormDescription>
                        Employee has reliable transportation
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Arabic Team */}
              <FormField
                control={form.control}
                name="is_arabic_team"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base flex items-center gap-2">
                        🗣️ Arabic Team
                      </FormLabel>
                      <FormDescription>
                        Employee can serve Arabic-speaking customers
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Additional Notes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Additional Notes
              </CardTitle>
              <CardDescription>
                Update additional information about the employee (optional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Enter any additional notes about the employee..."
                        className="min-h-[100px]"
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional notes about skills, preferences, or other relevant information
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-end">
                {renderFormActions()}
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
};

export default EditEmployeePage;
