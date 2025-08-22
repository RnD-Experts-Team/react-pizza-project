import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useReduxAuth } from '../hooks/useReduxAuth';
import { InfoSection } from '@/components/InfoSection';
import { InfoCards } from '../components/InfoCards';
import { ChannelSalesDashboard } from '../components/ChannelSalesDashboard';
import { DSQRDashboard } from '../components/DSQRDashboard';

const Dashboard: React.FC = () => {
  const { isAuthenticated, isLoading } = useReduxAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);



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
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <InfoSection></InfoSection>
      <InfoCards></InfoCards>
      <ChannelSalesDashboard></ChannelSalesDashboard>
      <DSQRDashboard></DSQRDashboard>
    </div>
  );
};

export default Dashboard;
