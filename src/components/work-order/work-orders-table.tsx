'use client';

import React, { useContext, useState } from 'react';
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
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal } from 'lucide-react';
import { WorkOrder, WorkOrderStatus, UserRoleContext, WorkOrderPriority } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';

interface WorkOrdersTableProps {
  workOrders: WorkOrder[];
  onRowClick: (order: WorkOrder) => void;
  onStatusChange: (orderId: string, newStatus: WorkOrderStatus) => void;
  onView: (order: WorkOrder) => void;
  onEdit: (order: WorkOrder) => void;
  onDelete: (orderId: string) => void;
  onRevert: (orderId: string) => void;
}

const statusVariant: Record<WorkOrderStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    Pending: 'destructive',
    'In Progress': 'secondary',
    Completed: 'default',
};

const priorityVariant: Record<WorkOrderPriority, 'default' | 'secondary' | 'destructive'> = {
    High: 'destructive',
    Medium: 'secondary',
    Low: 'default'
}

export function WorkOrdersTable({ workOrders, onRowClick, onStatusChange, onView, onEdit, onDelete, onRevert }: WorkOrdersTableProps) {
  const { isAdmin } = useContext(UserRoleContext);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const paginatedWorkOrders = workOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(workOrders.length / itemsPerPage);

  const renderActions = (order: WorkOrder) => {
      const isPending = order.status === 'Pending';
      const isCompleted = order.status === 'Completed';

      return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={() => onView(order)}>
                  View Details
                </DropdownMenuItem>
                
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                             <DropdownMenuItem onClick={() => onStatusChange(order.id, 'Pending')} disabled={order.status === 'Pending'}>Pending</DropdownMenuItem>
                             <DropdownMenuItem onClick={() => onStatusChange(order.id, 'In Progress')} disabled={order.status === 'In Progress'}>In Progress</DropdownMenuItem>
                             <DropdownMenuItem onClick={() => onStatusChange(order.id, 'Completed')} disabled={order.status === 'Completed'}>Completed</DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
                
                <DropdownMenuSeparator />
                
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                             <div className='relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'>
                                <DropdownMenuItem onClick={() => onEdit(order)} disabled={!isPending}>
                                    Edit
                                </DropdownMenuItem>
                            </div>
                        </TooltipTrigger>
                        {!isPending && <TooltipContent><p>Only pending orders can be edited.</p></TooltipContent>}
                    </Tooltip>
                    
                    {isCompleted && (
                       <DropdownMenuItem onClick={() => onRevert(order.id)}>
                         Revert Completion
                       </DropdownMenuItem>
                    )}

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div className='relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'>
                                <DropdownMenuItem
                                    onClick={() => onDelete(order.id)}
                                    disabled={!isPending}
                                    className="text-destructive focus:text-destructive"
                                >
                                    Delete
                                </DropdownMenuItem>
                            </div>
                        </TooltipTrigger>
                       {!isPending && <TooltipContent><p>Only pending orders can be deleted.</p></TooltipContent>}
                    </Tooltip>
                </TooltipProvider>
            </DropdownMenuContent>
        </DropdownMenu>
      )
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Tasks</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              {isAdmin && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedWorkOrders.map((order) => (
              <TableRow key={order.id} onClick={() => onRowClick(order)} className="cursor-pointer">
                <TableCell className="font-medium">{order.jobId}</TableCell>
                <TableCell>{format(parseISO(order.date), 'PP')}</TableCell>
                <TableCell className="text-xs">
                  <div className="flex flex-col gap-1">
                    {order.items && order.items.map((item, index) => (
                      <span key={index}>{item.name} (x{item.quantity})</span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={priorityVariant[order.priority]}>{order.priority}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
                </TableCell>
                {isAdmin && (
                  <TableCell className="text-right">
                      {renderActions(order)}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
