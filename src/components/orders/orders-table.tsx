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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';
import { Order, OrderStatus, UserRoleContext } from '@/lib/types';
import { format, parseISO } from 'date-fns';

interface OrdersTableProps {
  orders: Order[];
  onComplete: (order: Order) => void;
  onDiscard: (order: Order) => void;
}

const statusVariant: Record<OrderStatus, 'default' | 'secondary' | 'destructive'> = {
    Pending: 'secondary',
    Completed: 'default',
    Discarded: 'destructive',
};

export function OrdersTable({ orders, onComplete, onDiscard }: OrdersTableProps) {
    const { isAdmin, isManager } = useContext(UserRoleContext);
    const canPerformActions = isAdmin || isManager;

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Name</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Materials Used</TableHead>
            {canPerformActions && <TableHead className="text-right">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.name}</TableCell>
              <TableCell>{order.client}</TableCell>
              <TableCell>{format(parseISO(order.date), 'PP')}</TableCell>
              <TableCell>
                <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
              </TableCell>
               <TableCell className="text-xs text-muted-foreground">
                {order.materialsUsed?.map(m => (
                    <div key={m.materialId}>{m.materialName}: {m.sheetsUsed} sheets</div>
                )) ?? 'N/A'}
              </TableCell>
              {canPerformActions && (
                <TableCell className="text-right">
                  {order.status === 'Pending' && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onComplete(order)}>
                          Mark as Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => onDiscard(order)}
                        >
                          Discard Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
