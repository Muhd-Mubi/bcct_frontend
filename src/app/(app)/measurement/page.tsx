'use client';

import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MeasurementTable } from '@/components/measurement/measurement-table';
import { useData } from '@/context/data-context';
import { MeasurementFormDialog } from '@/components/measurement/measurement-form-dialog';
import { Measurement } from '@/lib/types';


export default function MeasurementPage() {
    const { measurements, saveMeasurement } = useData();
    const [isFormOpen, setFormOpen] = useState(false);
    const [selectedMeasurement, setSelectedMeasurement] = useState<Measurement | undefined>(undefined);

    const handleAdd = () => {
        setSelectedMeasurement(undefined);
        setFormOpen(true);
    };

    const handleSave = (measurement: Measurement) => {
        saveMeasurement(measurement);
        setFormOpen(false);
    };

    return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-headline">Measurements</CardTitle>
            <Button size="sm" onClick={handleAdd}>
              <PlusCircle />
              Add Measurement
            </Button>
        </CardHeader>
        <CardContent>
          <MeasurementTable
            data={measurements}
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
