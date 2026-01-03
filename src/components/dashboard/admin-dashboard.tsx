'use client';

import React from 'react';
import Link from 'next/link';
import { MetricCard } from '@/components/dashboard/metric-card';
import { useData } from '@/context/data-context';
import { Package, AlertTriangle, Box, ClipboardList, Briefcase } from 'lucide-react';
import { InventoryTable } from './inventory-table';
import { Card } from '../ui/card';
import { SensorGraphs } from './sensor-graphs';
import { InventoryCompositionChart } from './inventory-composition-chart';
import { AlertsPanel } from './alerts-panel';

export default function AdminDashboard() {
  const { materials, workOrders, jobOrders } = useData();

  const lowStockItems = materials.filter(
    (m) => (m.currentStock / m.maxStock) * 100 < m.reorderThreshold
  );

  const totalStock = materials.reduce((acc, m) => acc + m.currentStock, 0);
  const pendingWorkOrders = workOrders.filter(
    (o) => o.status === 'Pending' || o.status === 'In Progress'
  ).length;

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Materials"
          value={materials.length}
          icon={<Package className="size-6 text-muted-foreground" />}
        />
        <MetricCard
          title="Total Stock (Sheets)"
          value={totalStock.toLocaleString()}
          icon={<Box className="size-6 text-muted-foreground" />}
        />
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
            <InventoryTable materials={materials} />
          </Card>
          <InventoryCompositionChart materials={materials} />
          <SensorGraphs />
        </div>
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
          <AlertsPanel lowStockItems={lowStockItems} />
        </div>
      </div>
    </>
  );
}
