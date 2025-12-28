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
    if (material.category !== 'Paper') return 'N/A';
    const measurement = measurements.find(m => m.type === 'Rim');
    const sheetsPerRim = measurement ? measurement.sheetsPerUnit : 500;
    return (material.currentStock / sheetsPerRim).toFixed(2);
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Paper Type</TableHead>
            <TableHead className="text-right">Sheets</TableHead>
            <TableHead className="text-right">Rims</TableHead>
            <TableHead>Stock Level</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((material) => {
            const stockPercentage = (material.currentStock / material.maxStock) * 100;
            const rims = getRims(material);

            return (
              <TableRow key={material.id}>
                <TableCell className="font-medium">{material.name}</TableCell>
                <TableCell className="text-right">{material.currentStock.toLocaleString()}</TableCell>
                <TableCell className="text-right">{rims}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Progress value={stockPercentage} className="w-32" />
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
