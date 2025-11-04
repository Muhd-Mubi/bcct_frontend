import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>System Settings</CardTitle>
          <CardDescription>
            This is a placeholder for future settings. Options for managing user roles, sensor calibrations, and notification preferences will be available here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">Settings Panel Coming Soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
