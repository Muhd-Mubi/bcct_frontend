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
import { Measurement } from '@/lib/types';

interface MeasurementTableProps {
  data: Measurement[];
}

export function MeasurementTable({ data }: MeasurementTableProps) {

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Sheets Per Unit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((measurement) => (
            <TableRow key={measurement.id}>
              <TableCell className="font-medium">{measurement.name}</TableCell>
              <TableCell className="text-right">{measurement.sheetsPerUnit}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
