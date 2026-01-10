'use client';

import React, { useState, useContext, useEffect } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
} from '@/components/ui/sidebar';
import { MainNav } from '@/components/main-nav';
import { AppHeader } from '@/components/app-header';
import { Package2 } from 'lucide-react';
import { UserRoleContext, UserRole } from '@/lib/types';
import { DataProvider } from '@/context/data-context';
import { useAuth } from '@/context/AuthContext';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isSuperadmin, isAdmin, isUser  } = useAuth();
  
  // Default to a non-privileged role if user is not available
  const userRole = 'technical'; 
  // const isAdmin = true;

  return (
    <DataProvider>
      <UserRoleContext.Provider
        value={{
          role: userRole,
          isAdmin: isAdmin,
          isLeadership: userRole === 'leadership',
          isTechnical: userRole === 'technical',
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
          <div className="flex-1">
            <AppHeader />
            <main className="p-4 sm:p-6 lg:p-8">{children}</main>
          </div>
        </SidebarProvider>
      </UserRoleContext.Provider>
    </DataProvider>
  );
}
