import React from 'react';
import { InfoCard } from './InfoCard';
import type { CardDataProps } from '@/types/infoCards';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface InfoCardsGridProps {
  data: CardDataProps[];
  showIcons?: boolean;
  isLoading?: boolean;
  className?: string;
}

export const InfoCardsGrid: React.FC<InfoCardsGridProps> = ({
  data,
  showIcons = true,
  isLoading = false,
  className,
}) => {
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        // Always 2x2 grid
        'grid grid-cols-2 grid-rows-2',
        // Responsive gap
        isMobile ? 'gap-2' : 'gap-4 md:gap-6',
        className,
      )}
    >
      {data.slice(0, 4).map((card, index) => (
        <InfoCard
          key={card.id || `${card.title}-${index}`}
          card={card}
          showIcon={showIcons}
          isLoading={isLoading}
          isMobile={isMobile}
        />
      ))}
    </div>
  );
};
