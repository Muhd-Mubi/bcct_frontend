'use client';

import React from 'react';
import Link from 'next/link';
import { MetricCard } from '@/components/dashboard/metric-card';
import { useData } from '@/context/data-context';
import { ClipboardList, Package, CircleDot, CheckCircle2 } from 'lucide-react';
import { InventoryTable } from './inventory-table';
import { Card } from '../ui/card';
import { SensorGraphs } from './sensor-graphs';
import { InventoryCompositionChart } from './inventory-composition-chart';
import { ReorderSuggestions } from './reorder-suggestions';
import { AlertsPanel } from './alerts-panel';

export default function TechnicalDashboard() {
  const { materials, workOrders } = useData();

  const assignedWorkOrders = workOrders; // Assuming all are assigned for now
  const pendingCount = assignedWorkOrders.filter(
    (wo) => wo.status === 'Pending'
  ).length;
  const inProgressCount = assignedWorkOrders.filter(
    (wo) => wo.status === 'In Progress'
  ).length;
  const completedCount = assignedWorkOrders.filter(
    (wo) => wo.status === 'Completed'
  ).length;

  const lowStockItems = materials.filter(
    (m) => (m.currentStock / m.maxStock) * 100 < m.reorderThreshold
  );

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/work-order?status=Pending">
          <MetricCard
            title="Pending Work Orders"
            value={pendingCount}
            icon={<ClipboardList className="size-6 text-muted-foreground" />}
          />
        </Link>
        <Link href="/work-order?status=In Progress">
          <MetricCard
            title="In Progress"
            value={inProgressCount}
            icon={<CircleDot className="size-6 text-muted-foreground" />}
          />
        </Link>
        <Link href="/work-order?status=Completed">
          <MetricCard
            title="Completed Today"
            value={completedCount}
            icon={<CheckCircle2 className="size-6 text-muted-foreground" />}
          />
        </Link>
        <MetricCard
          title="Total Materials"
          value={materials.length}
          icon={<Package className="size-6 text-muted-foreground" />}
        />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
          <Card>
            <InventoryTable materials={materials} isClient={true} />
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
