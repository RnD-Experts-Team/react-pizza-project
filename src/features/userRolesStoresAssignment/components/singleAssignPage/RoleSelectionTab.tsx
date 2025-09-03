import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, Search, Shield } from 'lucide-react';
import type { Role } from '@/features/roles/types';

interface RoleWithStatus extends Role {
  status?: string;
}

interface RoleSelectionTabProps {
  displayRoles: RoleWithStatus[];
  selectedRoleId: number | null;
  roleSearch: string;
  rolesLoading: boolean;
  rolesError: string | null;
  onRoleSelect: (roleId: string) => void;
  onRoleSearchChange: (search: string) => void;
  formatDate: (dateString: string) => string;
}

export const RoleSelectionTab: React.FC<RoleSelectionTabProps> = ({
  displayRoles,
  selectedRoleId,
  roleSearch,
  rolesLoading,
  rolesError,
  onRoleSelect,
  onRoleSearchChange,
  formatDate,
}) => {
  return (
    <Card className="bg-[var(--card)] border-[var(--border)]">
      <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 gap-3 sm:gap-4">
          <CardTitle className="text-base sm:text-lg text-[var(--card-foreground)]">
            Select Role
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
            <Input
              placeholder="Search roles..."
              value={roleSearch}
              onChange={(e) => onRoleSearchChange(e.target.value)}
              className="pl-10 w-full sm:w-64 bg-[var(--background)] border-[var(--border)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:ring-[var(--ring)] focus:border-[var(--ring)] text-sm sm:text-base"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        {rolesError ? (
          <div className="text-[#dc2626] dark:text-[#f87171] text-center py-4 text-sm sm:text-base">
            Error loading roles: {rolesError}
          </div>
        ) : rolesLoading ? (
          <div className="flex items-center justify-center py-6 sm:py-8">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-[var(--primary)]" />
            <span className="ml-2 text-sm sm:text-base text-[var(--muted-foreground)]">
              Loading roles...
            </span>
          </div>
        ) : (
          <RadioGroup
            value={selectedRoleId?.toString() || ''}
            onValueChange={onRoleSelect}
            className="space-y-3 sm:space-y-4"
          >
            {displayRoles.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-[var(--muted-foreground)] text-sm sm:text-base">
                {roleSearch ? 'No roles found matching your search' : 'No roles found'}
              </div>
            ) : (
              displayRoles.map((role) => (
                <div key={role.id} className="flex items-center space-x-3 p-3 sm:p-4 border border-[var(--border)] rounded-lg hover:bg-[var(--muted)]/50 transition-colors">
                  <RadioGroupItem value={role.id.toString()} id={`role-${role.id}`} className="text-[var(--primary)] border-[var(--border)]" />
                  <Label htmlFor={`role-${role.id}`} className="flex-1 cursor-pointer">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                          <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-[var(--primary)]" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm sm:text-base text-[var(--card-foreground)] truncate">
                            {role.name}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-start sm:items-end gap-2 sm:gap-1">
                        {role.status && (
                          <Badge
                            variant={role.status === 'active' ? 'default' : 'secondary'}
                            className={`text-xs ${
                              role.status === 'active'
                                ? 'bg-[#16a34a] text-white'
                                : 'bg-[var(--secondary)] text-[var(--secondary-foreground)]'
                            }`}
                          >
                            {role.status}
                          </Badge>
                        )}
                        <div className="text-xs text-[var(--muted-foreground)]">
                          {formatDate(role.created_at)}
                        </div>
                      </div>
                    </div>
                  </Label>
                </div>
              ))
            )}
          </RadioGroup>
        )}
      </CardContent>
    </Card>
  );
};