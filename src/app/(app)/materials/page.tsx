'use client';

import React, { useState, useContext } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MaterialsTable } from '@/components/materials/materials-table';
import { initialMaterials, Material } from '@/lib/data';
import { MaterialFormDialog } from '@/components/materials/material-form-dialog';
import { UserRoleContext } from '@/lib/types';

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [isFormOpen, setFormOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | undefined>(undefined);
  const { isAdmin } = useContext(UserRoleContext);

  const handleAdd = () => {
    setSelectedMaterial(undefined);
    setFormOpen(true);
  };

  const handleEdit = (material: Material) => {
    setSelectedMaterial(material);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  const handleSave = (material: Material) => {
    if (selectedMaterial) {
      setMaterials((prev) =>
        prev.map((m) => (m.id === material.id ? material : m))
      );
    } else {
      setMaterials((prev) => [...prev, { ...material, id: `m${prev.length + 1}` }]);
    }
    setFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline">Inventory Materials</CardTitle>
          {isAdmin && (
            <Button size="sm" onClick={handleAdd}>
              <PlusCircle />
              Add Material
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <MaterialsTable
            data={materials}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

        <MaterialFormDialog
          isOpen={isFormOpen}
          onOpenChange={setFormOpen}
          onSave={handleSave}
          material={selectedMaterial}
        />
    </div>
  );
}
