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

interface OrdersTableProps {
  data: Order[];
  onCompleteClick: (order: Order) => void;
}

export function OrdersTable({ data, onCompleteClick }: OrdersTableProps) {
  const { isManager } = useContext(UserRoleContext);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Name</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.name}</TableCell>
              <TableCell>{order.clientName}</TableCell>
              <TableCell>{format(parseISO(order.createdAt), 'PP')}</TableCell>
              <TableCell>
                <Badge variant={order.status === 'Completed' ? 'secondary' : 'default'}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>
                {isManager && order.status === 'Pending' ? (
                  <Button size="sm" variant="outline" onClick={() => onCompleteClick(order)}>
                    Complete
                  </Button>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    {order.status === 'Completed' ? `Used ${order.sheetsUsed} sheets` : 'No actions'}
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
