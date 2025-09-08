import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Store } from 'lucide-react';

interface StoreAccessSectionProps {
  user: any; // Replace with your User type
  formattedData: any; // Replace with your FormattedData type
}

export const StoreAccessSection: React.FC<StoreAccessSectionProps> = ({
  user,
  formattedData,
}) => {
  // Memoized store access cards
  const storeAccessCards = useMemo(() => {
    if (!user?.stores || user.stores.length === 0) {
      return (
        <p className="text-sm sm:text-base text-muted-foreground">
          No store access assigned
        </p>
      );
    }

    return user.stores.map((userStore: { store: { id: string; name: string }; roles: { id: string; name: string }[] }) => (
      <div
        key={userStore.store.id}
        className="rounded-lg p-3 sm:p-4 border border-border bg-muted"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 mb-3">
          <h4 className="font-semibold text-sm sm:text-base text-card-foreground">
            {userStore.store.name}
          </h4>
          <Badge
            variant="outline"
            className="text-xs sm:text-sm px-2 py-1 w-fit"
          >
            {userStore.store.id}
          </Badge>
        </div>
        <div>
          <label className="text-xs sm:text-sm font-medium text-muted-foreground">
            Store Roles
          </label>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1">
            {userStore.roles.map((role) => (
              <Badge
                key={role.id}
                variant="secondary"
                className="text-xs sm:text-sm px-2 py-1"
              >
                {role.name}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    ));
  }, [user?.stores]);

  return (
    <Card className="lg:col-span-2 bg-card border-border">
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-card-foreground">
          <Store className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          Store Access ({formattedData?.storeCount})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-5 md:p-6">
        {user.stores && user.stores.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {storeAccessCards}
          </div>
        ) : (
          <p className="text-sm sm:text-base text-muted-foreground">
            No store access assigned
          </p>
        )}
      </CardContent>
    </Card>
  );
};
