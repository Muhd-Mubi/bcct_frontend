'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import {
  ChartContainer,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { trendData, chartConfig } from '@/lib/reports-data';

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
            {Object.keys(chartConfig).map((materialName) => (
                <Line
                    key={materialName}
                    dataKey={materialName}
                    type="monotone"
                    stroke={chartConfig[materialName].color}
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
