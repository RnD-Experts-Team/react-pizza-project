import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layouts/MainLayout';
import RoleGuard from '@/components/guards/RoleGuard';

// Auth Rules Management Pages
import AuthRulesManagement from '@/features/authorizationRules/pages/AuthRulesManagement';
import CreateAuthRule from '@/features/authorizationRules/pages/CreateAuthRule';

export const authRulesRoutes = [
  <Route
    key="auth-rules"
    path="/auth-rules"
    element={
      <ProtectedRoute>
        <RoleGuard role="super-admin">
          <MainLayout>
            <AuthRulesManagement />
          </MainLayout>
        </RoleGuard>
      </ProtectedRoute>
    }
  />,
  <Route
    key="create-auth-rule"
    path="/auth-rules/create"
    element={
      <ProtectedRoute>
        <RoleGuard role="super-admin">
          <MainLayout>
            <CreateAuthRule />
          </MainLayout>
        </RoleGuard>
      </ProtectedRoute>
    }
  />,
];