'use client';

import React, { useState, useMemo, useContext } from 'react';
import { PlusCircle, ListFilter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { OrdersTable } from '@/components/orders/orders-table';
import { CreateOrderDialog } from '@/components/orders/create-order-dialog';
import { CompleteOrderDialog } from '@/components/orders/complete-order-dialog';
import { DiscardOrderDialog } from '@/components/orders/discard-order-dialog';
import { useData } from '@/context/data-context';
import { Order, OrderStatus, Material, UserRoleContext } from '@/lib/types';

export default function OrdersPage() {
  const {
    orders,
    materials,
    measurements,
    saveOrder,
    markOrderAsComplete,
    markOrderAsDiscarded,
  } = useData();
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isCompleteOpen, setCompleteOpen] = useState(false);
  const [isDiscardOpen, setDiscardOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('date-desc');
  const { isAdmin, isManager } = useContext(UserRoleContext);
  const canPerformActions = isAdmin || isManager;


  const handleCreateNew = () => {
    setCreateOpen(true);
  };

  const handleSaveOrder = (orderData: Omit<Order, 'id' | 'status' | 'date'>) => {
    saveOrder(orderData);
    setCreateOpen(false);
  };

  const handleCompleteClick = (order: Order) => {
    setSelectedOrder(order);
    setCompleteOpen(true);
  };

  const handleDiscardClick = (order: Order) => {
    setSelectedOrder(order);
    setDiscardOpen(true);
  };

  const handleConfirmComplete = (
    orderId: string,
    materialsUsed: { materialId: string; unitQuantity: number; extraSheets: number }[]
  ) => {
    markOrderAsComplete(orderId, materialsUsed);
    setCompleteOpen(false);
  };

  const handleConfirmDiscard = (orderId: string) => {
    markOrderAsDiscarded(orderId);
    setDiscardOpen(false);
  };

  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders.filter(
      (o) =>
        o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.client.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'status-asc':
          return a.status.localeCompare(b.status);
        case 'status-desc':
          return b.status.localeCompare(a.status);
        case 'date-desc':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

    return filtered;
  }, [orders, searchTerm, sortOption]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline">Orders</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search by order or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        <ListFilter className="mr-2 h-4 w-4" />
                        Sort By
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Sort Orders</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={sortOption} onValueChange={setSortOption}>
                        <DropdownMenuRadioItem value="date-desc">Newest First</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="name-asc">Name (A-Z)</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="name-desc">Name (Z-A)</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="status-asc">Status (A-Z)</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="status-desc">Status (Z-A)</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
            {canPerformActions && (
              <Button size="sm" onClick={handleCreateNew}>
                <PlusCircle />
                Create New Order
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <OrdersTable
            orders={filteredAndSortedOrders}
            onComplete={handleCompleteClick}
            onDiscard={handleDiscardClick}
          />
        </CardContent>
      </Card>

      <CreateOrderDialog
        isOpen={isCreateOpen}
        onOpenChange={setCreateOpen}
        onSave={handleSaveOrder}
      />

      {selectedOrder && (
        <>
          <CompleteOrderDialog
            isOpen={isCompleteOpen}
            onOpenChange={setCompleteOpen}
            order={selectedOrder}
            materials={materials}
            onConfirm={handleConfirmComplete}
          />
          <DiscardOrderDialog
            isOpen={isDiscardOpen}
            onOpenChange={setDiscardOpen}
            order={selectedOrder}
            onConfirm={handleConfirmDiscard}
          />
        </>
      )}
    </div>
  );
}
