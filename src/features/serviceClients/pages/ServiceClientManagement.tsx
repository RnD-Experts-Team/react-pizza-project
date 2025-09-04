import React from 'react';
import { ServiceClientsTable } from '@/features/serviceClients/components/ServiceClientsTable/ServiceClientsTable';
import { ManageLayout } from '@/components/layouts/ManageLayout';

const ServiceClientsPage: React.FC = () => {

  return (
    <ManageLayout
      title="Service Client Management"
      subtitle="Manage API service clients and their authentication tokens"
    >
      {/* Main Content */}
      <ServiceClientsTable 
        onRotateToken={() => {}}
        onCreateSuccess={() => {}}
      />
    </ManageLayout>
  );
};

export default ServiceClientsPage;
