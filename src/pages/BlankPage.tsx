import React from 'react';
import { ManageLayout } from '@/components/layouts/ManageLayout';
import CalendarApp from '@/components/Schedul';

const BlankPage: React.FC = () => {
  return (
    <ManageLayout title="" subtitle="">
      <div>
        <CalendarApp />
      </div>
    </ManageLayout>
  );
};

export default BlankPage;
