import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { CardDataProps, iconMap } from '@/types/infoCards';
import { CurrencyDollarIcon } from '@heroicons/react/24/outline';

interface InfoCardProps {
  card: CardDataProps;
  showIcon?: boolean;
  isLoading?: boolean;
  isMobile?: boolean;
}

export const InfoCard: React.FC<InfoCardProps> = ({ 
  card, 
  showIcon = true, 
  isLoading = false,
  isMobile = false
}) => {
  const IconComponent = card.icon ? card.icon : CurrencyDollarIcon;
  
  return (
    <Card className={cn(
      "w-full h-full shadow-md transition-shadow duration-200",
      isLoading && "opacity-50",
      // Responsive min height
      isMobile ? "min-h-[120px]" : "min-h-[150px]"
    )}>
      <CardHeader className={cn(
        "flex flex-row items-center justify-between space-y-0",
        // Responsive padding
        isMobile ? "p-2 pb-1" : "pb-3"
      )}>
        <CardTitle className={cn(
          "font-medium text-foreground",
          // Responsive text size
          isMobile ? "text-sm" : "text-base md:text-lg"
        )}>
          {card.title}
        </CardTitle>
        {showIcon && (
          <IconComponent className={cn(
            "text-muted-foreground",
            // Responsive icon size
            isMobile ? "h-4 w-4" : "h-5 w-5 md:h-6 md:w-6"
          )} />
        )}
      </CardHeader>
      
      <CardContent className={cn(
        "pt-0",
        // Responsive spacing and padding
        isMobile ? "space-y-2 p-2" : "space-y-4"
      )}>
        <MetricRow 
          label="Daily" 
          value={card.daily} 
          primary 
          isMobile={isMobile}
        />
        <MetricRow 
          label="Weekly" 
          value={card.weekly} 
          isMobile={isMobile}
        />
      </CardContent>
    </Card>
  );
};

// Sub-component for metric rows
interface MetricRowProps {
  label: string;
  value: string;
  primary?: boolean;
  isMobile?: boolean;
}

const MetricRow: React.FC<MetricRowProps> = ({ 
  label, 
  value, 
  primary = false, 
  isMobile = false 
}) => (
  <div className="flex items-center justify-between">
    <span className={cn(
      "text-muted-foreground",
      primary && "font-bold",
      // Responsive text size
      isMobile ? "text-sm font-medium" : "text-lg md:text-xl font-bold",
      !primary && !isMobile && "text-base md:text-lg"
    )}>
      {label}
    </span>
    <span className={cn(
      "text-foreground",
      primary && "font-bold",
      // Responsive text size
      isMobile ? "text-sm font-bold" : "text-lg md:text-xl font-bold",
      !primary && !isMobile && "text-base md:text-lg"
    )}>
      {value}
    </span>
  </div>
);
