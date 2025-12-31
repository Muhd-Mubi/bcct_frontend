'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserNav } from '@/components/user-nav';
import { Badge } from '@/components/ui/badge';

const getPageTitle = (pathname: string) => {
  if (pathname.startsWith('/job-orders')) return 'Job Orders';
  if (pathname.startsWith('/work-order')) return 'Work Orders';
  if (pathname.startsWith('/materials')) return 'Inventory';
  if (pathname.startsWith('/onboarding')) return 'Onboarding';
  if (pathname.startsWith('/reports')) return 'Reports';
  if (pathname.startsWith('/settings')) return 'Settings';
  if (pathname.startsWith('/measurement')) return 'Measurement';
  return 'Dashboard';
};

export function AppHeader() {
  const [isClient, setIsClient] = useState(false);
  const [pageTitle, setPageTitle] = useState('Dashboard');
  const [currentTime, setCurrentTime] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    setIsClient(true);
    setPageTitle(getPageTitle(pathname));

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(timer);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <SidebarTrigger className="sm:hidden" />
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold font-headline sm:block">
          {isClient ? pageTitle : ''}
        </h1>
      </div>
      <div className="flex items-center gap-4 ml-auto">
        <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
          {isClient ? currentTime : ''}
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
        <UserNav />
      </div>
    </header>
  );
}
