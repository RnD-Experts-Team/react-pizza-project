import React from 'react';
import { ManageLayout } from '@/components/layouts/ManageLayout';

const BlankPage: React.FC = () => {
  return (
    <ManageLayout title="" subtitle="">
      <div>
      </div>
    </ManageLayout>
  );
};

export default BlankPage;
