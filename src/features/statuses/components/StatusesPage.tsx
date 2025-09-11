// src/features/statuses/components/StatusesPage.tsx

/**
 * Statuses Management Component
 * 
 * A complete statuses management interface with table view, CRUD dialogs,
 * expandable description cells, and confirmation modals. Uses ShadCN UI components and Sonner for toast notifications.
 */

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { 
  Loader2, 
  Plus, 
  RefreshCw, 
  Edit, 
  Trash2,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

import { useStatuses } from '../hooks/useStatuses';
import type { Status, CreateStatusRequest, UpdateStatusRequest } from '../types';

// Form validation schemas
const createStatusSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  slug: z.string().max(255, 'Slug must be less than 255 characters').optional().or(z.literal('')),
});

const updateStatusSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  slug: z.string().max(255, 'Slug must be less than 255 characters').optional().or(z.literal('')),
});

type CreateStatusForm = z.infer<typeof createStatusSchema>;
type UpdateStatusForm = z.infer<typeof updateStatusSchema>;

/**
 * Expandable Description Cell Component
 * Handles truncation and expansion of long descriptions
 */
interface ExpandableDescriptionCellProps {
  description: string;
  maxLength?: number;
}

const ExpandableDescriptionCell: React.FC<ExpandableDescriptionCellProps> = ({ 
  description, 
  maxLength = 100 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldTruncate = description.length > maxLength;
  
  const displayText = shouldTruncate && !isExpanded 
    ? `${description.substring(0, maxLength)}...` 
    : description;

  return (
    <div className="space-y-2">
      <div className={`text-gray-600 ${isExpanded ? 'whitespace-pre-wrap' : ''}`}>
        {displayText}
      </div>
      {shouldTruncate && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="h-6 px-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
        >
          {isExpanded ? (
            <>
              <EyeOff className="h-3 w-3 mr-1" />
              Show less
            </>
          ) : (
            <>
              <Eye className="h-3 w-3 mr-1" />
              Show more
            </>
          )}
        </Button>
      )}
    </div>
  );
};

/**
 * Main Statuses Management Component
 * Provides complete CRUD interface for status management
 */
const StatusesPage: React.FC = () => {
  // Hook for statuses management
  const {
    statuses,
    statusCount,
    loading,
    errors,
    fetchStatuses,
    createNewStatus,
    updateExistingStatus,
    deleteExistingStatus,
    clearSpecificError,
  } = useStatuses();

  // Local state for dialog management
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStatus, setEditingStatus] = useState<Status | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Forms for create and update
  const createForm = useForm<CreateStatusForm>({
    resolver: zodResolver(createStatusSchema),
    defaultValues: {
      description: '',
      slug: '',
    },
  });

  const updateForm = useForm<UpdateStatusForm>({
    resolver: zodResolver(updateStatusSchema),
    defaultValues: {
      description: '',
      slug: '',
    },
  });

  // Load statuses on component mount
  useEffect(() => {
    handleRefresh();
  }, []);

  // Handle errors with toast notifications
  useEffect(() => {
    if (errors.fetchAll) {
      toast.error('Error loading statuses', {
        description: errors.fetchAll,
      });
      clearSpecificError('fetchAll');
    }
  }, [errors.fetchAll, clearSpecificError]);

  useEffect(() => {
    if (errors.create) {
      toast.error('Error creating status', {
        description: errors.create,
      });
      clearSpecificError('create');
    }
  }, [errors.create, clearSpecificError]);

  useEffect(() => {
    if (errors.update) {
      toast.error('Error updating status', {
        description: errors.update,
      });
      clearSpecificError('update');
    }
  }, [errors.update, clearSpecificError]);

  useEffect(() => {
    if (errors.delete) {
      toast.error('Error deleting status', {
        description: errors.delete,
      });
      clearSpecificError('delete');
    }
  }, [errors.delete, clearSpecificError]);

  // ================================
  // Event Handlers
  // ================================

  /**
   * Handles refresh button click to reload statuses
   */
  const handleRefresh = async () => {
    try {
      await fetchStatuses();
      toast.success('Statuses refreshed', {
        description: 'Status list has been updated successfully.',
      });
    } catch (error) {
      // Error is handled by useEffect above
    }
  };

  /**
   * Handles create button click to open create dialog
   */
  const handleCreateClick = () => {
    createForm.reset();
    setIsCreateModalOpen(true);
  };

  /**
   * Handles edit button click to open edit dialog
   */
  const handleEditClick = (status: Status) => {
    setEditingStatus(status);
    updateForm.reset({
      description: status.description,
      slug: status.slug || '',
    });
    setIsEditModalOpen(true);
  };

  /**
   * Handles delete button click to open confirmation dialog
   */
  const handleDeleteClick = (status: Status) => {
    setDeletingId(status.id);
  };

  /**
   * Handles create form submission
   */
  const handleCreateSubmit = async (data: CreateStatusForm) => {
    try {
      const statusData: CreateStatusRequest = {
        description: data.description,
        slug: data.slug || undefined,
      };

      const newStatus = await createNewStatus(statusData);
      
      if (newStatus) {
        toast.success('Status created', {
          description: `Status "${data.description.substring(0, 50)}..." has been created successfully.`,
        });
        
        createForm.reset();
        setIsCreateModalOpen(false);
      }
    } catch (error) {
      // Error is handled by useEffect above
    }
  };

  /**
   * Handles update form submission
   */
  const handleUpdateSubmit = async (data: UpdateStatusForm) => {
    if (!editingStatus) return;

    try {
      const statusData: UpdateStatusRequest = {
        description: data.description,
        slug: data.slug || undefined,
      };

      const updatedStatus = await updateExistingStatus(editingStatus.id, statusData);
      
      if (updatedStatus) {
        toast.success('Status updated', {
          description: `Status has been updated successfully.`,
        });
        
        updateForm.reset();
        setIsEditModalOpen(false);
        setEditingStatus(null);
      }
    } catch (error) {
      // Error is handled by useEffect above
    }
  };

  /**
   * Handles delete confirmation
   */
  const handleDeleteConfirm = async () => {
    if (!deletingId) return;

    const status = statuses.find(s => s.id === deletingId);
    
    try {
      const success = await deleteExistingStatus(deletingId);
      
      if (success) {
        toast.success('Status deleted', {
          description: `Status "${status?.description.substring(0, 50) || 'Unknown'}..." has been deleted successfully.`,
        });
        
        setDeletingId(null);
      }
    } catch (error) {
      // Error is handled by useEffect above
    }
  };

  /**
   * Handles closing create dialog
   */
  const handleCloseCreateDialog = () => {
    createForm.reset();
    setIsCreateModalOpen(false);
  };

  /**
   * Handles closing edit dialog
   */
  const handleCloseEditDialog = () => {
    updateForm.reset();
    setIsEditModalOpen(false);
    setEditingStatus(null);
  };

  /**
   * Handles closing delete confirmation dialog
   */
  const handleCloseDeleteDialog = () => {
    setDeletingId(null);
  };

  // Find status being deleted for confirmation dialog
  const deletingStatus = statuses.find(s => s.id === deletingId);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Statuses</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your organization's statuses ({statusCount} total)
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading.fetchAll}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading.fetchAll ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
              
              <Button
                size="sm"
                onClick={handleCreateClick}
                disabled={loading.create}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create Status</span>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Statuses Table */}
      <Card>
        <CardContent className="p-0">
          {loading.fetchAll ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-2 text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading statuses...</span>
              </div>
            </div>
          ) : statuses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No statuses found</h3>
              <p className="text-sm text-gray-500 mb-4">
                Get started by creating your first status.
              </p>
              <Button onClick={handleCreateClick} className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Create Status</span>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold w-1/3">Description</TableHead>
                  <TableHead className="font-semibold">Slug</TableHead>
                  <TableHead className="font-semibold">Created</TableHead>
                  <TableHead className="font-semibold">Updated</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {statuses.map((status) => (
                  <TableRow key={status.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium max-w-xs">
                      <ExpandableDescriptionCell 
                        description={status.description}
                        maxLength={100}
                      />
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {status.slug || (
                        <span className="text-gray-400 italic">No slug</span>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(status.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(status.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(status)}
                          disabled={loading.update}
                          className="flex items-center space-x-1"
                        >
                          <Edit className="h-3 w-3" />
                          <span>Edit</span>
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(status)}
                          disabled={loading.delete}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Status Dialog */}
      <Dialog open={isCreateModalOpen} onOpenChange={handleCloseCreateDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Status</DialogTitle>
            <DialogDescription>
              Add a new status to your organization. The slug field is optional and will be used for URL-friendly identification.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(handleCreateSubmit)} className="space-y-4">
              <FormField
                control={createForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter status description"
                        rows={4}
                        {...field}
                        disabled={loading.create}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={createForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter URL-friendly slug"
                        {...field}
                        disabled={loading.create}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseCreateDialog}
                  disabled={loading.create}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading.create}
                  className="flex items-center space-x-2"
                >
                  {loading.create && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>Create Status</span>
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Status Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={handleCloseEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Status</DialogTitle>
            <DialogDescription>
              Update the status details. Changes will be saved immediately.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...updateForm}>
            <form onSubmit={updateForm.handleSubmit(handleUpdateSubmit)} className="space-y-4">
              <FormField
                control={updateForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description *</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter status description"
                        rows={4}
                        {...field}
                        disabled={loading.update}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={updateForm.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter URL-friendly slug"
                        {...field}
                        disabled={loading.update}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseEditDialog}
                  disabled={loading.update}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading.update}
                  className="flex items-center space-x-2"
                >
                  {loading.update && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>Update Status</span>
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingId} onOpenChange={handleCloseDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the status{' '}
              <span className="font-semibold">"{deletingStatus?.description.substring(0, 50)}..."</span> and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading.delete}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={loading.delete}
              className="bg-red-600 hover:bg-red-700 flex items-center space-x-2"
            >
              {loading.delete && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Delete Status</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StatusesPage;
