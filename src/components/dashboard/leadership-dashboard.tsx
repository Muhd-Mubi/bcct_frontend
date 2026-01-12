'use client';

import React from 'react';
import { MetricCard } from '@/components/dashboard/metric-card';
import { useData } from '@/context/data-context';
import {
  Package,
  AlertTriangle,
  ClipboardList,
  Briefcase,
} from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { WorkOrdersTable } from '../work-order/work-orders-table';
import { ReorderSuggestions } from './reorder-suggestions';
import { AlertsPanel } from './alerts-panel';
import { SensorGraphs } from './sensor-graphs';
import { InventoryCompositionChart } from './inventory-composition-chart';
import { useGeMaterialsCount } from '@/api/react-query/queries/material';
import { useGetJobsCount } from '@/api/react-query/queries/jobOrder';
import { useGetWorkOrderCounts } from '@/api/react-query/queries/workOrder';

export default function LeadershipDashboard() {
  const {
    materials,
    workOrders,
    jobOrders,
    updateWorkOrderStatus,
    markWorkOrderAsComplete,
    deleteWorkOrder,
    revertWorkOrderCompletion,
  } = useData();

  const { data: materialCountData,
    isLoading: isloadingMaterialCount,
    error: errorFetchingMaterialCount } = useGeMaterialsCount();
  const { data: workOrderCountData,
    isLoading: isLoadingWorkOrderCount,
    error: errorFetchingWorkOrderCount } = useGetWorkOrderCounts();
  const { data: jobCountData,
    isLoading: isloadingJobCount,
    error: errorFetchingJobCount } = useGetJobsCount();

  const lowStockItems = materials.filter(
    (m) => (m.currentStock / m.maxStock) * 100 < m.reorderThreshold
  );

  const activeWorkOrders = workOrders.filter(
    (o) => o.status === 'Pending' || o.status === 'In Progress'
  );

  // Dummy functions for WorkOrdersTable props - these actions are handled on the work-order page
  const handleStatusChange = () => { };
  const handleView = () => { };
  const handleEdit = () => { };
  const handleDelete = () => { };
  const handleRevert = () => { };

  const workOrderCounts = workOrderCountData?.data

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Materials"
          value={isloadingMaterialCount ? "Loading" : errorFetchingMaterialCount ? "Error" : materialCountData?.count}
          icon={<Package className="size-6 text-muted-foreground" />}
        />
        <Link href="/work-order">
          <MetricCard
            title="Active Work Orders"
            value={isLoadingWorkOrderCount ? "Loading" : errorFetchingWorkOrderCount ? "Error" : workOrderCounts["pending"] + workOrderCounts["in progress"]}
            icon={<ClipboardList className="size-6 text-muted-foreground" />}
          />
        </Link>
        <Link href="/job-orders">
          <MetricCard
            title="Total Job Orders"
            value={isloadingJobCount ? "Loading" : errorFetchingJobCount ? "Error" : jobCountData?.count}
            icon={<Briefcase className="size-6 text-muted-foreground" />}
          />
        </Link>
        <MetricCard
          title="Low Stock Alerts"
          value={lowStockItems.length}
          icon={<AlertTriangle className="size-6 text-destructive" />}
          variant={lowStockItems.length > 0 ? 'destructive' : 'default'}
        />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Work Orders Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <WorkOrdersTable
                workOrders={activeWorkOrders}
                onStatusChange={handleStatusChange}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRevert={handleRevert}
              />
            </CardContent>
          </Card>
          {/* <InventoryCompositionChart materials={materials} /> */}
          {/* <SensorGraphs /> */}
        </div>
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
          <AlertsPanel lowStockItems={lowStockItems} />
          {/* <ReorderSuggestions materials={materials} /> */}
        </div>
      </div>
    </>
  );
}
