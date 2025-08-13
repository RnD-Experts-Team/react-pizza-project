import React from 'react';
import { cn } from '@/lib/utils';
import { PlatformCard } from './PlatformCard';
import type { PlatformCardProps } from '@/types/dsqr';
import { useIsMobile } from '@/hooks/use-mobile';

interface PlatformContainerProps {
  platforms: PlatformCardProps[];
  layout?: 'horizontal' | 'vertical' | 'grid';
  className?: string;
}

export const PlatformContainer: React.FC<PlatformContainerProps> = ({
  platforms,
  layout = 'horizontal',
  className,
}) => {
  const isMobile = useIsMobile();

  const getLayoutClasses = () => {
    if (isMobile) {
      return 'flex flex-col gap-4';
    }

    switch (layout) {
      case 'vertical':
        return 'flex flex-col gap-6';
      case 'grid':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6';
      default:
        return 'flex flex-col lg:flex-row justify-center gap-6 overflow-x-auto';
    }
  };

  return (
    <div className={cn('w-full', getLayoutClasses(), className)}>
      {platforms.map((platform, index) => (
        <PlatformCard
          key={`platform-${index}`}
          {...platform}
          className="flex-shrink-0"
          isMobile={isMobile}
        />
      ))}
    </div>
  );
};
