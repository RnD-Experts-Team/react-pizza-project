/**
 * Authorization Badges Component
 * 
 * Reusable component for displaying role/permission badges
 * with truncation and overflow indicators
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';

interface AuthorizationBadgesProps {
  items: string[] | null;
  label: string;
  variant: 'secondary' | 'outline' | 'default';
  maxDisplay?: number;
}

export const AuthorizationBadges: React.FC<AuthorizationBadgesProps> = React.memo(({
  items,
  label,
  variant,
  maxDisplay = 2,
}) => {
  if (!items || items.length === 0) return null;

  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case 'secondary':
        return 'bg-secondary text-secondary-foreground';
      case 'outline':
        return 'bg-accent text-accent-foreground border-border';
      case 'default':
        return 'bg-primary text-primary-foreground';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="flex flex-wrap gap-1">
      <span className="text-xs whitespace-nowrap text-muted-foreground">
        {label}:
      </span>
      {items.slice(0, maxDisplay).map((item, idx) => (
        <Badge
          key={idx}
          variant={variant}
          className={`text-xs px-1 py-0.5 ${getVariantClasses(variant)}`}
        >
          <span className="truncate max-w-[3rem]" title={item}>
            {item}
          </span>
        </Badge>
      ))}
      {items.length > maxDisplay && (
        <span className="text-xs text-muted-foreground">
          +{items.length - maxDisplay}
        </span>
      )}
    </div>
  );
});

AuthorizationBadges.displayName = 'AuthorizationBadges';
