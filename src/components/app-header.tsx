'use client';

import React, { useState, useEffect } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserNav } from '@/components/user-nav';
import { Badge } from '@/components/ui/badge';

export function AppHeader() {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="sm:hidden" />
      <div className="flex-1 flex items-center gap-4">
        <h1 className="text-lg font-semibold font-headline hidden sm:block">Dashboard</h1>
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground ml-auto">
          {currentTime}
        </div>
        <div className="hidden sm:flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Sensors Online
            </Badge>
        </div>
      </div>
      <UserNav />
    </header>
  );
}
