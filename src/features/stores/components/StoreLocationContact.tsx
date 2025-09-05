/**
 * StoreLocationContact Component
 * Displays store's location, contact information, and timestamps
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Phone, MapPin, Calendar, Clock } from 'lucide-react';

interface Store {
  id: string;
  name: string;
  is_active: boolean;
  metadata?: {
    address?: string;
    phone?: string;
  };
  created_at: string;
  updated_at: string;
}

interface StoreLocationContactProps {
  store: Store;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const StoreLocationContact: React.FC<StoreLocationContactProps> = ({ store }) => {
  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
          <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
          <span>Location & Contact</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4">
        {store.metadata?.address && (
          <div className="space-y-1 sm:space-y-2">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">Address</span>
            <div className="flex items-start space-x-1 sm:space-x-2">
              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground mt-0.5 shrink-0" />
              <span className="text-xs sm:text-sm break-words">
                {store.metadata.address}
              </span>
            </div>
          </div>
        )}
        
        {store.metadata?.phone && (
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
            <span className="text-xs sm:text-sm font-medium text-muted-foreground">Phone</span>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              <span className="text-xs sm:text-sm break-all">{store.metadata.phone}</span>
            </div>
          </div>
        )}
        
        <Separator className="my-2 sm:my-4" />
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
          <span className="text-xs sm:text-sm font-medium text-muted-foreground">Created</span>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            <span className="text-xs sm:text-sm break-words">{formatDate(store.created_at)}</span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-0">
          <span className="text-xs sm:text-sm font-medium text-muted-foreground">Last Updated</span>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
            <span className="text-xs sm:text-sm break-words">{formatDate(store.updated_at)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
