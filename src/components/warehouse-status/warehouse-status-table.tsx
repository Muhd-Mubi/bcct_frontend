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
import { useData } from '@/context/data-context';

export function WarehouseStatusTable({ materials }: { materials: Material[] }) {
  const { measurements } = useData();

  const getUnitInfo = (material: Material) => {
    const measurement = measurements.find(m => m.name === material.type);
    if (!measurement || measurement.sheetsPerUnit === 0) {
      return { units: 'N/A', extraSheets: material.currentStock };
    }

    const sheetsPerUnit = measurement.sheetsPerUnit;
    const totalUnits = Math.floor(material.currentStock / sheetsPerUnit);
    const extraSheets = material.currentStock % sheetsPerUnit;
    
    let unitLabel = '';
    if (material.type.toLowerCase() === 'rim') {
        unitLabel = 'rm';
    } else if (material.type.toLowerCase() === 'packet') {
        unitLabel = 'p';
    }

    return {
      units: `${totalUnits} ${unitLabel}`,
      extraSheets: extraSheets,
    };
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Material Type</TableHead>
            <TableHead className="text-right">Units</TableHead>
            <TableHead className="text-right">Extra Sheets</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((material) => {
            const { units, extraSheets } = getUnitInfo(material);
            return (
              <TableRow key={material._id}>
                <TableCell className="font-medium">{material.name}</TableCell>
                <TableCell className="text-right">{units}</TableCell>
                <TableCell className="text-right">{extraSheets}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
