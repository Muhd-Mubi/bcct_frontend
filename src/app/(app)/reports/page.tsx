'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendCharts, trendData, initialMaterials } from '@/components/reports/trend-charts';
import { PredictiveAnalyticsPlaceholder } from '@/components/reports/predictive-analytics-placeholder';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { kuLogoBase64 } from '@/lib/logo';

export default function ReportsPage() {

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    doc.text("Monthly Stock Trends Report", 14, 16);

    const tableColumn = ["Month", ...initialMaterials.map(m => m.name)];
    const tableRows: (string | number)[][] = [];

    trendData.forEach(data => {
      const rowData = [
        data.month,
        ...initialMaterials.map(m => data[m.name] ?? 0)
      ];
      tableRows.push(rowData);
    });

    const addWatermark = (doc: jsPDF) => {
        const totalPages = (doc as any).internal.getNumberOfPages();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        
        // Watermark image properties
        const imgWidth = 100;
        const imgHeight = 100;
        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;

        for (let i = 1; i <= totalPages; i++) {
            doc.setPage(i);
            // Set watermark properties
            doc.setGState(new (doc as any).GState({opacity: 0.2}));
            doc.addImage(kuLogoBase64, 'PNG', x, y, imgWidth, imgHeight, undefined, 'FAST');
            // Reset properties
            doc.setGState(new (doc as any).GState({opacity: 1}));
        }
    };

    (doc as any).autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        didDrawPage: function (data: any) {
           addWatermark(doc);
           // Redraw header on each page
           doc.setFontSize(12);
           doc.text("Monthly Stock Trends Report", 14, 16);
        }
    });

    // Ensure watermark is on the first page too if autoTable doesn't trigger didDrawPage for it.
    if ((doc as any).internal.getNumberOfPages() === 1) {
        addWatermark(doc);
    }


    doc.save("monthly_stock_trends.pdf");
  };

  const handleExportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(trendData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Stock Trends");
    XLSX.writeFile(workbook, "monthly_stock_trends.xlsx");
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline">Reports & Trends</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF}>
            <FileDown />
            Export PDF
          </Button>
          <Button variant="outline" onClick={handleExportExcel}>
            <FileDown />
            Export Excel
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Monthly Stock Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <TrendCharts />
        </CardContent>
      </Card>

      <PredictiveAnalyticsPlaceholder />
    </div>
  );
}
