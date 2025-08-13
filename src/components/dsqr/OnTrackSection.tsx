import React from 'react';
import { cn } from '@/lib/utils';

interface OnTrackSectionProps {
  isMobile?: boolean;
}

export const OnTrackSection: React.FC<OnTrackSectionProps> = ({
  isMobile = false,
}) => (
  <div className={cn('flex items-center', isMobile ? 'py-1' : 'py-2')}>
    <span
      className={cn(
        'font-bold text-yellow-600',
        isMobile ? 'text-sm' : 'text-base',
      )}
    >
      On Track ?
    </span>
  </div>
);
