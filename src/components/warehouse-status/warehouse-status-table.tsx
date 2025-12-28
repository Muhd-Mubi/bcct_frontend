'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Material } from '@/lib/types';
import { Progress } from '@/components/ui/progress';
import { useData } from '@/context/data-context';


export function WarehouseStatusTable({ materials }: { materials: Material[] }) {
  const { measurements } = useData();

  const getRims = (material: Material) => {
    const measurement = measurements.find(m => m.name === 'Rim');
    if (!measurement || material.type !== 'Rim') return 'N/A';
    const sheetsPerRim = measurement.sheetsPerUnit;
    return (material.currentStock / sheetsPerRim).toFixed(2);
  }

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Material Type</TableHead>
            <TableHead className="text-right">Sheets</TableHead>
            <TableHead className="text-right">Rims/Units</TableHead>
            <TableHead>Stock Level</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((material) => {
            const stockPercentage = (material.currentStock / material.maxStock) * 100;
            const units = getRims(material);

            return (
              <TableRow key={material.id}>
                <TableCell className="font-medium">{material.name}</TableCell>
                <TableCell className="text-right">{material.currentStock.toLocaleString()}</TableCell>
                <TableCell className="text-right">{units}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 min-w-[150px]">
                    <Progress value={stockPercentage} className="w-full" />
                    <span className="text-xs text-muted-foreground">{stockPercentage.toFixed(1)}%</span>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
