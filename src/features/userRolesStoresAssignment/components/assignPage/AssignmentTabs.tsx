// components/AssignmentTabs.tsx
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BulkUserSelectionTab } from '@/features/userRolesStoresAssignment/components/assignPage/BulkUserSelectionTab';
import { BulkRoleSelectionTab } from '@/features/userRolesStoresAssignment/components/assignPage/BulkRoleSelectionTab';
import { BulkStoreSelectionTab } from '@/features/userRolesStoresAssignment/components/assignPage/BulkStoreSelectionTab';
import { Users, Shield, Store } from 'lucide-react';
import type { AssignmentData } from '@/features/userRolesStoresAssignment/types';

interface AssignmentTabsProps {
  assignmentData: AssignmentData;
  onUserToggle: (userId: number) => void;
  onRoleToggle: (roleId: number) => void;
  onStoreToggle: (storeId: string) => void;
  onSelectAllUsers: () => void;
  onSelectAllRoles: () => void;
  onSelectAllStores: () => void;
}

export const AssignmentTabs: React.FC<AssignmentTabsProps> = ({
  assignmentData,
  onUserToggle,
  onRoleToggle,
  onStoreToggle,
  onSelectAllUsers,
  onSelectAllRoles,
  onSelectAllStores,
}) => {
  return (
    <Tabs defaultValue="users" className="space-y-4 sm:space-y-6">
      <TabsList className="grid w-full grid-cols-3 bg-muted p-1 rounded-md">
        <TabsTrigger 
          value="users" 
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
        >
          <Users className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Users ({assignmentData.selectedUsers.length})</span>
          <span className="sm:hidden">Users</span>
        </TabsTrigger>
        <TabsTrigger 
          value="roles" 
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
        >
          <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Roles ({assignmentData.selectedRoles.length})</span>
          <span className="sm:hidden">Roles</span>
        </TabsTrigger>
        <TabsTrigger 
          value="stores" 
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-2 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm transition-all"
        >
          <Store className="h-3 w-3 sm:h-4 sm:w-4" />
          <span className="hidden sm:inline">Stores ({assignmentData.selectedStores.length})</span>
          <span className="sm:hidden">Stores</span>
        </TabsTrigger>
      </TabsList>

      {/* Users Tab */}
      <TabsContent value="users">
        <BulkUserSelectionTab
          selectedUserIds={assignmentData.selectedUsers}
          onUserToggle={onUserToggle}
          onSelectAllUsers={onSelectAllUsers}
        />
      </TabsContent>

      {/* Roles Tab */}
      <TabsContent value="roles">
        <BulkRoleSelectionTab
          selectedRoleIds={assignmentData.selectedRoles}
          onRoleToggle={onRoleToggle}
          onSelectAllRoles={onSelectAllRoles}
        />
      </TabsContent>

      {/* Stores Tab */}
      <TabsContent value="stores">
        <BulkStoreSelectionTab
          selectedStoreIds={assignmentData.selectedStores}
          onStoreToggle={onStoreToggle}
          onSelectAllStores={onSelectAllStores}
        />
      </TabsContent>
    </Tabs>
  );
};
