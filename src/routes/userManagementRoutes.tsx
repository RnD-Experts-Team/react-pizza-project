import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layouts/MainLayout';
import RoleGuard from '@/components/guards/RoleGuard';

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
        <RoleGuard role="super-admin">
          <MainLayout>
            <UserManagement />
          </MainLayout>
        </RoleGuard>
      </ProtectedRoute>
    }
  />,
  <Route
    key="create-user"
    path="/user-management/create/user"
    element={
      <ProtectedRoute>
        <RoleGuard role="super-admin">
          <MainLayout>
            <CreateUser />
          </MainLayout>
        </RoleGuard>
      </ProtectedRoute>
    }
  />,
  <Route
    key="edit-user"
    path="/user-management/edit/user/:id"
    element={
      <ProtectedRoute>
        <RoleGuard role="super-admin">
          <MainLayout>
            <EditUser />
          </MainLayout>
        </RoleGuard>
      </ProtectedRoute>
    }
  />,
  <Route
    key="view-user"
    path="/user-management/view/user/:id"
    element={
      <ProtectedRoute>
        <RoleGuard role="super-admin">
          <MainLayout>
            <UserDetail />
          </MainLayout>
        </RoleGuard>
      </ProtectedRoute>
    }
  />,
  <Route
    key="create-role"
    path="/user-management/create/role"
    element={
      <ProtectedRoute>
        <RoleGuard role="super-admin">
          <MainLayout>
            <CreateRole />
          </MainLayout>
        </RoleGuard>
      </ProtectedRoute>
    }
  />,
  <Route
    key="assign-permissions"
    path="/user-management/roles/assign-permissions"
    element={
      <ProtectedRoute>
        <RoleGuard role="super-admin">
          <MainLayout>
            <AssignPermissionsPage />
          </MainLayout>
        </RoleGuard>
      </ProtectedRoute>
    }
  />,
  <Route
    key="create-permission"
    path="/user-management/create/permission"
    element={
      <ProtectedRoute>
        <RoleGuard role="super-admin">
          <MainLayout>
            <CreatePermission />
          </MainLayout>
        </RoleGuard>
      </ProtectedRoute>
    }
  />,
];