import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { InfoSection } from '@/components/InfoSection';
import { CustomerServiceOverview } from '@/components/CustomerServiceOverview';
import { InfoCards } from '../components/InfoCards';
// import { ChannelSalesDashboard } from '../components/ChannelSalesDashboard';
// import { DSQRDashboard } from '../components/DSQRDashboard';
import { StoreItemsFilter } from '../features/storeItems/components/StoreItemsFilter';

const Dashboard: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [storeItemsError, setStoreItemsError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleStoreItemsError = useCallback((error: string | null) => {
    setStoreItemsError(error);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto space-y-4 md:space-y-6 p-2 md:p-4 max-w-7xl">
      <StoreItemsFilter className="mb-6" onError={handleStoreItemsError} />
      {storeItemsError ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-600 font-semibold text-lg mb-2">
            Store Items Filter Error
          </div>
          <div className="text-red-700 mb-4">
            {storeItemsError}
          </div>
          <div className="text-red-600 text-sm">
            Dashboard components are unavailable due to filter processing failure.
          </div>
        </div>
      ) : (
        <>
          <InfoCards></InfoCards>
          <InfoSection></InfoSection>
          <CustomerServiceOverview></CustomerServiceOverview>
        </>
      )}
      {/* <ChannelSalesDashboard></ChannelSalesDashboard> */}
      {/* <DSQRDashboard></DSQRDashboard> */}
    </div>
  );
};

export default Dashboard;
