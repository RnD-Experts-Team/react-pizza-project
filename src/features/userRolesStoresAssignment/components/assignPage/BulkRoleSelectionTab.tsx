import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Loader2, Search, Shield } from 'lucide-react';

interface Role {
  id: number;
  name: string;
  created_at: string;
  status?: string;
}

interface BulkRoleSelectionTabProps {
  displayRoles: Role[];
  selectedRoleIds: number[];
  roleSearch: string;
  rolesLoading: boolean;
  rolesError: string | null;
  onRoleToggle: (roleId: number) => void;
  onSelectAllRoles: () => void;
  onRoleSearchChange: (search: string) => void;
  formatDate: (dateString: string) => string;
}

export const BulkRoleSelectionTab: React.FC<BulkRoleSelectionTabProps> = ({
  displayRoles,
  selectedRoleIds,
  roleSearch,
  rolesLoading,
  rolesError,
  onRoleToggle,
  onSelectAllRoles,
  onRoleSearchChange,
  formatDate,
}) => {
  const allDisplayRolesSelected = displayRoles.length > 0 && selectedRoleIds.length === displayRoles.length;
  const someDisplayRolesSelected = selectedRoleIds.length > 0 && selectedRoleIds.length < displayRoles.length;

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 gap-3 sm:gap-4">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-card-foreground">
            <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            Select Roles
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search roles..."
              value={roleSearch}
              onChange={(e) => onRoleSearchChange(e.target.value)}
              className="pl-10 w-full sm:w-64 bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-ring focus:border-ring text-sm sm:text-base"
            />
          </div>
        </div>
        {displayRoles.length > 0 && (
          <div className="flex items-center gap-2 pt-2">
            <Checkbox
              checked={allDisplayRolesSelected}
              ref={(el) => {
                if (el) (el as any).indeterminate = someDisplayRolesSelected;
              }}
              onCheckedChange={onSelectAllRoles}
              className="border-border"
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={onSelectAllRoles}
              className="text-xs sm:text-sm text-muted-foreground hover:text-foreground"
            >
              {allDisplayRolesSelected ? 'Deselect All' : 'Select All'} ({displayRoles.length})
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
        {rolesError ? (
          <div className="text-destructive text-center py-4 text-sm sm:text-base">
            Error loading roles: {rolesError}
          </div>
        ) : rolesLoading ? (
          <div className="flex items-center justify-center py-6 sm:py-8">
            <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
            <span className="ml-2 text-sm sm:text-base text-muted-foreground">
              Loading roles...
            </span>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {displayRoles.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-muted-foreground text-sm sm:text-base">
                {roleSearch ? 'No roles found matching your search' : 'No roles found'}
              </div>
            ) : (
              displayRoles.map((role) => (
                <div key={role.id} className="flex items-center space-x-3 p-3 sm:p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <Checkbox
                    checked={selectedRoleIds.includes(role.id)}
                    onCheckedChange={() => onRoleToggle(role.id)}
                    className="border-border"
                  />
                  <div className="flex-1 cursor-pointer" onClick={() => onRoleToggle(role.id)}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium text-sm sm:text-base text-card-foreground truncate">
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
                                ? 'bg-green-600 text-white'
                                : 'bg-secondary text-secondary-foreground'
                            }`}
                          >
                            {role.status}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {formatDate(role.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};