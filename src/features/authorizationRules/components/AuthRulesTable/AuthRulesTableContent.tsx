/**
 * Authorization Rules Table Content Component
 *
 * Simplified component focused on table structure and state management
 */

import React from 'react';
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { AuthRuleRow } from '@/features/authorizationRules/components/AuthRulesTable/AuthRuleRow';

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

interface AuthRulesTableContentProps {
  rules: AuthRule[];
  loading: boolean;
  onToggleStatus: (ruleId: number) => () => void;
  isToggling: (ruleId: number) => boolean;
}

export const AuthRulesTableContent: React.FC<AuthRulesTableContentProps> = ({
  rules,
  loading,
  onToggleStatus,
  isToggling,
}) => {
  return (
    <CardContent className="p-0 bg-card">
      {loading ? (
        <div className="flex items-center justify-center h-48 sm:h-64 bg-card text-muted-foreground">
          <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-primary" />
          <span className="ml-2 text-sm sm:text-base text-foreground">
            Loading rules...
          </span>
        </div>
      ) : !rules.length ? (
        <div className="text-center py-6 sm:py-8 bg-card">
          <p className="text-sm sm:text-base text-muted-foreground">
            No authorization rules found.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader className="bg-muted border-b border-border">
              <TableRow className="border-border">
                <TableHead className="min-w-[5rem] text-xs sm:text-sm text-foreground font-semibold">
                  Service
                </TableHead>
                <TableHead className="min-w-[4rem] text-xs sm:text-sm text-foreground font-semibold">
                  Method
                </TableHead>
                <TableHead className="min-w-[8rem] text-xs sm:text-sm text-foreground font-semibold">
                  Path/Route
                </TableHead>
                <TableHead className="min-w-[10rem] text-xs sm:text-sm hidden sm:table-cell text-foreground font-semibold">
                  Authorization
                </TableHead>
                
                <TableHead className="min-w-[4rem] text-foreground font-semibold text-xs sm:text-sm">
                  Status
                </TableHead>
                <TableHead className="min-w-[5rem] text-right text-xs sm:text-sm text-foreground font-semibold">
                  Active
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rules.map((rule) => (
                <AuthRuleRow
                  key={rule.id}
                  rule={rule}
                  onToggleStatus={onToggleStatus}
                  isToggling={isToggling}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </CardContent>
  );
};
