'use client';

import React, { useState } from 'react';
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

interface StockRegisterTableProps {
  data: StockLedgerEntry[];
}

const typeVariant: Record<StockLedgerEntry['type'], 'default' | 'secondary' | 'destructive' | 'outline'> = {
  WORK_ORDER: 'secondary',
  ONBOARDING: 'default',
  ONBOARDING_REVERSAL: 'destructive',
  WORK_ORDER_REVERSAL: 'outline',
};

const typeLabel: Record<StockLedgerEntry['type'], string> = {
  WORK_ORDER: 'Work Order',
  ONBOARDING: 'Onboarding',
  ONBOARDING_REVERSAL: 'Onboarding Reversal',
  WORK_ORDER_REVERSAL: 'Work Order Reversal',
};


export function StockRegisterTable({ data }: StockRegisterTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  const renderStock = (stock: { units: number, extraSheets: number }) => (
    <>{`${stock.units} units, ${stock.extraSheets} sheets`}</>
  );

  return (
    <div className='space-y-4'>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job/Work ID</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Unit Quantity</TableHead>
              <TableHead>Extra Sheets</TableHead>
              <TableHead className="text-right">Unit Price (Rs)</TableHead>
              <TableHead className="text-right">Total Price (Rs)</TableHead>
              <TableHead>Stock Before</TableHead>
              <TableHead>Stock After</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length > 0 ? (
              paginatedData.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    <div className="font-medium">{entry.jobId}</div>
                    {entry.workOrderId && <div className="text-xs text-muted-foreground">{entry.workOrderId}</div>}
                  </TableCell>
                  <TableCell>
                    <Badge variant={typeVariant[entry.type]}>{typeLabel[entry.type]}</Badge>
                  </TableCell>
                  <TableCell>
                      <span className={cn(entry.unitQuantity > 0 ? 'text-green-600' : 'text-red-600')}>
                          {entry.unitQuantity > 0 ? '+' : ''}{entry.unitQuantity}
                      </span>
                  </TableCell>
                  <TableCell>
                      <span className={cn(entry.extraSheets > 0 ? 'text-green-600' : 'text-red-600')}>
                          {entry.extraSheets > 0 ? '+' : ''}{entry.extraSheets}
                      </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {entry.unitPrice > 0 ? entry.unitPrice.toFixed(2) : 'N/A'}
                  </TableCell>
                   <TableCell className={cn("text-right", entry.totalPrice > 0 ? 'text-green-600' : 'text-red-600')}>
                    {entry.totalPrice !== 0 ? entry.totalPrice.toFixed(2) : 'N/A'}
                  </TableCell>
                  <TableCell>{renderStock(entry.stockBefore)}</TableCell>
                  <TableCell>{renderStock(entry.stockAfter)}</TableCell>
                  <TableCell>{format(parseISO(entry.date), 'PP')}</TableCell>
                </TableRow>
              ))
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
