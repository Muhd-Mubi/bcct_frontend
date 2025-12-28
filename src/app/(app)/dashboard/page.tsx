'use client';

import React, { useState, useEffect, useContext } from 'react';
import { Card } from '@/components/ui/card';
import { MetricCard } from '@/components/dashboard/metric-card';
import { InventoryTable } from '@/components/dashboard/inventory-table';
import { SensorGraphs } from '@/components/dashboard/sensor-graphs';
import { InventoryCompositionChart } from '@/components/dashboard/inventory-composition-chart';
import { AlertsPanel } from '@/components/dashboard/alerts-panel';
import { ReorderSuggestions } from '@/components/dashboard/reorder-suggestions';
import { useData } from '@/context/data-context';
import { Package, AlertTriangle, FileText, Box, ClipboardList } from 'lucide-react';
import { UserRoleContext } from '@/lib/types';
import Link from 'next/link';

export default function DashboardPage() {
  const { materials, updateMaterialStock, orders } = useData();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const interval = setInterval(() => {
      // Simulate stock change for a random material
      if (materials.length > 0) {
          const randomIndex = Math.floor(Math.random() * materials.length);
          const materialToUpdate = materials[randomIndex];
          const change = (Math.random() - 0.5) * (materialToUpdate.maxStock * 0.01); // change up to 1% of max stock
          updateMaterialStock(materialToUpdate._id, change);
      }
    }, 60000); // Update every 1 minute to simulate real-time data

    return () => clearInterval(interval);
  }, [materials, updateMaterialStock]);

  const totalPaperSheets = materials
    .filter((m) => m.category === 'Paper')
    .reduce((acc, m) => acc + m.currentStock, 0);

  const totalCardboardItems = materials
    .filter((m) => m.category === 'Cardboard')
    .reduce((acc, m) => acc + m.currentStock, 0);
    
  const lowStockItems = materials.filter(
    (m) => (m.currentStock / m.maxStock) * 100 < m.reorderThreshold
  );

  const pendingOrders = orders.filter(o => o.status === 'Pending').length;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <MetricCard
          title="Total Materials"
          value={materials.length}
          icon={<Package className="size-6 text-muted-foreground" />}
        />
        <MetricCard
          title="Paper Stock (Sheets)"
          value={totalPaperSheets.toLocaleString()}
          icon={<FileText className="size-6 text-muted-foreground" />}
        />
        <MetricCard
          title="Cardboard Stock (Units)"
          value={totalCardboardItems.toLocaleString()}
          icon={<Box className="size-6 text-muted-foreground" />}
        />
         <Link href="/orders">
            <MetricCard
            title="Pending Orders"
            value={pendingOrders}
            icon={<ClipboardList className="size-6 text-muted-foreground" />}
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
            <InventoryTable materials={materials} isClient={isClient} />
          </Card>
          <SensorGraphs />
          <InventoryCompositionChart materials={materials} />
        </div>
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
          <AlertsPanel lowStockItems={lowStockItems} />
          <ReorderSuggestions materials={materials} />
        </div>
      </div>
    </div>
  );
}
