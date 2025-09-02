/**
 * Authorization Rules Main Listing Page
 *
 * Features:
 * - Displays all authorization rules in a table
 * - Create new rule functionality (navigates to create page)
 * - Test Path DSL functionality
 * - Pagination support
 * - Loading states and error handling
 * - Refresh functionality
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, AlertCircle, TestTube } from 'lucide-react';
import { useAuthRules } from '../../features/authorizationRules/hooks/useAuthRules';
import { AuthRulesTable } from '../../components/authorizationRules/AuthRulesTable';
import { AuthRuleTestDialog } from '../../components/authorizationRules/AuthRuleTestDialog';
import { ManageLayout } from '../../components/layouts/ManageLayout';

const AuthRulesPage: React.FC = () => {
  const { pagination, loading, error, helpers, actions } = useAuthRules();

  // UI state
  const [showTestDialog, setShowTestDialog] = useState(false);

  // Handle pagination
  const handlePageChange = (page: number) => {
    actions.updateFilters({ currentPage: page });
  };

  // Handle test path dialog
  const handleTestPath = () => {
    setShowTestDialog(true);
  };

  return (
    <ManageLayout
      title="Authorization Rules"
      subtitle="Manage access control rules for your application"
      mainButtons={
        <Button
          variant="outline"
          onClick={handleTestPath}
          className="flex items-center justify-center gap-2 text-sm"
          style={{
            backgroundColor: 'var(--secondary)',
            color: 'var(--secondary-foreground)',
            borderColor: 'var(--border)',
          }}
        >
          <TestTube className="h-4 w-4" />
          <span className="hidden md:inline">Test Path</span>
          <span className="inline md:hidden">Test</span>
        </Button>
      }
    >
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
        <Card
          className="rounded-sm"
          style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-realistic)',
          }}
        >
          <CardHeader
            className="mb-2"
            style={{
              backgroundColor: 'var(--muted)',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <CardTitle
                className="text-lg sm:text-xl"
                style={{ color: 'var(--card-foreground)' }}
              >
                Authorization Rules
              </CardTitle>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                {pagination && (
                  <div
                    className="text-xs sm:text-sm text-muted-foreground order-2 sm:order-1"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    <span className="hidden sm:inline">
                      Showing {pagination.from}-{pagination.to} of{' '}
                      {pagination.total} rules
                    </span>
                    <span className="sm:hidden">
                      {pagination.from}-{pagination.to} of {pagination.total}
                    </span>
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={actions.refreshRules}
                  disabled={loading.fetching}
                  className="flex items-center gap-2 order-1 sm:order-2 self-end sm:self-auto"
                  style={{
                    backgroundColor: loading.fetching
                      ? 'var(--muted)'
                      : 'var(--secondary)',
                    color: 'var(--secondary-foreground)',
                    borderColor: 'var(--border)',
                    opacity: loading.fetching ? 0.6 : 1,
                  }}
                >
                  <RefreshCw
                    className={`h-4 w-4 ${loading.fetching ? 'animate-spin' : ''}`}
                  />
                  <span className="hidden xs:inline">Refresh</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent style={{ backgroundColor: 'var(--card)' }}>
            <AuthRulesTable />
          </CardContent>
        </Card>

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <Card
            style={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <CardContent
              className="pt-4 sm:pt-5 lg:pt-6"
              style={{ backgroundColor: 'var(--card)' }}
            >
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 order-2 sm:order-1">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.current_page <= 1 || loading.fetching}
                    onClick={() =>
                      handlePageChange(pagination.current_page - 1)
                    }
                    style={{
                      backgroundColor:
                        pagination.current_page <= 1 || loading.fetching
                          ? 'var(--muted)'
                          : 'var(--secondary)',
                      color: 'var(--secondary-foreground)',
                      borderColor: 'var(--border)',
                      opacity:
                        pagination.current_page <= 1 || loading.fetching
                          ? 0.5
                          : 1,
                    }}
                  >
                    <span className="hidden xs:inline">Previous</span>
                    <span className="xs:hidden">Prev</span>
                  </Button>
                  <span
                    className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    <span className="hidden sm:inline">
                      Page {pagination.current_page} of {pagination.last_page}
                    </span>
                    <span className="sm:hidden">
                      {pagination.current_page}/{pagination.last_page}
                    </span>
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={
                      pagination.current_page >= pagination.last_page ||
                      loading.fetching
                    }
                    onClick={() =>
                      handlePageChange(pagination.current_page + 1)
                    }
                    style={{
                      backgroundColor:
                        pagination.current_page >= pagination.last_page ||
                        loading.fetching
                          ? 'var(--muted)'
                          : 'var(--secondary)',
                      color: 'var(--secondary-foreground)',
                      borderColor: 'var(--border)',
                      opacity:
                        pagination.current_page >= pagination.last_page ||
                        loading.fetching
                          ? 0.5
                          : 1,
                    }}
                  >
                    <span className="hidden xs:inline">Next</span>
                    <span className="xs:hidden">Next</span>
                  </Button>
                </div>

                <div className="flex items-center gap-2 order-1 sm:order-2">
                  <span
                    className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    <span className="hidden sm:inline">Go to page:</span>
                    <span className="sm:hidden">Page:</span>
                  </span>
                  <Input
                    type="number"
                    min="1"
                    max={pagination.last_page}
                    className="w-16 sm:w-20 text-sm"
                    style={{
                      backgroundColor: 'var(--input)',
                      borderColor: 'var(--border)',
                      color: 'var(--foreground)',
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const page = parseInt(
                          (e.target as HTMLInputElement).value,
                        );
                        if (page >= 1 && page <= pagination.last_page) {
                          handlePageChange(page);
                        }
                      }
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Dialog */}
        {showTestDialog && (
          <AuthRuleTestDialog
            pathDsl=""
            onClose={() => setShowTestDialog(false)}
          />
        )}
      </div>
    </ManageLayout>
  );
};

export default AuthRulesPage;
