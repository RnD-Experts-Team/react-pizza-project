import { Route } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import MainLayout from '@/components/layouts/MainLayout';

// Skills Management Pages
import SkillsPage from '@/features/skills/components/SkillsPage';
import SkillDetailsPage from '@/features/skills/pages/SkillDetailsPage';

export const skillsRoutes = [
  <Route
    key="skills-management"
    path="/skills"
    element={
      <ProtectedRoute>
        <MainLayout>
          <SkillsPage />
        </MainLayout>
      </ProtectedRoute>
    }
  />,
  <Route
    key="skill-details"
    path="/skills/:id"
    element={
      <ProtectedRoute>
        <MainLayout>
          <SkillDetailsPage />
        </MainLayout>
      </ProtectedRoute>
    }
  />,
];