import React from 'react';
import { Button } from '../../../../components/ui/button';
import type { ViewType } from '../../types/scheduler.types';

interface NavigationToolbarProps {
  currentView: ViewType;
  dateRangeText: string;
  onPrevious: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewChange: (view: ViewType) => void;
}

/**
 * NavigationToolbar Component
 * 
 * Provides navigation controls and view selection for the scheduler
 */
const NavigationToolbar: React.FC<NavigationToolbarProps> = ({
  currentView,
  dateRangeText,
  onPrevious,
  onNext,
  onToday,
  onViewChange
}) => {
  return (
    <div className="mb-5 flex items-center justify-between rounded-lg bg-muted p-4 shadow-sm">
      {/* Navigation Controls */}
      <div className="flex items-center gap-2.5">
        <Button 
          onClick={onPrevious}
          variant="outline"
          size="sm"
          className="text-sm"
        >
          ← Previous
        </Button>
        
        <Button 
          onClick={onToday}
          variant="default"
          size="sm"
          className="font-bold"
        >
          Today
        </Button>
        
        <Button 
          onClick={onNext}
          variant="outline"
          size="sm"
          className="text-sm"
        >
          Next →
        </Button>
        
        <div className="ml-5 text-base font-bold text-foreground">
          {dateRangeText}
        </div>
      </div>

      {/* View Selection Buttons */}
      <div className="flex gap-1">
        <Button 
          onClick={() => onViewChange('day')} 
          variant={currentView === 'day' ? 'default' : 'outline'}
          size="sm"
          className="px-4"
        >
          Day
        </Button>
        
        <Button 
          onClick={() => onViewChange('week')} 
          variant={currentView === 'week' ? 'default' : 'outline'}
          size="sm"
          className="px-4"
        >
          Week
        </Button>
        

      </div>
    </div>
  );
};

export default NavigationToolbar;