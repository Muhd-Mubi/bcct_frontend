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
import { useGetMeasurements, useCreateMeasurement, useEditMeasurement, useDeleteMeasurement } from '@/api/react-query/queries/measurement'
import { toast } from 'react-toastify';


export default function MeasurementPage() {
    const { measurements, materials, saveMeasurement, updateMeasurement } = useData();
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

    const { data, isLoading, error, refetch } = useGetMeasurements();
    const {
        mutate: createMeasurement,
        isPending: creatingMeasurement,
    } = useCreateMeasurement();
    const {
        mutate: editMeasurement,
        isPending: updatingMeasurement,
    } = useEditMeasurement();
    const {
        mutate: deleteMeasurement,
        isPending: deletingMeasurement,
    } = useDeleteMeasurement();

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
            const deletData = {
                id: measurementToDelete
            }
            deleteMeasurement(deletData, {
                onSuccess: (data) => {
                    toast.success(data.message);
                    refetch()
                    closeDeleteModal()
                },
                onError: (error) => {
                    toast.error(error.message);
                },
            })
        } else {
            closeDeleteModal()
        }
    };

    const closeCreateEditModal = () => {
        setFormOpen(false);
        setSelectedMeasurement(undefined);
    }

    const closeDeleteModal = () => {
        setConfirmOpen(false);
        setMeasurementToDelete(null);
    }

    const handleSave = (measurementData: Measurement) => {
        const isEdit = !!measurementData?._id

        if (isEdit) {
            const updatedData = {
                id: measurementData?._id,
                data: measurementData
            }
            editMeasurement(updatedData, {
                onSuccess: (data) => {
                    toast.success(data.message);
                    refetch()
                    closeCreateEditModal()
                },
                onError: (error) => {
                    toast.error(error.message);
                },
            })
        } else {
            const newData = {
                data: measurementData,
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

    // if (!isAdmin && !isLeadership) {
    //     return null;
    // }

    // const data = [
    //     {
    //         "_id": "695892a23726575a864a5013",
    //         "name": "Ream",
    //         "sheetsPerUnit": 500,
    //         "__v": 0,
    //         "numberOfMaterials": 2,
    //         "id": "695892a23726575a864a5013"
    //     },
    //     {
    //         "_id": "695a11be0a9c44dad40b8116",
    //         "name": "Packet",
    //         "sheetsPerUnit": 100,
    //         "__v": 0,
    //         "numberOfMaterials": 0,
    //         "id": "695a11be0a9c44dad40b8116"
    //     },
    //     {
    //         "_id": "695a11cc0a9c44dad40b8119",
    //         "name": "Single sheet",
    //         "sheetsPerUnit": 1,
    //         "__v": 0,
    //         "numberOfMaterials": 0,
    //         "id": "695a11cc0a9c44dad40b8119"
    //     }
    // ]

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>{error.message}</p>;

    const disableButtons = creatingMeasurement || updatingMeasurement || deletingMeasurement

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-headline">Measurements</CardTitle>
                    {/* {(isAdmin || isLeadership) && (
                        <Button size="sm" onClick={handleAdd}>
                            <PlusCircle />
                            Add Measurement
                        </Button>
                    )} */}
                    {true && (
                        <Button size="sm" onClick={handleAdd}>
                            <PlusCircle />
                            Add Measurement
                        </Button>
                    )}
                </CardHeader>
                <CardContent>
                    <MeasurementTable
                        data={data?.measurements || []}
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
                disableButtons={disableButtons}
            />

            <DeleteConfirmationDialog
                isOpen={isConfirmOpen}
                onCancel={closeDeleteModal}
                onConfirm={handleConfirmDelete}
                disableButtons={disableButtons}
            />

        </div>
    );
}
