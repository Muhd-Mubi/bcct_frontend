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
}

export function AlertsPanel({ lowStockItems }: AlertsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Bell className="size-5" />
          Low-Stock Alerts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[150px]">
          {lowStockItems.length > 0 ? (
            <ul className="space-y-3">
              {lowStockItems.map((item) => {
                const stockPercentage = ((item.currentStock / item.maxStock) * 100).toFixed(1);
                return (
                  <li key={item.id} className="flex items-start gap-3 text-sm">
                    <AlertTriangle className="size-4 text-destructive mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-muted-foreground">
                        Stock at {stockPercentage}%
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
