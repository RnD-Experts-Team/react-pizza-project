import React from 'react';
import { cn } from '@/lib/utils';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PlatformContainer } from '@/components/dsqr/PlatformContainer';
import { DSQRTabbedView } from '@/components/dsqr/DSQRTabbedView';
import { useDSQRData } from '@/hooks/useDSQRData';
import { useIsMobile } from '@/hooks/use-mobile';
import type { DSQRDashboardProps } from '@/types/dsqr';

export const DSQRDashboard: React.FC<DSQRDashboardProps> = ({
  title = 'DSQR',
  platforms: externalPlatforms,
  className,
  layout = 'horizontal',
}) => {
  const { platforms: hookPlatforms } = useDSQRData();
  const isMobile = useIsMobile();
  const platforms = externalPlatforms || hookPlatforms;

  // Use tabbed view for small and medium screens
  const shouldUseTabbedView = isMobile;

  return (
    <div
      className={cn(
        'w-full max-w-7xl mx-auto',
        isMobile ? 'p-2' : 'p-4 md:p-6',
        className,
      )}
    >
      <SectionHeader title={title} className="mb-4" />

      {shouldUseTabbedView ? (
        <DSQRTabbedView platforms={platforms} />
      ) : (
        <PlatformContainer platforms={platforms} layout={layout} />
      )}
    </div>
  );
};

// Export with original name for backward compatibility
export const Dsqr = DSQRDashboard;
