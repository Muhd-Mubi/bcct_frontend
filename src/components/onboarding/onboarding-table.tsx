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
import { PaperOnboarding } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface OnboardingTableProps {
  data: PaperOnboarding[];
  onRevertClick: (id: string) => void;
}

export function OnboardingTable({ data, onRevertClick }: OnboardingTableProps) {
  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Papers</TableHead>
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
              <TableCell>{item.supplier}</TableCell>
              <TableCell>
                 <div className="flex flex-col gap-1 text-xs">
                    {item.papers.map((p, index) => (
                      <span key={index}>{p.paperType} (Units: {p.unitQuantity}, Amount: Rs {p.amount.toFixed(2)})</span>
                    ))}
                  </div>
              </TableCell>
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
