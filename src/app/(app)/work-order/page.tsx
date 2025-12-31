'use client';

import React, { useState, useMemo, useContext } from 'react';
import { PlusCircle, ListFilter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { WorkOrdersTable } from '@/components/work-order/work-orders-table';
import { CreateWorkOrderDialog } from '@/components/work-order/create-work-order-dialog';
import { CompleteWorkOrderDialog } from '@/components/work-order/complete-work-order-dialog';
import { ViewWorkOrderDialog } from '@/components/work-order/view-work-order-dialog';
import { useData } from '@/context/data-context';
import { WorkOrder, WorkOrderPriority, WorkOrderStatus } from '@/lib/types';
import { UserRoleContext } from '@/lib/types';
import { CompleteConfirmationDialog } from '@/components/work-order/complete-confirmation-dialog';

export default function WorkOrdersPage() {
  const {
    workOrders,
    materials,
    jobOrders,
    saveWorkOrder,
    markWorkOrderAsComplete,
  } = useData();
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isCompleteOpen, setCompleteOpen] = useState(false);
  const [isConfirmCompleteOpen, setConfirmCompleteOpen] = useState(false);
  const [isViewOpen, setViewOpen] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<WorkOrderStatus[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<WorkOrderPriority[]>([]);
  const { isAdmin } = useContext(UserRoleContext);


  const handleCreateNew = () => {
    setCreateOpen(true);
  };

  const handleSaveWorkOrder = (orderData: Omit<WorkOrder, 'id' | 'status' | 'date'>) => {
    saveWorkOrder(orderData);
    setCreateOpen(false);
  };

  const handleCompleteClick = (order: WorkOrder) => {
    setSelectedWorkOrder(order);
    setConfirmCompleteOpen(true);
  };

  const handleProceedToComplete = () => {
    setConfirmCompleteOpen(false);
    setCompleteOpen(true);
  }

  const handleViewClick = (order: WorkOrder) => {
    setSelectedWorkOrder(order);
    setViewOpen(true);
  };

  const handleConfirmComplete = (
    orderId: string,
    materialsUsed: { materialId: string; quantity: number }[]
  ) => {
    markWorkOrderAsComplete(orderId, materialsUsed);
    setCompleteOpen(false);
  };

  const filteredAndSortedWorkOrders = useMemo(() => {
    return workOrders
      .filter((o) => o.jobId.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter((o) => statusFilter.length === 0 || statusFilter.includes(o.status))
      .filter((o) => priorityFilter.length === 0 || priorityFilter.includes(o.priority))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [workOrders, searchTerm, statusFilter, priorityFilter]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline">Work Orders</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search by Job Order ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <ListFilter className="mr-2 h-4 w-4" />
                  Filters
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes('Pending')}
                  onCheckedChange={() => {
                    setStatusFilter(prev => prev.includes('Pending') ? prev.filter(s => s !== 'Pending') : [...prev, 'Pending'])
                  }}
                >
                  Pending
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={statusFilter.includes('Completed')}
                  onCheckedChange={() => {
                    setStatusFilter(prev => prev.includes('Completed') ? prev.filter(s => s !== 'Completed') : [...prev, 'Completed'])
                  }}
                >
                  Completed
                </DropdownMenuCheckboxItem>

                <DropdownMenuLabel>Priority</DropdownMenuLabel>
                <DropdownMenuSeparator />
                 <DropdownMenuCheckboxItem
                  checked={priorityFilter.includes('High')}
                  onCheckedChange={() => {
                    setPriorityFilter(prev => prev.includes('High') ? prev.filter(s => s !== 'High') : [...prev, 'High'])
                  }}
                >
                  High
                </DropdownMenuCheckboxItem>
                 <DropdownMenuCheckboxItem
                  checked={priorityFilter.includes('Medium')}
                  onCheckedChange={() => {
                    setPriorityFilter(prev => prev.includes('Medium') ? prev.filter(s => s !== 'Medium') : [...prev, 'Medium'])
                  }}
                >
                  Medium
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={priorityFilter.includes('Low')}
                  onCheckedChange={() => {
                    setPriorityFilter(prev => prev.includes('Low') ? prev.filter(s => s !== 'Low') : [...prev, 'Low'])
                  }}
                >
                  Low
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {isAdmin && (
              <Button size="sm" onClick={handleCreateNew}>
                <PlusCircle />
                Create New Work Order
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <WorkOrdersTable
            workOrders={filteredAndSortedWorkOrders}
            onComplete={handleCompleteClick}
            onView={handleViewClick}
          />
        </CardContent>
      </Card>

      <CreateWorkOrderDialog
        isOpen={isCreateOpen}
        onOpenChange={setCreateOpen}
        onSave={handleSaveWorkOrder}
        jobOrders={jobOrders}
      />

      {selectedWorkOrder && (
        <CompleteConfirmationDialog
          isOpen={isConfirmCompleteOpen}
          onOpenChange={setConfirmCompleteOpen}
          onConfirm={handleProceedToComplete}
        />
      )}

      {selectedWorkOrder && (
        <CompleteWorkOrderDialog
          isOpen={isCompleteOpen}
          onOpenChange={setCompleteOpen}
          workOrder={selectedWorkOrder}
          materials={materials}
          onConfirm={handleConfirmComplete}
        />
      )}
       
       {selectedWorkOrder && (
        <ViewWorkOrderDialog
          isOpen={isViewOpen}
          onOpenChange={setViewOpen}
          workOrder={selectedWorkOrder}
        />
       )}
    </div>
  );
}
