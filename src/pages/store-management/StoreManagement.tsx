import React, { useState, useEffect } from 'react';
import { useStoreManagement } from '@/hooks/useReduxStoreManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Store as StoreIcon, Users, Shield, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';


const StoreManagement: React.FC = () => {
  const {
    state: {
      stores,
      storeUsers,
      storeRoles,
      // storeUsersPagination,
      // storeRolesPagination,
      loading,
      error
    },
    actions: {
      fetchStores,
      fetchStoreUsers,
      fetchStoreRoles
    }
  } = useStoreManagement();

  const [activeTab, setActiveTab] = useState('stores');
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  // Helper functions
  // const getStatusColor = (isActive: boolean) => {
  //   return isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  // };

  // const getStatusText = (isActive: boolean) => {
  //   return isActive ? 'Active' : 'Inactive';
  // };

  // const getUserInitials = (name: string) => {
  //   return name
  //     .split(' ')
  //     .map(word => word.charAt(0))
  //     .join('')
  //     .toUpperCase()
  //     .slice(0, 2);
  // };

  // const getRoleColor = (roleName: string) => {
  //   const colors: { [key: string]: string } = {
  //     'admin': 'bg-red-100 text-red-800',
  //     'manager': 'bg-blue-100 text-blue-800',
  //     'employee': 'bg-green-100 text-green-800',
  //     'viewer': 'bg-gray-100 text-gray-800'
  //   };
  //   return colors[roleName.toLowerCase()] || 'bg-gray-100 text-gray-800';
  // };

  // const handleStoreSelect = (storeId: string) => {
  //   setSelectedStoreId(storeId);
  //   if (activeTab === 'stores') {
  //     setActiveTab('store-users');
  //   }
  // };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'stores') {
      setSelectedStoreId(null);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    if (selectedStoreId && activeTab === 'store-users') {
      fetchStoreUsers(selectedStoreId);
    } else if (selectedStoreId && activeTab === 'store-roles') {
      fetchStoreRoles(selectedStoreId);
    }
  }, [selectedStoreId, activeTab]);

  if (loading && !stores.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading store management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-2 md:p-4 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Store Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage stores, store users, and store roles for your application
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/store-management/create-store">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Store
            </Button>
          </Link>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stores" className="flex items-center gap-2">
            <StoreIcon className="h-4 w-4" />
            Stores ({stores.length})
          </TabsTrigger>
          <TabsTrigger value="store-users" className="flex items-center gap-2" disabled={!selectedStoreId}>
            <Users className="h-4 w-4" />
            Store Users {selectedStoreId ? `(${storeUsers.length})` : ''}
          </TabsTrigger>
          <TabsTrigger value="store-roles" className="flex items-center gap-2" disabled={!selectedStoreId}>
            <Shield className="h-4 w-4" />
            Store Roles {selectedStoreId ? `(${storeRoles.length})` : ''}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="stores" className="space-y-4">
          {/* <StoresTab
            stores={stores}
            // pagination={pagination}
            onStoreSelect={handleStoreSelect}
            onFetchStores={fetchStores}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
          />
        </TabsContent>
        <TabsContent value="store-users" className="space-y-4">
          <StoreUsersTab
            storeUsers={storeUsers}
            // pagination={storeUsersPagination}
            selectedStoreId={selectedStoreId}
            onFetchStoreUsers={fetchStoreUsers}
            getUserInitials={getUserInitials}
            getRoleColor={getRoleColor}
          />
        </TabsContent>
        <TabsContent value="store-roles" className="space-y-4">
          <StoreRolesTab
            storeRoles={storeRoles}
            // pagination={storeRolesPagination}
            selectedStoreId={selectedStoreId}
            onFetchStoreRoles={fetchStoreRoles}
            getRoleColor={getRoleColor}
          /> */}
        </TabsContent>
      </Tabs>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}
    </div>
  );
};

export default StoreManagement;