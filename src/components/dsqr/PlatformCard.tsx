import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { MetricRow, MetricRowWithStatus } from './MetricRow';
import { OnTrackSection } from './OnTrackSection';
import { useTheme } from '@/hooks/useTheme';
import { getThemeIcon, isDarkTheme } from '@/types/dsqr';
import type { PlatformCardProps } from '@/types/dsqr';

interface PlatformCardComponentProps extends PlatformCardProps {
  isMobile?: boolean;
}

export const PlatformCard: React.FC<PlatformCardComponentProps> = ({
  iconSrc,
  title,
  data = null,
  metrics = null,
  hasOnTrack = true,
  onTrackPosition = 'middle',
  className,
  isMobile = false,
}) => {
  const { theme } = useTheme();
  const safeData = data || [];
  const safeMetrics = metrics || [];

  // Determine if we should use dark icons
  const shouldUseDarkIcon = theme === 'dark' || (theme === 'system' && isDarkTheme());

  // Get the appropriate icon based on theme
  const getIconSrc = () => {
    if (iconSrc) {
      // If iconSrc is provided, try to determine platform from the path
      if (iconSrc.includes('doordash')) {
        return getThemeIcon('doordash', shouldUseDarkIcon);
      } else if (iconSrc.includes('ubereats')) {
        return getThemeIcon('ubereats', shouldUseDarkIcon);
      } else if (iconSrc.includes('grubhub')) {
        return getThemeIcon('grubhub', shouldUseDarkIcon);
      }
      // If we can't determine the platform, return the original iconSrc
      return iconSrc;
    }
    return getThemeIcon('default', shouldUseDarkIcon);
  };

  return (
    <Card
      className={cn(
        'w-full shadow-realistic hover:shadow-realistic-lg transition-shadow duration-200',
        isMobile ? 'max-w-full' : 'max-w-full mx-auto',
        className,
      )}
    >
      <CardHeader className={cn(isMobile ? 'p-2' : 'p-2')}>
        <div className="flex items-center justify-center">
          <img
            src={getIconSrc()}
            alt={`${title} icon`}
            className={cn(
              'text-muted-foreground',
              isMobile ? 'w-4 h-4' : 'w-12 h-12',
            )}
          />
        </div>
      </CardHeader>

      <CardContent
        className={cn(isMobile ? 'space-y-2 p-3 pt-0' : 'space-y-3')}
      >
        {/* Basic data metrics */}
        {safeData.length > 0 &&
          safeData.map((item, index) => (
            <MetricRow
              key={`data-${index}`}
              {...item}
              isLast={false}
              isMobile={isMobile}
            />
          ))}

        {/* On Track section at top */}
        {hasOnTrack && onTrackPosition === 'top' && (
          <OnTrackSection isMobile={isMobile} />
        )}

        {/* On Track section in middle */}
        {hasOnTrack && onTrackPosition === 'middle' && safeData.length > 0 && (
          <OnTrackSection isMobile={isMobile} />
        )}

        {/* Metrics with status */}
        {safeMetrics.length > 0 &&
          safeMetrics.map((metric, index) => (
            <MetricRowWithStatus
              key={`metric-${index}`}
              {...metric}
              isLast={index === safeMetrics.length - 1}
              isMobile={isMobile}
            />
          ))}
      </CardContent>
    </Card>
  );
};
