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
import { useCreateWorkOrder, useGetWorkOrder } from '@/api/react-query/queries/workOrder'
import { useGetJobs } from '@/api/react-query/queries/jobOrder';
import { toast } from 'react-toastify';

// const priorityOrder: Record<WorkOrderPriority, number> = {
//   high: 1,
//   medium: 2,
//   low: 3,
// };

const dateSortOrder = (a: WorkOrder, b: WorkOrder) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

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
  const { isAdmin, isLeadership } = useContext(UserRoleContext);
  const [currentPage, setCurrentPage] = useState(1);


  const { data, isLoading, error, refetch } = useGetWorkOrder(currentPage);
  const {
    mutate: createWorkOrder,
    isPending: creatingWorkOrder,
  } = useCreateWorkOrder();

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
    const newData = {
      data: orderData
    }
    createWorkOrder(newData, {
      onSuccess: (data) => {
        toast.success(data.message);
        refetch()
        closeCreateEditModal();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    })
  };

  const closeCreateEditModal = () => {
    setSelectedWorkOrder(undefined);
    setCreateOpen(false);
  }

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

  // const filteredAndSortedWorkOrders = useMemo(() => {
  //   return workOrders
  //     .filter((o) => o.jobId.toLowerCase().includes(searchTerm.toLowerCase()))
  //     .filter((o) => statusFilter.length === 0 || statusFilter.includes(o.status))
  //     .filter((o) => priorityFilter.length === 0 || priorityFilter.includes(o.priority))
  //     .sort((a, b) => {
  //       const priorityComparison = priorityOrder[a.priority] - priorityOrder[b.priority];
  //       if (priorityComparison !== 0) {
  //         return priorityComparison;
  //       }
  //       return dateSortOrder(a, b);
  //     });
  // }, [workOrders, searchTerm, statusFilter, priorityFilter]);

  const canCreate = isLeadership || isAdmin;

  // const data = [
  //   {
  //     "_id": "6958a529a2752cdf4bf1a7ff",
  //     "job": "2",
  //     "description": "testing new logic",
  //     "priority": "medium",
  //     "tasks": [
  //       {
  //         "name": "performa forms",
  //         "quantity": 20
  //       },
  //       {
  //         "name": "G1 forms",
  //         "quantity": 120
  //       }
  //     ],
  //     "status": "reverted",
  //     "deliveryDate": null,
  //     "createdAt": "2026-01-03T05:12:09.400Z",
  //     "__v": 1
  //   }
  // ]

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  const disableButtons = creatingWorkOrder

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
                  checked={priorityFilter.includes('high')}
                  onCheckedChange={() => {
                    setPriorityFilter(prev => prev.includes('high') ? prev.filter(s => s !== 'high') : [...prev, 'high'])
                  }}
                >
                  high
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={priorityFilter.includes('medium')}
                  onCheckedChange={() => {
                    setPriorityFilter(prev => prev.includes('medium') ? prev.filter(s => s !== 'medium') : [...prev, 'medium'])
                  }}
                >
                  medium
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={priorityFilter.includes('low')}
                  onCheckedChange={() => {
                    setPriorityFilter(prev => prev.includes('low') ? prev.filter(s => s !== 'low') : [...prev, 'low'])
                  }}
                >
                  low
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {true && (
              <Button size="sm" onClick={handleCreateNew}>
                <PlusCircle />
                Create New Work Order
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <WorkOrdersTable
            workOrders={data?.workOrders || []}
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
        workOrder={selectedWorkOrder}
        disableButtons={disableButtons}
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
