import React from 'react';

/**
 * Custom Loading Screen Component
 * 
 * This is an example of how you can create a custom loading screen
 * to use with the AuthInitializer component.
 */
export const CustomLoadingScreen: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-background to-muted flex items-center justify-center z-50">
      <div className="bg-card rounded-lg shadow-xl p-8 max-w-md w-full mx-4" style={{ boxShadow: 'var(--shadow-xl)' }}>
        <div className="flex flex-col items-center space-y-6">
          {/* Pizza Logo/Icon */}
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <svg 
              className="w-10 h-10 text-primary-foreground" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM10 4.236L15 8v8H5V8l5-3.764z"/>
              <circle cx="8" cy="12" r="1"/>
              <circle cx="12" cy="10" r="1"/>
              <circle cx="10" cy="14" r="1"/>
            </svg>
          </div>
          
          {/* Loading animation */}
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-border"></div>
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent absolute top-0 left-0"></div>
          </div>
          
          {/* Loading text */}
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold text-card-foreground">
              Pizza App
            </h2>
            <p className="text-muted-foreground">
              Preparing your delicious experience...
            </p>
          </div>
          
          {/* Progress indicator */}
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomLoadingScreen;