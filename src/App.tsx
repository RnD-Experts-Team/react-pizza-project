import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { ThemeProvider } from './hooks/useTheme';

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

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="pizza-app-theme">
      <AuthProvider>
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
              
              {/* Default Route */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
