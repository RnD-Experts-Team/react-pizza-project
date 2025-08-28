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
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import VerifyEmail from './pages/auth/VerifyEmail';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';

// Main Pages
import Dashboard from './pages/Dashboard';
import Pizza from './pages/Pizza';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Settings from './pages/Settings';
import AuthRulesManagement from './pages/authorizationRules/AuthRulesManagement';
import CreateAuthRule from './pages/authorizationRules/CreateAuthRule';

// User Management Pages
import UserManagement from './pages/users/UserManagement';
import CreateUser from './pages/users/CreateUser';
import EditUser from './pages/users/EditUser';
import UserDetail from './pages/users/UserDetail';
import CreateRole from './pages/roles/CreateRole';
import AssignPermissionsPage from './pages/roles/AssignPermissions';
import CreatePermission from './pages/permissions/CreatePermission';

import StoresListPage from './pages/stores/StoresListPage';
import CreateStorePage from './pages/stores/CreateStorePage';
import EditStorePage from './pages/stores/EditStorePage';
import StoreDetailsPage from './pages/stores/StoreDetailsPage';

// Service Client Management Pages
import ServiceClientsPage from './pages/serviceClients/ServiceClientManagement';

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
                path="/pizza"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <Pizza />
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
                path="/user-management/create-user"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <CreateUser />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user-management/edit-user/:id"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <EditUser />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user-management/user-detail/:id"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <UserDetail />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user-management/create-role"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <CreateRole />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/user-management/assign-permissions"
                element={
                  <ProtectedRoute>
                    <MainLayout>
                      <AssignPermissionsPage />
                    </MainLayout>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/user-management/create-permission"
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
