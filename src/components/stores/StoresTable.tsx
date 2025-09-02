/**
 * StoresTable Component
 * Displays a table of stores with action buttons for view, edit, and delete operations
 * Fully responsive with light/dark mode support using CSS custom properties
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Eye, Edit, MoreHorizontal, Plus } from 'lucide-react';
import type { Store } from '../../features/stores/types';

interface StoresTableProps {
  stores: Store[];
  loading?: boolean;
  onCreateStore?: () => void;
}

export const StoresTable: React.FC<StoresTableProps> = ({
  stores,
  loading = false,
  onCreateStore,
}) => {
  const navigate = useNavigate();

  const handleView = (storeId: string) => {
    navigate(`/stores/view/${storeId}`);
  };

  const handleEdit = (storeId: string) => {
    navigate(`/stores/edit/${storeId}`);
  };



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div 
        className="rounded-md overflow-hidden"
        style={{
          border: `1px solid var(--border)`,
          backgroundColor: 'var(--card)',
        }}
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow style={{ backgroundColor: 'var(--muted)' }}>
                <TableHead 
                  className="text-xs sm:text-sm font-medium px-2 sm:px-4 py-2 sm:py-3"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Store ID
                </TableHead>
                <TableHead 
                  className="text-xs sm:text-sm font-medium px-2 sm:px-4 py-2 sm:py-3"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Name
                </TableHead>
                <TableHead 
                  className="text-xs sm:text-sm font-medium px-2 sm:px-4 py-2 sm:py-3 hidden md:table-cell"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Phone
                </TableHead>
                <TableHead 
                  className="text-xs sm:text-sm font-medium px-2 sm:px-4 py-2 sm:py-3 hidden lg:table-cell"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Address
                </TableHead>
                <TableHead 
                  className="text-xs sm:text-sm font-medium px-2 sm:px-4 py-2 sm:py-3"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Status
                </TableHead>
                <TableHead 
                  className="text-xs sm:text-sm font-medium px-2 sm:px-4 py-2 sm:py-3 hidden sm:table-cell"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Created
                </TableHead>
                <TableHead 
                  className="text-xs sm:text-sm font-medium px-2 sm:px-4 py-2 sm:py-3 w-[60px] sm:w-[100px]"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index} style={{ borderColor: 'var(--border)' }}>
                  <TableCell className="px-2 sm:px-4 py-2 sm:py-3">
                    <div 
                      className="h-3 sm:h-4 w-16 sm:w-20 animate-pulse rounded"
                      style={{ backgroundColor: 'var(--muted)' }}
                    />
                  </TableCell>
                  <TableCell className="px-2 sm:px-4 py-2 sm:py-3">
                    <div 
                      className="h-3 sm:h-4 w-24 sm:w-32 animate-pulse rounded"
                      style={{ backgroundColor: 'var(--muted)' }}
                    />
                  </TableCell>
                  <TableCell className="px-2 sm:px-4 py-2 sm:py-3 hidden md:table-cell">
                    <div 
                      className="h-3 sm:h-4 w-20 sm:w-24 animate-pulse rounded"
                      style={{ backgroundColor: 'var(--muted)' }}
                    />
                  </TableCell>
                  <TableCell className="px-2 sm:px-4 py-2 sm:py-3 hidden lg:table-cell">
                    <div 
                      className="h-3 sm:h-4 w-32 sm:w-40 animate-pulse rounded"
                      style={{ backgroundColor: 'var(--muted)' }}
                    />
                  </TableCell>
                  <TableCell className="px-2 sm:px-4 py-2 sm:py-3">
                    <div 
                      className="h-3 sm:h-4 w-12 sm:w-16 animate-pulse rounded"
                      style={{ backgroundColor: 'var(--muted)' }}
                    />
                  </TableCell>
                  <TableCell className="px-2 sm:px-4 py-2 sm:py-3 hidden sm:table-cell">
                    <div 
                      className="h-3 sm:h-4 w-16 sm:w-20 animate-pulse rounded"
                      style={{ backgroundColor: 'var(--muted)' }}
                    />
                  </TableCell>
                  <TableCell className="px-2 sm:px-4 py-2 sm:py-3">
                    <div 
                      className="h-3 sm:h-4 w-6 sm:w-8 animate-pulse rounded"
                      style={{ backgroundColor: 'var(--muted)' }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div 
        className="rounded-md overflow-hidden"
        style={{
          border: `1px solid var(--border)`,
          backgroundColor: 'var(--card)',
        }}
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow style={{ backgroundColor: 'var(--muted)' }}>
                <TableHead 
                  className="text-xs sm:text-sm font-medium px-2 sm:px-4 py-2 sm:py-3"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Store ID
                </TableHead>
                <TableHead 
                  className="text-xs sm:text-sm font-medium px-2 sm:px-4 py-2 sm:py-3"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Name
                </TableHead>
                <TableHead 
                  className="text-xs sm:text-sm font-medium px-2 sm:px-4 py-2 sm:py-3 hidden md:table-cell"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Phone
                </TableHead>
                <TableHead 
                  className="text-xs sm:text-sm font-medium px-2 sm:px-4 py-2 sm:py-3 hidden lg:table-cell"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Address
                </TableHead>
                <TableHead 
                  className="text-xs sm:text-sm font-medium px-2 sm:px-4 py-2 sm:py-3"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Status
                </TableHead>
                <TableHead 
                  className="text-xs sm:text-sm font-medium px-2 sm:px-4 py-2 sm:py-3 hidden sm:table-cell"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Created
                </TableHead>
                <TableHead 
                  className="text-xs sm:text-sm font-medium px-2 sm:px-4 py-2 sm:py-3 w-[60px] sm:w-[100px]"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow style={{ borderColor: 'var(--border)' }}>
                <TableCell 
                  colSpan={7} 
                  className="text-center py-6 sm:py-8 px-4 text-sm sm:text-base"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  No stores found
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="rounded-md overflow-hidden"
      style={{
        border: `1px solid var(--border)`,
        backgroundColor: 'var(--card)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow style={{ backgroundColor: 'var(--muted)' }}>
              <TableHead 
                className="text-xs sm:text-sm font-medium px-2 sm:px-4 py-2 sm:py-3"
                style={{ color: 'var(--muted-foreground)' }}
              >
                Store ID
              </TableHead>
              <TableHead 
                className="text-xs sm:text-sm font-medium px-2 sm:px-4 py-2 sm:py-3"
                style={{ color: 'var(--muted-foreground)' }}
              >
                Name
              </TableHead>
              <TableHead 
                className="text-xs sm:text-sm font-medium px-2 sm:px-4 py-2 sm:py-3 hidden md:table-cell"
                style={{ color: 'var(--muted-foreground)' }}
              >
                Phone
              </TableHead>
              <TableHead 
                className="text-xs sm:text-sm font-medium px-2 sm:px-4 py-2 sm:py-3 hidden lg:table-cell"
                style={{ color: 'var(--muted-foreground)' }}
              >
                Address
              </TableHead>
              <TableHead 
                className="text-xs sm:text-sm font-medium px-2 sm:px-4 py-2 sm:py-3"
                style={{ color: 'var(--muted-foreground)' }}
              >
                Status
              </TableHead>
              <TableHead 
                className="text-xs sm:text-sm font-medium px-2 sm:px-4 py-2 sm:py-3 hidden sm:table-cell"
                style={{ color: 'var(--muted-foreground)' }}
              >
                Created
              </TableHead>
              <TableHead 
                className="text-xs sm:text-sm font-medium px-2 sm:px-4 py-2 sm:py-3 w-[60px] sm:w-[100px]"
                style={{ color: 'var(--muted-foreground)' }}
              >
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Create Store Row */}
            {onCreateStore && (
              <TableRow 
                className="hover:bg-opacity-50 transition-colors duration-200 border-dashed"
                style={{ 
                  borderColor: 'var(--primary)',
                  backgroundColor: 'color-mix(in srgb, var(--primary) 5%, transparent)',
                }}
              >
                <TableCell 
                  colSpan={7} 
                  className="px-2 sm:px-4 py-4 sm:py-6 text-center"
                >
                  <Button 
                    onClick={onCreateStore}
                    variant="outline"
                    className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base border-dashed"
                    style={{
                      borderColor: 'var(--primary)',
                      color: 'var(--primary)',
                      backgroundColor: 'transparent',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--primary)';
                      e.currentTarget.style.color = 'var(--primary-foreground)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--primary)';
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Create New Store
                  </Button>
                </TableCell>
              </TableRow>
            )}
            {stores.map((store) => (
              <TableRow 
                key={store.id} 
                className="hover:bg-opacity-50 transition-colors duration-200"
                style={{ 
                  borderColor: 'var(--border)',
                  backgroundColor: 'transparent',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--muted)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <TableCell 
                  className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm"
                  style={{ 
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--foreground)',
                  }}
                >
                  <span className="block truncate max-w-[80px] sm:max-w-none">
                    {store.id}
                  </span>
                </TableCell>
                <TableCell 
                  className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium"
                  style={{ color: 'var(--foreground)' }}
                >
                  <span className="block truncate max-w-[100px] sm:max-w-[150px] lg:max-w-none">
                    {store.name}
                  </span>
                </TableCell>
                <TableCell 
                  className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden md:table-cell"
                  style={{ color: 'var(--foreground)' }}
                >
                  <span className="block truncate max-w-[120px]">
                    {store.metadata.phone || 'N/A'}
                  </span>
                </TableCell>
                <TableCell 
                  className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden lg:table-cell"
                  style={{ color: 'var(--foreground)' }}
                >
                  <span className="block truncate max-w-[150px] xl:max-w-[200px]">
                    {store.metadata.address || 'N/A'}
                  </span>
                </TableCell>
                <TableCell className="px-2 sm:px-4 py-2 sm:py-3">
                  <Badge 
                    variant={store.is_active ? 'default' : 'secondary'}
                    className="text-xs px-2 py-1"
                    style={{
                      backgroundColor: store.is_active ? 'var(--primary)' : 'var(--secondary)',
                      color: store.is_active ? 'var(--primary-foreground)' : 'var(--secondary-foreground)',
                      border: `1px solid ${store.is_active ? 'var(--primary)' : 'var(--border)'}`,
                    }}
                  >
                    {store.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell 
                  className="px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm hidden sm:table-cell"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  <span className="block truncate">
                    {formatDate(store.created_at)}
                  </span>
                </TableCell>
                <TableCell className="px-2 sm:px-4 py-2 sm:py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className="h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-opacity-20"
                        style={{
                          color: 'var(--muted-foreground)',
                          backgroundColor: 'transparent',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--accent)';
                          e.currentTarget.style.color = 'var(--accent-foreground)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'var(--muted-foreground)';
                        }}
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="end"
                      className="min-w-[140px] sm:min-w-[160px]"
                      style={{
                        backgroundColor: 'var(--popover)',
                        border: `1px solid var(--border)`,
                        boxShadow: 'var(--shadow-md)',
                      }}
                    >
                      <DropdownMenuItem 
                        onClick={() => handleView(store.id)}
                        className="text-xs sm:text-sm px-2 py-1.5 sm:px-3 sm:py-2 cursor-pointer"
                        style={{
                          color: 'var(--popover-foreground)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--accent)';
                          e.currentTarget.style.color = 'var(--accent-foreground)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'var(--popover-foreground)';
                        }}
                      >
                        <Eye className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        <span>View Details</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleEdit(store.id)}
                        className="text-xs sm:text-sm px-2 py-1.5 sm:px-3 sm:py-2 cursor-pointer"
                        style={{
                          color: 'var(--popover-foreground)',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--accent)';
                          e.currentTarget.style.color = 'var(--accent-foreground)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                          e.currentTarget.style.color = 'var(--popover-foreground)';
                        }}
                      >
                        <Edit className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Edit Store</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default StoresTable;