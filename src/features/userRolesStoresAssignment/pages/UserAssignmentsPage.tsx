/**
 * User Assignments Page
 * 
 * This page displays all role assignments for a specific user
 * using the useUserRolesStoresAssignment hook.
 */
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserRolesStoresAssignment } from '@/features/userRolesStoresAssignment/hooks/UseUserRolesStoresAssignment';
import {
  AssignmentsTable,
  DeleteAssignmentDialog,
} from '@/features/userRolesStoresAssignment/components/userAssignmentsPage';
import { ManageLayout } from '@/components/layouts/ManageLayout';
import type { Assignment } from '@/features/userRolesStoresAssignment/types';

const DATE_FORMAT_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
};

export const UserAssignmentsPage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  
  const userIdNumber = useMemo(() => {
    return userId ? parseInt(userId) : 0;
  }, [userId]);
  
  const {
    getUserAssignments,
    fetchUserAssignments,
    isLoadingUserAssignments,
    getUserAssignmentsError,
    toggleUserRoleStatus,
    removeUserRole,
  } = useUserRolesStoresAssignment();
  
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);
  const [updatingAssignments, setUpdatingAssignments] = useState<Set<number>>(new Set());
  
  // Fetch user assignments on component mount
  useEffect(() => {
    if (userIdNumber) {
      fetchUserAssignments(userIdNumber);
    }
  }, [userIdNumber, fetchUserAssignments]);
  
  // Memoize expensive data derivations
  const assignments = useMemo(() => {
    return getUserAssignments(userIdNumber);
  }, [getUserAssignments, userIdNumber]);
  
  const loading = useMemo(() => {
    return isLoadingUserAssignments();
  }, [isLoadingUserAssignments]);
  
  const error = useMemo(() => {
    return getUserAssignmentsError();
  }, [getUserAssignmentsError]);
  
  // Memoize callback functions
  const handleBack = useCallback(() => {
    navigate('/user-role-store-assignment');
  }, [navigate]);
  
  const handleAssignRole = useCallback(() => {
    navigate(`/user-role-store-assignment/assign?userId=${userId}`);
  }, [navigate, userId]);
  
  const getRoleName = useCallback((roleId: number) => {
    // Get role name from assignment data if available
    const assignment = assignments.find(a => a.role_id === roleId);
    return assignment?.role?.name || `Role ID: ${roleId}`;
  }, [assignments]);
  
  const getStoreName = useCallback((storeId: string) => {
    // Get store name from assignment data if available
    const assignment = assignments.find(a => a.store_id === storeId);
    return assignment?.store?.name || storeId;
  }, [assignments]);
  
  const handleToggleStatus = useCallback(async (assignment: Assignment) => {
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
  }, [updatingAssignments, toggleUserRoleStatus, fetchUserAssignments, userIdNumber]);
  
  // Handle delete
  const handleDeleteClick = useCallback((assignment: Assignment) => {
    setAssignmentToDelete(assignment);
    setDeleteDialogOpen(true);
  }, []);
  
  const handleDeleteConfirm = useCallback(async () => {
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
  }, [assignmentToDelete, removeUserRole, fetchUserAssignments, userIdNumber]);

  const handleDeleteDialogOpenChange = useCallback((open: boolean) => {
    setDeleteDialogOpen(open);
    if (!open) {
      setAssignmentToDelete(null);
    }
  }, []);
  
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', DATE_FORMAT_OPTIONS);
  }, []);
  
  // Memoize layout props
  const layoutProps = useMemo(() => ({
    title: "User Role Assignments",
    subtitle: `View all role assignments for User ID: ${userId}`,
    backButton: {
      show: true,
      onClick: handleBack
    }
  }), [userId, handleBack]);
  
  // Memoize table props
  const tableProps = useMemo(() => ({
    assignments,
    loading,
    error,
    getRoleName,
    getStoreName,
    onToggleStatus: handleToggleStatus,
    onDelete: handleDeleteClick,
    updatingAssignments,
    formatDate,
    onAssignRole: handleAssignRole
  }), [
    assignments,
    loading,
    error,
    getRoleName,
    getStoreName,
    handleToggleStatus,
    handleDeleteClick,
    updatingAssignments,
    formatDate,
    handleAssignRole
  ]);
  
  // Memoize dialog props
  const dialogProps = useMemo(() => ({
    open: deleteDialogOpen,
    onOpenChange: handleDeleteDialogOpenChange,
    assignment: assignmentToDelete,
    onConfirm: handleDeleteConfirm,
    getRoleName,
    getStoreName
  }), [
    deleteDialogOpen,
    handleDeleteDialogOpenChange,
    assignmentToDelete,
    handleDeleteConfirm,
    getRoleName,
    getStoreName
  ]);
  
  return (
    <ManageLayout {...layoutProps}>
      <AssignmentsTable {...tableProps} />
      <DeleteAssignmentDialog {...dialogProps} />
    </ManageLayout>
  );
};

export default UserAssignmentsPage;
