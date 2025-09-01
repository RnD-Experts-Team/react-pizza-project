/**
 * LoadingTable Component
 * 
 * Displays a skeleton loading state for the stores table with animated placeholders.
 * Provides visual feedback while data is being fetched.
 */

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Building2 } from 'lucide-react';

interface LoadingTableProps {
  rowCount?: number;
}

export const LoadingTable: React.FC<LoadingTableProps> = ({ rowCount = 5 }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
          <Building2 className="h-5 w-5" />
          <span>Store Locations</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[100px]">Store ID</TableHead>
                <TableHead className="min-w-[150px]">Name</TableHead>
                <TableHead className="hidden sm:table-cell min-w-[120px]">Phone</TableHead>
                <TableHead className="hidden md:table-cell min-w-[200px]">Address</TableHead>
                <TableHead className="min-w-[80px]">Status</TableHead>
                <TableHead className="hidden lg:table-cell min-w-[100px]">Created</TableHead>
                <TableHead className="min-w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(rowCount)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="h-4 w-24 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="h-4 w-40 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-16 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <div className="h-4 w-20 bg-muted animate-pulse rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-8 w-24 bg-muted animate-pulse rounded" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoadingTable;