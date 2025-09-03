import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layouts/MainLayout';

// Auth Rules Management Pages
import AuthRulesManagement from '@/features/authorizationRules/pages/AuthRulesManagement';
import CreateAuthRule from '@/features/authorizationRules/pages/CreateAuthRule';

export const authRulesRoutes = [
  <Route
    key="auth-rules"
    path="/auth-rules"
    element={
      <ProtectedRoute>
        <MainLayout>
          <AuthRulesManagement />
        </MainLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="create-auth-rule"
    path="/auth-rules/create"
    element={
      <ProtectedRoute>
        <MainLayout>
          <CreateAuthRule />
        </MainLayout>
      </ProtectedRoute>
    }
  />,
];