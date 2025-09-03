/**
 * Auth Rule Row Component
 * 
 * Individual table row for displaying authorization rule data
 * Memoized for performance optimization
 */

import React from 'react';
import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { AuthRuleStatusBadge } from '@/features/authorizationRules/components/AuthRulesTable/AuthRulesStatusBadge';
import { AuthorizationBadges } from '@/features/authorizationRules/components/AuthRulesTable/AuthorizationBadges';

interface AuthRule {
  id: number;
  service: string;
  method: string;
  path_dsl: string | null;
  route_name: string | null;
  roles_any: string[] | null;
  permissions_any: string[] | null;
  permissions_all: string[] | null;
  priority: number;
  is_active: boolean;
}

interface AuthRuleRowProps {
  rule: AuthRule;
  onToggleStatus: (ruleId: number) => () => void;
  isToggling: (ruleId: number) => boolean;
}

export const AuthRuleRow: React.FC<AuthRuleRowProps> = React.memo(({
  rule,
  onToggleStatus,
  isToggling,
}) => {
  return (
    <TableRow className="border-border bg-card hover:bg-muted/50">
      <TableCell className="font-medium text-xs sm:text-sm p-2 sm:p-4 text-foreground">
        <div
          className="truncate max-w-[4rem] sm:max-w-none"
          title={rule.service}
        >
          {rule.service}
        </div>
      </TableCell>

      <TableCell className="p-2 sm:p-4">
        <Badge
          variant="outline"
          className="text-xs px-1 py-0.5 sm:px-2 sm:py-1 bg-secondary text-secondary-foreground border-border"
        >
          {rule.method}
        </Badge>
      </TableCell>

      <TableCell className="p-2 sm:p-4">
        <div className="max-w-[6rem] sm:max-w-xs">
          {rule.path_dsl ? (
            <div>
              <div
                className="text-xs sm:text-sm font-mono px-1 py-0.5 sm:px-2 sm:py-1 rounded truncate bg-muted text-foreground border border-border"
                title={rule.path_dsl}
              >
                {rule.path_dsl}
              </div>
              <div className="text-xs mt-1 hidden sm:block text-muted-foreground">
                DSL Pattern
              </div>
            </div>
          ) : (
            <div>
              <div
                className="text-xs sm:text-sm truncate text-foreground"
                title={rule.route_name || undefined}
              >
                {rule.route_name}
              </div>
              <div className="text-xs hidden sm:block text-muted-foreground">
                Named Route
              </div>
            </div>
          )}
        </div>
      </TableCell>

      <TableCell className="p-2 sm:p-4 hidden sm:table-cell">
        <div className="space-y-1 max-w-[8rem] lg:max-w-none">
          <AuthorizationBadges 
            items={rule.roles_any} 
            label="Roles" 
            variant="secondary" 
          />
          <AuthorizationBadges 
            items={rule.permissions_any} 
            label="Perms" 
            variant="outline" 
          />
          <AuthorizationBadges 
            items={rule.permissions_all} 
            label="All" 
            variant="default" 
          />
        </div>
      </TableCell>

      

      <TableCell className="p-2 sm:p-4">
        <AuthRuleStatusBadge isActive={rule.is_active} />
      </TableCell>

      <TableCell className="text-right p-2 sm:p-4">
        <div className="flex justify-end">
          <Switch
            checked={rule.is_active}
            onCheckedChange={onToggleStatus(rule.id)}
            disabled={isToggling(rule.id)}
            className="scale-75 sm:scale-100"
            style={
              {
                '--switch-thumb': 'var(--primary-foreground)',
                '--switch-track-checked': 'var(--primary)',
                '--switch-track-unchecked': 'var(--input)',
              } as React.CSSProperties
            }
          />
        </div>
      </TableCell>
    </TableRow>
  );
});

AuthRuleRow.displayName = 'AuthRuleRow';
