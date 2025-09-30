import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layouts/MainLayout';
import RoleGuard from '@/components/guards/RoleGuard';

// Service Client Management Pages
import ServiceClientsPage from '@/features/serviceClients/pages/ServiceClientManagement';

export const serviceClientRoutes = [
  <Route
    key="service-client-management"
    path="/service-client-management"
    element={
      <ProtectedRoute>
        <RoleGuard role="super-admin">
          <MainLayout>
            <ServiceClientsPage />
          </MainLayout>
        </RoleGuard>
      </ProtectedRoute>
    }
  />,
];