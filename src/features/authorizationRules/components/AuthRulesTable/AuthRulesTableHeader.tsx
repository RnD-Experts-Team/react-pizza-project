/**
 * Authorization Rules Table Header Component
 *
 * Features:
 * - Card header with title
 * - Refresh button with loading state
 * - Create new rule button
 * - Responsive design
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, RefreshCw } from 'lucide-react';

interface AuthRulesTableHeaderProps {
  loading: boolean;
  onRefresh: () => void;
}

export const AuthRulesTableHeader: React.FC<AuthRulesTableHeaderProps> = ({
  loading,
  onRefresh,
}) => {
  const navigate = useNavigate();

  const handleCreateRule = () => {
    navigate('/auth-rules/create');
  };

  return (
    <CardHeader className="mb-0 bg-muted border-b border-border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <CardTitle className="text-lg sm:text-xl text-card-foreground">
          Authorization Rules
        </CardTitle>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <div className="flex items-center gap-2 order-1 sm:order-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={loading}
              className={`flex items-center gap-2 text-secondary-foreground border-border ${
                loading ? 'bg-muted opacity-60' : 'bg-secondary'
              }`}
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
              />
              <span className="hidden xs:inline">Refresh</span>
            </Button>
            <Button
              onClick={handleCreateRule}
              className="flex items-center justify-center gap-2 text-sm bg-primary text-primary-foreground shadow-[var(--shadow-sm)]"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden xs:inline">Create Rule</span>
              <span className="xs:hidden">Create</span>
            </Button>
          </div>
        </div>
      </div>
    </CardHeader>
  );
};