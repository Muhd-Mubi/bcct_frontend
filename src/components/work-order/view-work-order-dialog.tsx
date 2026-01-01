'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { WorkOrder, WorkOrderPriority, WorkOrderStatus } from '@/lib/types';
import { format, parseISO } from 'date-fns';

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

export function ViewWorkOrderDialog({ isOpen, onOpenChange, workOrder }: ViewWorkOrderDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">Work Order Details</DialogTitle>
          <DialogDescription>
            Complete information for Job Order ID: {workOrder.jobId}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Date Created:</span>
            <span className="font-medium">{format(parseISO(workOrder.date), 'PPP')}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Priority:</span>
            <Badge variant={priorityVariant[workOrder.priority]}>{workOrder.priority}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Status:</span>
            <Badge variant={statusVariant[workOrder.status]}>{workOrder.status}</Badge>
          </div>
           <div className="space-y-2">
            <h4 className="font-medium text-muted-foreground">Included Items</h4>
            <ul className="list-disc list-inside space-y-1 rounded-md border p-3 bg-muted/50">
              {workOrder.items && workOrder.items.map((item, index) => (
                <li key={index}>{item.name} (Quantity: {item.quantity})</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-muted-foreground">Description</h4>
            <p className="p-3 bg-muted/50 rounded-md border text-foreground">
              {workOrder.description || 'No description provided.'}
            </p>
          </div>
          {workOrder.materialsUsed && workOrder.materialsUsed.length > 0 && (
             <div className="space-y-2">
                <h4 className="font-medium text-muted-foreground">Materials Used</h4>
                 <ul className="list-disc list-inside space-y-1 rounded-md border p-3 bg-muted/50">
                  {workOrder.materialsUsed.map((material) => (
                    <li key={material.materialId}>{material.materialName} (Quantity: {material.quantity})</li>
                  ))}
                </ul>
             </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
