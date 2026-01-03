'use client';

import React, { useContext } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { PaperOnboarding, UserRoleContext } from '@/lib/types';
import { format, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface OnboardingTableProps {
  data: PaperOnboarding[];
  onRevertClick: (id: string) => void;
}

export function OnboardingTable({ data, onRevertClick }: OnboardingTableProps) {
  const { isTechnical, isLeadership } = useContext(UserRoleContext);
  const canRevert = isTechnical || isLeadership;

  const calculateTotalPrice = (papers: PaperOnboarding['papers']) => {
    return papers.reduce((total, paper) => total + paper.amount, 0);
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Papers</TableHead>
            <TableHead>Total Price</TableHead>
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
                    {item.papers.map((p, index) => {
                      const unitPrice = p.unitQuantity > 0 ? p.amount / p.unitQuantity : 0;
                      return (
                        <span key={index}>{p.paperType} (Units: {p.unitQuantity}, Amount: Rs {unitPrice.toFixed(2)} / Unit)</span>
                      )
                    })}
                  </div>
              </TableCell>
              <TableCell>
                {item.isReverted ? (
                    <Badge variant="destructive">Reverted</Badge>
                ) : (
                    `Rs ${calculateTotalPrice(item.papers).toFixed(2)}`
                )}
              </TableCell>
              <TableCell>
                {canRevert && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onRevertClick(item.id)}
                      disabled={item.isReverted}
                    >
                      Revert
                    </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
