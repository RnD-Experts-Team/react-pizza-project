import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layouts/MainLayout';

// Daily Schedules Management Pages
import DailySchedulesPage from '@/features/dailySchedules/pages/DailySchedulesPage';

export const dailySchedulesRoutes = [
  <Route
    key="daily-schedules-management"
    path="/daily-schedules"
    element={
      <ProtectedRoute>
        <MainLayout>
          <DailySchedulesPage />
        </MainLayout>
      </ProtectedRoute>
    }
  />,
];