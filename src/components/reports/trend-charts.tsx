'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';

const data = [
  { month: 'Jan', Paper: 4000, Cardboard: 2400 },
  { month: 'Feb', Paper: 3000, Cardboard: 1398 },
  { month: 'Mar', Paper: 2000, Cardboard: 9800 },
  { month: 'Apr', Paper: 2780, Cardboard: 3908 },
  { month: 'May', Paper: 1890, Cardboard: 4800 },
  { month: 'Jun', Paper: 2390, Cardboard: 3800 },
  { month: 'Jul', Paper: 3490, Cardboard: 4300 },
];

const chartConfig = {
  Paper: { label: "Paper", color: "hsl(var(--chart-1))" },
  Cardboard: { label: "Cardboard", color: "hsl(var(--chart-2))" },
};

export function TrendCharts() {
  return (
    <div className="h-[350px] w-full">
      <ChartContainer config={chartConfig} className="w-full h-full">
        <ResponsiveContainer>
            <LineChart data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend />
            <Line
                dataKey="Paper"
                type="monotone"
                stroke={chartConfig.Paper.color}
                strokeWidth={2}
                dot={false}
            />
            <Line
                dataKey="Cardboard"
                type="monotone"
                stroke={chartConfig.Cardboard.color}
                strokeWidth={2}
                dot={false}
            />
            </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
