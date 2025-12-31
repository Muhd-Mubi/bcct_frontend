'use client';

import React from 'react';
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
import { format } from 'date-fns';

interface StockReportTableProps {
  data: StockLedgerEntry[];
}

export function StockReportTable({ data }: StockReportTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Job Order/Supplier</TableHead>
            <TableHead className="text-right">Unit Change</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Updated Stock</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((entry, index) => (
              <TableRow
                key={index}
                className={cn(
                  entry.source === 'Onboarding' && 'bg-green-500/10 hover:bg-green-500/20'
                )}
              >
                <TableCell>{format(new Date(entry.date), 'PP')}</TableCell>
                <TableCell>{entry.source}</TableCell>
                <TableCell>{entry.jobId}</TableCell>
                <TableCell className="text-right">{entry.unitQuantity}</TableCell>
                <TableCell className="text-right">{entry.amount ? `$${entry.amount.toFixed(2)}` : 'N/A'}</TableCell>
                <TableCell className="text-right font-medium">{entry.updatedStock.toLocaleString()}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No stock history found for this material.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
