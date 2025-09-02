/**
 * Store Assignments Page
 * 
 * This page displays all role assignments for a specific store
 * using the useUserRolesStoresAssignment hook.
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserRolesStoresAssignment } from '../../features/userRolesStoresAssignment/hooks/UseUserRolesStoresAssignment';
import { useUsers } from '../../features/users/hooks/useUsers';
import { useRoles } from '../../features/roles/hooks/useRoles';
import { ManageLayout } from '../../components/layouts/ManageLayout';
import {
  AssignmentsCard,
  DeleteConfirmationDialog,
} from '../../components/userRolesStoresAssignment/storeAssignmentsPage';
import type { Assignment } from '../../features/userRolesStoresAssignment/types';

export const StoreAssignmentsPage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  
  const {
    getStoreAssignments,
    fetchStoreAssignments,
    isLoadingStoreAssignments,
    getStoreAssignmentsError,
    toggleUserRoleStatus,
    removeUserRole,
    // Removed unused variables: isToggling, isRemoving, toggleError, removeError
  } = useUserRolesStoresAssignment();
  
  const { users } = useUsers();
  const { roles } = useRoles();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);
  const [updatingAssignments, setUpdatingAssignments] = useState<Set<number>>(new Set());

  // Fetch store assignments on component mount
  useEffect(() => {
    if (storeId) {
      fetchStoreAssignments(storeId);
    }
  }, [storeId, fetchStoreAssignments]);

  // Helper functions to get names
  const getUserName = (userId: number) => {
    const user = users?.find(u => u.id === userId);
    return user ? user.name : `User ID: ${userId}`;
  };

  const getRoleName = (roleId: number) => {
    const role = roles?.find(r => r.id === roleId);
    return role ? role.name : `Role ID: ${roleId}`;
  };

  // getStoreName function removed as it's not used

  // Handle toggle status
  const handleToggleStatus = async (assignment: Assignment) => {
    if (!assignment.id || updatingAssignments.has(assignment.id)) return;
    
    setUpdatingAssignments(prev => new Set(prev).add(assignment.id!));
    try {
      await toggleUserRoleStatus({
        user_id: assignment.user_id,
        role_id: assignment.role_id,
        store_id: assignment.store_id
      });
      // Refresh the assignments after toggle
      if (storeId) {
        fetchStoreAssignments(storeId);
      }
    } catch (error) {
      console.error('Failed to toggle assignment status:', error);
    } finally {
      setUpdatingAssignments(prev => {
        const newSet = new Set(prev);
        if (assignment.id) {
          newSet.delete(assignment.id);
        }
        return newSet;
      });
    }
  };

  // Handle delete
  const handleDeleteClick = (assignment: Assignment) => {
    setAssignmentToDelete(assignment);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!assignmentToDelete) return;
    
    try {
      await removeUserRole({
        user_id: assignmentToDelete.user_id,
        role_id: assignmentToDelete.role_id,
        store_id: assignmentToDelete.store_id
      });
      setDeleteDialogOpen(false);
      setAssignmentToDelete(null);
      // Refresh the assignments after deletion
      if (storeId) {
        fetchStoreAssignments(storeId);
      }
    } catch (error) {
      console.error('Failed to delete assignment:', error);
    }
  };

  // Handle assign role navigation
  const handleAssignRole = () => {
    navigate(`/user-role-store-assignment/assign?storeId=${storeId}`);
  };

  const assignments = getStoreAssignments(storeId || '');
  const loading = isLoadingStoreAssignments();
  const error = getStoreAssignmentsError();

  const handleBack = () => {
    navigate('/user-role-store-assignment');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <ManageLayout
      title="Store Role Assignments"
      subtitle={`View all role assignments for Store ID: ${storeId || ''}`}
      backButton={{
        show: true,
        onClick: handleBack
      }}
    >
      <AssignmentsCard
        assignments={assignments}
        loading={loading}
        error={error}
        getUserName={getUserName}
        getRoleName={getRoleName}
        formatDate={formatDate}
        onToggleStatus={handleToggleStatus}
        onDeleteClick={handleDeleteClick}
        onAssignRole={handleAssignRole}
        updatingAssignments={updatingAssignments}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        assignmentToDelete={assignmentToDelete}
        getUserName={getUserName}
        getRoleName={getRoleName}
        onConfirm={handleDeleteConfirm}
      />
    </ManageLayout>
  );
};

export default StoreAssignmentsPage;