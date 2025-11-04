'use client';
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Material } from '@/lib/types';
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];

export function InventoryCompositionChart({ materials }: { materials: Material[] }) {
  const data = useMemo(() => {
    const composition: { [key: string]: number } = {};
    materials.forEach((material) => {
      if (composition[material.type]) {
        composition[material.type] += material.currentStock;
      } else {
        composition[material.type] = material.currentStock;
      }
    });
    return Object.keys(composition).map((key) => ({
      name: key,
      value: composition[key],
    }));
  }, [materials]);

  const chartConfig = {
    value: { label: "Stock" },
    ...data.reduce((acc, cur) => ({ ...acc, [cur.name]: { label: cur.name } }), {}),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Inventory Composition</CardTitle>
        <CardDescription>By material type</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                labelLine={false}
                label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                  const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                  const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                  return (
                    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12}>
                      {`${(percent * 100).toFixed(0)}%`}
                    </text>
                  );
                }}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
