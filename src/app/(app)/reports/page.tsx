'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useData } from '@/context/data-context';
import { StockLedgerEntry } from '@/lib/types';
import { StockReportTable } from '@/components/reports/stock-report-table';

export default function ReportsPage() {
  const { materials, onloadings, workOrders, measurements } = useData();
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);

  const stockLedger = useMemo(() => {
    if (!selectedMaterialId) return [];

    const material = materials.find(m => m._id === selectedMaterialId);
    if (!material) return [];

    const measurement = measurements.find(m => m.name === material.type);
    const sheetsPerUnit = measurement?.sheetsPerUnit || 1;

    const onboardingEntries: StockLedgerEntry[] = onloadings
      .flatMap(o => o.papers.map(p => ({ ...p, onloading: o })))
      .filter(p => p.paperType === material.name && !p.onloading.isReverted)
      .map(p => {
        const totalSheets = p.unitQuantity * sheetsPerUnit;
        return {
          date: p.onloading.date,
          materialName: material.name,
          source: 'Onboarding',
          jobId: p.onloading.supplier,
          change: totalSheets,
          unitQuantity: p.unitQuantity,
          amount: p.amount,
        };
      });
      
    const workOrderEntries: StockLedgerEntry[] = workOrders
        .filter(wo => wo.status === 'Completed' && wo.materialsUsed)
        .flatMap(wo => 
            wo.materialsUsed!.map(mu => ({ ...mu, workOrder: wo }))
        )
        .filter(mu => mu.materialId === selectedMaterialId)
        .map(mu => ({
            date: mu.workOrder.date,
            materialName: material.name,
            source: 'Work Order',
            jobId: mu.workOrder.jobId,
            change: -mu.quantity,
            unitQuantity: Math.floor(-mu.quantity / sheetsPerUnit),
            amount: 0, // No cost associated with work order usage in this context
        }));

    const allEntries = [...onboardingEntries, ...workOrderEntries].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    let runningStock = material.currentStock + allEntries.reduce((acc, entry) => acc - entry.change, 0);

    return allEntries.map(entry => {
      const updatedStock = runningStock + entry.change;
      runningStock = updatedStock;
      return { ...entry, updatedStock };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  }, [selectedMaterialId, materials, onloadings, workOrders, measurements]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Stock Reports</h1>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Material Stock Ledger</CardTitle>
          <div className="pt-4">
             <Select onValueChange={setSelectedMaterialId}>
                <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Select a material to view its ledger" />
                </SelectTrigger>
                <SelectContent>
                    {materials.map(material => (
                        <SelectItem key={material._id} value={material._id}>
                            {material.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
            {selectedMaterialId ? (
                <StockReportTable data={stockLedger} />
            ) : (
                <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Please select a material to see its report.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
