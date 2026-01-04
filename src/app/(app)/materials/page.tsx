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
import { useGetMeasurements } from '@/api/react-query/queries/measurement'
import { useGeMaterials, useCreateMaterial, useEditMaterial } from '@/api/react-query/queries/material'
import { toast } from 'react-toastify';

export default function MaterialsPage() {
  const { materials, saveMaterial, deleteMaterial } = useData();
  const [isFormOpen, setFormOpen] = useState(false);
  const [isConfirmOpen, setConfirmOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | undefined>(undefined);
  const [materialToDelete, setMaterialToDelete] = useState<string | null>(null);
  const { isLeadership, isTechnical } = useContext(UserRoleContext);

  const { data: measurementData, isLoading: isLoadingMeasurement, error: isErrorMeasurement } = useGetMeasurements();
  const { data, isLoading, error, refetch } = useGeMaterials();
  const {
    mutate: createMeasurement,
    isPending: creatingMeasurement,
  } = useCreateMaterial();
  const {
    mutate: editMeasurement,
    isPending: editingMeasurement,
  } = useEditMaterial();

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

  const handleSave = (materialData: Material) => {
    const isEdit = materialData?._id
    if (isEdit) {
      const updatedData = {
        id: materialData?._id,
        data: materialData
      }
      editMeasurement(updatedData, {
        onSuccess: (data) => {
          toast.success(data.message);
          refetch()
          closeCreateEditModal();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      })
    } else {
      const newData = {
        data: materialData,
      }
      createMeasurement(newData, {
        onSuccess: (data) => {
          toast.success(data.message);
          refetch()
          closeCreateEditModal();
        },
        onError: (error) => {
          toast.error(error.message);
        },
      })
    }

  };

  const closeCreateEditModal = () => {
    setSelectedMaterial(undefined);
    setFormOpen(false);
  }

  // const data = [
  //   {
  //     "_id": "695896020cb268e7e9c60845",
  //     "name": "A4",
  //     "measurement": "Ream",
  //     "unitQuantity": 1,
  //     "extraSheets": 22
  //   },
  //   {
  //     "_id": "695896900cb268e7e9c60852",
  //     "name": "A3",
  //     "measurement": "Ream",
  //     "unitQuantity": 1,
  //     "extraSheets": 236
  //   }
  // ]

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>{error.message}</p>;

  const disableButtons = creatingMeasurement || editingMeasurement

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
            data={data?.materials || []}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <MaterialFormDialog
        isOpen={isFormOpen}
        onCLose={closeCreateEditModal}
        onSave={handleSave}
        material={selectedMaterial}
        disableButtons={disableButtons}
        measurementsList={measurementData?.measurements || []}
        loadingMeasurements={isLoadingMeasurement}
      />

      <DeleteConfirmationDialog
        isOpen={isConfirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
