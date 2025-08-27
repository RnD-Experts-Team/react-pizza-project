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
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Plus, 
  RefreshCw, 
  AlertCircle, 
  TestTube
} from 'lucide-react';
import { useAuthRules } from '../../features/authorizationRules/hooks/useAuthRules';
import { AuthRulesTable } from '../../components/authorizationRules/AuthRulesTable';
import { AuthRuleTestDialog } from '../../components/authorizationRules/AuthRuleTestDialog';

const AuthRulesPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    pagination, 
    loading, 
    error, 
    helpers,
    actions 
  } = useAuthRules();

  // UI state
  const [showTestDialog, setShowTestDialog] = useState(false);

  // Handle pagination
  const handlePageChange = (page: number) => {
    actions.updateFilters({ currentPage: page });
  };

  // Handle create rule navigation
  const handleCreateRule = () => {
    navigate('/auth-rules/create');
  };

  // Handle test path dialog
  const handleTestPath = () => {
    setShowTestDialog(true);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Authorization Rules</h1>
            <p className="text-muted-foreground">
              Manage access control rules for your application
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              onClick={handleTestPath}
              className="flex items-center gap-2"
            >
              <TestTube className="h-4 w-4" />
              Test Path
            </Button>
            <Button 
              onClick={handleCreateRule}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Create Rule
            </Button>
          </div>
        </div>

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
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Authorization Rules</CardTitle>
              <div className="flex items-center gap-4">
                {pagination && (
                  <div className="text-sm text-muted-foreground">
                    Showing {pagination.from}-{pagination.to} of {pagination.total} rules
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={actions.refreshRules}
                  disabled={loading.fetching}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${loading.fetching ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <AuthRulesTable />
          </CardContent>
        </Card>

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={pagination.current_page <= 1 || loading.fetching}
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {pagination.current_page} of {pagination.last_page}
                  </span>
                  <Button
                    variant="outline"
                    disabled={pagination.current_page >= pagination.last_page || loading.fetching}
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                  >
                    Next
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Go to page:</span>
                  <Input
                    type="number"
                    min="1"
                    max={pagination.last_page}
                    className="w-20"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const page = parseInt((e.target as HTMLInputElement).value);
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
    </div>
  );
};

export default AuthRulesPage;
