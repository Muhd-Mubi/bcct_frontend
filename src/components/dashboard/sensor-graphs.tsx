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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const generateInitialData = () => {
  const data = [];
  const now = new Date();
  for (let i = 10; i >= 0; i--) {
    data.push({
      time: new Date(now.getTime() - i * 5000).toLocaleTimeString(),
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
          time: new Date().toLocaleTimeString(),
          weight: Math.floor(Math.random() * (1500 - 1200 + 1)) + 1200,
          height: Math.floor(Math.random() * (90 - 70 + 1)) + 70,
        };
        return [...prevData.slice(1), newDataPoint];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const chartConfig = {
    weight: { label: "Weight (kg)", color: "hsl(var(--primary))" },
    height: { label: "Height (cm)", color: "hsl(var(--accent))" },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Live Sensor Graphs</CardTitle>
        <CardDescription>Real-time feed of total weight and height.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2">
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 100', 'dataMax + 100']}/>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke={chartConfig.weight.color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} domain={['dataMin - 10', 'dataMax + 10']} />
              <Tooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Line
                type="monotone"
                dataKey="height"
                stroke={chartConfig.height.color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
