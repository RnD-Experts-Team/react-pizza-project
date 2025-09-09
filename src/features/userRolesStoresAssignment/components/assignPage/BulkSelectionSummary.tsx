import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, Store, Settings } from 'lucide-react';
import { useUsers } from '@/features/users/hooks/useUsers';
import { useRoles } from '@/features/roles/hooks/useRoles';
import { useStores } from '@/features/stores/hooks/useStores';

interface AssignmentData {
  selectedUsers: number[];
  selectedRoles: number[];
  selectedStores: string[];
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

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
  roles?: Array<{
    id: number;
    name: string;
    permissions?: Array<{
      id: number;
      name: string;
    }>;
  }>;
  permissions?: Array<{
    id: number;
    name: string;
  }>;
  stores?: {
    store: {
      id: string;
      name: string;
    };
    roles: Array<{
      id: number;
      name: string;
      permissions: Array<{
        id: number;
        name: string;
      }>;
    }>;
  }[];
}

interface Role {
  id: number;
  name: string;
  guard_name: string; // Add this missing property
  description?: string;
  permissions?: Array<{ id: number; name: string }>;
  created_at: string;
  updated_at: string;
}

interface BulkSelectionSummaryProps {
  assignmentData: AssignmentData;
}

// Placeholder factory functions to avoid inline object creation
const createUserPlaceholder = (id: number): User => ({
  id,
  name: `User ${id}`,
  email: '',
  email_verified_at: null,
  created_at: '',
  updated_at: ''
});

const createRolePlaceholder = (id: number): Role => ({
  id,
  name: `Role ${id}`,
  guard_name: 'web', // Add default guard_name value
  created_at: '',
  updated_at: ''
})

const createStorePlaceholder = (id: string): Store => ({
  id,
  name: `Store ${id}`,
  is_active: true,
  created_at: '',
  metadata: {}
});

// Generic hook for selected items to eliminate repetitive patterns
const useSelectedItems = <T, K>(
  allItems: T[],
  selectedIds: K[],
  getId: (item: T) => K,
  createPlaceholder: (id: K) => T
) => {
  return useMemo(() => 
    selectedIds.map(id => 
      allItems.find(item => getId(item) === id) ?? createPlaceholder(id)
    ), 
    [allItems, selectedIds, getId, createPlaceholder]
  );
};

// Custom hook to manage all selection data
const useSelectionData = (assignmentData: AssignmentData) => {
  const { users } = useUsers();
  const { roles } = useRoles();
  const { stores } = useStores();

  const selectedUsers = useSelectedItems(
    users,
    assignmentData.selectedUsers,
    (user) => user.id,
    createUserPlaceholder
  );

  const selectedRoles = useSelectedItems(
    roles,
    assignmentData.selectedRoles,
    (role) => role.id,
    createRolePlaceholder as (id: number) => any
  );

  const selectedStores = useSelectedItems(
    stores,
    assignmentData.selectedStores,
    (store) => store.id,
    createStorePlaceholder
  );

  return {
    selectedUsers,
    selectedRoles,
    selectedStores
  };
};

// Selection section component to reduce JSX repetition
interface SelectionSectionProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  count: number;
  items: Array<{ id: string | number; name: string }>;
  maxDisplay?: number;
}

const SelectionSection: React.FC<SelectionSectionProps> = ({
  icon: Icon,
  title,
  count,
  items,
  maxDisplay = 3
}) => (
  <div className="space-y-2 sm:space-y-3">
    <div className="flex items-center gap-2">
      <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
      <span className="font-medium text-xs sm:text-sm text-card-foreground">
        {title} ({count})
      </span>
    </div>
    <div className="flex flex-wrap gap-1">
      {items.slice(0, maxDisplay).map((item) => (
        <Badge
          key={item.id}
          variant="secondary"
          className="text-xs bg-secondary text-secondary-foreground border-border"
        >
          {item.name}
        </Badge>
      ))}
      {count > maxDisplay && (
        <Badge
          variant="outline"
          className="text-xs border-border text-muted-foreground"
        >
          +{count - maxDisplay} more
        </Badge>
      )}
    </div>
  </div>
);

export const BulkSelectionSummary: React.FC<BulkSelectionSummaryProps> = ({
  assignmentData,
}) => {
  const { selectedUsers, selectedRoles, selectedStores } = useSelectionData(assignmentData);

  const hasSelection =
    assignmentData.selectedUsers.length > 0 ||
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
          <SelectionSection
            icon={Users}
            title="Selected Users"
            count={assignmentData.selectedUsers.length}
            items={selectedUsers}
          />
          <SelectionSection
            icon={Shield}
            title="Selected Roles"
            count={assignmentData.selectedRoles.length}
            items={selectedRoles}
          />
          <SelectionSection
            icon={Store}
            title="Selected Stores"
            count={assignmentData.selectedStores.length}
            items={selectedStores}
          />
        </div>
      </CardContent>
    </Card>
  );
};
