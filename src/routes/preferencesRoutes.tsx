import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layouts/MainLayout';
import RoleGuard from '@/components/guards/RoleGuard';

// preferences Management Pages
import PreferencesPage from '@/features/preference/components/PreferencesPage';
import PreferenceDetailsPage from '@/features/preference/pages/PreferenceDetailsPage';

export const preferencesRoutes = [
  <Route
    key="preferences-management"
    path="/preferences"
    element={
      <ProtectedRoute>
        <RoleGuard role="super-admin">
          <MainLayout>
            <PreferencesPage />
          </MainLayout>
        </RoleGuard>
      </ProtectedRoute>
    }
  />,
  <Route
    key="preference-details"
    path="/preferences/:id"
    element={
      <ProtectedRoute>
        <RoleGuard role="super-admin">
          <MainLayout>
            <PreferenceDetailsPage />
          </MainLayout>
        </RoleGuard>
      </ProtectedRoute>
    }
  />,
];