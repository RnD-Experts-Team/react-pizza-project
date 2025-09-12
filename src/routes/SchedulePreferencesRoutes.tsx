import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layouts/MainLayout';

// Schedule Preferences Management Pages
import SchedulePreferencesPage from '@/features/schedulePreferences/pages/SchedulePreferencesPage';

export const schedulePreferencesRoutes = [
  <Route
    key="schedule-preferences-management"
    path="/schedule-preferences"
    element={
      <ProtectedRoute>
        <MainLayout>
          <SchedulePreferencesPage />
        </MainLayout>
      </ProtectedRoute>
    }
  />,
];