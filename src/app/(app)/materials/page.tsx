'use client';

import React, { useState, useContext } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MaterialsTable } from '@/components/materials/materials-table';
import { Material } from '@/lib/types';
import { MaterialFormDialog } from '@/components/materials/material-form-dialog';
import { UserRoleContext } from '@/lib/types';
import { useData } from '@/context/data-context';

export default function MaterialsPage() {
  const { materials, saveMaterial, deleteMaterial } = useData();
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
    deleteMaterial(id);
  };

  const handleSave = (materialData: Omit<Material, '_id'> | Material) => {
    saveMaterial(materialData);
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
