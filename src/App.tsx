import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
// import { AuthProvider } from './hooks/useAuth';
import { ThemeProvider } from './hooks/useTheme';
import AuthInitializer from './components/AuthInitializer';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

// Layouts
import AuthLayout from './components/layouts/AuthLayout';
import MainLayout from './components/layouts/MainLayout';

// Auth Pages
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import VerifyEmail from './features/auth/pages/VerifyEmail';
import ForgotPassword from './features/auth/pages/ForgotPassword';
import ResetPassword from './features/auth/pages/ResetPassword';

// Main Pages
import Dashboard from './pages/Dashboard';
import TermsOfService from './pages/settings-and-abouts/TermsOfService';
import PrivacyPolicy from './pages/settings-and-abouts/PrivacyPolicy';
import Settings from './pages/settings-and-abouts/Settings';

// User Management Pages
import UserManagement from './features/users/pages/UserManagement';
import CreateUser from './features/users/pages/CreateUser';
import EditUser from './features/users/pages/EditUser';
import UserDetail from './features/users/pages/UserDetail';
import CreateRole from './features/roles/pages/CreateRole';
import AssignPermissionsPage from './features/roles/pages/AssignPermissions';
import CreatePermission from './features/permissions/pages/CreatePermission';

//Service Client Management Pages
import ServiceClientsPage from './features/serviceClients/pages/ServiceClientManagement';

//Auth Roles
import AuthRulesManagement from './features/authorizationRules/pages/AuthRulesManagement';
import CreateAuthRule from './features/authorizationRules/pages/CreateAuthRule';

// Stores Management Routes
import StoresListPage from './features/stores/pages/StoresListPage';
import CreateStorePage from './features/stores/pages/CreateStorePage';
import EditStorePage from './features/stores/pages/EditStorePage';
import StoreDetailsPage from './features/stores/pages/StoreDetailsPage';

// User Role Store Assignment Pages
import UserRoleStoreAssignmentPage from './features/userRolesStoresAssignment/pages/UserRoleStoreAssignmentPage';
import UserAssignmentsPage from './features/userRolesStoresAssignment/pages/UserAssignmentsPage';
import StoreAssignmentsPage from './features/userRolesStoresAssignment/pages/StoreAssignmentsPage';
import AssignPage from './features/userRolesStoresAssignment/pages/AssignPage';
import SingleAssignPage from './features/userRolesStoresAssignment/pages/SingleAssignPage';

// Stores Hierarchy Management Routes
import StoresHierarchyPage from './features/storeHierarchy/pages/StoresHierarchyPage';
import StoreHierarchyDetailPage from './features/storeHierarchy/pages/StoreHierarchyDetailPage';
import CreateHierarchyPage from './features/storeHierarchy/pages/CreateHierarchy';
import ValidateHierarchyPage from './features/storeHierarchy/pages/ValidateHierarchy';
import DeleteHierarchyConfirmationPage from './features/storeHierarchy/pages/DeleteHierarchyConfirmationPage';


function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="pizza-app-theme">
      {/* <AuthProvider> */}
      <AuthInitializer>
        <Router>
          <div className="min-h-screen bg-background text-foreground transition-colors">
            <Routes>
              {/* Public Routes (Auth Pages) */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <AuthLayout>
                      <Login />
                    </AuthLayout>
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <AuthLayout>
                      <Register />
                    </AuthLayout>
                  </PublicRoute>
                }
              />
              <Route
                path="/verify-email"
                element={
                  <PublicRoute>
                    <AuthLayout>
                      <VerifyEmail />
                    </AuthLayout>
                  </PublicRoute>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <PublicRoute>
                    <AuthLayout>
                      <ForgotPassword />
                    </AuthLayout>
                  </PublicRoute>
                }
              />
              <Route
                path="/reset-password"
                element={
                  <PublicRoute>
                    <AuthLayout>
                      <ResetPassword />
                    </AuthLayout>
                  </PublicRoute>
                }
              />

              {/* Protected Routes (Main App) */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Dashboard />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Settings />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/terms"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <TermsOfService />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/privacy"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <PrivacyPolicy />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

               {/* User Management Routes */}
              <Route
                path="/user-management"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <UserManagement />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user-management/create/user"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <CreateUser />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user-management/edit/user/:id"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <EditUser />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user-management/view/user/:id"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <UserDetail />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user-management/create/role"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <CreateRole />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user-management/roles/assign-permissions"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <AssignPermissionsPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/user-management/create/permission"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <CreatePermission />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* Service Client Management Routes */}
              <Route
                path="/service-client-management"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ServiceClientsPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* Auth Rules Management Routes */}
              <Route
                path="/auth-rules"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <AuthRulesManagement />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/auth-rules/create"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <CreateAuthRule />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* Stores Management Routes */}
              <Route
                path="/stores"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <StoresListPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stores/create"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <CreateStorePage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stores/edit/:storeId"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <EditStorePage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stores/view/:id"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <StoreDetailsPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* User Role Store Assignment Routes */}
              <Route
                path="/user-role-store-assignment"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <UserRoleStoreAssignmentPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user-role-store-assignment/bulk"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <AssignPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user-role-store-assignment/assign"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <SingleAssignPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user-role-store-assignment/view/user/:userId"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <UserAssignmentsPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user-role-store-assignment/view/store/:storeId"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <StoreAssignmentsPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              {/* Stores Hierarchy Management Routes */}
              <Route
                path="/stores-hierarchy"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <StoresHierarchyPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stores-hierarchy/view/:storeId"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <StoreHierarchyDetailPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stores-hierarchy/create/:storeId"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <CreateHierarchyPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stores-hierarchy/delete/:storeId"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <DeleteHierarchyConfirmationPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/stores-hierarchy/validate/:storeId"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <ValidateHierarchyPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              

              {/* Default Route */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />

              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthInitializer>
      {/* </AuthProvider> */}
    </ThemeProvider>
  );
}

export default App;
