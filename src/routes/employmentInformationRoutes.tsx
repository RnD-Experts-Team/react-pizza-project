import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layouts/MainLayout';

// Employment Information Management Pages
import EmploymentInformationPage from '@/features/employmentInformation/pages/EmploymentInformationPage';

export const employmentInformationRoutes = [
  <Route
    key="employment-information-management"
    path="/employment-information"
    element={
      <ProtectedRoute>
        <MainLayout>
          <EmploymentInformationPage />
        </MainLayout>
      </ProtectedRoute>
    }
  />,
];