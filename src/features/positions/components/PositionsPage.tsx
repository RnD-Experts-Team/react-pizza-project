/**
 * Positions Management Component
 * 
 * A complete positions management interface with table view, CRUD dialogs,
 * and confirmation modals. Uses ShadCN UI components and Sonner for toast notifications.
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
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { 
  Loader2, 
  Plus, 
  RefreshCw, 
  Edit, 
  Trash2,
  AlertCircle
} from 'lucide-react';

import { usePositions } from '../hooks/usePositions';
import type { Position, CreatePositionDto, UpdatePositionDto } from '../types';

// Form validation schemas
const createPositionSchema = z.object({
  name: z.string().min(1, 'Position name is required').max(255, 'Name must be less than 255 characters'),
  slug: z.string().max(255, 'Slug must be less than 255 characters').optional().or(z.literal('')),
});

const updatePositionSchema = z.object({
  name: z.string().min(1, 'Position name is required').max(255, 'Name must be less than 255 characters'),
  slug: z.string().max(255, 'Slug must be less than 255 characters').optional().or(z.literal('')),
});

type CreatePositionForm = z.infer<typeof createPositionSchema>;
type UpdatePositionForm = z.infer<typeof updatePositionSchema>;

/**
 * Main Positions Management Component
 * Provides complete CRUD interface for position management
 */
const PositionsPage: React.FC = () => {
  // Hook for positions management
  const {
    positions,
    loading,
    error,
    ui,
    fetchPositions,
    createPosition,
    updatePosition,
    deletePosition,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    setSelectedPosition,
    setDeletingId,
    clearError,
  } = usePositions();

  // Local state for dialog management
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);

  // Forms for create and update
  const createForm = useForm<CreatePositionForm>({
    resolver: zodResolver(createPositionSchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  });

  const updateForm = useForm<UpdatePositionForm>({
    resolver: zodResolver(updatePositionSchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  });

  // Load positions on component mount
  useEffect(() => {
    handleRefresh();
  }, []);

  // Clear errors when they exist (with toast notifications)
  useEffect(() => {
    if (error.list) {
      toast.error('Error loading positions', {
        description: error.list,
      });
      clearError('list');
    }
  }, [error.list, clearError]);

  useEffect(() => {
    if (error.create) {
      toast.error('Error creating position', {
        description: error.create,
      });
      clearError('create');
    }
  }, [error.create, clearError]);

  useEffect(() => {
    if (error.update) {
      toast.error('Error updating position', {
        description: error.update,
      });
      clearError('update');
    }
  }, [error.update, clearError]);

  useEffect(() => {
    if (error.delete) {
      toast.error('Error deleting position', {
        description: error.delete,
      });
      clearError('delete');
    }
  }, [error.delete, clearError]);

  // ================================
  // Event Handlers
  // ================================

  /**
   * Handles refresh button click to reload positions
   */
  const handleRefresh = async () => {
    try {
      await fetchPositions({ per_page: 50 });
      toast.success('Positions refreshed', {
        description: 'Position list has been updated successfully.',
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
    openCreateModal();
  };

  /**
   * Handles edit button click to open edit dialog
   */
  const handleEditClick = (position: Position) => {
    setEditingPosition(position);
    setSelectedPosition(position);
    updateForm.reset({
      name: position.name,
      slug: position.slug || '',
    });
    openEditModal();
  };

  /**
   * Handles delete button click to open confirmation dialog
   */
  const handleDeleteClick = (position: Position) => {
    setDeletingId(position.id);
  };

  /**
   * Handles create form submission
   */
  const handleCreateSubmit = async (data: CreatePositionForm) => {
    try {
      const positionData: CreatePositionDto = {
        name: data.name,
        slug: data.slug || undefined,
      };

      await createPosition(positionData);
      
      toast.success('Position created', {
        description: `Position "${data.name}" has been created successfully.`,
      });
      
      createForm.reset();
      closeCreateModal();
    } catch (error) {
      // Error is handled by useEffect above
    }
  };

  /**
   * Handles update form submission
   */
  const handleUpdateSubmit = async (data: UpdatePositionForm) => {
    if (!editingPosition) return;

    try {
      const positionData: UpdatePositionDto = {
        name: data.name,
        slug: data.slug || undefined,
      };

      await updatePosition(editingPosition.id, positionData);
      
      toast.success('Position updated', {
        description: `Position "${data.name}" has been updated successfully.`,
      });
      
      updateForm.reset();
      closeEditModal();
      setEditingPosition(null);
    } catch (error) {
      // Error is handled by useEffect above
    }
  };

  /**
   * Handles delete confirmation
   */
  const handleDeleteConfirm = async () => {
    if (!ui.deletingId) return;

    const position = positions.find(p => p.id === ui.deletingId);
    
    try {
      await deletePosition(ui.deletingId);
      
      toast.success('Position deleted', {
        description: `Position "${position?.name || 'Unknown'}" has been deleted successfully.`,
      });
      
      setDeletingId(null);
    } catch (error) {
      // Error is handled by useEffect above
    }
  };

  /**
   * Handles closing create dialog
   */
  const handleCloseCreateDialog = () => {
    createForm.reset();
    closeCreateModal();
  };

  /**
   * Handles closing edit dialog
   */
  const handleCloseEditDialog = () => {
    updateForm.reset();
    closeEditModal();
    setEditingPosition(null);
  };

  /**
   * Handles closing delete confirmation dialog
   */
  const handleCloseDeleteDialog = () => {
    setDeletingId(null);
  };

  // Find position being deleted for confirmation dialog
  const deletingPosition = positions.find(p => p.id === ui.deletingId);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Positions</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage your organization's positions
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading.list}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading.list ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </Button>
              
              <Button
                size="sm"
                onClick={handleCreateClick}
                disabled={loading.create}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Create Position</span>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Positions Table */}
      <Card>
        <CardContent className="p-0">
          {loading.list ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-2 text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading positions...</span>
              </div>
            </div>
          ) : positions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No positions found</h3>
              <p className="text-sm text-gray-500 mb-4">
                Get started by creating your first position.
              </p>
              <Button onClick={handleCreateClick} className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Create Position</span>
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Slug</TableHead>
                  <TableHead className="font-semibold">Created</TableHead>
                  <TableHead className="font-semibold">Updated</TableHead>
                  <TableHead className="text-right font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {positions.map((position) => (
                  <TableRow key={position.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{position.name}</TableCell>
                    <TableCell className="text-gray-600">
                      {position.slug || (
                        <span className="text-gray-400 italic">No slug</span>
                      )}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(position.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(position.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(position)}
                          disabled={loading.update}
                          className="flex items-center space-x-1"
                        >
                          <Edit className="h-3 w-3" />
                          <span>Edit</span>
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(position)}
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

      {/* Create Position Dialog */}
      <Dialog open={ui.isCreateModalOpen} onOpenChange={handleCloseCreateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Position</DialogTitle>
            <DialogDescription>
              Add a new position to your organization. The slug field is optional and will be used for URL-friendly identification.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(handleCreateSubmit)} className="space-y-4">
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter position name"
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
                  <span>Create Position</span>
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Position Dialog */}
      <Dialog open={ui.isEditModalOpen} onOpenChange={handleCloseEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Position</DialogTitle>
            <DialogDescription>
              Update the position details. Changes will be saved immediately.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...updateForm}>
            <form onSubmit={updateForm.handleSubmit(handleUpdateSubmit)} className="space-y-4">
              <FormField
                control={updateForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter position name"
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
                  <span>Update Position</span>
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!ui.deletingId} onOpenChange={handleCloseDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the position{' '}
              <span className="font-semibold">"{deletingPosition?.name}"</span> and all associated data.
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
              <span>Delete Position</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PositionsPage;
