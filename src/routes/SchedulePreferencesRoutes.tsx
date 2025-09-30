import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layouts/MainLayout';
import RoleGuard from '@/components/guards/RoleGuard';

// Schedule Preferences Management Pages
import SchedulePreferencesPage from '@/features/schedulePreferences/pages/SchedulePreferencesPage';

export const schedulePreferencesRoutes = [
  <Route
    key="schedule-preferences-management"
    path="/schedule-preferences"
    element={
      <ProtectedRoute>
        <RoleGuard role="super-admin">
          <MainLayout>
            <SchedulePreferencesPage />
          </MainLayout>
        </RoleGuard>
      </ProtectedRoute>
    }
  />,
];