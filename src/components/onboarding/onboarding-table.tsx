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
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function OnboardingTable({ data, onRevertClick, currentPage, totalPages, onPageChange }: OnboardingTableProps) {
  const { isTechnical, isLeadership } = useContext(UserRoleContext);
  const canRevert = isTechnical || isLeadership;

  const calculateTotalPrice = ({ unitQuantity, pricePerUnit = 1 }: { unitQuantity: number, pricePerUnit: number }) => {
    return unitQuantity * pricePerUnit
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
            <TableRow key={item?._id} className={item?.isReversal ? 'bg-muted/50 text-muted-foreground' : ''}>
              <TableCell className="font-medium">
                {format(parseISO(item?.createdAt), 'PPP')}
              </TableCell>
              <TableCell>{item.supplier}</TableCell>
              <TableCell>
                <div className="flex flex-col gap-1 text-xs">
                  {item?.items?.map((p, index) => {
                    return (
                      <p key={index} className='text-[#9cafa9]'>
                        <span className='text-[#F97316]'>{p?.materialId?.name} </span>
                        (Units:
                        <span className='text-primary'> {p?.unitQuantity} </span>
                        , Amount:
                        <span className='text-primary'> Rs {p?.pricePerUnit?.toFixed(2)} / Unit</span>
                        )
                      </p>
                    )
                  })}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1 text-xs">
                  {item?.items?.map((p, index) => {
                    return (
                      <p key={index}>
                        <span className='text-[#F97316]'>
                          Rs {calculateTotalPrice({ unitQuantity: p?.unitQuantity, pricePerUnit: p?.pricePerUnit })}
                        </span>
                      </p>
                    )
                  })}
                </div>
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
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
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>

  );
}
