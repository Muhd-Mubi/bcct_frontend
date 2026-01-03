'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { WorkOrder, WorkOrderPriority, WorkOrderStatus } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { useData } from '@/context/data-context';
import { AlertCircle } from 'lucide-react';

const statusVariant: Record<
  WorkOrderStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  Pending: 'destructive',
  'In Progress': 'secondary',
  Completed: 'default',
};

const priorityVariant: Record<
  WorkOrderPriority,
  'default' | 'secondary' | 'destructive'
> = {
  High: 'destructive',
  Medium: 'secondary',
  Low: 'default',
};

export default function WorkOrderViewerPage() {
  const searchParams = useSearchParams();
  const { workOrders } = useData();
  const workOrderId = searchParams.get('id');

  const workOrder = workOrders.find((wo) => wo.id === workOrderId);

  if (!workOrder) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
          <AlertCircle className="size-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold font-headline">Work Order Not Found</h1>
        <p className="text-muted-foreground">
          Please select a work order from the list to view its details.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline">
            Work Order Details
          </h1>
          <p className="text-muted-foreground">
            Read-only view for Work Order: {workOrder.id}
          </p>
        </div>
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <div className="flex items-center gap-2">
            <span className="font-medium">Status:</span>
            <Badge variant={statusVariant[workOrder.status]}>
              {workOrder.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Priority:</span>
            <Badge variant={priorityVariant[workOrder.priority]}>
              {workOrder.priority}
            </Badge>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Work Order: {workOrder.id}</CardTitle>
          <CardDescription>
            Associated with Job ID:{' '}
            <strong>{workOrder.jobId}</strong> | Created on:{' '}
            {format(parseISO(workOrder.date), 'PPP')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <h4 className="font-semibold font-headline">Description</h4>
            <p className="text-sm p-4 bg-muted/50 rounded-lg border">
              {workOrder.description || 'No description provided.'}
            </p>
          </div>

          <Separator />

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold font-headline">Tasks</h4>
              <ul className="space-y-2 text-sm list-disc list-inside p-4 bg-muted/50 rounded-lg border">
                {workOrder.items.map((item, index) => (
                  <li key={index}>
                    <span className="font-medium">{item.name}</span> -
                    Quantity:{' '}
                    <span className="font-mono">
                      {item.quantity.toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold font-headline">Materials Used</h4>
              {workOrder.materialsUsed &&
              workOrder.materialsUsed.length > 0 ? (
                <ul className="space-y-2 text-sm list-disc list-inside p-4 bg-muted/50 rounded-lg border">
                  {workOrder.materialsUsed.map((material, index) => (
                    <li key={index}>
                      <span className="font-medium">
                        {material.materialName}
                      </span>{' '}
                      - Quantity Used:{' '}
                      <span className="font-mono">
                        {material.quantity.toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="flex items-center justify-center h-full p-4 bg-muted/50 rounded-lg border">
                  <p className="text-sm text-muted-foreground">
                    No materials have been used for this order yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
