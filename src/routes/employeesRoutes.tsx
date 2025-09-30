import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layouts/MainLayout';
import RoleGuard from '@/components/guards/RoleGuard';

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
        <RoleGuard role="super-admin">
          <MainLayout>
            <EmployeesPage />
          </MainLayout>
        </RoleGuard>
      </ProtectedRoute>
    }
  />,
  <Route
    key="create-employee"
    path="/employees/create"
    element={
      <ProtectedRoute>
        <RoleGuard role="super-admin">
          <MainLayout>
            <CreateEmployeePage />
          </MainLayout>
        </RoleGuard>
      </ProtectedRoute>
    }
  />,
  <Route
    key="edit-employee"
    path="/employees/edit/:id"
    element={
      <ProtectedRoute>
        <RoleGuard role="super-admin">
          <MainLayout>
            <EditEmployeePage />
          </MainLayout>
        </RoleGuard>
      </ProtectedRoute>
    }
  />,
  <Route
    key="view-employee"
    path="/employees/view/:id"
    element={
      <ProtectedRoute>
        <RoleGuard role="super-admin">
          <MainLayout>
            <ViewEmployeePage />
          </MainLayout>
        </RoleGuard>
      </ProtectedRoute>
    }
  />,
];