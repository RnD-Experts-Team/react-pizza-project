import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layouts/MainLayout';
import RoleGuard from '@/components/guards/RoleGuard';

// Daily Schedules Management Pages
import DailySchedulesPage from '@/features/dailySchedules/pages/DailySchedulesPage';

export const dailySchedulesRoutes = [
  <Route
    key="daily-schedules-management"
    path="/daily-schedules"
    element={
      <ProtectedRoute>
        <RoleGuard role="super-admin">
          <MainLayout>
            <DailySchedulesPage />
          </MainLayout>
        </RoleGuard>
      </ProtectedRoute>
    }
  />,
];