import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Material, QualityStatus, LiveStatus } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { sheetToUnitConverter } from './alerts-panel';

const getQualityStatus = (stockPercentage: number): QualityStatus => {
  if (stockPercentage < 10) return 'Very Low';
  if (stockPercentage < 30) return 'Low';
  return 'Good';
};

const getLiveStatus = (
  stockPercentage: number,
  reorderThreshold: number
): LiveStatus => {
  if (stockPercentage < reorderThreshold) return 'Low';
  if (stockPercentage < reorderThreshold + 10) return 'Near Low';
  return 'Normal';
};

const statusConfig: Record<
  LiveStatus,
  { color: string; icon: React.ReactNode }
> = {
  Normal: {
    color: 'bg-green-500',
    icon: <div className="h-2 w-2 rounded-full bg-green-500" />,
  },
  'Near Low': {
    color: 'bg-yellow-500',
    icon: <div className="h-2 w-2 rounded-full bg-yellow-500" />,
  },
  Low: {
    color: 'bg-red-500',
    icon: <div className="h-2 w-2 rounded-full bg-red-500" />,
  },
};

export function InventoryTable({ materials, isLoading = false, isError = false }: { materials: Material[], isLoading?: boolean, isError?: boolean }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="overflow-x-auto">
      {isLoading ? "Loading" : isError ? "Error" : <>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Material Name</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead className="text-right">Current Stock</TableHead>
              <TableHead>Threshold</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {materials.map((material) => {
              const totalSheets = material?.totalSheets
              const sheetsPerUnit = material?.sheetsPerUnit
              const thresholdUnits = material?.thresholdUnits
              const thresholdSheets = thresholdUnits * sheetsPerUnit
              const { unitQuantity, extraSheets } = sheetToUnitConverter({ totalSheets, sheetsPerUnit })

              const stockPercentage = (material.currentStock / material.maxStock) * 100;
              const quality = totalSheets > thresholdSheets ? "Good" : "low"
              const liveStatus = getLiveStatus(stockPercentage, material.reorderThreshold);
              const currentStock = `${unitQuantity} units, ${extraSheets} sheets`

              return (
                <TableRow key={material._id}>
                  <TableCell className="font-medium">{material.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        quality === 'Good'
                          ? 'secondary'
                          : quality === 'Low'
                            ? 'outline'
                            : 'destructive'
                      }
                    >
                      {quality}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-xs">{currentStock}</TableCell>
                  <TableCell className='text-xs'>
                    {thresholdUnits + ' units'}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </>}

    </div>
  );
}
