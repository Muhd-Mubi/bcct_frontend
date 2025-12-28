'use client';

import React, { useState, useMemo, useContext } from 'react';
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OrdersTable } from '@/components/orders/orders-table';
import { Order, Material } from '@/lib/data';
import { OrderFormDialog } from '@/components/orders/order-form-dialog';
import { CompleteOrderDialog } from '@/components/orders/complete-order-dialog';
import { DiscardOrderDialog } from '@/components/orders/discard-order-dialog';
import { UserRoleContext } from '@/lib/types';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useData } from '@/context/data-context';


type SortKey = keyof Order | '';

export default function OrdersPage() {
  const { orders, saveOrder, markOrderAsComplete, markOrderAsDiscarded } = useData();
  const [isOrderFormOpen, setOrderFormOpen] = useState(false);
  const [isCompleteFormOpen, setCompleteFormOpen] = useState(false);
  const [isDiscardFormOpen, setDiscardFormOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>(undefined);
  const { isManager } = useContext(UserRoleContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleAddOrder = () => {
    setSelectedOrder(undefined);
    setOrderFormOpen(true);
  };

  const handleSaveOrder = (order: Order) => {
    saveOrder(order);
    setOrderFormOpen(false);
  };

  const handleCompleteClick = (order: Order) => {
    setSelectedOrder(order);
    setCompleteFormOpen(true);
  };
  
  const handleDiscardClick = (order: Order) => {
    setSelectedOrder(order);
    setDiscardFormOpen(true);
  };

  const handleMarkAsComplete = (orderId: string, materialsUsed: { materialId: string; sheetsUsed: number }[]) => {
    markOrderAsComplete(orderId, materialsUsed);
    setCompleteFormOpen(false);
  };

  const handleMarkAsDiscarded = (orderId: string) => {
    markOrderAsDiscarded(orderId);
    setDiscardFormOpen(false);
  };
  
  const filteredAndSortedData = useMemo(() => {
    let filtered = orders.filter((o) =>
      o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.clientName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortKey) {
      filtered.sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];
        if (valA === undefined || valB === undefined) return 0;
        if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
        if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  }, [orders, searchTerm, sortKey, sortOrder]);


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline">Orders</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Sort By</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup value={sortKey} onValueChange={(val) => setSortKey(val as SortKey)}>
                  <DropdownMenuRadioItem value="name">Order Name</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="clientName">Client Name</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="status">Status</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="createdAt">Date Created</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {isManager && (
              <Button size="sm" onClick={handleAddOrder}>
                <PlusCircle />
                Create New Order
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <OrdersTable
            data={filteredAndSortedData}
            onCompleteClick={handleCompleteClick}
            onDiscardClick={handleDiscardClick}
          />
        </CardContent>
      </Card>

      <OrderFormDialog
        isOpen={isOrderFormOpen}
        onOpenChange={setOrderFormOpen}
        onSave={handleSaveOrder}
        order={selectedOrder}
      />

      <CompleteOrderDialog
        isOpen={isCompleteFormOpen}
        onOpenChange={setCompleteFormOpen}
        order={selectedOrder}
        onSave={handleMarkAsComplete}
      />

      <DiscardOrderDialog
        isOpen={isDiscardFormOpen}
        onOpenChange={setDiscardFormOpen}
        order={selectedOrder}
        onConfirm={handleMarkAsDiscarded}
      />
    </div>
  );
}
