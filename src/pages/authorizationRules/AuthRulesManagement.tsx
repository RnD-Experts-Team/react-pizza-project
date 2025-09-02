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
import { TestTube } from 'lucide-react';
import { AuthRulesTable } from '../../components/authorizationRules/AuthRulesTable';
import { AuthRuleTestDialog } from '../../components/authorizationRules/AuthRuleTestDialog';
import { ManageLayout } from '../../components/layouts/ManageLayout';

const AuthRulesPage: React.FC = () => {
  // UI state
  const [showTestDialog, setShowTestDialog] = useState(false);

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
      {/* Consolidated Table Component */}
      <AuthRulesTable />

      {/* Test Path Dialog */}
      {showTestDialog && (
        <AuthRuleTestDialog
          pathDsl=""
          onClose={() => setShowTestDialog(false)}
        />
      )}
    </ManageLayout>
  );
};

export default AuthRulesPage;
