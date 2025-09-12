/**
 * Create Employee Page
 * 
 * This page provides a form for creating new employees with validation,
 * store selection, and proper error handling. Uses shadcn/ui components
 * and React Hook Form for form management.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { CreateEmployeeRequest, EmployeeStatus } from '../types';

// ============================================================================
// Form Schema and Types - FIXED VALIDATION
// ============================================================================

const createEmployeeSchema = z.object({
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
type CreateEmployeeFormData = z.infer<typeof createEmployeeSchema>;

interface CreateEmployeePageProps {
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

// ============================================================================
// Main Component
// ============================================================================

const CreateEmployeePage: React.FC<CreateEmployeePageProps> = ({ className }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedStoreId = searchParams.get('storeId');

  // Local state for form submission
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Hooks
  const { stores, loading: storesLoading, error: storesError } = useStores(true, {
    per_page: 100
  });
  const { actions } = useEmployees();

  // ========================================================================
  // Form setup - FIXED with proper validation triggers
  // ========================================================================

  const form = useForm<CreateEmployeeFormData>({
    resolver: zodResolver(createEmployeeSchema),
    mode: 'onChange', // Enable real-time validation
    reValidateMode: 'onChange', // Re-validate on every change
    defaultValues: {
      store_id: preselectedStoreId || '',
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
  // Computed Values - FIXED
  // ========================================================================

  const selectedStore = useMemo(() => {
    const storeId = form.watch('store_id');
    return stores.find(store => store.id === storeId);
  }, [stores, form.watch('store_id')]);

  // Fixed form validation check
  const isFormValid = useMemo(() => {
    // Trigger validation manually to ensure form state is updated
    const formState = form.formState;
    
    // Get current form values
    const values = form.getValues();
    
    // Check required fields manually as backup
    const hasRequiredFields = 
      values.store_id && 
      values.full_name && 
      values.date_of_birth && 
      values.status;
    
    // For debugging - remove in production
    console.log('Form validation check:', {
      isValid: formState.isValid,
      isDirty: formState.isDirty,
      isSubmitting,
      hasRequiredFields,
      errors: formState.errors,
      values
    });
    
    return formState.isValid && hasRequiredFields && !isSubmitting;
  }, [form.formState, isSubmitting, form]);

  // ========================================================================
  // Effects - FIXED
  // ========================================================================

  // Set preselected store and trigger validation
  useEffect(() => {
    if (preselectedStoreId && stores.length > 0) {
      const storeExists = stores.some(store => store.id === preselectedStoreId);
      if (storeExists) {
        form.setValue('store_id', preselectedStoreId, { 
          shouldValidate: true, // Trigger validation
          shouldDirty: true,    // Mark as dirty
          shouldTouch: true     // Mark as touched
        });
      }
    }
  }, [preselectedStoreId, stores, form]);

  // Clear errors when form changes and trigger validation
  useEffect(() => {
    const subscription = form.watch(() => {
      // Trigger validation on every change
      form.trigger();
      
      if (submitError) {
        setSubmitError(null);
      }
      if (submitSuccess) {
        setSubmitSuccess(false);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, submitError, submitSuccess]);

  // ========================================================================
  // Handlers
  // ========================================================================

  const handleSubmit = async (data: CreateEmployeeFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      setSubmitSuccess(false);

      // Prepare request data
      const requestData: CreateEmployeeRequest = {
        store_id: data.store_id,
        full_name: data.full_name.trim(),
        date_of_birth: data.date_of_birth,
        has_family: data.has_family,
        has_car: data.has_car,
        is_arabic_team: data.is_arabic_team,
        notes: data.notes?.trim() || undefined,
        status: data.status,
      };

      console.log('Creating employee with data:', requestData);

      const result = await actions.createEmployee(requestData);

      if (result) {
        setSubmitSuccess(true);
        
        // Show success message briefly, then navigate
        setTimeout(() => {
          navigate(`/employees`, {
            replace: true,
            state: { 
              message: `Employee "${data.full_name}" created successfully` 
            }
          });
        }, 1000);
      } else {
        throw new Error('Failed to create employee');
      }
    } catch (error: any) {
      console.error('Error creating employee:', error);
      setSubmitError(
        error?.message || 
        'Failed to create employee. Please check your information and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (preselectedStoreId) {
      navigate(`/employees/store?selected=${preselectedStoreId}`);
    } else {
      navigate('/employees/store');
    }
  };

  const handleReset = () => {
    form.reset();
    setSubmitError(null);
    setSubmitSuccess(false);
  };

  // ========================================================================
  // Render Methods
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
          Back to Employees
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Create Employee</h1>
          <p className="text-muted-foreground">
            Add a new employee to the system
          </p>
        </div>
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
        disabled={isSubmitting}
      >
        Reset Form
      </Button>
      
      {/* Debug info - remove in production */}
      <div className="text-xs text-muted-foreground">
        Valid: {String(form.formState.isValid)} | 
        Errors: {Object.keys(form.formState.errors).length} |
        Submitting: {String(isSubmitting)}
      </div>
      
      <Button
        type="submit"
        disabled={!isFormValid}
        className="gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Creating...
          </>
        ) : (
          <>
            <Save className="h-4 w-4" />
            Create Employee {!isFormValid && '(Form Invalid)'}
          </>
        )}
      </Button>
    </div>
  );

  // ========================================================================
  // Main Render
  // ========================================================================

  if (storesLoading) {
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
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
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

  if (stores.length === 0) {
    return (
      <div className={cn("space-y-6", className)}>
        {renderPageHeader()}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Stores Available</h3>
              <p className="text-muted-foreground mb-4 max-w-md">
                You need to create at least one store before adding employees.
              </p>
              <Button onClick={() => navigate('/stores/create')} className="gap-2">
                <Building2 className="h-4 w-4" />
                Create Store
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {renderPageHeader()}

      {/* Success Message */}
      {submitSuccess && (
        <Alert className="border-green-200 bg-green-50 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            Employee created successfully! Redirecting to employees list...
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
                Enter the employee's personal and contact information
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
                      Choose which store this employee will be assigned to
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
                      Enter the employee's complete name (first and last name)
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
                      Set the initial employment status for this employee
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
                Additional information about the employee's circumstances and capabilities
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
                Any additional information about the employee (optional)
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

export default CreateEmployeePage;
