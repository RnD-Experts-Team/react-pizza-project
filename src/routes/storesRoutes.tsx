import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layouts/MainLayout';
import RoleGuard from '@/components/guards/RoleGuard';

// Stores Management Pages
import StoresListPage from '@/features/stores/pages/StoresListPage';
import CreateStorePage from '@/features/stores/pages/CreateStorePage';
import EditStorePage from '@/features/stores/pages/EditStorePage';
import StoreDetailsPage from '@/features/stores/pages/StoreDetailsPage';

export const storesRoutes = [
  <Route
    key="stores-list"
    path="/stores"
    element={
      <ProtectedRoute>
        <RoleGuard role="super-admin">
          <MainLayout>
            <StoresListPage />
          </MainLayout>
        </RoleGuard>
      </ProtectedRoute>
    }
  />,
  <Route
    key="create-store"
    path="/stores/create"
    element={
      <ProtectedRoute>
        <RoleGuard role="super-admin">
          <MainLayout>
            <CreateStorePage />
          </MainLayout>
        </RoleGuard>
      </ProtectedRoute>
    }
  />,
  <Route
    key="edit-store"
    path="/stores/edit/:storeId"
    element={
      <ProtectedRoute>
        <RoleGuard role="super-admin">
          <MainLayout>
            <EditStorePage />
          </MainLayout>
        </RoleGuard>
      </ProtectedRoute>
    }
  />,
  <Route
    key="view-store"
    path="/stores/view/:id"
    element={
      <ProtectedRoute>
        <RoleGuard role="super-admin">
          <MainLayout>
            <StoreDetailsPage />
          </MainLayout>
        </RoleGuard>
      </ProtectedRoute>
    }
  />,
];