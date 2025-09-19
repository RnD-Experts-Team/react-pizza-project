import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { InfoSection } from '@/components/InfoSection';
import { CustomerServiceOverview } from '@/components/CustomerServiceOverview';
import { InfoCards } from '../components/InfoCards';
import { ChannelSalesDashboard } from '../components/ChannelSalesDashboard';
import { DSQRDashboard } from '../components/DSQRDashboard';
import { DrawerExample } from '../components/DrawerExample';

const Dashboard: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
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
    <div className="container mx-auto space-y-4 md:space-y-6 p-2 md:p-4 max-w-7xl">
      <DrawerExample></DrawerExample>
      <InfoCards></InfoCards>
      <InfoSection></InfoSection>
      <CustomerServiceOverview></CustomerServiceOverview>
      <ChannelSalesDashboard></ChannelSalesDashboard>
      <DSQRDashboard></DSQRDashboard>
    </div>
  );
};

export default Dashboard;
