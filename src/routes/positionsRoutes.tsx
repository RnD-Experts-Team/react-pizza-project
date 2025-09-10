import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layouts/MainLayout';

// Positions Management Pages
import PositionsManagementPage from '@/features/positions/pages/PositionsManagementPage';

export const positionsRoutes = [
  <Route
    key="positions-management"
    path="/positions"
    element={
      <ProtectedRoute>
        <MainLayout>
          <PositionsManagementPage />
        </MainLayout>
      </ProtectedRoute>
    }
  />,
];