import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import type { UserRoleStoreAssignment } from '../../../types/userRoleStoreAssignment';
import { Calendar, User, Store, Shield, Clock, FileText } from 'lucide-react';

interface AssignmentDetailsDialogProps {
  assignment: UserRoleStoreAssignment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AssignmentDetailsDialog: React.FC<AssignmentDetailsDialogProps> = ({
  assignment,
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Assignment Details
          </DialogTitle>
          <DialogDescription>
            View detailed information about this user role assignment.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-4 w-4" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Name</p>
                  <p className="font-medium">{assignment.user?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="text-sm">{assignment.user?.email || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">User ID</p>
                  <p className="text-sm font-mono">{assignment.user_id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Role Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-4 w-4" />
                Role Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Role Name</p>
                  <Badge variant="outline" className="mt-1">
                    {assignment.role?.name || 'N/A'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Role ID</p>
                  <p className="text-sm font-mono">{assignment.role_id}</p>
                </div>
              </div>
              {assignment.role?.description && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Description</p>
                  <p className="text-sm">{assignment.role.description}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Store Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Store className="h-4 w-4" />
                Store Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Store Name</p>
                  <p className="font-medium">{assignment.store?.name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Store ID</p>
                  <p className="text-sm font-mono">{assignment.store_id}</p>
                </div>
              </div>
              {assignment.store?.address && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Address</p>
                  <p className="text-sm">{assignment.store.address}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Assignment Status & Dates */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-4 w-4" />
                Assignment Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Status</p>
                  <Badge variant={assignment.is_active ? 'default' : 'secondary'} className="mt-1">
                    {assignment.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Created Date</p>
                  <p className="text-sm">
                    {assignment.created_at 
                      ? new Date(assignment.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'N/A'
                    }
                  </p>
                </div>
                {assignment.metadata?.start_date && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                    <p className="text-sm">
                      {new Date(assignment.metadata.start_date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                )}
                {assignment.updated_at && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                    <p className="text-sm">
                      {new Date(assignment.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Metadata */}
          {assignment.metadata && Object.keys(assignment.metadata).length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-4 w-4" />
                  Additional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {assignment.metadata.notes && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Notes</p>
                    <p className="text-sm bg-muted p-2 rounded">{assignment.metadata.notes}</p>
                  </div>
                )}
                {assignment.metadata.department && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Department</p>
                    <p className="text-sm">{assignment.metadata.department}</p>
                  </div>
                )}
                {assignment.metadata.manager_id && (
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Manager ID</p>
                    <p className="text-sm font-mono">{assignment.metadata.manager_id}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssignmentDetailsDialog;