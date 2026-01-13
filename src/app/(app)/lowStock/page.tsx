'use client';

import React, { useRef } from 'react';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MaterialsTable } from '@/components/materials/materials-table';
import { useGetLowStockMaterial } from '@/api/react-query/queries/material'
import jsPDF from "jspdf"
import html2canvas from "html2canvas"


export default function MaterialsPage() {

    const { data, isLoading, error, refetch } = useGetLowStockMaterial();
    const tableRef = useRef<HTMLDivElement>(null)


    if (isLoading) return <p>Loading...</p>;
    if (error) return <p>{error.message}</p>;

    const downloadPdf = async () => {
        if (!tableRef.current) return

        const canvas = await html2canvas(tableRef.current, {
            scale: 2,
            useCORS: true
        })

        const imgData = canvas.toDataURL("image/png")

        const pdf = new jsPDF("l", "mm", "a4")
        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width

        pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight)
        pdf.save("stock-register.pdf")
    }


    const lowStockMaterials = data?.data || []

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="font-headline">Low Stock Inventory</CardTitle>
                    <Button size="sm" onClick={downloadPdf}>
                        <PlusCircle />
                        Download Report
                    </Button>
                </CardHeader>
                <CardContent>
                    <MaterialsTable
                        data={lowStockMaterials}
                        onEdit={() => { }}
                        onDelete={() => { }}
                        isLowStock={true}
                        tableRef={tableRef}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
