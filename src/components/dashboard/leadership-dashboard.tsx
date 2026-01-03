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

  const lowStockItems = materials.filter(
    (m) => (m.currentStock / m.maxStock) * 100 < m.reorderThreshold
  );

  const pendingWorkOrders = workOrders.filter(
    (o) => o.status === 'Pending' || o.status === 'In Progress'
  ).length;

  // Dummy functions for WorkOrdersTable props - these actions are handled on the work-order page
  const handleStatusChange = () => {};
  const handleView = () => {};
  const handleEdit = () => {};
  const handleDelete = () => {};
  const handleRevert = () => {};

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Materials"
          value={materials.length}
          icon={<Package className="size-6 text-muted-foreground" />}
        />
        <Link href="/work-order">
          <MetricCard
            title="Active Work Orders"
            value={pendingWorkOrders}
            icon={<ClipboardList className="size-6 text-muted-foreground" />}
          />
        </Link>
        <Link href="/job-orders">
          <MetricCard
            title="Total Job Orders"
            value={jobOrders.length}
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
                    workOrders={workOrders}
                    onStatusChange={handleStatusChange}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onRevert={handleRevert}
                />
            </CardContent>
          </Card>
          <InventoryCompositionChart materials={materials} />
          <SensorGraphs />
        </div>
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
          <AlertsPanel lowStockItems={lowStockItems} />
          <ReorderSuggestions materials={materials} />
        </div>
      </div>
    </>
  );
}
