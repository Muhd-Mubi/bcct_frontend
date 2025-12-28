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
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface OnloadingTableProps {
  data: PaperOnloading[];
  onRevertClick: (id: string) => void;
}

export function OnloadingTable({ data, onRevertClick }: OnloadingTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Paper Type</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead className="text-right">Unit Quantity</TableHead>
            <TableHead className="text-right">Extra Sheets</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.id} className={item.isReverted ? 'bg-muted/50 text-muted-foreground' : ''}>
              <TableCell className="font-medium">
                {format(parseISO(item.date), 'PPP')}
              </TableCell>
              <TableCell>{item.paperType}</TableCell>
              <TableCell>{item.supplier}</TableCell>
              <TableCell className="text-right">{item.unitQuantity.toLocaleString()}</TableCell>
              <TableCell className="text-right">{item.extraSheets.toLocaleString()}</TableCell>
              <TableCell>
                {item.isReverted && <Badge variant="destructive">Reverted</Badge>}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onRevertClick(item.id)}
                  disabled={item.isReverted}
                >
                  Revert
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
