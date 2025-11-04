import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { TrendCharts } from '@/components/reports/trend-charts';
import { PredictiveAnalyticsPlaceholder } from '@/components/reports/predictive-analytics-placeholder';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold font-headline">Reports & Trends</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileDown />
            Export PDF
          </Button>
          <Button variant="outline">
            <FileDown />
            Export Excel
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Monthly Stock Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <TrendCharts />
        </CardContent>
      </Card>

      <PredictiveAnalyticsPlaceholder />
    </div>
  );
}
