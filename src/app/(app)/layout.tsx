'use client';

import React, { useState, useContext, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
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
import { UserRoleContext } from '@/lib/types';
import { UserRole } from '@/lib/types';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [isAdmin, setIsAdmin] = useState(userRole === 'admin');
  const [isManager, setIsManager] = useState(userRole === 'manager');
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);


  const handleSetRole = (role: UserRole) => {
    setUserRole(role);
    setIsAdmin(role === 'admin');
    setIsManager(role === 'manager');
  };
  
  if (!user) {
    return null; // or a loading spinner
  }

  return (
    <UserRoleContext.Provider
      value={{
        role: userRole,
        setRole: handleSetRole,
        isAdmin,
        isManager,
      }}
    >
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2 p-2">
              <SidebarTrigger className="size-8" />
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
  );
}
