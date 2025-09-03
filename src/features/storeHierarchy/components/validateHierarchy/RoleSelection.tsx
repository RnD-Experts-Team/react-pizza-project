import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Loader2, Crown, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Role {
  id: number;
  name: string;
  permissions?: any[];
}

interface RoleSelectionProps {
  title: string;
  description: string;
  icon: 'crown' | 'usercheck';
  roles: Role[];
  selectedRoleId: string;
  disabledRoleId?: string;
  isLoading: boolean;
  validationError?: string;
  onRoleChange: (value: string) => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({
  title,
  description,
  icon,
  roles,
  selectedRoleId,
  disabledRoleId,
  isLoading,
  validationError,
  onRoleChange
}) => {
  const IconComponent = icon === 'crown' ? Crown : UserCheck;
  const iconColor = icon === 'crown' ? 'text-yellow-600' : 'text-blue-600';

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
          <IconComponent className={`h-4 w-4 sm:h-5 sm:w-5 ${iconColor}`} />
          <span className="text-foreground">{title}</span>
        </CardTitle>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {description}
        </p>
      </CardHeader>
      <CardContent className="pt-0 sm:pt-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-6 sm:py-8">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span className="text-sm sm:text-base text-muted-foreground">Loading roles...</span>
          </div>
        ) : (
          <RadioGroup
            value={selectedRoleId}
            onValueChange={onRoleChange}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
          >
            {roles.map((role) => (
              <div key={role.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent/50">
                <RadioGroupItem
                  value={role.id.toString()}
                  id={`${icon}-role-${role.id}`}
                  disabled={disabledRoleId === role.id.toString()}
                />
                <Label
                  htmlFor={`${icon}-role-${role.id}`}
                  className={cn(
                    "text-xs sm:text-sm font-medium leading-none cursor-pointer flex-1",
                    disabledRoleId === role.id.toString() && "text-muted-foreground cursor-not-allowed"
                  )}
                >
                  <span className="text-foreground">{role.name}</span>
                  {role.permissions && role.permissions.length > 0 && (
                    <span className="text-xs text-muted-foreground ml-1 block sm:inline">
                      ({role.permissions.length} permission{role.permissions.length > 1 ? 's' : ''})
                    </span>
                  )}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
        {validationError && (
          <p className="text-xs sm:text-sm text-destructive mt-2">{validationError}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RoleSelection;