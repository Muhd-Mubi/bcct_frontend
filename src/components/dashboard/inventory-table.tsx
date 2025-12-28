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

export function InventoryTable({ materials, isClient }: { materials: Material[], isClient: boolean }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Material Name</TableHead>
            <TableHead>Quality</TableHead>
            <TableHead className="text-right">Current Stock</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {materials.map((material) => {
            const stockPercentage = (material.currentStock / material.maxStock) * 100;
            const quality = getQualityStatus(stockPercentage);
            const liveStatus = getLiveStatus(stockPercentage, material.reorderThreshold);
            
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
                <TableCell className="text-right">{Math.round(material.currentStock).toLocaleString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {statusConfig[liveStatus].icon}
                    {liveStatus}
                  </div>
                </TableCell>
                <TableCell>
                  {isClient ? format(parseISO(material.lastUpdated), "PPp") : 'Loading...'}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
