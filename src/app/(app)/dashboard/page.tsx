'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { MetricCard } from '@/components/dashboard/metric-card';
import { InventoryTable } from '@/components/dashboard/inventory-table';
import { SensorGraphs } from '@/components/dashboard/sensor-graphs';
import { InventoryCompositionChart } from '@/components/dashboard/inventory-composition-chart';
import { AlertsPanel } from '@/components/dashboard/alerts-panel';
import { ReorderSuggestions } from '@/components/dashboard/reorder-suggestions';
import { initialMaterials, Material } from '@/lib/data';
import { Package, AlertTriangle, FileText, Box } from 'lucide-react';

export default function DashboardPage() {
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const interval = setInterval(() => {
      setMaterials((prevMaterials) =>
        prevMaterials.map((material) => {
          const change = (Math.random() - 0.5) * 1000; // Simulate stock change
          const newStock = Math.max(
            0,
            Math.min(material.maxStock, material.currentStock + change)
          );
          return {
            ...material,
            currentStock: newStock,
            lastUpdated: new Date().toISOString(),
          };
        })
      );
    }, 60000); // Update every 1 minute to simulate real-time data

    return () => clearInterval(interval);
  }, []);

  const totalPaperSheets = materials
    .filter((m) => m.type === 'Paper')
    .reduce((acc, m) => acc + m.currentStock, 0);

  const totalCardboardItems = materials
    .filter((m) => m.type === 'Cardboard')
    .reduce((acc, m) => acc + m.currentStock, 0);
    
  const lowStockItems = materials.filter(
    (m) => (m.currentStock / m.maxStock) * 100 < m.reorderThreshold
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Materials"
          value={materials.length}
          icon={<Package className="size-6 text-muted-foreground" />}
        />
        <MetricCard
          title="Approx. Paper Sheets"
          value={totalPaperSheets.toLocaleString()}
          icon={<FileText className="size-6 text-muted-foreground" />}
        />
        <MetricCard
          title="Approx. Cardboard Items"
          value={totalCardboardItems.toLocaleString()}
          icon={<Box className="size-6 text-muted-foreground" />}
        />
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
