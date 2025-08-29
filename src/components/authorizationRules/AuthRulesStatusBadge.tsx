/**
 * Authorization Rule Status Badge Component
 * 
 * Simple badge component to show active/inactive status
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

interface AuthRuleStatusBadgeProps {
  isActive: boolean;
  showIcon?: boolean;
  variant?: 'default' | 'compact';
}

export const AuthRuleStatusBadge: React.FC<AuthRuleStatusBadgeProps> = ({
  isActive,
  showIcon = true,
  variant = 'default'
}) => {
  if (variant === 'compact') {
    return (
      <Badge 
        variant={isActive ? 'default' : 'secondary'}
        className="text-xs sm:text-sm px-1.5 py-0.5 sm:px-2 sm:py-1"
        style={{
          backgroundColor: isActive ? 'var(--chart-2)' : 'var(--muted)',
          color: isActive ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
          borderColor: isActive ? 'var(--chart-2)' : 'var(--border)',
          fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
        }}
      >
        {isActive ? 'Active' : 'Inactive'}
      </Badge>
    );
  }

  return (
    <Badge 
      variant={isActive ? 'default' : 'secondary'}
      className="flex items-center gap-0.5 sm:gap-1 text-xs sm:text-sm px-1.5 py-0.5 sm:px-2 sm:py-1"
      style={{
        backgroundColor: isActive ? 'var(--chart-2)' : 'var(--muted)',
        color: isActive ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
        borderColor: isActive ? 'var(--chart-2)' : 'var(--border)',
        fontSize: 'clamp(0.75rem, 2vw, 0.875rem)'
      }}
    >
      {showIcon && (
        isActive ? (
          <CheckCircle 
            className="h-2.5 w-2.5 sm:h-3 sm:w-3" 
            style={{ 
              color: 'var(--primary-foreground)',
              minWidth: '0.625rem',
              minHeight: '0.625rem'
            }}
          />
        ) : (
          <XCircle 
            className="h-2.5 w-2.5 sm:h-3 sm:w-3" 
            style={{ 
              color: 'var(--muted-foreground)',
              minWidth: '0.625rem',
              minHeight: '0.625rem'
            }}
          />
        )
      )}
      <span className="whitespace-nowrap">
        {isActive ? 'Active' : 'Inactive'}
      </span>
    </Badge>
  );
};
