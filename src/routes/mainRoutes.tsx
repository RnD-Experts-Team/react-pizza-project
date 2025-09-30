import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layouts/MainLayout';

// Main Pages
import Dashboard from '@/features/dashboard/pages/Dashboard';
import BlankPage from '@/pages/BlankPage';
import TermsOfService from '@/pages/settings-and-abouts/TermsOfService';
import PrivacyPolicy from '@/pages/settings-and-abouts/PrivacyPolicy';
import Settings from '@/pages/settings-and-abouts/Settings';

export const mainRoutes = [
  <Route
    key="dashboard"
    path="/dashboard"
    element={
      <ProtectedRoute>
        <MainLayout>
          <Dashboard />
        </MainLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="blank-page"
    path="/blank-page"
    element={
      <ProtectedRoute>
        <MainLayout>
          <BlankPage />
        </MainLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="settings"
    path="/settings"
    element={
      <ProtectedRoute>
        <MainLayout>
          <Settings />
        </MainLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="terms"
    path="/settings/terms"
    element={
      <ProtectedRoute>
        <MainLayout>
          <TermsOfService />
        </MainLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="privacy"
    path="/settings/privacy"
    element={
      <ProtectedRoute>
        <MainLayout>
          <PrivacyPolicy />
        </MainLayout>
      </ProtectedRoute>
    }
  />,
];