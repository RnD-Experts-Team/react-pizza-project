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
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useAuthRules } from '../hooks/useAuthRules';
import { CreateAuthRuleForm } from '../components/CreateAuthRule/CreateAuthRuleForm';
import { ManageLayout } from '../../../components/layouts/ManageLayout';

const CreateAuthRulePage: React.FC = () => {
  const navigate = useNavigate();
  const { error, helpers } = useAuthRules({ autoFetch: false, showToasts: true });



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
    <ManageLayout
      title="Create Authorization Rule"
      subtitle="Define a new access control rule for your application"
      backButton={{
        show: true,
      }}
    >
      <div className="space-y-4 sm:space-y-5 lg:space-y-6">

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

            <li>• Either Path DSL OR Route Name is required, not both</li>
            <li>• At least one role or permission must be specified</li>
            <li>• Inactive rules won't be enforced but are kept for future use</li>
          </ul>
        </div>
      </div>
    </ManageLayout>
  );
};

export default CreateAuthRulePage;
