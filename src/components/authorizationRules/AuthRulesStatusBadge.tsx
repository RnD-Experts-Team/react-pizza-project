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
        className={isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}
      >
        {isActive ? 'Active' : 'Inactive'}
      </Badge>
    );
  }

  return (
    <Badge 
      variant={isActive ? 'default' : 'secondary'}
      className={`flex items-center gap-1 ${
        isActive 
          ? 'bg-green-100 text-green-800 border-green-200' 
          : 'bg-gray-100 text-gray-600 border-gray-200'
      }`}
    >
      {showIcon && (
        isActive ? (
          <CheckCircle className="h-3 w-3" />
        ) : (
          <XCircle className="h-3 w-3" />
        )
      )}
      {isActive ? 'Active' : 'Inactive'}
    </Badge>
  );
};
