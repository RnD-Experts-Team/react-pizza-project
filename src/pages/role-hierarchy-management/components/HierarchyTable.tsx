import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import { Checkbox } from '../../../components/ui/checkbox';
import { MoreHorizontal, Eye, Edit, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import type { RoleHierarchyTableData } from '../../../types/roleHierarchy';
import { formatDate } from '../../../utils/dateUtils';

interface HierarchyTableProps {
  hierarchies: RoleHierarchyTableData[];
  selectedHierarchies: string[];
  onSelectionChange: (hierarchyIds: string[]) => void;
  onView: (hierarchy: RoleHierarchyTableData) => void;
  onEdit: (hierarchy: RoleHierarchyTableData) => void;
  onDelete: (hierarchy: RoleHierarchyTableData) => void;
  loading?: boolean;
}

const HierarchyTable: React.FC<HierarchyTableProps> = ({
  hierarchies,
  selectedHierarchies,
  onSelectionChange,
  onView,
  onEdit,
  onDelete,
  loading = false,
}) => {
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelectionChange(hierarchies.map(h => h.id.toString()));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectHierarchy = (hierarchyId: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedHierarchies, hierarchyId]);
    } else {
      onSelectionChange(selectedHierarchies.filter(id => id !== hierarchyId));
    }
  };

  const isAllSelected = hierarchies.length > 0 && selectedHierarchies.length === hierarchies.length;
  const isIndeterminate = selectedHierarchies.length > 0 && selectedHierarchies.length < hierarchies.length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (hierarchies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <p className="text-lg font-medium">No role hierarchies found</p>
        <p className="text-sm">Create a new hierarchy to get started</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox
                checked={isAllSelected}
                indeterminate={isIndeterminate}
                onCheckedChange={handleSelectAll}
                aria-label="Select all hierarchies"
              />
            </TableHead>
            <TableHead>Higher Role</TableHead>
            <TableHead>Lower Role</TableHead>
            <TableHead>Store</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created By</TableHead>
            <TableHead>Created Date</TableHead>
            <TableHead className="w-12">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hierarchies.map((hierarchy) => {
            const isSelected = selectedHierarchies.includes(hierarchy.id.toString());
            
            return (
              <TableRow key={hierarchy.id} className={isSelected ? 'bg-muted/50' : ''}>
                <TableCell>
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={(checked) => 
                      handleSelectHierarchy(hierarchy.id.toString(), checked as boolean)
                    }
                    aria-label={`Select hierarchy ${hierarchy.id}`}
                  />
                </TableCell>
                <TableCell className="font-medium">
                  <div>
                    <div className="font-semibold">{hierarchy.higher_role_name}</div>
                    <div className="text-sm text-gray-500">ID: {hierarchy.higher_role_id}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-semibold">{hierarchy.lower_role_name}</div>
                    <div className="text-sm text-gray-500">ID: {hierarchy.lower_role_id}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-semibold">{hierarchy.store_name}</div>
                    <div className="text-sm text-gray-500">ID: {hierarchy.store_id}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={hierarchy.is_active ? 'default' : 'secondary'}>
                    {hierarchy.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{hierarchy.created_by}</div>
                    {hierarchy.reason && (
                      <div className="text-sm text-gray-500 max-w-xs truncate" title={hierarchy.reason}>
                        {hierarchy.reason}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {formatDate(hierarchy.created_at)}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onView(hierarchy)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(hierarchy)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => onDelete(hierarchy)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default HierarchyTable;