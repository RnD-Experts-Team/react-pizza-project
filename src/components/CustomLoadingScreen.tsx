import React, { useState, useEffect } from 'react';
import PneLogo from '../../public/image.svg';
import { useTheme } from '@/hooks/useTheme'; // Update this import path accordingly

export const CustomLoadingScreen: React.FC = () => {
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
    }, 50);
    return () => clearInterval(interval);
  }, []);

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

      <div
        className={`fixed inset-0 flex items-center justify-center z-50 ${
          isDark ? 'bg-gradient-to-br from-gray-900 to-gray-700' : 'bg-gradient-to-br from-background to-muted'
        }`}
      >
        <div
          className={`rounded-lg p-8 max-w-md w-full mx-4 ${
            isDark ? 'bg-gray-800 text-white shadow-xl' : 'bg-card text-card-foreground shadow-xl'
          }`}
          style={{ boxShadow: isDark ? '0 10px 15px rgba(0,0,0,0.75)' : 'var(--shadow-xl)' }}
        >
          <div className="flex flex-col items-center space-y-6">
            <img
              src={PneLogo}
              alt="PNE Empowering Logo"
              className="shake"
              style={{
                transition: 'clip-path 0.3s linear',
                width: '220px',
                height: '110px',
                objectFit: 'contain',
                filter: isDark ? 'brightness(0) invert(1)' : 'none',
                clipPath: `inset(${100 - opacity * 100}% 0 0 0)`,
              }}
            />

            <div className="relative">
              <div
                className={`animate-spin rounded-full h-12 w-12 border-4 ${
                  isDark ? 'border-gray-600' : 'border-border'
                }`}
              ></div>
              <div
                className={`animate-spin rounded-full h-12 w-12 border-4 absolute top-0 left-0 border-t-transparent ${
                  isDark ? 'border-primary' : 'border-primary'
                }`}
              ></div>
            </div>

            <div className="text-center space-y-2">
              <h2 className={isDark ? 'text-white' : 'text-card-foreground'}>
                Empowering a Brighter Future
              </h2>
              <p className={isDark ? 'text-gray-300' : 'text-muted-foreground'}>
                Please wait while we power things up...
              </p>
            </div>

            <div className="w-full rounded-full h-2 bg-muted">
              <div
                className="h-2 rounded-full bg-primary transition-all duration-300"
                style={{ width: `${Math.round(opacity * 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomLoadingScreen;
