/**
 * View User Page
 *
 * Page for viewing user details in a beautiful layout with responsive design
 * and CSS variable integration for light/dark mode compatibility
 */
import React, { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '@/features/users/hooks/useUsers';
import { Button } from '@/components/ui/button';
import { ManageLayout } from '@/components/layouts/ManageLayout';
import { Edit, Loader2 } from 'lucide-react';
import { UserProfileSection } from '@/features/users/components/UserDetail/UserProfileSection';
import { RolesPermissionsSection } from '@/features/users/components/UserDetail/RolesPermissionsSection';
import { StoreAccessSection } from '@/features/users/components/UserDetail/StoreAccessSection';

const ViewUserPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Memoized userId calculation with proper validation
  const userId = useMemo(() => {
    if (!id) return undefined;
    const parsed = parseInt(id, 10);
    return isNaN(parsed) ? undefined : parsed;
  }, [id]);
  
  const { user, loading, error, formattedData } = useUser(userId);

  // Memoized navigation handler
  const handleEdit = useCallback(() => {
    navigate(`/user-management/edit/user/${userId}`);
  }, [navigate, userId]);

  // Memoized main button component to prevent re-renders
  const mainButtons = useMemo(() => (
    <Button
      onClick={handleEdit}
      className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
    >
      <Edit className="h-4 w-4" />
      <span className="text-sm sm:text-base">Edit User</span>
    </Button>
  ), [handleEdit]);

  if (loading) {
    return (
      <ManageLayout
        title="User Details"
        subtitle="View all information about this user"
        backButton={{
          show: true,
        }}
      >
        <div className="flex items-center justify-center py-8 sm:py-10 md:py-12 lg:py-16">
          <Loader2 className="h-6 w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 animate-spin text-primary" />
          <span className="ml-2 text-sm sm:text-base text-foreground">
            Loading user...
          </span>
        </div>
      </ManageLayout>
    );
  }

  if (error || !user) {
    return (
      <ManageLayout
        title="User Details"
        subtitle="View all information about this user"
        backButton={{
          show: true,
        }}
      >
        <div className="text-center py-3 sm:py-4 text-sm sm:text-base text-destructive">
          {error || 'User not found'}
        </div>
      </ManageLayout>
    );
  }

  return (
    <ManageLayout
      title="User Details"
      subtitle="View all information about this user"
      backButton={{
        show: true,
      }}
      mainButtons={mainButtons}
    >
      <UserProfileSection user={user} formattedData={formattedData} />
      <RolesPermissionsSection user={user} formattedData={formattedData} />
      <StoreAccessSection user={user} formattedData={formattedData} />
    </ManageLayout>
  );
};

export default ViewUserPage;
