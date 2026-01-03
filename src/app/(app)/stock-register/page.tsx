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
import { StockRegisterTable } from '@/components/stock-register/stock-register-table';

export default function StockRegisterPage() {
  const { materials, onloadings, workOrders, measurements } = useData();
  const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);

  const stockLedger = useMemo(() => {
    if (!selectedMaterialId) return [];

    const material = materials.find(m => m._id === selectedMaterialId);
    if (!material) return [];

    const measurement = measurements.find(m => m.name === material.type);
    const sheetsPerUnit = measurement?.sheetsPerUnit || 1;

    const formatStock = (totalSheets: number) => {
        if (sheetsPerUnit === 1) return { units: totalSheets, extraSheets: 0 };
        const units = Math.floor(totalSheets / sheetsPerUnit);
        const extraSheets = totalSheets % sheetsPerUnit;
        return { units, extraSheets };
    };

    const allEntries: Omit<StockLedgerEntry, 'stockBefore' | 'stockAfter'>[] = [];

    // Process Onboardings
    onloadings.forEach(onloading => {
        onloading.papers.forEach(paper => {
            if (paper.paperType === material.name) {
                const sheetChange = paper.unitQuantity * sheetsPerUnit;
                const unitPrice = paper.unitQuantity > 0 ? paper.amount / paper.unitQuantity : 0;

                if (onloading.isReverted) {
                    allEntries.push({
                        id: `${onloading.id}-${paper.paperType}`,
                        jobId: onloading.supplier,
                        type: 'ONBOARDING_REVERSAL',
                        unitQuantity: -paper.unitQuantity,
                        extraSheets: 0,
                        changeInSheets: -sheetChange,
                        date: onloading.date,
                        unitPrice: unitPrice,
                        totalPrice: -paper.amount,
                    });
                } else {
                    allEntries.push({
                        id: `${onloading.id}-${paper.paperType}`,
                        jobId: onloading.supplier,
                        type: 'ONBOARDING',
                        unitQuantity: paper.unitQuantity,
                        extraSheets: 0,
                        changeInSheets: sheetChange,
                        date: onloading.date,
                        unitPrice: unitPrice,
                        totalPrice: paper.amount,
                    });
                }
            }
        });
    });

    // Process Work Orders
    workOrders.forEach(wo => {
        if (wo.materialsUsed && wo.materialsUsed.length > 0) {
            wo.materialsUsed.forEach(mu => {
                if (mu.materialId === selectedMaterialId) {
                    if (wo.status === 'Completed') {
                         allEntries.push({
                            id: `${wo.id}-${mu.materialId}`,
                            jobId: wo.jobId,
                            workOrderId: wo.id,
                            type: 'WORK_ORDER',
                            unitQuantity: Math.floor(-mu.quantity / sheetsPerUnit),
                            extraSheets: -mu.quantity % sheetsPerUnit,
                            changeInSheets: -mu.quantity,
                            date: wo.date,
                            unitPrice: 0,
                            totalPrice: 0,
                        });
                    }
                }
            });
        }
    });

    // Sort entries by date descending
    allEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Calculate running stock
    let runningStockSheets = material.currentStock;
    const ledgerWithStock: StockLedgerEntry[] = [];

    allEntries.forEach(entry => {
        const stockAfterSheets = runningStockSheets;
        const stockBeforeSheets = runningStockSheets - entry.changeInSheets;

        ledgerWithStock.push({
            ...entry,
            stockBefore: formatStock(stockBeforeSheets),
            stockAfter: formatStock(stockAfterSheets),
        });

        runningStockSheets = stockBeforeSheets;
    });

    return ledgerWithStock;

  }, [selectedMaterialId, materials, onloadings, workOrders, measurements]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Stock Register</h1>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Material Stock Ledger</CardTitle>
          <div className="pt-4">
             <Select onValueChange={setSelectedMaterialId}>
                <SelectTrigger className="w-full md:w-[320px]">
                    <SelectValue placeholder="Select a material to view its stock register" />
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
                <StockRegisterTable data={stockLedger} />
            ) : (
                <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
                    <p className="text-muted-foreground">Please select a material to see its register.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
