/**
 * User Assignments Page
 * 
 * This page displays all role assignments for a specific user
 * using the useUserRolesStoresAssignment hook.
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserRolesStoresAssignment } from '@/features/userRolesStoresAssignment/hooks/UseUserRolesStoresAssignment';
import { useRoles } from '@/features/roles/hooks/useRoles';
import { useStores } from '@/features/stores/hooks/useStores';
import {
  AssignmentsTable,
  DeleteAssignmentDialog,
} from '@/features/userRolesStoresAssignment/components/userAssignmentsPage';
import { ManageLayout } from '@/components/layouts/ManageLayout';
import type { Assignment } from '@/features/userRolesStoresAssignment/types';

export const UserAssignmentsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const userIdNumber = userId ? parseInt(userId) : 0;
  
  const {
    getUserAssignments,
    fetchUserAssignments,
    isLoadingUserAssignments,
    getUserAssignmentsError,
    toggleUserRoleStatus,
    removeUserRole,
  } = useUserRolesStoresAssignment();

  // Fetch roles and stores to get names
  const { roles } = useRoles();
  const { stores } = useStores();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);
  const [updatingAssignments, setUpdatingAssignments] = useState<Set<number>>(new Set());

  // Fetch user assignments on component mount
  useEffect(() => {
    if (userIdNumber) {
      fetchUserAssignments(userIdNumber);
    }
  }, [userIdNumber, fetchUserAssignments]);

  const assignments = getUserAssignments(userIdNumber);
  const loading = isLoadingUserAssignments();
  const error = getUserAssignmentsError();

  const handleBack = () => {
    navigate('/user-role-store-assignment');
  };

  const handleAssignRole = () => {
    navigate(`/user-role-store-assignment/assign?userId=${userId}`);
  };

  const getRoleName = (roleId: number) => {
    const role = roles.find(r => r.id === roleId);
    return role ? role.name : `Role ID: ${roleId}`;
  };

  const getStoreName = (storeId: string) => {
    const store = stores.find(s => s.id === storeId);
    return store ? store.name : storeId;
  };

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
      fetchUserAssignments(userIdNumber);
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
      fetchUserAssignments(userIdNumber);
    } catch (error) {
      console.error('Failed to delete assignment:', error);
    }
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
      title="User Role Assignments"
      subtitle={`View all role assignments for User ID: ${userId}`}
      backButton={{
        show: true,
        onClick: handleBack
      }}
    >
      <AssignmentsTable
        assignments={assignments}
        loading={loading}
        error={error}
        getRoleName={getRoleName}
        getStoreName={getStoreName}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDeleteClick}
        updatingAssignments={updatingAssignments}
        formatDate={formatDate}
        onAssignRole={handleAssignRole}
      />

      <DeleteAssignmentDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        assignment={assignmentToDelete}
        onConfirm={handleDeleteConfirm}
        getRoleName={getRoleName}
        getStoreName={getStoreName}
      />
    </ManageLayout>
  );
};

export default UserAssignmentsPage;