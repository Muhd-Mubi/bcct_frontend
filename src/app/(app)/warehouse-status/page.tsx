'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { WarehouseStatusTable } from '@/components/warehouse-status/warehouse-status-table';
import { useData } from '@/context/data-context';
import { Input } from '@/components/ui/input';

export default function WarehouseStatusPage() {
  const { materials } = useData();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMaterials = materials.filter(material =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Inventory</h1>
      <Card>
        <CardHeader>
          <CardTitle>Inventory Status</CardTitle>
          <CardDescription>
            Current quantities of all materials in the warehouse.
          </CardDescription>
          <Input
            placeholder="Search for a specific material..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </CardHeader>
        <CardContent>
          <WarehouseStatusTable materials={filteredMaterials} />
        </CardContent>
      </Card>
    </div>
  );
}
