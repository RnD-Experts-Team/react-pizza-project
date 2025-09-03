import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layouts/MainLayout';

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
        <MainLayout>
          <UserRoleStoreAssignmentPage />
        </MainLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="bulk-assign"
    path="/user-role-store-assignment/bulk"
    element={
      <ProtectedRoute>
        <MainLayout>
          <AssignPage />
        </MainLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="single-assign"
    path="/user-role-store-assignment/assign"
    element={
      <ProtectedRoute>
        <MainLayout>
          <SingleAssignPage />
        </MainLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="view-user-assignments"
    path="/user-role-store-assignment/view/user/:userId"
    element={
      <ProtectedRoute>
        <MainLayout>
          <UserAssignmentsPage />
        </MainLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="view-store-assignments"
    path="/user-role-store-assignment/view/store/:storeId"
    element={
      <ProtectedRoute>
        <MainLayout>
          <StoreAssignmentsPage />
        </MainLayout>
      </ProtectedRoute>
    }
  />,
];