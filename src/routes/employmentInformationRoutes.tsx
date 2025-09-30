import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layouts/MainLayout';
import RoleGuard from '@/components/guards/RoleGuard';

// Employment Information Management Pages
import EmploymentInformationPage from '@/features/employmentInformation/pages/EmploymentInformationPage';

export const employmentInformationRoutes = [
  <Route
    key="employment-information-management"
    path="/employment-information"
    element={
      <ProtectedRoute>
        <RoleGuard role="super-admin">
          <MainLayout>
            <EmploymentInformationPage />
          </MainLayout>
        </RoleGuard>
      </ProtectedRoute>
    }
  />,
];