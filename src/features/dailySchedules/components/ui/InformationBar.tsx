import React from 'react';
import type { ViewType } from '../../types/scheduler.types';

interface InformationBarProps {
  currentView: ViewType;
}

/**
 * InformationBar Component
 * 
 * Displays contextual information about the current view and business hours
 */
const InformationBar: React.FC<InformationBarProps> = ({ currentView }) => {
  const getViewInfo = () => {
    switch (currentView) {
      case 'day':
      case 'week':
        return ' • Business hours: 8 AM - 8 PM';
      default:
        return '';
    }
  };

  return (
    <div className="mb-4 rounded bg-primary-50 p-2.5 text-sm text-primary-700">
      <strong>Current View:</strong> {currentView.charAt(0).toUpperCase() + currentView.slice(1)}
      {getViewInfo()}
    </div>
  );
};

export default InformationBar;