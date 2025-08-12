import React from 'react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  actions?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  className,
  actions
}) => {
  const isMobile = useIsMobile();

  return (
    <header className={cn(
      "text-center",
      isMobile ? "space-y-1" : "space-y-2",
      className
    )}>
      <div className={cn(
        "flex items-center justify-between",
        isMobile && "flex-col space-y-2"
      )}>
        <div className="flex-1">
          <h1 className={cn(
            "font-bold text-foreground",
            // Responsive title size
            isMobile 
              ? "text-lg" 
              : "text-xl md:text-2xl lg:text-3xl"
          )}>
            {title}
          </h1>
          {subtitle && (
            <p className={cn(
              "text-muted-foreground mt-1",
              // Responsive subtitle size
              isMobile ? "text-xs" : "text-sm"
            )}>
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className={cn(
            "flex items-center",
            isMobile ? "gap-1" : "gap-2"
          )}>
            {actions}
          </div>
        )}
      </div>
    </header>
  );
};
