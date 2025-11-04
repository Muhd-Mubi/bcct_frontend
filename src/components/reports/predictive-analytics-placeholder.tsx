import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BrainCircuit } from 'lucide-react';

export function PredictiveAnalyticsPlaceholder() {
  return (
    <Card className="border-dashed">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
            <BrainCircuit className="size-8 text-muted-foreground" />
        </div>
        <CardTitle className="font-headline">Predictive Analytics Panel</CardTitle>
        <CardDescription>
          Coming soon: AI-driven demand forecasting and stockout predictions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-40 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            This space is reserved for advanced machine learning insights.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
