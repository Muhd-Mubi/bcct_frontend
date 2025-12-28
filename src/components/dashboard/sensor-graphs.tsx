'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { ChartContainer, ChartTooltipContent } from '../ui/chart';

const generateInitialData = () => {
  const data = [];
  const now = new Date();
  for (let i = 10; i >= 0; i--) {
    data.push({
      time: new Date(now.getTime() - i * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      weight: Math.floor(Math.random() * (1500 - 1200 + 1)) + 1200,
      height: Math.floor(Math.random() * (90 - 70 + 1)) + 70,
    });
  }
  return data;
};

export function SensorGraphs() {
  const [data, setData] = useState(generateInitialData());

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) => {
        const newDataPoint = {
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          weight: Math.floor(Math.random() * (1500 - 1200 + 1)) + 1200,
          height: Math.floor(Math.random() * (90 - 70 + 1)) + 70,
        };
        return [...prevData.slice(1), newDataPoint];
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const chartConfig = {
    weight: { label: 'Weight (kg)', color: 'hsl(var(--primary))' },
    height: { label: 'Height (cm)', color: 'hsl(var(--accent))' },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Live Sensor Graphs</CardTitle>
        <CardDescription>Real-time feed of total weight and height.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 100', 'dataMax + 100']} />
              <Tooltip content={<ChartTooltipContent indicator="line" />} />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="var(--color-weight)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
              <Tooltip content={<ChartTooltipContent indicator="line" />} />
              <Line
                type="monotone"
                dataKey="height"
                stroke="var(--color-height)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
