'use client';

import React, { useState } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { MainNav } from '@/components/main-nav';
import { AppHeader } from '@/components/app-header';
import { Package2 } from 'lucide-react';
import { UserRole, UserRoleContext } from '@/lib/types';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>('admin');

  return (
    <UserRoleContext.Provider value={{ role: userRole, setRole: setUserRole }}>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
              <SidebarTrigger className="size-8" />
              <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
                <Package2 className="size-6 text-primary" />
                <h1 className="text-lg font-bold font-headline">StockSight</h1>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <MainNav />
          </SidebarContent>
        </Sidebar>
        <SidebarInset>
          <AppHeader />
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </UserRoleContext.Provider>
  );
}
