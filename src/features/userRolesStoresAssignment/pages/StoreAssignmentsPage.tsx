/**
 * Store Assignments Page
 * 
 * This page displays all role assignments for a specific store
 * using the useUserRolesStoresAssignment hook.
 */
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserRolesStoresAssignment } from '@/features/userRolesStoresAssignment/hooks/UseUserRolesStoresAssignment';
import { ManageLayout } from '@/components/layouts/ManageLayout';
import {
  AssignmentsCard,
  DeleteConfirmationDialog,
} from '@/features/userRolesStoresAssignment/components/storeAssignmentsPage';
import type { Assignment } from '@/features/userRolesStoresAssignment/types';

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
  } = useUserRolesStoresAssignment();

  // State for UI controls
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<Assignment | null>(null);
  const [updatingAssignments, setUpdatingAssignments] = useState<Set<number>>(new Set());
  
  // State for error messages
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Get data from hook
  const assignments = getStoreAssignments(storeId || '');
  const loading = isLoadingStoreAssignments();
  const error = getStoreAssignmentsError();

  // Fetch store assignments on component mount
  useEffect(() => {
    if (storeId) {
      fetchStoreAssignments(storeId);
    }
  }, [storeId, fetchStoreAssignments]);

  // Clear error message when assignments change
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  // Memoized helper functions to get names from assignment data
  const getUserName = useCallback((userId: number) => {
    const assignment = assignments.find(a => a.user_id === userId);
    return assignment?.user?.name || `User ID: ${userId}`;
  }, [assignments]);

  const getRoleName = useCallback((roleId: number) => {
    const assignment = assignments.find(a => a.role_id === roleId);
    return assignment?.role?.name || `Role ID: ${roleId}`;
  }, [assignments]);

  // Memoized handle toggle status
  const handleToggleStatus = useCallback(async (assignment: Assignment) => {
    if (!assignment.id || updatingAssignments.has(assignment.id)) return;
    
    setUpdatingAssignments(prev => new Set(prev).add(assignment.id!));
    setErrorMessage(null); // Clear any previous error
    
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
      setErrorMessage('Failed to update assignment status. Please try again.');
    } finally {
      setUpdatingAssignments(prev => {
        const newSet = new Set(prev);
        if (assignment.id) {
          newSet.delete(assignment.id);
        }
        return newSet;
      });
    }
  }, [toggleUserRoleStatus, storeId, fetchStoreAssignments, updatingAssignments]);

  // Memoized handle delete click
  const handleDeleteClick = useCallback((assignment: Assignment) => {
    setAssignmentToDelete(assignment);
    setDeleteDialogOpen(true);
  }, []);

  // Memoized handle delete confirm
  const handleDeleteConfirm = useCallback(async () => {
    if (!assignmentToDelete) return;
    
    setErrorMessage(null); // Clear any previous error
    
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
      setErrorMessage('Failed to delete assignment. Please try again.');
      // Keep dialog open so user can retry
    }
  }, [assignmentToDelete, removeUserRole, storeId, fetchStoreAssignments]);

  // Memoized handle assign role navigation
  const handleAssignRole = useCallback(() => {
    navigate(`/user-role-store-assignment/assign?storeId=${storeId}`);
  }, [navigate, storeId]);

  // Memoized handle back navigation
  const handleBack = useCallback(() => {
    navigate('/user-role-store-assignment');
  }, [navigate]);

  // Memoized format date function
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }, []);

  return (
    <ManageLayout
      title="Store Role Assignments"
      subtitle={`View all role assignments for Store ID: ${storeId || ''}`}
      backButton={{
        show: true,
        onClick: handleBack
      }}
    >
      {/* Error message display */}
      {errorMessage && (
        <div style={{
          backgroundColor: '#fee2e2',
          border: '1px solid #fecaca',
          color: '#dc2626',
          padding: '12px',
          marginBottom: '16px',
          borderRadius: '6px',
          fontSize: '14px'
        }}>
          {errorMessage}
        </div>
      )}
      
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
