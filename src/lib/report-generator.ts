import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { StockLedgerEntry, Material } from './types';
import { kuLogoBase64 } from './logo';

interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

const typeLabel: Record<StockLedgerEntry['type'], string> = {
  WORK_ORDER: 'Work Order',
  ONBOARDING: 'Onboarding',
  ONBOARDING_REVERSAL: 'Onboarding Reversal',
  WORK_ORDER_REVERSAL: 'Work Order Reversal',
};

export const generateStockLedgerPDF = (material: Material, ledgerData: StockLedgerEntry[]) => {
  const doc = new jsPDF() as jsPDFWithAutoTable;
  
  // Add Header
  if (kuLogoBase64) {
    try {
        doc.addImage(kuLogoBase64, 'PNG', 15, 10, 40, 15);
    } catch (e) {
        console.error("Failed to add logo to PDF:", e);
    }
  }
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('Stock Ledger Report', 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Material: ${material.name}`, 15, 40);
  doc.text(`Report Generated: ${format(new Date(), 'PPp')}`, 200, 40, { align: 'right' });

  // Prepare table data
  const tableData = ledgerData.map(entry => [
    entry.jobId + (entry.workOrderId ? `\n(${entry.workOrderId})` : ''),
    typeLabel[entry.type],
    `${entry.unitQuantity}`,
    `${entry.extraSheets}`,
    entry.unitPrice > 0 ? entry.unitPrice.toFixed(2) : 'N/A',
    entry.totalPrice !== 0 ? entry.totalPrice.toFixed(2) : 'N/A',
    `${entry.stockBefore.units}u, ${entry.stockBefore.extraSheets}s`,
    `${entry.stockAfter.units}u, ${entry.stockAfter.extraSheets}s`,
    format(new Date(entry.date), 'PP'),
  ]);

  // Create table
  doc.autoTable({
    startY: 50,
    head: [['Job/Work ID', 'Type', 'Unit Qty', 'Extra Sheets', 'Unit Price (Rs)', 'Total Price (Rs)', 'Stock Before', 'Stock After', 'Date']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 30 },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right' },
      5: { halign: 'right' },
    }
  });

  // Save the PDF
  doc.save(`Stock_Ledger_${material.name.replace(/ /g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
};
