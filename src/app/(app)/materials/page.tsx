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
import { DeleteConfirmationDialog } from '@/components/materials/delete-confirmation-dialog';

export default function MaterialsPage() {
  const { materials, saveMaterial, deleteMaterial } = useData();
  const [isFormOpen, setFormOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | undefined>(undefined);
  const [materialToDelete, setMaterialToDelete] = useState<string | null>(null);
  const { isLeadership, isTechnical } = useContext(UserRoleContext);

  const canAdd = isLeadership || isTechnical;

  const handleAdd = () => {
    setSelectedMaterial(undefined);
    setFormOpen(true);
  };

  const handleEdit = (material: Material) => {
    setSelectedMaterial(material);
    setFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setMaterialToDelete(id);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (materialToDelete) {
      deleteMaterial(materialToDelete);
    }
    setConfirmOpen(false);
    setMaterialToDelete(null);
  };

  const handleSave = (materialData: Omit<Material, '_id'> | Material) => {
    saveMaterial(materialData);
    setFormOpen(false);
  };

  const data = [
    {
      "_id": "695896020cb268e7e9c60845",
      "name": "A4",
      "measurement": "Ream",
      "unitQuantity": 1,
      "extraSheets": 22
    },
    {
      "_id": "695896900cb268e7e9c60852",
      "name": "A3",
      "measurement": "Ream",
      "unitQuantity": 1,
      "extraSheets": 236
    }
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline">Inventory</CardTitle>
          {canAdd && (
            <Button size="sm" onClick={handleAdd}>
              <PlusCircle />
              Add Material
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <MaterialsTable
            data={data || []}
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

      <DeleteConfirmationDialog
        isOpen={isConfirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
