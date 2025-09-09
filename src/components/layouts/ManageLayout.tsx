import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import { ArrowLeft } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useIsMobile } from '../../hooks/use-mobile';

interface ManageLayoutProps {
  /** Required title text for the header */
  title: string;
  /** Optional subtitle text */
  subtitle?: string;
  /** Optional primary action buttons */
  mainButtons?: React.ReactNode;
  /** Optional secondary action buttons */
  subButtons?: React.ReactNode;
  /** Optional back button configuration */
  backButton?: {
    /** Show the back button */
    show: boolean;
    /** Custom back button text (defaults to "Back") */
    text?: string;
    /** Custom navigation path (defaults to browser back) */
    to?: string;
    /** Custom click handler (overrides default navigation) */
    onClick?: () => void;
  };
  /** Main content to be rendered */
  children: React.ReactNode;
  /** Additional CSS classes for the container */
  className?: string;
  /** Additional CSS classes for the header */
  headerClassName?: string;
  /** Additional CSS classes for the content area */
  contentClassName?: string;
}

export const ManageLayout: React.FC<ManageLayoutProps> = ({
  title,
  subtitle,
  mainButtons,
  subButtons,
  backButton,
  children,
  className,
  headerClassName,
  contentClassName,
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleBackClick = () => {
    if (backButton?.onClick) {
      backButton.onClick();
    } else if (backButton?.to) {
      navigate(backButton.to);
    } else {
      navigate(-1); // Browser back
    }
  };

  return (
    <div className={cn('flex-1 flex-col min-h-full space-y-6 p-4 md:p-6 lg:p-8', className)}>
      {/* Header Section */}
      <header
        className={cn(
          'flex flex-col space-y-4 pb-4 sm:pb-6 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
          headerClassName
        )}
      >
        {/* Top row with back button and title */}
        <div className="flex flex-col space-y-3 lg:flex-row lg:items-start lg:justify-between lg:space-y-0 ">
          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
            {/* Title and Back Button Container */}
            <div className="flex items-center space-x-5 flex-1 ">
              {/* Back Button */}
              {backButton?.show && (
                <Button
                  onClick={handleBackClick}
                  variant="outline"
                  size={isMobile ? 'sm' : 'default'}
                  className="hover:bg-accent w-fit p-2 flex-shrink-0"
                  aria-label={backButton.text || 'Back'}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}

              {/* Title and Subtitle */}
              <div className="space-y-1 flex-1">
                <h1
                  className={cn(
                    'font-bold text-foreground',
                    isMobile
                      ? 'text-lg'
                      : 'text-xl sm:text-2xl lg:text-3xl'
                  )}
                >
                  {title}
                </h1>
                {subtitle && (
                  <p
                    className={cn(
                      'text-muted-foreground',
                      isMobile ? 'text-xs' : 'text-sm sm:text-base'
                    )}
                  >
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons - All buttons aligned to the right */}
          {(mainButtons || subButtons) && (
            <div className="flex flex-col space-y-2 sm:flex-col sm:space-y-2 sm:items-end">
              
              {/* Main Action Buttons */}
              {mainButtons && (
                <div className="flex flex-wrap mx-auto md:m-0 items-center gap-4">
                  {mainButtons}
                </div>
              )}

              {/* Secondary Action Buttons */}
              {subButtons && (
                <div className="flex flex-wrap mx-auto md:m-0 items-center gap-4">
                  {subButtons}
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <main
        className={cn(
          'flex-1 pt-4 sm:pt-6',
          // Responsive padding
          'px-0 sm:px-0', // No horizontal padding as it's handled by parent layout
          // Responsive spacing
          'space-y-4 sm:space-y-6',
          contentClassName
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default ManageLayout;