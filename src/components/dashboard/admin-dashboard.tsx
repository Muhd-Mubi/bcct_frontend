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
import { useGeMaterialsCount, useGetDashboardMaterials, useGetLowStockMaterial } from '@/api/react-query/queries/material';
import { useGetJobsCount } from '@/api/react-query/queries/jobOrder';
import { useGetWorkOrderCounts } from '@/api/react-query/queries/workOrder';

export default function AdminDashboard() {
  const { data: materialCountData,
    isLoading: isloadingMaterialCount,
    error: errorFetchingMaterialCount } = useGeMaterialsCount();
  const { data: workOrderCountData,
    isLoading: isLoadingWorkOrderCount,
    error: errorFetchingWorkOrderCount } = useGetWorkOrderCounts();
  const { data: jobCountData,
    isLoading: isloadingJobCount,
    error: errorFetchingJobCount } = useGetJobsCount();
  const { data: materialData,
    isLoading: isloadingMaterials,
    error: errorFetchingMaterials } = useGetDashboardMaterials();
  const { data: lowStockData,
    isLoading: isloadinglowStock,
    error: errorFetchingLowStock } = useGetLowStockMaterial();

  const workOrderCounts = workOrderCountData?.data
  const materials = materialData?.materials || []
  const lowStocks = lowStockData?.data || []

  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Materials"
          value={isloadingMaterialCount ? "Loading" : errorFetchingMaterialCount ? "Error" : materialCountData?.count}
          icon={<Package className="size-6 text-muted-foreground" />}
        />
        <MetricCard
          title="Work Orders Completed"
          value={isLoadingWorkOrderCount ? "Loading" : errorFetchingWorkOrderCount ? "Error" : workOrderCounts["completed"]}
          icon={<Box className="size-6 text-muted-foreground" />}
        />
        <Link href="/job-orders">
          <MetricCard
            title="Total Job Orders"
            value={isloadingJobCount ? "Loading" : errorFetchingJobCount ? "Error" : jobCountData?.count}
            icon={<Briefcase className="size-6 text-muted-foreground" />}
          />
        </Link>
        <MetricCard
          title="Low Stock Alerts"
          value={lowStocks?.length}
          icon={<AlertTriangle className="size-6 text-destructive" />}
          variant={lowStocks?.length > 0 ? 'destructive' : 'default'}
        />
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-9 flex flex-col gap-6">
          <Card>
            <InventoryTable materials={materials} isLoading={isloadingMaterials} isError={errorFetchingMaterials} />
          </Card>
          {/* <InventoryCompositionChart materials={materials} /> */}
          {/* <SensorGraphs /> */}
        </div>
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
          <AlertsPanel lowStockItems={lowStocks} isLoading={isloadinglowStock} isError={errorFetchingLowStock} />
        </div>
      </div>
    </>
  );
}
