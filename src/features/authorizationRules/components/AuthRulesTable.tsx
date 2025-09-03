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
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardFooter, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Plus, RefreshCw, AlertCircle } from 'lucide-react';
import { useAuthRules } from '../hooks/useAuthRules';
import { AuthRuleStatusBadge } from './AuthRulesStatusBadge';

export const AuthRulesTable: React.FC = () => {
  const navigate = useNavigate();
  const { rules, loading, error, pagination, helpers, actions } =
    useAuthRules();

  const handleToggleStatus = async (ruleId: number) => {
    await actions.toggleRuleStatus(ruleId);
  };

  const handleCreateRule = () => {
    navigate('/auth-rules/create');
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    actions.updateFilters({ currentPage: page });
  };

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
      <Card
        className="rounded-sm"
        style={{
          backgroundColor: 'var(--card)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-realistic)',
        }}
      >
        <CardHeader
          className="mb-0"
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
              <div className="flex items-center gap-2 order-1 sm:order-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={actions.refreshRules}
                  disabled={loading.fetching}
                  className="flex items-center gap-2"
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
                <Button
                  onClick={handleCreateRule}
                  className="flex items-center justify-center gap-2 text-sm"
                  style={{
                    backgroundColor: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  <Plus className="h-4 w-4" />
                  <span className="hidden xs:inline">Create Rule</span>
                  <span className="xs:hidden">Create</span>
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0" style={{ backgroundColor: 'var(--card)' }}>
          {loading.fetching ? (
            <div
              className="flex items-center justify-center h-48 sm:h-64"
              style={{
                backgroundColor: 'var(--card)',
                color: 'var(--muted-foreground)',
              }}
            >
              <Loader2
                className="h-6 w-6 sm:h-8 sm:w-8 animate-spin"
                style={{ color: 'var(--primary)' }}
              />
              <span
                className="ml-2 text-sm sm:text-base"
                style={{ color: 'var(--foreground)' }}
              >
                Loading rules...
              </span>
            </div>
          ) : !rules.length ? (
            <div
              className="text-center py-6 sm:py-8"
              style={{ backgroundColor: 'var(--card)' }}
            >
              <p
                className="text-sm sm:text-base text-muted-foreground"
                style={{ color: 'var(--muted-foreground)' }}
              >
                No authorization rules found.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader
                  style={{
                    backgroundColor: 'var(--muted)',
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  <TableRow style={{ borderColor: 'var(--border)' }}>
                    <TableHead
                      className="min-w-[5rem] text-xs sm:text-sm"
                      style={{ color: 'var(--foreground)', fontWeight: '600' }}
                    >
                      Service
                    </TableHead>
                    <TableHead
                      className="min-w-[4rem] text-xs sm:text-sm"
                      style={{ color: 'var(--foreground)', fontWeight: '600' }}
                    >
                      Method
                    </TableHead>
                    <TableHead
                      className="min-w-[8rem] text-xs sm:text-sm"
                      style={{ color: 'var(--foreground)', fontWeight: '600' }}
                    >
                      Path/Route
                    </TableHead>
                    <TableHead
                      className="min-w-[10rem] text-xs sm:text-sm hidden sm:table-cell"
                      style={{ color: 'var(--foreground)', fontWeight: '600' }}
                    >
                      Authorization
                    </TableHead>
                    <TableHead
                      className="min-w-[4rem] text-xs sm:text-sm"
                      style={{ color: 'var(--foreground)', fontWeight: '600' }}
                    >
                      Priority
                    </TableHead>
                    <TableHead
                      className="min-w-[4rem] text-xs sm:text-sm"
                      style={{ color: 'var(--foreground)', fontWeight: '600' }}
                    >
                      Status
                    </TableHead>
                    <TableHead
                      className="min-w-[5rem] text-right text-xs sm:text-sm"
                      style={{ color: 'var(--foreground)', fontWeight: '600' }}
                    >
                      Active
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rules.map((rule) => (
                    <TableRow
                      key={rule.id}
                      style={{
                        borderColor: 'var(--border)',
                        backgroundColor: 'var(--card)',
                      }}
                      className="hover:bg-muted/50"
                    >
                      <TableCell
                        className="font-medium text-xs sm:text-sm p-2 sm:p-4"
                        style={{ color: 'var(--foreground)' }}
                      >
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
                          className="text-xs px-1 py-0.5 sm:px-2 sm:py-1"
                          style={{
                            backgroundColor: 'var(--secondary)',
                            color: 'var(--secondary-foreground)',
                            borderColor: 'var(--border)',
                          }}
                        >
                          {rule.method}
                        </Badge>
                      </TableCell>

                      <TableCell className="p-2 sm:p-4">
                        <div className="max-w-[6rem] sm:max-w-xs">
                          {rule.path_dsl ? (
                            <div>
                              <div
                                className="text-xs sm:text-sm font-mono px-1 py-0.5 sm:px-2 sm:py-1 rounded truncate"
                                style={{
                                  backgroundColor: 'var(--muted)',
                                  color: 'var(--foreground)',
                                  border: '1px solid var(--border)',
                                }}
                                title={rule.path_dsl}
                              >
                                {rule.path_dsl}
                              </div>
                              <div
                                className="text-xs mt-1 hidden sm:block"
                                style={{ color: 'var(--muted-foreground)' }}
                              >
                                DSL Pattern
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div
                                className="text-xs sm:text-sm truncate"
                                style={{ color: 'var(--foreground)' }}
                                title={rule.route_name || undefined}
                              >
                                {rule.route_name}
                              </div>
                              <div
                                className="text-xs hidden sm:block"
                                style={{ color: 'var(--muted-foreground)' }}
                              >
                                Named Route
                              </div>
                            </div>
                          )}
                        </div>
                      </TableCell>

                      <TableCell className="p-2 sm:p-4 hidden sm:table-cell">
                        <div className="space-y-1 max-w-[8rem] lg:max-w-none">
                          {rule.roles_any && rule.roles_any.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              <span
                                className="text-xs whitespace-nowrap"
                                style={{ color: 'var(--muted-foreground)' }}
                              >
                                Roles:
                              </span>
                              {rule.roles_any.slice(0, 2).map((role, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="text-xs px-1 py-0.5"
                                  style={{
                                    backgroundColor: 'var(--secondary)',
                                    color: 'var(--secondary-foreground)',
                                  }}
                                >
                                  <span
                                    className="truncate max-w-[3rem]"
                                    title={role}
                                  >
                                    {role}
                                  </span>
                                </Badge>
                              ))}
                              {rule.roles_any.length > 2 && (
                                <span className="text-xs text-muted-foreground">
                                  +{rule.roles_any.length - 2}
                                </span>
                              )}
                            </div>
                          )}

                          {rule.permissions_any &&
                            rule.permissions_any.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                <span
                                  className="text-xs whitespace-nowrap"
                                  style={{ color: 'var(--muted-foreground)' }}
                                >
                                  Perms:
                                </span>
                                {rule.permissions_any
                                  .slice(0, 2)
                                  .map((perm, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="outline"
                                      className="text-xs px-1 py-0.5"
                                      style={{
                                        backgroundColor: 'var(--accent)',
                                        color: 'var(--accent-foreground)',
                                        borderColor: 'var(--border)',
                                      }}
                                    >
                                      <span
                                        className="truncate max-w-[3rem]"
                                        title={perm}
                                      >
                                        {perm}
                                      </span>
                                    </Badge>
                                  ))}
                                {rule.permissions_any.length > 2 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{rule.permissions_any.length - 2}
                                  </span>
                                )}
                              </div>
                            )}

                          {rule.permissions_all &&
                            rule.permissions_all.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                <span
                                  className="text-xs whitespace-nowrap"
                                  style={{ color: 'var(--muted-foreground)' }}
                                >
                                  All:
                                </span>
                                {rule.permissions_all
                                  .slice(0, 2)
                                  .map((perm, idx) => (
                                    <Badge
                                      key={idx}
                                      variant="default"
                                      className="text-xs px-1 py-0.5"
                                      style={{
                                        backgroundColor: 'var(--primary)',
                                        color: 'var(--primary-foreground)',
                                      }}
                                    >
                                      <span
                                        className="truncate max-w-[3rem]"
                                        title={perm}
                                      >
                                        {perm}
                                      </span>
                                    </Badge>
                                  ))}
                                {rule.permissions_all.length > 2 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{rule.permissions_all.length - 2}
                                  </span>
                                )}
                              </div>
                            )}
                        </div>
                      </TableCell>

                      <TableCell
                        className="text-xs sm:text-sm p-2 sm:p-4"
                        style={{ color: 'var(--foreground)' }}
                      >
                        {rule.priority}
                      </TableCell>

                      <TableCell className="p-2 sm:p-4">
                        <AuthRuleStatusBadge isActive={rule.is_active} />
                      </TableCell>

                      <TableCell className="text-right p-2 sm:p-4">
                        <div className="flex justify-end">
                          <Switch
                            checked={rule.is_active}
                            onCheckedChange={() => handleToggleStatus(rule.id)}
                            disabled={loading.isToggling(rule.id)}
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
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        {pagination && pagination.last_page > 1 && (
          <CardFooter
            className="pt-4 sm:pt-5 lg:pt-6"
            style={{ backgroundColor: 'var(--card)', borderTop: '1px solid var(--border)' }}
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.current_page <= 1 || loading.fetching}
                  onClick={() => handlePageChange(pagination.current_page - 1)}
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
                  onClick={() => handlePageChange(pagination.current_page + 1)}
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
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};
