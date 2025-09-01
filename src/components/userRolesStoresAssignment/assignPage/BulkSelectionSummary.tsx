import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Users, Shield, Store, Settings } from 'lucide-react';

interface AssignmentData {
  selectedUsers: number[];
  selectedRoles: number[];
  selectedStores: string[];
}

interface User {
  id: number;
  name: string;
  email: string;
  roles?: any[];
  created_at: string;
}

interface Role {
  id: number;
  name: string;
  created_at: string;
}

interface Store {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  metadata: {
    address?: string;
    phone?: string;
  };
}

interface BulkSelectionSummaryProps {
  assignmentData: AssignmentData;
  users: User[];
  roles: Role[];
  stores: Store[];
}

export const BulkSelectionSummary: React.FC<BulkSelectionSummaryProps> = ({
  assignmentData,
  users,
  roles,
  stores,
}) => {
  const hasSelection = assignmentData.selectedUsers.length > 0 || 
                      assignmentData.selectedRoles.length > 0 || 
                      assignmentData.selectedStores.length > 0;

  if (!hasSelection) return null;

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex items-center gap-2 text-card-foreground text-base sm:text-lg">
          <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          Selection Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 p-3 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              <span className="font-medium text-xs sm:text-sm text-card-foreground">
                Selected Users ({assignmentData.selectedUsers.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {assignmentData.selectedUsers.slice(0, 3).map(userId => {
                const user = users.find(u => u.id === userId);
                return user ? (
                  <Badge key={userId} variant="secondary" className="text-xs bg-secondary text-secondary-foreground border-border">
                    {user.name}
                  </Badge>
                ) : null;
              })}
              {assignmentData.selectedUsers.length > 3 && (
                <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                  +{assignmentData.selectedUsers.length - 3} more
                </Badge>
              )}
            </div>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              <span className="font-medium text-xs sm:text-sm text-card-foreground">
                Selected Roles ({assignmentData.selectedRoles.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {assignmentData.selectedRoles.slice(0, 3).map(roleId => {
                const role = roles.find(r => r.id === roleId);
                return role ? (
                  <Badge key={roleId} variant="secondary" className="text-xs bg-secondary text-secondary-foreground border-border">
                    {role.name}
                  </Badge>
                ) : null;
              })}
              {assignmentData.selectedRoles.length > 3 && (
                <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                  +{assignmentData.selectedRoles.length - 3} more
                </Badge>
              )}
            </div>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2">
              <Store className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              <span className="font-medium text-xs sm:text-sm text-card-foreground">
                Selected Stores ({assignmentData.selectedStores.length})
              </span>
            </div>
            <div className="flex flex-wrap gap-1">
              {assignmentData.selectedStores.slice(0, 3).map(storeId => {
                const store = stores.find(s => s.id === storeId);
                return store ? (
                  <Badge key={storeId} variant="secondary" className="text-xs bg-secondary text-secondary-foreground border-border">
                    {store.name}
                  </Badge>
                ) : null;
              })}
              {assignmentData.selectedStores.length > 3 && (
                <Badge variant="outline" className="text-xs border-border text-muted-foreground">
                  +{assignmentData.selectedStores.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};