import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layouts/MainLayout';

// Employees Management Pages
import EmployeesPage from '@/features/employees/pages/EmployeesPage';
import CreateEmployeePage from '@/features/employees/pages/CreateEmployeePage';
import EditEmployeePage from '@/features/employees/pages/EditEmployeePage';
import ViewEmployeePage from '@/features/employees/pages/ViewEmployeePage';

export const employeesRoutes = [
  <Route
    key="employees-management"
    path="/employees"
    element={
      <ProtectedRoute>
        <MainLayout>
          <EmployeesPage />
        </MainLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="create-employee"
    path="/employees/create"
    element={
      <ProtectedRoute>
        <MainLayout>
          <CreateEmployeePage />
        </MainLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="edit-employee"
    path="/employees/edit/:id"
    element={
      <ProtectedRoute>
        <MainLayout>
          <EditEmployeePage />
        </MainLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="view-employee"
    path="/employees/view/:id"
    element={
      <ProtectedRoute>
        <MainLayout>
          <ViewEmployeePage />
        </MainLayout>
      </ProtectedRoute>
    }
  />,
];