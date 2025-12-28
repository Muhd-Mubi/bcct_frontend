'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendCharts } from '@/components/reports/trend-charts';
import { PredictiveAnalyticsPlaceholder } from '@/components/reports/predictive-analytics-placeholder';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { useData } from '@/context/data-context';
import { trendData } from '@/lib/reports-data';

export default function ReportsPage() {
  const { materials } = useData();

  const handleExportPDF = () => {
    const doc = new jsPDF();
    
    doc.text("Monthly Stock Trends Report", 14, 16);

    const tableColumn = ["Month", ...materials.map(m => m.name)];
    const tableRows: (string | number)[][] = [];

    trendData.forEach(data => {
      const rowData = [
        data.month,
        ...materials.map(m => data[m.name] ?? 0)
      ];
      tableRows.push(rowData);
    });
    
    (doc as any).autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
    });

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
