import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layouts/MainLayout';
import RoleGuard from '@/components/guards/RoleGuard';

// Store Hierarchy Management Pages
import StoreHierarchyDetailPage from '@/features/storeHierarchy/pages/StoreHierarchyDetailPage';
import CreateHierarchyPage from '@/features/storeHierarchy/pages/CreateHierarchy';
import ValidateHierarchyPage from '@/features/storeHierarchy/pages/ValidateHierarchy';
import DeleteHierarchyConfirmationPage from '@/features/storeHierarchy/pages/DeleteHierarchyConfirmationPage';

export const storeHierarchyRoutes = [
  
  <Route
    key="view-store-hierarchy"
    path="/stores-hierarchy/view/:storeId"
    element={
      <ProtectedRoute>
        <RoleGuard role="super-admin">
          <MainLayout>
            <StoreHierarchyDetailPage />
          </MainLayout>
        </RoleGuard>
      </ProtectedRoute>
    }
  />,
  <Route
    key="create-hierarchy"
    path="/stores-hierarchy/create/:storeId"
    element={
      <ProtectedRoute>
        <RoleGuard role="super-admin">
          <MainLayout>
            <CreateHierarchyPage />
          </MainLayout>
        </RoleGuard>
      </ProtectedRoute>
    }
  />,
  <Route
    key="delete-hierarchy"
    path="/stores-hierarchy/delete/:storeId"
    element={
      <ProtectedRoute>
        <RoleGuard role="super-admin">
          <MainLayout>
            <DeleteHierarchyConfirmationPage />
          </MainLayout>
        </RoleGuard>
      </ProtectedRoute>
    }
  />,
  <Route
    key="validate-hierarchy"
    path="/stores-hierarchy/validate/:storeId"
    element={
      <ProtectedRoute>
        <RoleGuard role="super-admin">
          <MainLayout>
            <ValidateHierarchyPage />
          </MainLayout>
        </RoleGuard>
      </ProtectedRoute>
    }
  />,
];