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
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={handleBack} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Create Authorization Rule</h1>
              <p className="text-muted-foreground">
                Define a new access control rule for your application
              </p>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
          <button 
            onClick={handleBack}
            className="hover:text-foreground transition-colors"
          >
            Authorization Rules
          </button>
          <span>/</span>
          <span className="text-foreground">Create New Rule</span>
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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Creating Authorization Rules</h3>
          <div className="text-sm text-blue-800 space-y-1">
            <p>• <strong>Service:</strong> The application service this rule applies to (e.g., api, data, auth)</p>
            <p>• <strong>Path DSL:</strong> Dynamic path pattern with variables like <code className="bg-blue-100 px-1 rounded">/users/{'{id}'}/posts/*</code></p>
            <p>• <strong>Route Name:</strong> Named route identifier like <code className="bg-blue-100 px-1 rounded">users.posts.show</code></p>
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
        <div className="border-t pt-6">
          <h3 className="font-medium mb-3">Common Examples</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium text-green-700">Path DSL Examples:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li><code className="bg-gray-100 px-1 rounded">/api/users/{'{id}'}</code> - Matches /api/users/123</li>
                <li><code className="bg-gray-100 px-1 rounded">/files/*</code> - Matches any path starting with /files/</li>
                <li><code className="bg-gray-100 px-1 rounded">/admin/{'{section}'}/settings</code> - Matches admin sections</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-blue-700">Route Name Examples:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li><code className="bg-gray-100 px-1 rounded">users.show</code> - Show user profile</li>
                <li><code className="bg-gray-100 px-1 rounded">admin.dashboard</code> - Admin dashboard</li>
                <li><code className="bg-gray-100 px-1 rounded">api.data.export</code> - Data export endpoint</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h3 className="font-medium text-amber-900 mb-2">💡 Pro Tips</h3>
          <ul className="text-sm text-amber-800 space-y-1">
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
