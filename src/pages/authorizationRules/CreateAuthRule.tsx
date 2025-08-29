/**
 * Create Authorization Rule Page
 * 
 * Features:
 * - Dedicated page for creating new authorization rules
 * - Navigation breadcrumbs and back functionality
 * - Error handling and success navigation
 * - Clean layout following existing patterns
 * - Integration with CreateAuthRuleForm component
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, AlertCircle, Shield } from 'lucide-react';
import { useAuthRules } from '../../features/authorizationRules/hooks/useAuthRules';
import { CreateAuthRuleForm } from '../../components/authorizationRules/CreateAuthRuleForm';

const CreateAuthRulePage: React.FC = () => {
  const navigate = useNavigate();
  const { error, helpers } = useAuthRules({ autoFetch: false, showToasts: true });

  // Handle navigation back to rules list
  const handleBack = () => {
    navigate('/auth-rules');
  };

  // Handle successful rule creation
  const handleCreateSuccess = () => {
    // Navigate back to auth rules list
    navigate('/auth-rules');
  };

  // Handle form cancellation
  const handleCancel = () => {
    navigate('/auth-rules');
  };

  return (
    <div className="container mx-auto py-4 px-3 sm:py-6 sm:px-4 lg:py-8 lg:px-6">
      <div className="mx-auto space-y-4 sm:space-y-5 lg:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <Button variant="ghost" onClick={handleBack} className="p-2 self-start sm:self-auto">
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
          <div className="flex items-start sm:items-center gap-3 w-full">
            <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg flex-shrink-0">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight break-words">
                Create Authorization Rule
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Define a new access control rule for your application
              </p>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <nav className="flex items-center space-x-1.5 sm:space-x-2 text-xs sm:text-sm text-muted-foreground overflow-x-auto">
          <button 
            onClick={handleBack}
            className="hover:text-foreground transition-colors whitespace-nowrap"
          >
            Authorization Rules
          </button>
          <span className="flex-shrink-0">/</span>
          <span className="text-foreground whitespace-nowrap">Create New Rule</span>
        </nav>

        {/* Global Error Alert */}
        {error && helpers.isNetworkError() && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Unable to connect to the server. Please check your internet connection and try again.
            </AlertDescription>
          </Alert>
        )}

        {error && helpers.isUnauthorizedError() && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your session has expired. Please <a href="/login" className="underline">login again</a> to continue.
            </AlertDescription>
          </Alert>
        )}

        {/* Instructions Card */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-3 sm:p-4">
          <h3 className="font-medium text-primary-900 mb-2 text-sm sm:text-base">Creating Authorization Rules</h3>
          <div className="text-xs sm:text-sm text-primary-800 space-y-1 sm:space-y-1.5">
            <p className="break-words">• <strong>Service:</strong> The application service this rule applies to (e.g., api, data, auth)</p>
            <p className="break-words">• <strong>Path DSL:</strong> Dynamic path pattern with variables like <code className="bg-primary-100 px-1 rounded text-xs">/users/{'{id}'}/posts/*</code></p>
            <p className="break-words">• <strong>Route Name:</strong> Named route identifier like <code className="bg-primary-100 px-1 rounded text-xs">users.posts.show</code></p>
            <p>• <strong>Roles:</strong> User must have ANY of the specified roles</p>
            <p>• <strong>Permissions (Any):</strong> User needs ANY of these permissions</p>
            <p>• <strong>Permissions (All):</strong> User needs ALL of these permissions</p>
            <p>• <strong>Priority:</strong> Lower numbers = higher priority (1-1000)</p>
          </div>
        </div>

        {/* Create Form */}
        <CreateAuthRuleForm
          onSuccess={handleCreateSuccess}
          onCancel={handleCancel}
        />

        {/* Help Section */}
        <div className="border-t pt-4 sm:pt-5 lg:pt-6">
          <h3 className="font-medium mb-3 text-sm sm:text-base">Common Examples</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 text-xs sm:text-sm">
            <div className="space-y-2">
              <h4 className="font-medium text-chart-3 text-sm sm:text-base">Path DSL Examples:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li className="break-all"><code className="bg-muted px-1 rounded text-xs">/api/users/{'{id}'}</code> - Matches /api/users/123</li>
                <li className="break-all"><code className="bg-muted px-1 rounded text-xs">/files/*</code> - Matches any path starting with /files/</li>
                <li className="break-all"><code className="bg-muted px-1 rounded text-xs">/admin/{'{section}'}/settings</code> - Matches admin sections</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-chart-4 text-sm sm:text-base">Route Name Examples:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li className="break-all"><code className="bg-muted px-1 rounded text-xs">users.show</code> - Show user profile</li>
                <li className="break-all"><code className="bg-muted px-1 rounded text-xs">admin.dashboard</code> - Admin dashboard</li>
                <li className="break-all"><code className="bg-muted px-1 rounded text-xs">api.data.export</code> - Data export endpoint</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-chart-2/10 border border-chart-2/30 rounded-lg p-3 sm:p-4">
          <h3 className="font-medium text-chart-2 mb-2 text-sm sm:text-base">💡 Pro Tips</h3>
          <ul className="text-xs sm:text-sm text-chart-2/80 space-y-1">
            <li>• Use the <strong>Test</strong> button to validate your Path DSL patterns before saving</li>
            <li>• Lower priority numbers take precedence (priority 1 beats priority 100)</li>
            <li>• Either Path DSL OR Route Name is required, not both</li>
            <li>• At least one role or permission must be specified</li>
            <li>• Inactive rules won't be enforced but are kept for future use</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreateAuthRulePage;
