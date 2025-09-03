import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layouts/MainLayout';

// User Management Pages
import UserManagement from '@/features/users/pages/UserManagement';
import CreateUser from '@/features/users/pages/CreateUser';
import EditUser from '@/features/users/pages/EditUser';
import UserDetail from '@/features/users/pages/UserDetail';
import CreateRole from '@/features/roles/pages/CreateRole';
import AssignPermissionsPage from '@/features/roles/pages/AssignPermissions';
import CreatePermission from '@/features/permissions/pages/CreatePermission';

export const userManagementRoutes = [
  <Route
    key="user-management"
    path="/user-management"
    element={
      <ProtectedRoute>
        <MainLayout>
          <UserManagement />
        </MainLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="create-user"
    path="/user-management/create/user"
    element={
      <ProtectedRoute>
        <MainLayout>
          <CreateUser />
        </MainLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="edit-user"
    path="/user-management/edit/user/:id"
    element={
      <ProtectedRoute>
        <MainLayout>
          <EditUser />
        </MainLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="view-user"
    path="/user-management/view/user/:id"
    element={
      <ProtectedRoute>
        <MainLayout>
          <UserDetail />
        </MainLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="create-role"
    path="/user-management/create/role"
    element={
      <ProtectedRoute>
        <MainLayout>
          <CreateRole />
        </MainLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="assign-permissions"
    path="/user-management/roles/assign-permissions"
    element={
      <ProtectedRoute>
        <MainLayout>
          <AssignPermissionsPage />
        </MainLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="create-permission"
    path="/user-management/create/permission"
    element={
      <ProtectedRoute>
        <MainLayout>
          <CreatePermission />
        </MainLayout>
      </ProtectedRoute>
    }
  />,
];