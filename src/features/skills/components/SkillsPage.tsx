// src/features/skills/components/SkillsPage.tsx
/**
 * Skills Management Component
 * 
 * Complete skills management interface with table view, CRUD dialogs,
 * confirmation modals, and skill detail viewing modal.
 * Uses ShadCN UI components and Sonner for toast notifications.
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Eye,
  AlertCircle,
} from 'lucide-react';

import { useSkills } from '../hooks/useSkills';
import type { Skill, CreateSkillDto, UpdateSkillDto } from '../types';

// Form validation schemas
const createSkillSchema = z.object({
  name: z.string().min(1, 'Skill name is required').max(255, 'Name must be less than 255 characters'),
  slug: z.string().max(255, 'Slug must be less than 255 characters').optional().or(z.literal('')),
});

const updateSkillSchema = z.object({
  name: z.string().min(1, 'Skill name is required').max(255, 'Name must be less than 255 characters'),
  slug: z.string().max(255, 'Slug must be less than 255 characters').optional().or(z.literal('')),
});

type CreateSkillForm = z.infer<typeof createSkillSchema>;
type UpdateSkillForm = z.infer<typeof updateSkillSchema>;



/**
 * Main Skills Management Component
 */
const SkillsPage: React.FC = () => {
  const {
    skills,
    loading,
    error,
    ui,
    fetchSkills,
    createSkill,
    updateSkill,
    deleteSkill,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    setSelectedSkill,
    setDeletingId,
    clearError,
  } = useSkills();

  // Local state for dialogs
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  
  // Navigation hook
  const navigate = useNavigate();

  const createForm = useForm<CreateSkillForm>({
    resolver: zodResolver(createSkillSchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  });

  const updateForm = useForm<UpdateSkillForm>({
    resolver: zodResolver(updateSkillSchema),
    defaultValues: {
      name: '',
      slug: '',
    },
  });

  // Load skills on mount
  useEffect(() => {
    handleRefresh();
  }, []);

  // Show error toasts and clear errors
  useEffect(() => {
    if (error.list) {
      toast.error('Error loading skills', { description: error.list });
      clearError('list');
    }
  }, [error.list, clearError]);

  useEffect(() => {
    if (error.create) {
      toast.error('Error creating skill', { description: error.create });
      clearError('create');
    }
  }, [error.create, clearError]);

  useEffect(() => {
    if (error.update) {
      toast.error('Error updating skill', { description: error.update });
      clearError('update');
    }
  }, [error.update, clearError]);

  useEffect(() => {
    if (error.delete) {
      toast.error('Error deleting skill', { description: error.delete });
      clearError('delete');
    }
  }, [error.delete, clearError]);

  // ================================
  // Event Handlers
  // ================================

  const handleRefresh = async () => {
    try {
      await fetchSkills();
      toast.success('Skills refreshed', { description: 'Skill list updated successfully.' });
    } catch {
      // Handled by useEffect
    }
  };

  const handleCreateClick = () => {
    createForm.reset();
    openCreateModal();
  };

  const handleEditClick = (skill: Skill) => {
    setEditingSkill(skill);
    setSelectedSkill(skill);
    updateForm.reset({
      name: skill.name,
      slug: skill.slug || '',
    });
    openEditModal();
  };

  const handleViewClick = (skill: Skill) => {
    navigate(`/skills/${skill.id}`);
  };

  const handleDeleteClick = (skill: Skill) => {
    setDeletingId(skill.id);
  };

  const handleCreateSubmit = async (data: CreateSkillForm) => {
    try {
      const skillData: CreateSkillDto = {
        name: data.name,
        slug: data.slug || undefined,
      };
      await createSkill(skillData);
      toast.success('Skill created', { description: `Skill "${data.name}" created successfully.` });
      createForm.reset();
      closeCreateModal();
    } catch {
      // Handled by useEffect
    }
  };

  const handleUpdateSubmit = async (data: UpdateSkillForm) => {
    if (!editingSkill) return;
    try {
      const skillData: UpdateSkillDto = {
        name: data.name,
        slug: data.slug || undefined,
      };
      await updateSkill(editingSkill.id, skillData);
      toast.success('Skill updated', { description: `Skill "${data.name}" updated successfully.` });
      updateForm.reset();
      closeEditModal();
      setEditingSkill(null);
    } catch {
      // Handled by useEffect
    }
  };

  const handleDeleteConfirm = async () => {
    if (!ui.deletingId) return;
    const skill = skills.find(s => s.id === ui.deletingId);
    try {
      await deleteSkill(ui.deletingId);
      toast.success('Skill deleted', { description: `Skill "${skill?.name || 'Unknown'}" deleted successfully.` });
      setDeletingId(null);
    } catch {
      // Handled by useEffect
    }
  };

  const handleCloseCreateDialog = () => {
    createForm.reset();
    closeCreateModal();
  };

  const handleCloseEditDialog = () => {
    updateForm.reset();
    closeEditModal();
    setEditingSkill(null);
  };

  const handleCloseDeleteDialog = () => {
    setDeletingId(null);
  };



  const deletingSkill = skills.find(s => s.id === ui.deletingId);

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Skills</h1>
              <p className="text-sm text-gray-500 mt-1">Manage your organization's skills</p>
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
                <span>Create Skill</span>
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Skills Table */}
      <Card>
        <CardContent className="p-0">
          {loading.list ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center space-x-2 text-gray-500">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Loading skills...</span>
              </div>
            </div>
          ) : skills.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No skills found</h3>
              <p className="text-sm text-gray-500 mb-4">Get started by creating your first skill.</p>
              <Button onClick={handleCreateClick} className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Create Skill</span>
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
                {skills.map(skill => (
                  <TableRow key={skill.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{skill.name}</TableCell>
                    <TableCell className="text-gray-600">
                      {skill.slug || <span className="text-gray-400 italic">No slug</span>}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(skill.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {new Date(skill.updated_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewClick(skill)}
                          className="flex items-center space-x-1"
                        >
                          <Eye className="h-3 w-3" />
                          <span>View</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditClick(skill)}
                          disabled={loading.update}
                          className="flex items-center space-x-1"
                        >
                          <Edit className="h-3 w-3" />
                          <span>Edit</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(skill)}
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

      {/* Create Skill Dialog */}
      <Dialog open={ui.isCreateModalOpen} onOpenChange={handleCloseCreateDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Skill</DialogTitle>
            <DialogDescription>
              Add a new skill to your organization. The slug field is optional and will be used for URL-friendly identification.
            </DialogDescription>
          </DialogHeader>
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(handleCreateSubmit)} className="space-y-4">
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter skill name" {...field} disabled={loading.create} />
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
                      <Input placeholder="Enter URL-friendly slug" {...field} disabled={loading.create} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseCreateDialog} disabled={loading.create}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading.create} className="flex items-center space-x-2">
                  {loading.create && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>Create Skill</span>
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Skill Dialog */}
      <Dialog open={ui.isEditModalOpen} onOpenChange={handleCloseEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Skill</DialogTitle>
            <DialogDescription>Update the skill details. Changes will be saved immediately.</DialogDescription>
          </DialogHeader>
          <Form {...updateForm}>
            <form onSubmit={updateForm.handleSubmit(handleUpdateSubmit)} className="space-y-4">
              <FormField
                control={updateForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Skill Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter skill name" {...field} disabled={loading.update} />
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
                      <Input placeholder="Enter URL-friendly slug" {...field} disabled={loading.update} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleCloseEditDialog} disabled={loading.update}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading.update} className="flex items-center space-x-2">
                  {loading.update && <Loader2 className="h-4 w-4 animate-spin" />}
                  <span>Update Skill</span>
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
              This action cannot be undone. This will permanently delete the skill{' '}
              <span className="font-semibold">"{deletingSkill?.name}"</span> and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading.delete}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={loading.delete}
              className="bg-red-600 hover:bg-red-700 flex items-center space-x-2"
            >
              {loading.delete && <Loader2 className="h-4 w-4 animate-spin" />}
              <span>Delete Skill</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>


    </div>
  );
};

export default SkillsPage;
