import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../components/ui/card';
import { Separator } from '../../../components/ui/separator';
import { Shield, Building, User, Calendar, FileText, Edit, X } from 'lucide-react';
import type { RoleHierarchyTableData } from '../../../types/roleHierarchy';
import { formatDate } from '../../../utils/dateUtils';

interface HierarchyDetailsModalProps {
  hierarchy: RoleHierarchyTableData | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (hierarchy: RoleHierarchyTableData) => void;
}

const HierarchyDetailsModal: React.FC<HierarchyDetailsModalProps> = ({
  hierarchy,
  isOpen,
  onClose,
  onEdit,
}) => {
  if (!hierarchy) {
    return null;
  }

  const handleEdit = () => {
    if (onEdit) {
      onEdit(hierarchy);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-blue-500" />
                <span>Role Hierarchy Details</span>
              </DialogTitle>
              <DialogDescription>
                Detailed information about the role hierarchy relationship
              </DialogDescription>
            </div>
            <div className="flex space-x-2">
              {onEdit && (
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-gray-600">Higher Role</span>
                  </div>
                  <div className="pl-6">
                    <div className="font-semibold">{hierarchy.higherRoleName}</div>
                    <div className="text-sm text-gray-500">ID: {hierarchy.higher_role_id}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-600">Lower Role</span>
                  </div>
                  <div className="pl-6">
                    <div className="font-semibold">{hierarchy.lowerRoleName}</div>
                    <div className="text-sm text-gray-500">ID: {hierarchy.lower_role_id}</div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Building className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-medium text-gray-600">Store</span>
                  </div>
                  <div className="pl-6">
                    <div className="font-semibold">{hierarchy.storeName}</div>
                    <div className="text-sm text-gray-500">ID: {hierarchy.store_id}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">Status</span>
                  </div>
                  <div className="pl-6">
                    <Badge variant={hierarchy.is_active ? 'default' : 'secondary'}>
                      {hierarchy.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Metadata</CardTitle>
              <CardDescription>
                Additional information about this hierarchy relationship
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-medium text-gray-600">Created By</span>
                  </div>
                  <div className="pl-6">
                    <div className="font-semibold">{hierarchy.created_at}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-indigo-500" />
                    <span className="text-sm font-medium text-gray-600">Created Date</span>
                  </div>
                  <div className="pl-6">
                    <div className="font-semibold">{formatDate(hierarchy.created_at)}</div>
                  </div>
                </div>
              </div>

               
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-600">Reason</span>
                    </div>
                    {/* <div className="pl-6">
                      <div className="text-sm bg-gray-50 p-3 rounded-md border">
                        {hierarchy.reason}
                      </div>
                    </div> */}
                  </div>
                </>
              
            </CardContent>
          </Card>

          {/* Hierarchy Relationship */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Hierarchy Relationship</CardTitle>
              <CardDescription>
                Visual representation of the role relationship
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center space-x-4 p-6 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="font-semibold text-sm">{hierarchy.higherRoleName}</div>
                  <div className="text-xs text-gray-500">Higher Role</div>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="text-2xl font-bold text-gray-400">→</div>
                  <div className="text-xs text-gray-500 mt-1">manages</div>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <Shield className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="font-semibold text-sm">{hierarchy.lowerRoleName}</div>
                  <div className="text-xs text-gray-500">Lower Role</div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <div className="inline-flex items-center space-x-2 text-sm text-gray-600">
                  <Building className="h-4 w-4" />
                  <span>Within {hierarchy.storeName}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">System Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Hierarchy ID:</span>
                  <div className="font-mono">{hierarchy.id}</div>
                </div>
                <div>
                  <span className="text-gray-600">Store ID:</span>
                  <div className="font-mono">{hierarchy.store_id}</div>
                </div>
                <div>
                  <span className="text-gray-600">Higher Role ID:</span>
                  <div className="font-mono">{hierarchy.higher_role_id}</div>
                </div>
                <div>
                  <span className="text-gray-600">Lower Role ID:</span>
                  <div className="font-mono">{hierarchy.lower_role_id}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HierarchyDetailsModal;