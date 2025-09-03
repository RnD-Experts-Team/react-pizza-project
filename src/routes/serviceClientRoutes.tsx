import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layouts/MainLayout';

// Service Client Management Pages
import ServiceClientsPage from '@/features/serviceClients/pages/ServiceClientManagement';

export const serviceClientRoutes = [
  <Route
    key="service-client-management"
    path="/service-client-management"
    element={
      <ProtectedRoute>
        <MainLayout>
          <ServiceClientsPage />
        </MainLayout>
      </ProtectedRoute>
    }
  />,
];