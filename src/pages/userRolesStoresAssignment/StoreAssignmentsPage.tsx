/**
 * Store Assignments Page
 * 
 * This page displays all role assignments for a specific store
 * using the useUserRolesStoresAssignment hook.
 */

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUserRolesStoresAssignment } from '../../features/userRolesStoresAssignment/hooks/UseUserRolesStoresAssignment';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Loader2, ArrowLeft, User, Store, Shield } from 'lucide-react';
import { Separator } from '../../components/ui/separator';

export const StoreAssignmentsPage: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  
  const {
    getStoreAssignments,
    fetchStoreAssignments,
    isLoadingStoreAssignments,
    getStoreAssignmentsError
  } = useUserRolesStoresAssignment();

  // Fetch store assignments on component mount
  useEffect(() => {
    if (storeId) {
      fetchStoreAssignments(storeId);
    }
  }, [storeId, fetchStoreAssignments]);

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
    <div className="container mx-auto p-6 space-y-8">
      {/* Page Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Store Role Assignments</h1>
          <p className="text-muted-foreground">
            View all role assignments for Store ID: {storeId}
          </p>
        </div>
      </div>

      <Separator />

      {/* Assignments Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Store className="h-5 w-5" />
            <CardTitle>Role Assignments</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-red-500 text-center py-4">
              Error loading assignments: {error.message || 'Unknown error'}
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading assignments...</span>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Assignment ID</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Date</TableHead>
                  <TableHead>Updated Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No role assignments found for this store
                    </TableCell>
                  </TableRow>
                ) : (
                  assignments.map((assignment) => (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-mono text-sm">
                        {assignment.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">
                            User ID: {assignment.user_id}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-green-500" />
                          <span className="font-medium">
                            Role ID: {assignment.role_id}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={assignment.is_active ? 'default' : 'secondary'}
                        >
                          {assignment.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(assignment.created_at)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(assignment.updated_at)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StoreAssignmentsPage;