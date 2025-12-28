'use client';

import React, { useState, useContext, useEffect } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MeasurementTable } from '@/components/measurement/measurement-table';
import { useData } from '@/context/data-context';
import { MeasurementFormDialog } from '@/components/measurement/measurement-form-dialog';
import { Measurement } from '@/lib/types';
import { UserRoleContext } from '@/lib/types';


export default function MeasurementPage() {
    const { measurements, setMeasurements, saveMeasurement, updateMeasurement } = useData();
    const [isFormOpen, setFormOpen] = useState(false);
    const [selectedMeasurement, setSelectedMeasurement] = useState<Measurement | undefined>(undefined);
    const { isAdmin } = useContext(UserRoleContext);
    
    const handleAdd = () => {
        setSelectedMeasurement(undefined);
        setFormOpen(true);
    };
    
    const handleEdit = (measurement: Measurement) => {
        setSelectedMeasurement(measurement);
        setFormOpen(true);
    };

    const handleSave = (measurementData: Measurement | Omit<Measurement, '_id'>) => {
        if ('_id' in measurementData) {
            updateMeasurement(measurementData);
        } else {
            saveMeasurement(measurementData);
        }
        setFormOpen(false);
    };

    return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline">Measurements</CardTitle>
            {isAdmin && (
                <Button size="sm" onClick={handleAdd}>
                  <PlusCircle />
                  Add Measurement
                </Button>
            )}
        </CardHeader>
        <CardContent>
          <MeasurementTable
            data={measurements}
            onEdit={handleEdit}
          />
        </CardContent>
      </Card>

      <MeasurementFormDialog
        isOpen={isFormOpen}
        onOpenChange={setFormOpen}
        onSave={handleSave}
        measurement={selectedMeasurement}
       />

    </div>
    );
}
