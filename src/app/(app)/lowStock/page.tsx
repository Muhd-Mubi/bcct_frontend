'use client';

import React, { useState, useContext } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MaterialsTable } from '@/components/materials/materials-table';
import { useGetLowStockMaterial } from '@/api/react-query/queries/material'


export default function MaterialsPage() {

    const { data, isLoading, error, refetch } = useGetLowStockMaterial();

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>{error.message}</p>;

    const lowStockMaterials = data?.data || []

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-headline">Low Stock Inventory</CardTitle>
                    <Button size="sm" onClick={()=>{}}>
                        <PlusCircle />
                        Download Report
                    </Button>
                </CardHeader>
                <CardContent>
                    <MaterialsTable
                        data={lowStockMaterials}
                        onEdit={()=>{}}
                        onDelete={()=>{}}
                        isLowStock={true}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
