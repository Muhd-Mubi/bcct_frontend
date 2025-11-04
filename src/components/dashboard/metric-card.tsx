import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  variant?: 'default' | 'destructive';
}

export function MetricCard({
  title,
  value,
  icon,
  variant = 'default',
}: MetricCardProps) {
  return (
    <Card
      className={cn(
        variant === 'destructive' && 'bg-destructive/10 border-destructive'
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            'text-2xl font-bold font-headline',
            variant === 'destructive' && 'text-destructive'
          )}
        >
          {value}
        </div>
      </CardContent>
    </Card>
  );
}
