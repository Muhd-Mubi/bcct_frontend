'use client';

import React, { useContext } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Order } from '@/lib/types';
import { UserRoleContext } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useData } from '@/context/data-context';

interface OrdersTableProps {
  data: Order[];
  onCompleteClick: (order: Order) => void;
  onDiscardClick: (order: Order) => void;
}

export function OrdersTable({ data, onCompleteClick, onDiscardClick }: OrdersTableProps) {
  const { isManager } = useContext(UserRoleContext);
  const { materials } = useData();
  
  const getStatusBadgeVariant = (status: Order['status']) => {
    switch (status) {
      case 'Completed':
        return 'secondary';
      case 'Discarded':
        return 'destructive';
      case 'Pending':
      default:
        return 'default';
    }
  };

  const getMaterialName = (id: string) => {
    return materials.find(m => m.id === id)?.name || 'Unknown Material';
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Name</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Details</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.name}</TableCell>
              <TableCell>{order.clientName}</TableCell>
              <TableCell>{format(parseISO(order.createdAt), 'PP')}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(order.status)}>
                  {order.status}
                </Badge>
              </TableCell>
               <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                {order.status === 'Completed' && order.materialsUsed ? (
                   <div className="flex flex-col gap-1">
                     {order.materialsUsed.map((m, index) => (
                       <span key={index}>
                         Used {m.sheetsUsed} sheets of {getMaterialName(m.materialId)}
                       </span>
                     ))}
                   </div>
                ) : (
                  order.details
                )}
              </TableCell>
              <TableCell className="text-right">
                {isManager && order.status === 'Pending' ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onCompleteClick(order)}>
                        Mark as Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive focus:bg-destructive/10"
                        onClick={() => onDiscardClick(order)}
                      >
                        Discard Order
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    No actions
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
