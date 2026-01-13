'use client';

import React, { useState, useMemo, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useData } from '@/context/data-context';
import { StockLedgerEntry, Material } from '@/lib/types';
import { StockRegisterTable } from '@/components/stock-register/stock-register-table';
import { generateStockLedgerPDF } from '@/lib/report-generator';
import { useGeMaterials } from '@/api/react-query/queries/material';
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

export default function StockRegisterPage() {
    const { materials, onloadings, workOrders, measurements } = useData();
    const [selectedMaterialId, setSelectedMaterialId] = useState<string | null>(null);

    const { data: materialData, isLoading: isLoadingMaterial, error: errorFetchingMateiral } = useGeMaterials();

    const stockLedger = useMemo(() => {
        if (!selectedMaterialId) return [];

        const material = materials.find(m => m._id === selectedMaterialId);
        if (!material) return [];

        const measurement = measurements.find(m => m.name === material.type);
        const sheetsPerUnit = measurement?.sheetsPerUnit || 1;

        const formatStock = (totalSheets: number) => {
            if (sheetsPerUnit === 1) return { units: totalSheets, extraSheets: 0 };
            const units = Math.floor(totalSheets / sheetsPerUnit);
            const extraSheets = totalSheets % sheetsPerUnit;
            return { units, extraSheets };
        };

        const allEntries: Omit<StockLedgerEntry, 'stockBefore' | 'stockAfter'>[] = [];

        // Process Onboardings
        onloadings.forEach(onloading => {
            onloading.papers.forEach(paper => {
                if (paper.paperType === material.name) {
                    const sheetChange = paper.unitQuantity * sheetsPerUnit;
                    const unitPrice = paper.unitQuantity > 0 ? paper.amount / paper.unitQuantity : 0;

                    if (onloading.isReverted) {
                        allEntries.push({
                            id: `${onloading.id}-${paper.paperType}`,
                            jobId: onloading.supplier,
                            type: 'ONBOARDING_REVERSAL',
                            unitQuantity: -paper.unitQuantity,
                            extraSheets: 0,
                            changeInSheets: -sheetChange,
                            date: onloading.date,
                            unitPrice: unitPrice,
                            totalPrice: -paper.amount,
                        });
                    } else {
                        allEntries.push({
                            id: `${onloading.id}-${paper.paperType}`,
                            jobId: onloading.supplier,
                            type: 'ONBOARDING',
                            unitQuantity: paper.unitQuantity,
                            extraSheets: 0,
                            changeInSheets: sheetChange,
                            date: onloading.date,
                            unitPrice: unitPrice,
                            totalPrice: paper.amount,
                        });
                    }
                }
            });
        });

        // Process Work Orders
        workOrders.forEach(wo => {
            if (wo.materialsUsed && wo.materialsUsed.length > 0) {
                wo.materialsUsed.forEach(mu => {
                    if (mu.materialId === selectedMaterialId) {
                        if (wo.status === 'Completed') {
                            allEntries.push({
                                id: `${wo.id}-${mu.materialId}`,
                                jobId: wo.jobId,
                                workOrderId: wo.id,
                                type: 'WORK_ORDER',
                                unitQuantity: Math.floor(-mu.quantity / sheetsPerUnit),
                                extraSheets: -mu.quantity % sheetsPerUnit,
                                changeInSheets: -mu.quantity,
                                date: wo.date,
                                unitPrice: 0,
                                totalPrice: 0,
                            });
                        }
                    }
                });
            }
        });

        // Sort entries by date descending
        allEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        // Calculate running stock
        let runningStockSheets = material.currentStock;
        const ledgerWithStock: StockLedgerEntry[] = [];

        allEntries.forEach(entry => {
            const stockAfterSheets = runningStockSheets;
            const stockBeforeSheets = runningStockSheets - entry.changeInSheets;

            ledgerWithStock.push({
                ...entry,
                stockBefore: formatStock(stockBeforeSheets),
                stockAfter: formatStock(stockAfterSheets),
            });

            runningStockSheets = stockBeforeSheets;
        });

        return ledgerWithStock;

    }, [selectedMaterialId, materials, onloadings, workOrders, measurements]);

    const handleDownload = () => {
        if (!selectedMaterialId) return;
        const material = materials.find(m => m._id === selectedMaterialId);
        if (material) {
            generateStockLedgerPDF(material, stockLedger);
        }
    };

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


    const tableRef = useRef<HTMLDivElement>(null)

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-headline">Stock Register</h1>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Material Stock Ledger</CardTitle>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-4">
                        <Select onValueChange={setSelectedMaterialId}>
                            <SelectTrigger className="w-full md:w-[320px]">
                                <SelectValue placeholder="Select a material to view its stock register" />
                            </SelectTrigger>
                            <SelectContent>
                                {isLoadingMaterial && <p>Loading Materials</p>}
                                {errorFetchingMateiral && <p> Error Loading materials</p>}
                                {materialData?.materials && materialData?.materials?.map(material => (
                                    <SelectItem key={material._id} value={material._id}>
                                        {material.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button onClick={downloadPdf} disabled={!selectedMaterialId}>
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {selectedMaterialId ? (
                        <StockRegisterTable data={stockLedger} selectedMaterialId={selectedMaterialId} tableRef={tableRef} />
                    ) : (
                        <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
                            <p className="text-muted-foreground">Please select a material to see its register.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div >
    );
}
