'use client';

import React from 'react';
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
import { Job } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAuth } from '@/context/AuthContext';

interface JobOrdersTableProps {
  jobOrders: Job[];
  workOrderCounts: { [jobId: string]: { total: number; open: number } };
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onEdit: (job: Job) => void;
  onDelete: (jobId: string) => void;
}

export function JobOrdersTable({ jobOrders, workOrderCounts, currentPage, totalPages, onPageChange, onEdit, onDelete }: JobOrdersTableProps) {
  const { isAdmin } = useAuth()

  const renderActions = (job: Job) => {
    const openWorkOrderCount = workOrderCounts[job._id]?.open || 0;
    const canModify = openWorkOrderCount === 0;

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full">
                  <DropdownMenuItem onClick={() => onEdit(job)} disabled={!canModify} className="w-full">
                    Edit
                  </DropdownMenuItem>
                </div>
              </TooltipTrigger>
              {!canModify && <TooltipContent><p>Cannot edit a job with open work orders.</p></TooltipContent>}
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full">
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive w-full"
                    onClick={() => onDelete(job?.job_id)}
                    disabled={!canModify}
                  >
                    Delete
                  </DropdownMenuItem>
                </div>
              </TooltipTrigger>
              {!canModify && <TooltipContent><p>Cannot delete a job with open work orders.</p></TooltipContent>}
            </Tooltip>
          </TooltipProvider>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Order ID</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Date Created</TableHead>
              <TableHead>Tasks</TableHead>
              <TableHead className="text-center">No. of Work Orders</TableHead>
              {isAdmin && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {jobOrders.map((job, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{job.job_id}</TableCell>
                <TableCell>{job.department}</TableCell>
                <TableCell>{format(parseISO(String(job.createdAt)), 'PP')}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 text-xs">
                    {job.tasks.map((item, index) => (
                      <span className='flex gap-[2px]' key={index}>
                        <div className='text-[#F97316]'>{item.name}</div>
                        <div className='text-[#9cafa9]'> (x{item.quantity})</div>
                      </span>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-center">{job.numberOfWorkOrders}</TableCell>
                {isAdmin && <TableCell className="text-right">{renderActions(job)}</TableCell>}
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
