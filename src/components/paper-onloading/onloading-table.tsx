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
import { PaperOnloading } from '@/lib/types';
import { format, parseISO } from 'date-fns';

interface OnloadingTableProps {
  data: PaperOnloading[];
}

export function OnloadingTable({ data }: OnloadingTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Paper Type</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead className="text-right">Unit Quantity</TableHead>
            <TableHead className="text-right">Extra Sheets</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">
                {format(parseISO(item.date), 'PPP')}
              </TableCell>
              <TableCell>{item.paperType}</TableCell>
              <TableCell>{item.supplier}</TableCell>
              <TableCell className="text-right">{item.unitQuantity.toLocaleString()}</TableCell>
              <TableCell className="text-right">{item.extraSheets.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
