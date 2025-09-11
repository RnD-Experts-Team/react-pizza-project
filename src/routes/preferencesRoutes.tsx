import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layouts/MainLayout';

// preferences Management Pages
import PreferencesPage from '@/features/preference/components/PreferencesPage';
import PreferenceDetailsPage from '@/features/preference/pages/PreferenceDetailsPage';

export const preferencesRoutes = [
  <Route
    key="preferences-management"
    path="/preferences"
    element={
      <ProtectedRoute>
        <MainLayout>
          <PreferencesPage />
        </MainLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="preference-details"
    path="/preferences/:id"
    element={
      <ProtectedRoute>
        <MainLayout>
          <PreferenceDetailsPage />
        </MainLayout>
      </ProtectedRoute>
    }
  />,
];