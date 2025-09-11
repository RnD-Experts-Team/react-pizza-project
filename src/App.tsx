import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
// import { AuthProvider } from './hooks/useAuth';
import { ThemeProvider } from '@/hooks/useTheme';
import AuthInitializer from '@/components/AuthInitializer';
import CustomLoadingScreen from '@/components/CustomLoadingScreen';

// Import all route modules
import {
  authRoutes,
  mainRoutes,
  userManagementRoutes,
  serviceClientRoutes,
  authRulesRoutes,
  storesRoutes,
  userRoleStoreAssignmentRoutes,
  storeHierarchyRoutes,
  positionsRoutes,
  skillsRoutes,
  preferencesRoutes,
} from '@/routes';


function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="pizza-app-theme">
      {/* <AuthProvider> */}
      <AuthInitializer fallback={<CustomLoadingScreen />}>
        <Router>
          <div className="min-h-screen bg-background text-foreground transition-colors">
            <Routes>
              {/* Authentication Routes */}
              {authRoutes}

              {/* Main Application Routes */}
              {mainRoutes}

              {/* User Management Routes */}
              {userManagementRoutes}

              {/* Service Client Management Routes */}
              {serviceClientRoutes}

              {/* Authorization Rules Management Routes */}
              {authRulesRoutes}

              {/* Stores Management Routes */}
              {storesRoutes}

              {/* User Role Store Assignment Routes */}
              {userRoleStoreAssignmentRoutes}

              {/* Store Hierarchy Management Routes */}
              {storeHierarchyRoutes}

              {/* Positions Management Routes */}
              {positionsRoutes}

              {/* Skills Management Routes */}
              {skillsRoutes}

              {/* Preferences Management Routes */}
              {preferencesRoutes}

              {/* Default and catch-all routes */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
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
