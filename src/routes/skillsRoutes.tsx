import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layouts/MainLayout';
import RoleGuard from '@/components/guards/RoleGuard';

// Skills Management Pages
import SkillsPage from '@/features/skills/components/SkillsPage';
import SkillDetailsPage from '@/features/skills/pages/SkillDetailsPage';

export const skillsRoutes = [
  <Route
    key="skills-management"
    path="/skills"
    element={
      <ProtectedRoute>
        <RoleGuard role="super-admin">
          <MainLayout>
            <SkillsPage />
          </MainLayout>
        </RoleGuard>
      </ProtectedRoute>
    }
  />,
  <Route
    key="skill-details"
    path="/skills/:id"
    element={
      <ProtectedRoute>
        <RoleGuard role="super-admin">
          <MainLayout>
            <SkillDetailsPage />
          </MainLayout>
        </RoleGuard>
      </ProtectedRoute>
    }
  />,
];