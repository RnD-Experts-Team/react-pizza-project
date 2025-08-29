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
    <div className="container mx-auto py-4 px-3 sm:py-6 sm:px-4 lg:py-8 lg:px-6" style={{ backgroundColor: 'var(--background)' }}>
      <div className="space-y-4 sm:space-y-5 lg:space-y-6">
        {/* Header */}
        <div 
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 lg:p-6 rounded-lg" 
          style={{ 
            backgroundColor: 'var(--card)',
            boxShadow: 'var(--shadow-realistic)',
            border: '1px solid var(--border)'
          }}
        >
          <div className="min-w-0 flex-1">
            <h1 
              className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight break-words" 
              style={{ color: 'var(--foreground)' }}
            >
              Authorization Rules
            </h1>
            <p 
              className="text-sm sm:text-base text-muted-foreground mt-1 sm:mt-2"
              style={{ color: 'var(--muted-foreground)' }}
            >
              Manage access control rules for your application
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <Button 
              variant="outline"
              onClick={handleTestPath}
              className="flex items-center justify-center gap-2 text-sm"
              style={{
                backgroundColor: 'var(--secondary)',
                color: 'var(--secondary-foreground)',
                borderColor: 'var(--border)'
              }}
            >
              <TestTube className="h-4 w-4" />
              <span className="hidden xs:inline">Test Path</span>
              <span className="xs:hidden">Test</span>
            </Button>
            <Button 
              onClick={handleCreateRule}
              className="flex items-center justify-center gap-2 text-sm"
              style={{
                backgroundColor: 'var(--primary)',
                color: 'var(--primary-foreground)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <Plus className="h-4 w-4" />
              <span className="hidden xs:inline">Create Rule</span>
              <span className="xs:hidden">Create</span>
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
        <Card 
        className='rounded-sm'
          style={{
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow-realistic)'
          }}
        >
          <CardHeader 
          className='mb-2'
            style={{
              backgroundColor: 'var(--muted)',
              borderBottom: '1px solid var(--border)'
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
                    <span className="hidden sm:inline">Showing {pagination.from}-{pagination.to} of {pagination.total} rules</span>
                    <span className="sm:hidden">{pagination.from}-{pagination.to} of {pagination.total}</span>
                  </div>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={actions.refreshRules}
                  disabled={loading.fetching}
                  className="flex items-center gap-2 order-1 sm:order-2 self-end sm:self-auto"
                  style={{
                    backgroundColor: loading.fetching ? 'var(--muted)' : 'var(--secondary)',
                    color: 'var(--secondary-foreground)',
                    borderColor: 'var(--border)',
                    opacity: loading.fetching ? 0.6 : 1
                  }}
                >
                  <RefreshCw className={`h-4 w-4 ${loading.fetching ? 'animate-spin' : ''}`} />
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
              boxShadow: 'var(--shadow-sm)'
            }}
          >
            <CardContent className="pt-4 sm:pt-5 lg:pt-6" style={{ backgroundColor: 'var(--card)' }}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 order-2 sm:order-1">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.current_page <= 1 || loading.fetching}
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    style={{
                      backgroundColor: (pagination.current_page <= 1 || loading.fetching) ? 'var(--muted)' : 'var(--secondary)',
                      color: 'var(--secondary-foreground)',
                      borderColor: 'var(--border)',
                      opacity: (pagination.current_page <= 1 || loading.fetching) ? 0.5 : 1
                    }}
                  >
                    <span className="hidden xs:inline">Previous</span>
                    <span className="xs:hidden">Prev</span>
                  </Button>
                  <span 
                    className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap"
                    style={{ color: 'var(--muted-foreground)' }}
                  >
                    <span className="hidden sm:inline">Page {pagination.current_page} of {pagination.last_page}</span>
                    <span className="sm:hidden">{pagination.current_page}/{pagination.last_page}</span>
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.current_page >= pagination.last_page || loading.fetching}
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                    style={{
                      backgroundColor: (pagination.current_page >= pagination.last_page || loading.fetching) ? 'var(--muted)' : 'var(--secondary)',
                      color: 'var(--secondary-foreground)',
                      borderColor: 'var(--border)',
                      opacity: (pagination.current_page >= pagination.last_page || loading.fetching) ? 0.5 : 1
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
                      color: 'var(--foreground)'
                    }}
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
