/**
 * StoresListPage Component
 * Main page that displays the stores table with create store functionality
 */

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStores } from '../../features/stores/store/storesSlice';
import { StoresTable } from '../../components/stores/StoresTable';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Alert, AlertDescription } from '../../components/ui/alert';
import {
  Store,
  Plus,
  AlertCircle,
  Building2,
} from 'lucide-react';
import type { AppDispatch, RootState } from '../../store';

export const StoresListPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();



  // Redux selectors
  const stores = useSelector((state: RootState) => 
    state.stores.stores?.stores || []
  );
  const loading = useSelector((state: RootState) => 
    state.stores.asyncStates.fetchStores.loading
  );
  const error = useSelector((state: RootState) => 
    state.stores.asyncStates.fetchStores.error
  );
  

  // Initial data fetch
  useEffect(() => {
    dispatch(fetchStores());
  }, [dispatch]);



  const handleCreateStore = () => {
    navigate('/stores/create');
  };



  const renderHeader = () => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center space-x-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Stores Management</h1>
          <p className="text-muted-foreground">
            Manage your store locations and settings
          </p>
        </div>
      </div>
      <Button onClick={handleCreateStore} className="shrink-0">
        <Plus className="mr-2 h-4 w-4" />
        Create Store
      </Button>
    </div>
  );





  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Page Header */}
        {renderHeader()}

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load stores: {error}
            </AlertDescription>
          </Alert>
        )}



        {/* Stores Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Store className="h-5 w-5" />
              <span>Stores List</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StoresTable
              stores={stores}
              loading={loading}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StoresListPage;