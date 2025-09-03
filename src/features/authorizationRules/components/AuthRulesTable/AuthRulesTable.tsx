/**
 * Authorization Rules Data Table Component
 *
 * Features:
 * - Displays auth rules in a sortable table with Card wrapper
 * - Toggle buttons for active/inactive status
 * - Loading states and responsive design
 * - Pagination functionality
 * - Error handling and refresh capability
 * - Create new rule functionality
 * - Modular component architecture
 */

import React, { useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useAuthRules } from '@/features/authorizationRules/hooks/useAuthRules';
import { AuthRulesTableHeader } from '@/features/authorizationRules/components/AuthRulesTable/AuthRulesTableHeader';
import { AuthRulesTableContent } from '@/features/authorizationRules/components/AuthRulesTable/AuthRulesTableContent';
import { AuthRulesTableFooter } from '@/features/authorizationRules/components/AuthRulesTable/AuthRulesTableFooter';

export const AuthRulesTable: React.FC = () => {
  const { rules, loading, error, pagination, filters, helpers, actions } =
    useAuthRules();

  const handleToggleStatus = useCallback((ruleId: number) => {
    return () => actions.toggleRuleStatus(ruleId);
  }, [actions.toggleRuleStatus]);

  return (
    <div className="space-y-4 sm:space-y-5 lg:space-y-6">
      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {helpers.getDisplayErrorMessage()}
          </AlertDescription>
        </Alert>
      )}

      {/* Rules Table */}
      <Card className="rounded-sm bg-card border border-border shadow-[var(--shadow-realistic)]">
        <AuthRulesTableHeader
          loading={loading.fetching}
          onRefresh={actions.refreshRules}
        />
        
        <AuthRulesTableContent
          rules={rules}
          loading={loading.fetching}
          onToggleStatus={handleToggleStatus}
          isToggling={loading.isToggling}
        />
        
        {pagination && (
          <AuthRulesTableFooter
            pagination={pagination}
            filters={filters}
            loading={loading.fetching}
            totalRules={helpers.totalRules}
            onUpdateFilters={actions.updateFilters}
          />
        )}
      </Card>
    </div>
  );
};
