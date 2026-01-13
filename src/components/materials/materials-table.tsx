'use client';

import React, { useState, useMemo, useContext, Ref } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import { Material } from '@/lib/types';
import { UserRoleContext } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';

type SortKey = keyof Material | '';

interface MaterialsTableProps {
  data: Material[];
  onEdit: (material: Material) => void;
  onDelete: (id: string) => void;
  isLowStock?: boolean
  tableRef?: Ref<HTMLDivElement>
}

export function MaterialsTable({ data, onEdit, onDelete, isLowStock = false, tableRef }: MaterialsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { isLeadership, isAdmin, isTechnical } = useContext(UserRoleContext);
  const { isUser } = useAuth()

  const canEdit = isLeadership || isTechnical;
  const canDelete = isLeadership || isAdmin;

  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter((m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortKey) {
      filtered.sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, searchTerm, sortKey, sortOrder]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const SortableHeader = ({
    sortKeyName,
    children,
  }: {
    sortKeyName: SortKey;
    children: React.ReactNode;
  }) => (
    <TableHead>
      <Button
        variant="ghost"
        onClick={() => { }}
      >
        {children}
        {/* <ArrowUpDown className="ml-2 h-4 w-4" /> */}
      </Button>
    </TableHead>
  );

  return (
    <div className="space-y-4">
      {!isLowStock && <Input
        placeholder="Search materials..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />}
      <div ref={tableRef} className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Measurement Unit</TableHead>
              <TableHead>Unit Quantity</TableHead>
              <TableHead>Extra Sheets</TableHead>
              {isLowStock && <TableHead>Threshold Units</TableHead>}
              {!isLowStock && isUser && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedData.map((material) => (
              <TableRow key={material._id}>
                <TableCell className="font-medium">{material.name}</TableCell>
                <TableCell>{material.measurement}</TableCell>
                <TableCell className='text-red-600 pl-8'>{material.unitQuantity}</TableCell>
                <TableCell className='text-red-600 pl-8'>{material.extraSheets}</TableCell>
                {isLowStock && <TableCell>{material?.thresholdUnits}</TableCell>}
                {!isLowStock && isUser && <TableCell>
                  {(canEdit || canDelete) ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {canEdit && (
                          <DropdownMenuItem onClick={() => onEdit(material)}>
                            Edit
                          </DropdownMenuItem>
                        )}
                        {true && (
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive"
                            onClick={() => onDelete(material._id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <span className="text-xs text-muted-foreground">No actions</span>
                  )}
                </TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
