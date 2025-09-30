import React from 'react';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { ChannelDataProps } from '@/features/dashboard/types/channelSales';

interface ChannelItemProps {
  channel: ChannelDataProps;
  isLast?: boolean;
  isMobile?: boolean;
}

export const ChannelItem: React.FC<ChannelItemProps> = ({
  channel,
  isLast = false,
  isMobile = false,
}) => {
  return (
    <div className="space-y-2">
      <div
        className={cn(
          'flex items-center justify-between',
          // Responsive padding
          isMobile ? 'px-2 py-1' : 'px-2.5 py-1',
        )}
      >
        {/* Center: Channel Info */}
        <ChannelInfo
          channel={channel}
          isMobile={isMobile}
        />

        {/* Center Right: Financial Data */}
        <FinancialData channel={channel} isMobile={isMobile} />
      </div>

      {!isLast && <Separator className={cn(isMobile ? 'w-[96%] mx-auto' : 'w-[96%] mx-auto')} />}
    </div>
  );
};

// Sub-components
interface ChannelInfoProps {
  channel: ChannelDataProps;
  isMobile: boolean;
}

const ChannelInfo: React.FC<ChannelInfoProps> = ({
  channel,
  isMobile,
}) => (
  <div
    className={cn(
      'flex flex-col items-center justify-center space-y-1',
      isMobile ? 'min-w-[60px]' : 'min-w-[78px]',
    )}
  >
    <h3
      className={cn(
        'font-bold text-foreground whitespace-nowrap',
        isMobile ? 'text-xs' : 'text-sm md:text-base',
      )}
    >
      {channel.name}
    </h3>
    
  </div>
);

interface FinancialDataProps {
  channel: ChannelDataProps;
  isMobile: boolean;
}

const FinancialData: React.FC<FinancialDataProps> = ({ channel, isMobile }) => (
  <div
    className={cn(
      'flex flex-col items-center justify-center space-y-1',
      isMobile ? 'min-w-[50px]' : 'min-w-[66px]',
    )}
  >
    <span
      className={cn(
        'text-foreground whitespace-nowrap',  
        isMobile ? 'font-semibold text-sm md:text-base' : 'font-semibold text-sm md:text-base',
      )}
    >
      Daily  :  {channel.daily}
    </span>
    <span
      className={cn(
        'text-muted-foreground whitespace-nowrap',
        isMobile ? 'text-xs md:text-sm' : 'text-xs md:text-sm',
      )}
    >
      Weekly  :  {channel.weekly}
    </span>
  </div>
);
