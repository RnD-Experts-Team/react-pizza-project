/**
 * StoresTableContainer Component
 * Container component that wraps the table with Card styling
 */
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { StoresTableHeader } from '@/features/userRolesStoresAssignment/components/StoresTable/StoresTableHeader';
import { StoresTableContent } from '@/features/userRolesStoresAssignment/components/StoresTable/StoresTableContent';
import { StoresTableFooter } from '@/features/userRolesStoresAssignment/components/StoresTable/StoresTableFooter';

interface Store {
  id: string;
  name: string;
  is_active: boolean;
}

interface Pagination {
  current_page: number;
  last_page: number;
}

interface CurrentPageData {
  from: number;
  to: number;
  total: number;
}

interface StoresTableContainerProps {
  stores: Store[];
  loading: boolean;
  pagination: Pagination | null;
  perPage: number;
  currentPageData: CurrentPageData;
  onView: (storeId: string) => void;
  onAssign: (storeId: string) => void;
  onRetry: () => void;
  onPageChange: (page: number) => void;
  onPerPageChange: (value: string) => void;
}

export const StoresTableContainer: React.FC<StoresTableContainerProps> = ({
  stores,
  loading,
  pagination,
  perPage,
  currentPageData,
  onView,
  onAssign,
  onRetry,
  onPageChange,
  onPerPageChange,
}) => {
  return (
    <Card
      className="rounded-sm bg-card border border-border"
      style={{
        boxShadow: 'var(--shadow-realistic)',
      }}
    >
      <StoresTableHeader
        loading={loading}
        onRetry={onRetry}
      />

      <CardContent className="p-0 bg-card">
        <StoresTableContent
          stores={stores}
          loading={loading}
          onView={onView}
          onAssign={onAssign}
        />
      </CardContent>

      <StoresTableFooter
        stores={stores}
        loading={loading}
        pagination={pagination}
        perPage={perPage}
        currentPageData={currentPageData}
        onPageChange={onPageChange}
        onPerPageChange={onPerPageChange}
      />
    </Card>
  );
};
