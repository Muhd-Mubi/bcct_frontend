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
import { ChangeStatusConfirmationDialog } from '@/components/work-order/change-status-confirmation-dialog';
import { DeleteWorkOrderDialog } from '@/components/work-order/delete-work-order-dialog';
import { RevertConfirmationDialog } from '@/components/onboarding/revert-confirmation-dialog';

export default function WorkOrdersPage() {
  const {
    workOrders,
    materials,
    jobOrders,
    saveWorkOrder,
    markWorkOrderAsComplete,
    deleteWorkOrder,
    updateWorkOrderStatus,
    revertWorkOrderCompletion,
  } = useData();
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isCompleteOpen, setCompleteOpen] = useState(false);
  const [isViewOpen, setViewOpen] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isStatusConfirmOpen, setStatusConfirmOpen] = useState(false);
  const [isRevertConfirmOpen, setRevertConfirmOpen] = useState(false);
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | undefined>(undefined);
  const [workOrderToDelete, setWorkOrderToDelete] = useState<string | null>(null);
  const [statusChange, setStatusChange] = useState<{ id: string, status: WorkOrderStatus } | null>(null);
  const [workOrderToRevert, setWorkOrderToRevert] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<WorkOrderStatus[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<WorkOrderPriority[]>([]);
  const { isAdmin } = useContext(UserRoleContext);


  const handleCreateNew = () => {
    setSelectedWorkOrder(undefined);
    setCreateOpen(true);
  };
  
  const handleEdit = (order: WorkOrder) => {
    setSelectedWorkOrder(order);
    setCreateOpen(true);
  };

  const handleDelete = (orderId: string) => {
    setWorkOrderToDelete(orderId);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (workOrderToDelete) {
      deleteWorkOrder(workOrderToDelete);
    }
    setDeleteOpen(false);
    setWorkOrderToDelete(null);
  };

  const handleSaveWorkOrder = (orderData: WorkOrder | Omit<WorkOrder, 'id' | 'status' | 'date'>) => {
    saveWorkOrder(orderData);
    setCreateOpen(false);
  };

  const handleStatusChangeClick = (orderId: string, newStatus: WorkOrderStatus) => {
    setStatusChange({ id: orderId, status: newStatus });
    setStatusConfirmOpen(true);
  };

  const handleConfirmStatusChange = () => {
    if (statusChange) {
      if (statusChange.status === 'Completed') {
        const order = workOrders.find(wo => wo.id === statusChange.id);
        setSelectedWorkOrder(order);
        setCompleteOpen(true);
      } else {
        updateWorkOrderStatus(statusChange.id, statusChange.status);
      }
    }
    setStatusConfirmOpen(false);
    setStatusChange(null);
  };
  
  const handleRevertClick = (orderId: string) => {
    setWorkOrderToRevert(orderId);
    setRevertConfirmOpen(true);
  }

  const handleConfirmRevert = () => {
    if (workOrderToRevert) {
      revertWorkOrderCompletion(workOrderToRevert);
    }
    setRevertConfirmOpen(false);
    setWorkOrderToRevert(null);
  };

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
                {(['Pending', 'In Progress', 'Completed'] as WorkOrderStatus[]).map(status => (
                    <DropdownMenuCheckboxItem
                        key={status}
                        checked={statusFilter.includes(status)}
                        onCheckedChange={() => {
                            setStatusFilter(prev => prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status])
                        }}
                    >
                        {status}
                    </DropdownMenuCheckboxItem>
                ))}
                
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
            onRowClick={handleViewClick}
            onStatusChange={handleStatusChangeClick}
            onView={handleViewClick}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onRevert={handleRevertClick}
          />
        </CardContent>
      </Card>

      <CreateWorkOrderDialog
        isOpen={isCreateOpen}
        onOpenChange={setCreateOpen}
        onSave={handleSaveWorkOrder}
        jobOrders={jobOrders}
        workOrder={selectedWorkOrder}
      />
      
      <DeleteWorkOrderDialog
        isOpen={isDeleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />

      <ChangeStatusConfirmationDialog
        isOpen={isStatusConfirmOpen}
        onOpenChange={setStatusConfirmOpen}
        onConfirm={handleConfirmStatusChange}
        status={statusChange?.status}
      />
      
      <RevertConfirmationDialog
        isOpen={isRevertConfirmOpen}
        onOpenChange={setRevertConfirmOpen}
        onConfirm={handleConfirmRevert}
        description="This will revert the work order to 'In Progress' and add the used materials back to the inventory."
      />

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
