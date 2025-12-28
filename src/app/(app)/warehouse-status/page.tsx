'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WarehouseStatusTable } from '@/components/warehouse-status/warehouse-status-table';
import { useData } from '@/context/data-context';

export default function WarehouseStatusPage() {
  const { materials } = useData();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Warehouse Status</h1>
      <Card>
        <CardHeader>
          <CardTitle>Paper Inventory</CardTitle>
          <CardDescription>
            Current quantities of all paper materials in the warehouse.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WarehouseStatusTable materials={materials.filter(m => m.category === 'Paper')} />
        </CardContent>
      </Card>
       <Card>
        <CardHeader>
          <CardTitle>Cardboard Inventory</CardTitle>
           <CardDescription>
            Current quantities of all cardboard materials in the warehouse.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WarehouseStatusTable materials={materials.filter(m => m.category === 'Cardboard')} />
        </CardContent>
      </Card>
    </div>
  );
}
