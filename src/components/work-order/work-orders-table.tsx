'use client';

import React, { useContext, useState } from 'react';
import Link from 'next/link';
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
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface WorkOrdersTableProps {
  workOrders: WorkOrder[];
  onStatusChange: (orderId: string, newStatus: WorkOrderStatus) => void;
  onView: (order: WorkOrder) => void;
  onEdit: (order: WorkOrder) => void;
  onDelete: (orderId: string) => void;
  onRevert: (orderId: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const statusVariant: Record<WorkOrderStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  pending: 'destructive',
  'in progress': 'secondary',
  completed: 'default',
};

const priorityVariant: Record<WorkOrderPriority, 'default' | 'secondary' | 'destructive'> = {
  high: 'destructive',
  medium: 'secondary',
  low: 'default',
}

export function WorkOrdersTable({ workOrders, onStatusChange, onView, onEdit, onDelete, onRevert, currentPage, totalPages, onPageChange }: WorkOrdersTableProps) {
  const pathname = usePathname();
  const itemsPerPage = 10;
  const { isAdmin, isUser } = useAuth()

  const handleRowClick = (e: React.MouseEvent, order: WorkOrder) => {
    // if ((e.target as HTMLElement).closest('[data-radix-dropdown-menu-trigger]') || (e.target as HTMLElement).tagName === 'A') {
    //   return;
    // }
    onView(order);
  };

  const isDashboard = pathname.includes('/dashboard');

  const renderActions = (order: WorkOrder) => {
    if (isDashboard) {
      return null;
    }
    const canChangeStatus = isUser || isAdmin;
    const canUserUpdateStatus = isUser && (order.status !== 'completed')
    const canEdit = isAdmin && (order.status === 'pending')
    const canDelete = isAdmin && (order.status === 'pending');
    const canRevert = isAdmin && (order.status === 'completed');

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
          {/* <DropdownMenuItem onClick={() => onView(order)}>
            View Details
          </DropdownMenuItem> */}

          {canChangeStatus && (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {canUserUpdateStatus && <>
                    <DropdownMenuItem onClick={() => onStatusChange(order._id, 'pending')} disabled={order.status === 'pending'}>
                      Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onStatusChange(order._id, 'in progress')} disabled={order.status === 'in progress'}>
                      In Progress
                    </DropdownMenuItem>
                  </>}
                  {isAdmin && <DropdownMenuItem onClick={() => onStatusChange(order._id, 'completed')} disabled={order.status === 'completed'}>
                    Completed
                  </DropdownMenuItem>}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          )}

          {/* <DropdownMenuSeparator /> */}

          <TooltipProvider>
            {canEdit && (
              <DropdownMenuItem onClick={() => onEdit(order)}>
                Edit
              </DropdownMenuItem>
            )}

            {canRevert && (
              <DropdownMenuItem onClick={() => onRevert(order._id)}>
                Revert Completion
              </DropdownMenuItem>
            )}

            {canDelete && (
              <DropdownMenuItem
                onClick={() => onDelete(order._id)}
                className="text-destructive focus:text-destructive"
              >
                Delete
              </DropdownMenuItem>
            )}
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
              <TableHead>No.</TableHead>
              <TableHead>Job Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Tasks</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              {!isDashboard && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {workOrders?.map((order, index) => (
              <TableRow key={index} onClick={(e) => handleRowClick(e, order)} className="cursor-pointer">
                <TableCell>{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                <TableCell className="font-medium">
                  <Link
                    href={`/work-order-viewer?id=${order._id}`}
                    target="_blank"
                    className="hover:underline text-primary"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {order.job}
                  </Link>
                </TableCell>
                <TableCell>{format(parseISO(String(order?.createdAt)), 'PP')}</TableCell>
                {/* <TableCell>{format(parseISO(String(order.createdAt)), 'PP')}</TableCell> */}
                <TableCell className="text-xs">
                  <div className="flex flex-col gap-1">
                    {order.tasks && order.tasks.map((item, index) => (
                      <span className='flex gap-[2px]' key={index}>
                        <div className='text-[#F97316]'>{item.name}</div>
                        <div className='text-[#9cafa9]'> (x{item.quantity})</div>
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={priorityVariant[order.priority]}>{order.priority}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[order.status]}>{order.status}</Badge>
                </TableCell>
                {!isDashboard && (
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
            onClick={() => onPageChange(currentPage - 1)}
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
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
    </div>
  );
}
