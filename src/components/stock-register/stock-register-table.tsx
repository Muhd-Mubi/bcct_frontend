'use client';

import React, { Ref, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StockLedgerEntry } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useGetInventoryTransections } from '@/api/react-query/queries/inventoryTransections';

interface StockRegisterTableProps {
  data: StockLedgerEntry[];
  selectedMaterialId: string;
  tableRef: Ref<HTMLDivElement>
}

const typeVariant: Record<StockLedgerEntry['type'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
  WORK_ORDER: 'outline',
  ONBOARDING: 'outline',
  ONBOARDING_REVERSAL: 'destructive',
  WORK_ORDER_REVERSAL: 'default',
};

const typeLabel: Record<StockLedgerEntry['type'], string> = {
  WORK_ORDER: 'Work Order',
  ONBOARDING: 'Onboarding',
  ONBOARDING_REVERSAL: 'Onboarding Reversal',
  WORK_ORDER_REVERSAL: 'Work Order Reversal',
};


export function StockRegisterTable({ data, selectedMaterialId,tableRef }: StockRegisterTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: inventoryTransectionData,
    isLoading: isLoaingInventoryTransection,
    error: errorFetchingInventoryTransection,
    refetch } = useGetInventoryTransections({
      page: currentPage,
      body: {
        "materialId": selectedMaterialId
      }
    });

  const itemsPerPage = 10;
  // const paginatedData = data.slice(
  //   (currentPage - 1) * itemsPerPage,
  //   currentPage * itemsPerPage
  // );

  if (isLoaingInventoryTransection) return <p>Loading...</p>;
  if (errorFetchingInventoryTransection) return <p>{errorFetchingInventoryTransection.message}</p>;

  const transections = inventoryTransectionData?.transactions
  const totalPages = inventoryTransectionData?.totalPages || 0




  const renderStock = (stock: { units: number, extraSheets: number }) => (
    <>{`${stock.units} units, ${stock.extraSheets} sheets`}</>
  );

  const sheetToUnitConverter = ({ sheetsPerUnit = 1, totalSheets = 1 }) => {
    const unitQuantity = Math.floor(totalSheets / sheetsPerUnit);
    const extraSheets = totalSheets - (unitQuantity * sheetsPerUnit)
    return { unitQuantity, extraSheets };
  }

  return (
    <div className='space-y-4'>
      <div ref={tableRef} className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='text-sm'>Source ID</TableHead>
              <TableHead className='text-sm'>Type</TableHead>
              <TableHead className='text-sm'>Unit Quantity</TableHead>
              <TableHead className='text-sm'>Extra Sheets</TableHead>
              <TableHead className="text-right">Unit Price</TableHead>
              <TableHead className="text-right">Total Price</TableHead>
              <TableHead>Stock Before</TableHead>
              <TableHead>Stock After</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transections?.length > 0 ? (
              transections?.map((entry) => {
                const sheetsPerUnit = entry?.materialId?.measurementId?.sheetsPerUnit
                const totalSheetsBefore = entry?.stockBefore
                const totaolSheetsAfter = entry?.stockAfter
                const {
                  unitQuantity: unitQuantityBefore,
                  extraSheets: extraSheetsBefore } = sheetToUnitConverter({ sheetsPerUnit, totalSheets: totalSheetsBefore })
                const stockBefore = {
                  units : unitQuantityBefore,
                  extraSheets : extraSheetsBefore
                }
                const {
                  unitQuantity: unitQuantityAfter,
                  extraSheets: extraSheetsAfter } = sheetToUnitConverter({ sheetsPerUnit, totalSheets: totaolSheetsAfter })
                const stockAfter = {
                  units : unitQuantityAfter,
                  extraSheets : extraSheetsAfter
                }

                return (
                  <TableRow key={entry._id}>
                    <TableCell>
                      <div className="font-medium">{entry?.sourceId?.job || "Onboarding"}</div>
                      {/* {entry.workOrderId && <div className="text-xs text-muted-foreground">{entry.workOrderId}</div>} */}
                    </TableCell>
                    <TableCell>
                      <Badge className='flex items-center text-center' variant={typeVariant[entry.sourceType]}>{typeLabel[entry.sourceType]}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className={cn(entry.type == 'IN' ? 'text-green-600' : 'text-red-600')}>
                        {entry.type == 'IN' ? '+' : '-'}{entry.unitQuantity}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={cn(entry.type == 'IN' ? 'text-green-600' : 'text-red-600')}>
                        {entry.type == 'IN' ? '+' : '-'}{entry.extraSheets}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {entry?.pricePerUnit > 0 ? entry?.pricePerUnit : '-'}
                    </TableCell>
                    <TableCell className={cn("text-right", entry.totalPrice > 0 ? 'text-green-600' : 'text-red-600')}>
                      {entry?.pricePerUnit ? entry.pricePerUnit * entry?.unitQuantity : '-'}
                    </TableCell>
                    <TableCell>{renderStock(stockBefore)}</TableCell>
                  <TableCell className='text-[#F97316]'>{renderStock(stockAfter)}</TableCell>
                    <TableCell>{format(parseISO(entry.createdAt), 'PP')}</TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="h-24 text-center">
                  No stock history found for this material.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
