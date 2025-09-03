import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Shield, Store, Settings } from 'lucide-react';

interface AssignmentData {
  selectedUser: number | null;
  selectedRole: number | null;
  selectedStore: string | null;
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

interface SelectionSummaryProps {
  assignmentData: AssignmentData;
  users: User[];
  roles: Role[];
  stores: Store[];
}

export const SelectionSummary: React.FC<SelectionSummaryProps> = ({
  assignmentData,
  users,
  roles,
  stores,
}) => {
  const hasSelection = assignmentData.selectedUser || assignmentData.selectedRole || assignmentData.selectedStore;

  if (!hasSelection) return null;

  return (
    <Card className="bg-[var(--card)] border-[var(--border)]">
      <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-[var(--card-foreground)]">
          <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--primary)]" />
          Current Selection
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[var(--primary)] flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base text-[var(--card-foreground)]">
                Selected User
              </span>
            </div>
            <div>
              {assignmentData.selectedUser ? (
                (() => {
                  const user = users.find(u => u.id === assignmentData.selectedUser);
                  return user ? (
                    <Badge variant="secondary" className="text-xs sm:text-sm bg-[var(--secondary)] text-[var(--secondary-foreground)] border-[var(--border)]">
                      {user.name}
                    </Badge>
                  ) : (
                    <span className="text-[var(--muted-foreground)] text-xs sm:text-sm">
                      User not found
                    </span>
                  );
                })()
              ) : (
                <span className="text-[var(--muted-foreground)] text-xs sm:text-sm">
                  No user selected
                </span>
              )}
            </div>
          </div>
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-[var(--primary)] flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base text-[var(--card-foreground)]">
                Selected Role
              </span>
            </div>
            <div>
              {assignmentData.selectedRole ? (
                (() => {
                  const role = roles.find(r => r.id === assignmentData.selectedRole);
                  return role ? (
                    <Badge variant="secondary" className="text-xs sm:text-sm bg-[var(--secondary)] text-[var(--secondary-foreground)] border-[var(--border)]">
                      {role.name}
                    </Badge>
                  ) : (
                    <span className="text-[var(--muted-foreground)] text-xs sm:text-sm">
                      Role not found
                    </span>
                  );
                })()
              ) : (
                <span className="text-[var(--muted-foreground)] text-xs sm:text-sm">
                  No role selected
                </span>
              )}
            </div>
          </div>
          <div className="space-y-2 sm:space-y-3 sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2">
              <Store className="h-4 w-4 text-[var(--primary)] flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base text-[var(--card-foreground)]">
                Selected Store
              </span>
            </div>
            <div>
              {assignmentData.selectedStore ? (
                (() => {
                  const store = stores.find(s => s.id === assignmentData.selectedStore);
                  return store ? (
                    <Badge variant="secondary" className="text-xs sm:text-sm bg-[var(--secondary)] text-[var(--secondary-foreground)] border-[var(--border)]">
                      {store.name}
                    </Badge>
                  ) : (
                    <span className="text-[var(--muted-foreground)] text-xs sm:text-sm">
                      Store not found
                    </span>
                  );
                })()
              ) : (
                <span className="text-[var(--muted-foreground)] text-xs sm:text-sm">
                  No store selected
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};