/**
 * ManageLayout Example Page
 * 
 * This page demonstrates how to use the ManageLayout component with all its features:
 * - Required title and optional subtitle
 * - Primary and secondary action buttons
 * - Back button with different configurations
 * - Responsive design across all breakpoints
 * - Proper content structure
 */

import React, { useState } from 'react';
import { ManageLayout } from '../../components/layouts/ManageLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Plus,
  Save,
  Download,
  Upload,
  Filter,
  Search,
  RefreshCw,
} from 'lucide-react';

const ManageLayoutExample: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleSave = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      alert('Data saved successfully!');
    }, 2000);
  };

  const handleExport = () => {
    alert('Exporting data...');
  };

  const handleImport = () => {
    alert('Import dialog would open here...');
  };

  const handleRefresh = () => {
    alert('Refreshing data...');
  };

  const handleFilter = () => {
    alert('Filter dialog would open here...');
  };


  // Primary action buttons (most important actions)
  const mainButtons = (
    <>
      <Button onClick={handleSave} disabled={isLoading} className="gap-2">
        <Save className="h-4 w-4" />
        {isLoading ? 'Saving...' : 'Save Changes'}
      </Button>
      <Button onClick={() => alert('Creating new item...')} className="gap-2">
        <Plus className="h-4 w-4" />
        <span className="hidden sm:inline">Add New</span>
        <span className="sm:hidden">Add</span>
      </Button>
    </>
  );

  // Secondary action buttons (less critical actions)
  const subButtons = (
    <>
      <Button variant="outline" size="sm" onClick={handleRefresh} className="gap-2">
        <RefreshCw className="h-4 w-4" />
        <span className="hidden sm:inline">Refresh</span>
      </Button>
      <Button variant="outline" size="sm" onClick={handleFilter} className="gap-2">
        <Filter className="h-4 w-4" />
        <span className="hidden sm:inline">Filter</span>
      </Button>
      <Button variant="outline" size="sm" onClick={handleExport} className="gap-2">
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">Export</span>
      </Button>
      <Button variant="outline" size="sm" onClick={handleImport} className="gap-2">
        <Upload className="h-4 w-4" />
        <span className="hidden sm:inline">Import</span>
      </Button>
    </>
  );

  return (
    <ManageLayout
      title="User Management"
      subtitle="Manage users, roles, and permissions across your organization"
      mainButtons={mainButtons}
      subButtons={subButtons}
      backButton={{
        show: true,
        text: 'Back to Dashboard',
        to: '/dashboard',
      }}
    >
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search & Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label htmlFor="search">Search Users</Label>
              <Input
                id="search"
                placeholder="Search by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button variant="outline" className="gap-2">
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Sample Cards */}
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <Card key={item} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>User {item}</span>
                <Badge variant={item % 2 === 0 ? 'default' : 'secondary'}>
                  {item % 2 === 0 ? 'Active' : 'Inactive'}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  user{item}@example.com
                </p>
                <p className="text-sm">
                  Role: {item % 3 === 0 ? 'Admin' : item % 2 === 0 ? 'Manager' : 'User'}
                </p>
                <div className="flex gap-2 pt-2">
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                  <Button size="sm" variant="outline">
                    View
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Form Section */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="Enter full name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="Enter email address" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes..."
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline">Cancel</Button>
            <Button>Create User</Button>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">1,234</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">987</div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">45</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">12</div>
              <div className="text-sm text-muted-foreground">Inactive</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ManageLayout>
  );
};

export default ManageLayoutExample;