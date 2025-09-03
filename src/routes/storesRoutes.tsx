import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layouts/MainLayout';

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
        <MainLayout>
          <StoresListPage />
        </MainLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="create-store"
    path="/stores/create"
    element={
      <ProtectedRoute>
        <MainLayout>
          <CreateStorePage />
        </MainLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="edit-store"
    path="/stores/edit/:storeId"
    element={
      <ProtectedRoute>
        <MainLayout>
          <EditStorePage />
        </MainLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="view-store"
    path="/stores/view/:id"
    element={
      <ProtectedRoute>
        <MainLayout>
          <StoreDetailsPage />
        </MainLayout>
      </ProtectedRoute>
    }
  />,
];