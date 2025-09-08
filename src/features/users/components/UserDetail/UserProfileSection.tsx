import React from 'react';
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Mail, Calendar, User } from 'lucide-react';

interface UserProfileSectionProps {
  user: any; // Replace with your User type
  formattedData: any; // Replace with your FormattedData type
}

export const UserProfileSection: React.FC<UserProfileSectionProps> = ({
  user,
  formattedData,
}) => {
  return (
    <>
      {/* User Profile Card */}
      <Card className="bg-card border-border">
        <CardContent className="pt-4 sm:pt-5 md:pt-6 p-4 sm:p-5 md:p-6">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
            <div className="h-16 w-16 sm:h-18 sm:w-18 md:h-20 md:w-20 rounded-full flex items-center justify-center text-lg sm:text-xl md:text-2xl font-bold mx-auto sm:mx-0 bg-primary/10 text-primary">
              {formattedData?.initials}
            </div>
            <div className="flex-1 space-y-2 text-center sm:text-left">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-card-foreground">
                {formattedData?.displayName}
              </h2>
              <div className="flex items-center gap-2 justify-center sm:justify-start text-muted-foreground">
                <Mail className="h-4 w-4" />
                <span className="text-sm sm:text-base">
                  {formattedData?.formattedEmail}
                </span>
              </div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <Badge
                  variant={user.email_verified_at ? 'default' : 'secondary'}
                  className="text-xs sm:text-sm"
                >
                  {formattedData?.verificationStatus}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
        {/* Account Information */}
        <Card className="bg-card border-border">
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-card-foreground">
              <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-5 md:p-6">
            <div>
              <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                User ID
              </label>
              <p className="text-sm sm:text-base mt-1 text-card-foreground">
                {user.id}
              </p>
            </div>
            <Separator className="bg-border" />
            <div>
              <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                Created
              </label>
              <p className="text-sm sm:text-base mt-1 flex items-center gap-2 text-card-foreground">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                {formattedData?.createdAt}
              </p>
            </div>
            <div>
              <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                Last Updated
              </label>
              <p className="text-sm sm:text-base mt-1 text-card-foreground">
                {formattedData?.updatedAt}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
