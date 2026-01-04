'use client';

import React, { useState, useContext, useMemo, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MeasurementTable } from '@/components/measurement/measurement-table';
import { useData } from '@/context/data-context';
import { MeasurementFormDialog } from '@/components/measurement/measurement-form-dialog';
import { Measurement } from '@/lib/types';
import { UserRoleContext } from '@/lib/types';
import { DeleteConfirmationDialog } from '@/components/materials/delete-confirmation-dialog';
import { useRouter } from 'next/navigation';


export default function MeasurementPage() {
    const { measurements, materials, saveMeasurement, updateMeasurement, deleteMeasurement } = useData();
    const { isAdmin, isLeadership } = useContext(UserRoleContext);
    const router = useRouter();

    useEffect(() => {
        if (!isAdmin && !isLeadership) {
            // router.push('/dashboard');
        }
    }, [isAdmin, isLeadership, router]);

    const [isFormOpen, setFormOpen] = useState(false);
    const [isConfirmOpen, setConfirmOpen] = useState(false);
    const [selectedMeasurement, setSelectedMeasurement] = useState<Measurement | undefined>(undefined);
    const [measurementToDelete, setMeasurementToDelete] = useState<string | null>(null);
    
    const measurementUsage = useMemo(() => {
        const counts: { [key: string]: number } = {};
        measurements.forEach(m => counts[m.name] = 0);
        materials.forEach(material => {
            if (counts[material.type] !== undefined) {
                counts[material.type]++;
            }
        });
        return counts;
    }, [measurements, materials]);
    
    const handleAdd = () => {
        setSelectedMeasurement(undefined);
        setFormOpen(true);
    };
    
    const handleEdit = (measurement: Measurement) => {
        setSelectedMeasurement(measurement);
        setFormOpen(true);
    };

    const handleDelete = (id: string) => {
        setMeasurementToDelete(id);
        setConfirmOpen(true);
    };

    const handleConfirmDelete = () => {
        if (measurementToDelete) {
            deleteMeasurement(measurementToDelete);
        }
        setConfirmOpen(false);
        setMeasurementToDelete(null);
    };

    const handleSave = (measurementData: Measurement | Omit<Measurement, '_id'>) => {
        if ('_id' in measurementData && measurementData._id) {
            updateMeasurement(measurementData as Measurement);
        } else {
            saveMeasurement(measurementData as Omit<Measurement, '_id'>);
        }
        setFormOpen(false);
    };
    
    // if (!isAdmin && !isLeadership) {
    //     return null;
    // }

    return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline">Measurements</CardTitle>
            {(isAdmin || isLeadership) && (
                <Button size="sm" onClick={handleAdd}>
                  <PlusCircle />
                  Add Measurement
                </Button>
            )}
        </CardHeader>
        <CardContent>
          <MeasurementTable
            data={measurements.filter(Boolean)}
            usage={measurementUsage}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>

      <MeasurementFormDialog
        isOpen={isFormOpen}
        onOpenChange={setFormOpen}
        onSave={handleSave}
        measurement={selectedMeasurement}
       />

        <DeleteConfirmationDialog 
            isOpen={isConfirmOpen}
            onOpenChange={setConfirmOpen}
            onConfirm={handleConfirmDelete}
        />

    </div>
    );
}
