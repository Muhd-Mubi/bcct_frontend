'use client';

import React, { useState, useContext, useEffect } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarInset,
} from '@/components/ui/sidebar';
import { MainNav } from '@/components/main-nav';
import { AppHeader } from '@/components/app-header';
import { Package2 } from 'lucide-react';
import { UserRoleContext } from '@/lib/types';
import { UserRole } from '@/lib/types';
import { DataProvider } from '@/context/data-context';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const isAdmin = userRole === 'admin';
  
  const handleSetRole = (role: UserRole) => {
    setUserRole(role);
  };

  return (
    <DataProvider>
      <UserRoleContext.Provider
        value={{
          role: userRole,
          setRole: handleSetRole,
          isAdmin,
        }}
      >
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader>
              <div className="flex items-center gap-2 p-2">
                <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
                  <Package2 className="size-6 text-primary" />
                  <h1 className="text-md font-bold font-headline whitespace-nowrap">
                    BCCT INVENTORY
                  </h1>
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
    </DataProvider>
  );
}
