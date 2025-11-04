'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { initialMaterials } from '@/lib/data';

// Generate more detailed mock data
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
const trendData = months.map(month => {
    const monthData: { [key: string]: string | number } = { month };
    initialMaterials.forEach(material => {
        // Simulate some trend data
        const randomFactor = (Math.random() - 0.2) * 0.3;
        const trendValue = material.currentStock * (1 + (months.indexOf(month) * 0.05) + randomFactor);
        monthData[material.name] = Math.max(0, Math.round(trendValue));
    });
    return monthData;
});

const chartColors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
    'hsl(220, 70%, 50%)',
    'hsl(100, 60%, 45%)',
    'hsl(340, 80%, 55%)',
    'hsl(40, 75%, 60%)',
    'hsl(180, 75%, 55%)',
];

const chartConfig = initialMaterials.reduce((config, material, index) => {
    config[material.name] = {
        label: material.name,
        color: chartColors[index % chartColors.length],
    };
    return config;
}, {} as any);


export function TrendCharts() {
  return (
    <div className="h-[450px] w-full">
      <ChartContainer config={chartConfig} className="w-full h-full">
        <ResponsiveContainer>
            <LineChart data={trendData}>
            <CartesianGrid vertical={false} />
            <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value: number) => value.toLocaleString()}
            />
            <Tooltip content={<ChartTooltipContent />} />
            <Legend wrapperStyle={{fontSize: '12px'}}/>
            {initialMaterials.map((material) => (
                <Line
                    key={material.id}
                    dataKey={material.name}
                    type="monotone"
                    stroke={chartConfig[material.name].color}
                    strokeWidth={2}
                    dot={false}
                />
            ))}
            </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
}
