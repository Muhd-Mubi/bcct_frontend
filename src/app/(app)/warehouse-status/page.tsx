'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { initialMaterials, Material } from '@/lib/data';
import { WarehouseStatusTable } from '@/components/warehouse-status/warehouse-status-table';

export default function WarehouseStatusPage() {
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);

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
          <WarehouseStatusTable materials={materials.filter(m => m.type === 'Paper')} />
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
          <WarehouseStatusTable materials={materials.filter(m => m.type === 'Cardboard')} />
        </CardContent>
      </Card>
    </div>
  );
}
