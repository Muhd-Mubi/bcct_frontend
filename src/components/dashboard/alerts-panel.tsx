import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Bell, AlertTriangle } from 'lucide-react';
import { Material } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AlertsPanelProps {
  lowStockItems: Material[];
  isLoading?: boolean
  isError?: boolean
}
export const sheetToUnitConverter = ({ sheetsPerUnit = 1, totalSheets = 1 }) => {
  const unitQuantity = Math.floor(totalSheets / sheetsPerUnit);
  const extraSheets = totalSheets - (unitQuantity * sheetsPerUnit)
  return { unitQuantity, extraSheets };
}

export function AlertsPanel({ lowStockItems, isLoading = false, isError = false }: AlertsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Bell className="size-5" />
          Low-Stock Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[150px] overflow-y-auto">
          {isLoading ? "Loading" : isError ? "Error" : lowStockItems.length > 0 ? (
            <ul className="space-y-3">
              {lowStockItems.map((item) => {
                // const stockPercentage = ((item.currentStock / item.maxStock) * 100).toFixed(1);
                const { unitQuantity, extraSheets } = sheetToUnitConverter({
                  sheetsPerUnit: item?.measurementId?.sheetsPerUnit,
                  totalSheets: item?.totalSheets
                })
                const currentStock = `${unitQuantity} units, ${extraSheets} sheets`
                return (
                  <li key={item._id} className="flex items-start gap-3 text-sm">
                    <AlertTriangle className="size-4 text-destructive mt-1 shrink-0" />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-muted-foreground">
                        {currentStock}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <Bell className="size-8 mb-2" />
              <p>No active alerts.</p>
              <p className="text-xs">All stock levels are normal.</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
