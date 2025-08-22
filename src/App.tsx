import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { ThemeProvider } from './hooks/useTheme';
import { AuthInitializer } from './components/AuthInitializer';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import { PermissionBasedRoute } from './components/PermissionBasedRoute';

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
import TermsOfService from './pages/settings-and-abouts/TermsOfService';
import PrivacyPolicy from './pages/settings-and-abouts/PrivacyPolicy';
import Settings from './pages/settings-and-abouts/Settings';
import AuthRulesManagement from './pages/auth-rules-management/AuthRulesManagement';

// User Management Pages
import UserManagement from './pages/user-management/UserManagement';
import CreateUser from './pages/user-management/CreateUser';
import EditUser from './pages/user-management/EditUser';
import UserDetail from './pages/settings-and-abouts/UserDetail';
import CreateRole from './pages/user-management/CreateRole';
import CreatePermission from './pages/user-management/CreatePermission';

// Service Client Management Pages
import ServiceClientManagement from './pages/service-client-management/ServiceClientManagement';

// Unauthorized component
const UnauthorizedPage = () => (
  <MainLayout>
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to access this page.</p>
      </div>
    </div>
  </MainLayout>
);

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="pizza-app-theme">
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

              {/* Unauthorized Page */}
              <Route
                path="/unauthorized"
                element={
                  <ProtectedRoute>
                    <UnauthorizedPage />
                  </ProtectedRoute>
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

              {/* Permission-based routes */}
              <Route
                path="/auth-rules"
                element={
                  <PermissionBasedRoute 
                    permissions="manage auth rules" 
                    redirectTo="/unauthorized"
                  >
                    <MainLayout>
                      <AuthRulesManagement />
                    </MainLayout>
                  </PermissionBasedRoute>
                }
              />

              {/* User Management Routes - Require specific permissions */}
              <Route
                path="/user-management"
                element={
                  <PermissionBasedRoute 
                    permissions="manage users" 
                    redirectTo="/unauthorized"
                  >
                    <MainLayout>
                      <UserManagement />
                    </MainLayout>
                  </PermissionBasedRoute>
                }
              />
              <Route
                path="/user-management/create-user"
                element={
                  <PermissionBasedRoute 
                    permissions="manage users" 
                    redirectTo="/unauthorized"
                  >
                    <MainLayout>
                      <CreateUser />
                    </MainLayout>
                  </PermissionBasedRoute>
                }
              />
              <Route
                path="/user-management/edit-user/:id"
                element={
                  <PermissionBasedRoute 
                    permissions="manage users" 
                    redirectTo="/unauthorized"
                  >
                    <MainLayout>
                      <EditUser />
                    </MainLayout>
                  </PermissionBasedRoute>
                }
              />
              <Route
                path="/user-management/user-detail/:id"
                element={
                  <PermissionBasedRoute 
                    permissions="manage users" 
                    redirectTo="/unauthorized"
                  >
                    <MainLayout>
                      <UserDetail />
                    </MainLayout>
                  </PermissionBasedRoute>
                }
              />
              <Route
                path="/user-management/create-role"
                element={
                  <PermissionBasedRoute 
                    permissions="manage roles" 
                    redirectTo="/unauthorized"
                  >
                    <MainLayout>
                      <CreateRole />
                    </MainLayout>
                  </PermissionBasedRoute>
                }
              />
              <Route
                path="/user-management/create-permission"
                element={
                  <PermissionBasedRoute 
                    permissions="manage permissions" 
                    redirectTo="/unauthorized"
                  >
                    <MainLayout>
                      <CreatePermission />
                    </MainLayout>
                  </PermissionBasedRoute>
                }
              />

              {/* Service Client Management Routes */}
              <Route
                path="/service-client-management"
                element={
                  <PermissionBasedRoute 
                    permissions="manage service clients" 
                    redirectTo="/unauthorized"
                  >
                    <MainLayout>
                      <ServiceClientManagement />
                    </MainLayout>
                  </PermissionBasedRoute>
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
    </ThemeProvider>
  );
}

export default App;
