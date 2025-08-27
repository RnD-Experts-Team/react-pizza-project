/**
 * Authorization Rules Data Table Component
 * 
 * Features:
 * - Displays auth rules in a sortable table
 * - Toggle buttons for active/inactive status
 * - Loading states and responsive design
 * - Simplified action column (toggle activation only)
 */

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { useAuthRules } from '../../features/authorizationRules/hooks/useAuthRules';
import { AuthRuleStatusBadge } from './AuthRulesStatusBadge';

export const AuthRulesTable: React.FC = () => {
  const { 
    rules, 
    loading, 
    actions 
  } = useAuthRules();

  const handleToggleStatus = async (ruleId: number) => {
    await actions.toggleRuleStatus(ruleId);
  };

  if (loading.fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading rules...</span>
      </div>
    );
  }

  if (!rules.length) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No authorization rules found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service</TableHead>
            <TableHead>Method</TableHead>
            <TableHead>Path/Route</TableHead>
            <TableHead>Authorization</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Toggle Activation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rules.map((rule) => (
            <TableRow key={rule.id}>
              <TableCell className="font-medium">{rule.service}</TableCell>
              
              <TableCell>
                <Badge variant="outline">{rule.method}</Badge>
              </TableCell>
              
              <TableCell>
                <div className="max-w-xs">
                  {rule.path_dsl ? (
                    <div>
                      <div className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                        {rule.path_dsl}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        DSL Pattern
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-sm">{rule.route_name}</div>
                      <div className="text-xs text-muted-foreground">
                        Named Route
                      </div>
                    </div>
                  )}
                </div>
              </TableCell>
              
              <TableCell>
                <div className="space-y-1">
                  {rule.roles_any && rule.roles_any.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs text-muted-foreground">Roles (any):</span>
                      {rule.roles_any.map((role, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {role}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {rule.permissions_any && rule.permissions_any.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs text-muted-foreground">Perms (any):</span>
                      {rule.permissions_any.map((perm, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {perm}
                        </Badge>
                      ))}
                    </div>
                  )}
                  
                  {rule.permissions_all && rule.permissions_all.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      <span className="text-xs text-muted-foreground">Perms (all):</span>
                      {rule.permissions_all.map((perm, idx) => (
                        <Badge key={idx} variant="default" className="text-xs">
                          {perm}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </TableCell>
              
              <TableCell>{rule.priority}</TableCell>
              
              <TableCell>
                <AuthRuleStatusBadge isActive={rule.is_active} />
              </TableCell>
              
              <TableCell className="text-right">
                <div className="flex justify-end">
                  <Switch
                    checked={rule.is_active}
                    onCheckedChange={() => handleToggleStatus(rule.id)}
                    disabled={loading.isToggling(rule.id)}
                  />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
