import React from 'react';
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

export function InventoryTable({ materials }: { materials: Material[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Material Type</TableHead>
          <TableHead>Quality</TableHead>
          <TableHead className="text-right">Weight (kg)</TableHead>
          <TableHead className="text-right">Height (cm)</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last Updated</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {materials.map((material) => {
          const stockPercentage = (material.currentStock / material.maxStock) * 100;
          const quality = getQualityStatus(stockPercentage);
          const liveStatus = getLiveStatus(stockPercentage, material.reorderThreshold);
          const weight = material.currentStock * material.unitWeight;
          const height = material.currentStock * material.unitHeight;
          
          return (
            <TableRow key={material.id}>
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
              <TableCell className="text-right">{weight.toFixed(2)}</TableCell>
              <TableCell className="text-right">{height.toFixed(2)}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {statusConfig[liveStatus].icon}
                  {liveStatus}
                </div>
              </TableCell>
              <TableCell>
                {format(parseISO(material.lastUpdated), "PPp")}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
