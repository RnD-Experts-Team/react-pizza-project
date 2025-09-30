import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layouts/MainLayout';
import RoleGuard from '@/components/guards/RoleGuard';

// User Role Store Assignment Pages
import UserRoleStoreAssignmentPage from '@/features/userRolesStoresAssignment/pages/UserRoleStoreAssignmentPage';
import UserAssignmentsPage from '@/features/userRolesStoresAssignment/pages/UserAssignmentsPage';
import StoreAssignmentsPage from '@/features/userRolesStoresAssignment/pages/StoreAssignmentsPage';
import AssignPage from '@/features/userRolesStoresAssignment/pages/AssignPage';
import SingleAssignPage from '@/features/userRolesStoresAssignment/pages/SingleAssignPage';

export const userRoleStoreAssignmentRoutes = [
  <Route
    key="user-role-store-assignment"
    path="/user-role-store-assignment"
    element={
      <ProtectedRoute>
        <RoleGuard role="super-admin">
          <MainLayout>
            <UserRoleStoreAssignmentPage />
          </MainLayout>
        </RoleGuard>
      </ProtectedRoute>
    }
  />,
  <Route
    key="bulk-assign"
    path="/user-role-store-assignment/bulk"
    element={
      <ProtectedRoute>
        <RoleGuard role="super-admin">
          <MainLayout>
            <AssignPage />
          </MainLayout>
        </RoleGuard>
      </ProtectedRoute>
    }
  />,
  <Route
    key="single-assign"
    path="/user-role-store-assignment/assign"
    element={
      <ProtectedRoute>
        <RoleGuard role="super-admin">
          <MainLayout>
            <SingleAssignPage />
          </MainLayout>
        </RoleGuard>
      </ProtectedRoute>
    }
  />,
  <Route
    key="view-user-assignments"
    path="/user-role-store-assignment/view/user/:userId"
    element={
      <ProtectedRoute>
        <RoleGuard role="super-admin">
          <MainLayout>
            <UserAssignmentsPage />
          </MainLayout>
        </RoleGuard>
      </ProtectedRoute>
    }
  />,
  <Route
    key="view-store-assignments"
    path="/user-role-store-assignment/view/store/:storeId"
    element={
      <ProtectedRoute>
        <RoleGuard role="super-admin">
          <MainLayout>
            <StoreAssignmentsPage />
          </MainLayout>
        </RoleGuard>
      </ProtectedRoute>
    }
  />,
];