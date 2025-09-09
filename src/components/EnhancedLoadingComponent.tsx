import React, { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';

interface EnhancedLoadingComponentProps {
  message?: string;
  showLogo?: boolean;
  showProgressBar?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const EnhancedLoadingComponent: React.FC<EnhancedLoadingComponentProps> = ({
  message = 'Loading...',
  showLogo = true,
  showProgressBar = true,
  size = 'medium',
  className = '',
}) => {
  const { theme } = useTheme();
  const [opacity, setOpacity] = useState(0);

  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    let value = 0;
    const interval = setInterval(() => {
      value += 0.02;
      if (value >= 1) {
        value = 1;
        clearInterval(interval);
      }
      setOpacity(value);
    }, 10);
    return () => clearInterval(interval);
  }, []);

  // Size configurations
  const sizeConfig = {
    small: {
      logo: { width: '80px', height: '40px' },
      spinner: 'h-6 w-6',
      text: 'text-xs',
      title: 'text-sm',
      progressBar: 'w-24 h-1',
      spacing: 'space-y-2',
    },
    medium: {
      logo: { width: '120px', height: '60px' },
      spinner: 'h-8 w-8',
      text: 'text-xs',
      title: 'text-sm',
      progressBar: 'w-32 h-1.5',
      spacing: 'space-y-4',
    },
    large: {
      logo: { width: '220px', height: '110px' },
      spinner: 'h-12 w-12',
      text: 'text-base',
      title: 'text-xl',
      progressBar: 'w-48 h-2',
      spacing: 'space-y-6',
    },
  };

  const config = sizeConfig[size];

  return (
    <>
      {/* Shake keyframes animation injected via style tag */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-4px); }
          40%, 80% { transform: translateX(4px); }
        }
        .shake {
          animation: shake 0.5s ease-in-out infinite;
        }
      `}</style>

      <div className={`flex flex-col items-center justify-center ${config.spacing} ${className}`}>
        {showLogo && (
          <img
            src="/image.svg"
            alt="PNE Empowering Logo"
            className="shake"
            style={{
              transition: 'clip-path 0.3s linear',
              width: config.logo.width,
              height: config.logo.height,
              objectFit: 'contain',
              filter: isDark ? 'brightness(0) invert(1)' : 'none',
              clipPath: `inset(${100 - opacity * 100}% 0 0 0)`,
            }}
          />
        )}

        <div className="relative">
          <div
            className={`animate-spin rounded-full border-4 ${config.spinner} ${
              isDark ? 'border-gray-600' : 'border-border'
            }`}
          ></div>
          <div
            className={`animate-spin rounded-full border-4 absolute top-0 left-0 border-t-transparent ${config.spinner} ${
              isDark ? 'border-primary' : 'border-primary'
            }`}
          ></div>
        </div>

        <div className="text-center space-y-1">
          {showLogo && (
            <p className={`font-medium ${
              isDark ? 'text-white' : 'text-card-foreground'
            } ${config.title}`}>
              Empowering a Brighter Future
            </p>
          )}
          <p className={`${
            isDark ? 'text-gray-300' : 'text-muted-foreground'
          } ${config.text}`}>
            {message}
          </p>
        </div>

        {showProgressBar && (
          <div className={`rounded-full bg-muted ${config.progressBar}`}>
            <div
              className="h-full rounded-full bg-primary transition-all duration-300"
              style={{ width: `${Math.round(opacity * 100)}%` }}
            ></div>
          </div>
        )}
      </div>
    </>
  );
};

export default EnhancedLoadingComponent;