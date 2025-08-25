import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { MetricDataProps, MetricWithStatusProps } from '@/types/dsqr';

interface MetricRowProps extends MetricDataProps {
  isLast?: boolean;
  isMobile?: boolean;
}

export const MetricRow: React.FC<MetricRowProps> = ({
  label,
  value,
  multiline = false,
  isLast = false,
  isMobile = false,
}) => {
  return (
    <div className={cn('space-y-2', isMobile && 'space-y-1')}>
      <div
        className={cn(
          'flex items-center justify-between',
          isMobile ? 'py-1' : 'py-2',
        )}
      >
        <span
          className={cn(
            'font-semibold text-muted-foreground truncate flex-1',
            isMobile ? 'text-xs' : 'text-sm',
            multiline ? 'leading-relaxed' : 'whitespace-nowrap',
          )}
        >
          {multiline ? (
            <span className="block">
              {label.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < label.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </span>
          ) : (
            label
          )}
        </span>
        <span
          className={cn(
            'font-bold text-foreground truncate flex-shrink-0',
            isMobile ? 'text-xs' : 'text-sm',
          )}
        >
          {value}
        </span>
      </div>
      {!isLast && <Separator />}
    </div>
  );
};

interface MetricRowWithStatusProps extends MetricWithStatusProps {
  isLast?: boolean;
  isMobile?: boolean;
}

export const MetricRowWithStatus: React.FC<MetricRowWithStatusProps> = ({
  label,
  value,
  status,
  statusColor,
  multiline = false,
  isLast = false,
  isMobile = false,
}) => {
  return (
    <div className={cn('space-y-2', isMobile && 'space-y-1')}>
      <div
        className={cn(
          'flex items-center justify-between',
          isMobile ? 'py-1' : 'py-2',
        )}
      >
        <span
          className={cn(
            'font-semibold text-muted-foreground flex-1 truncate',
            isMobile ? 'text-xs' : 'text-sm',
            multiline ? 'leading-relaxed' : 'whitespace-nowrap',
          )}
        >
          {multiline ? (
            <span className="block">
              {label.split('\n').map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < label.split('\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </span>
          ) : (
            label
          )}
        </span>

        <div className={cn('flex items-center', isMobile ? 'gap-1' : 'gap-2')}>
          <span
            className={cn(
              'font-bold text-foreground truncate flex-shrink-0',
              isMobile ? 'text-xs' : 'text-sm',
            )}
          >
            {value}
          </span>
          <div
            className={cn(
              'flex items-center justify-center rounded-lg overflow-hidden',
              
              isMobile ? 'w-6 h-5' : 'w-8 h-6',
            )}
          >
            <Badge
              variant={status === 'OT' ? 'secondary' : 'destructive'}
              className={cn(
                'p-2 ',
                status === 'OT' && 'bg-[var(--chart-3)] text-foreground',
                isMobile ? 'text-xs h-3' : 'text-xs h-4',
              )}
            >
              {status}
            </Badge>
          </div>
        </div>
      </div>
      {!isLast && <Separator />}
    </div>
  );
};
