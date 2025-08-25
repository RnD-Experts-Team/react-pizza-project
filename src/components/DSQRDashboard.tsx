import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PlatformContainer } from '@/components/dsqr/PlatformContainer';
import { DSQRTabbedView } from '@/components/dsqr/DSQRTabbedView';
import { useDSQRData } from '@/hooks/useDSQRData';
import type { DSQRDashboardProps } from '@/types/dsqr';

export const DSQRDashboard: React.FC<DSQRDashboardProps> = ({
  title = 'DSQR',
  platforms: externalPlatforms,
  className,
  layout = 'horizontal',
}) => {
  const { platforms: hookPlatforms } = useDSQRData();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const platforms = externalPlatforms || hookPlatforms;

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };

    // Check on mount
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Use tabbed view for screens smaller than 1024px
  const shouldUseTabbedView = isSmallScreen;

  return (
    <div
      className={cn(
        'w-full max-w-full mx-auto',
        isSmallScreen ? 'p-2' : 'p-4 md:p-6',
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
