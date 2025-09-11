// src/pages/ManagementPage.tsx

/**
 * Management Page Component
 * 
 * A tabbed interface for managing different aspects of the organization.
 * Currently includes Positions, Skills, and Statuses tabs with room for expansion to other management areas.
 */

import React, { useState } from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  Building,
  CircleDot,
  // Users,
  // Settings,
  // Shield
} from 'lucide-react';

import PositionsPage from '@/features/positions/components/PositionsPage';
import SkillsPage from '@/features/skills/components/SkillsPage';
import StatusesPage from '@/features/statuses/components/StatusesPage';

/**
 * Tab configuration interface
 */
interface TabConfig {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
  description: string;
}

/**
 * Main Management Page Component
 * Provides tabbed interface for various management functions
 */
const ManagementPage: React.FC = () => {
  // Tab configuration - easily extensible for future tabs
  const tabs: TabConfig[] = [
    {
      id: 'positions',
      label: 'Positions',
      icon: <Building className="h-4 w-4" />,
      component: <PositionsPage />,
      description: 'Manage organizational positions and roles',
    },
    {
      id: 'skills',
      label: 'Skills',
      icon: <CircleDot className="h-4 w-4" />,
      component: <SkillsPage />,
      description: 'Manage organizational skills and related employee info',
    },
    {
      id: 'statuses',
      label: 'Statuses',
      icon: <CircleDot className="h-4 w-4" />,
      component: <StatusesPage />,
      description: 'Manage organizational statuses and their descriptions',
    },
    // Future tabs can be added here:
    // {
    //   id: 'users',
    //   label: 'Users',
    //   icon: <Users className="h-4 w-4" />,
    //   component: <UsersPage />,
    //   description: 'Manage user accounts and permissions'
    // },
    // {
    //   id: 'departments',
    //   label: 'Departments',
    //   icon: <Settings className="h-4 w-4" />,
    //   component: <DepartmentsPage />,
    //   description: 'Manage organizational departments'
    // },
    // {
    //   id: 'permissions',
    //   label: 'Permissions',
    //   icon: <Shield className="h-4 w-4" />,
    //   component: <PermissionsPage />,
    //   description: 'Manage user roles and permissions'
    // }
  ];

  // Default active tab - start with positions
  const [activeTab, setActiveTab] = useState<string>('positions');

  // Get current tab configuration
  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">
              Management Dashboard
            </h1>
            <p className="text-gray-600">
              {currentTab?.description || 'Manage your organization settings and data'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Container */}
      <div className="container mx-auto px-6 py-6">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full space-y-6"
        >
          {/* Tab Navigation */}
          <div className="bg-white rounded-lg shadow-sm border p-1">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-1 bg-transparent">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="flex items-center space-x-2 px-4 py-3 text-sm font-medium rounded-md transition-all duration-200 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:shadow-sm hover:bg-gray-50"
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* Tab Content */}
          {tabs.map((tab) => (
            <TabsContent 
              key={tab.id} 
              value={tab.id}
              className="space-y-6 mt-6"
            >
              {/* Tab Content Container */}
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                {tab.component}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Future: Add floating action buttons or quick actions */}
      <div className="fixed bottom-6 right-6 space-y-2">
        {/* This space reserved for floating action buttons */}
      </div>
    </div>
  );
};

export default ManagementPage;
