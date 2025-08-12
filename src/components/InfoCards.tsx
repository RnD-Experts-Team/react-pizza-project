import React from 'react';
import { cn } from '@/lib/utils';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { InfoCardsGrid } from '@/components/infoCards/InfoCardsGrid';
import { useInfoCardsData } from '@/hooks/useInfoCardsData';
import { useIsMobile } from '@/hooks/use-mobile';
import type { CardDataProps } from '@/types/infoCards';
import { Button } from '@/components/ui/button';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface InfoCardsProps {
  title?: string;
  subtitle?: string;
  data?: CardDataProps[];
  className?: string;
  showIcons?: boolean;
  showRefresh?: boolean;
}

export const InfoCards: React.FC<InfoCardsProps> = ({
  title = "Business Overview",
  subtitle,
  data: externalData,
  className,
  showIcons = true,
  showRefresh = true
}) => {
  const { data: hookData, isLoading, refreshData } = useInfoCardsData();
  const isMobile = useIsMobile();
  const data = externalData || hookData;

  return (
    <section className={cn(
      "w-full",
      // Responsive padding and spacing
      isMobile 
        ? "p-2 space-y-3" 
        : "p-4 md:p-6 lg:p-8 space-y-6",
      className
    )}>
      <SectionHeader 
        title={title}
        subtitle={subtitle}
        actions={
          showRefresh ? (
            <Button
              variant="outline"
              size={isMobile ? "sm" : "sm"}
              onClick={refreshData}
              disabled={isLoading}
              className={cn(
                "gap-2",
                isMobile && "text-xs px-2 py-1"
              )}
            >
              <ArrowPathIcon className={cn(
                isMobile ? "h-3 w-3" : "h-4 w-4",
                isLoading && "animate-spin"
              )} />
              Refresh
            </Button>
          ) : null
        }
      />
      
      <InfoCardsGrid
        data={data}
        showIcons={showIcons}
        isLoading={isLoading}
      />
    </section>
  );
};
