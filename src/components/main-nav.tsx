'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Package,
  Settings,
  PackagePlus,
  BookCopy,
  FileSearch,
  Briefcase,
  FileCheck,
  Ruler
} from 'lucide-react';
import { useContext } from 'react';
import { UserRoleContext } from '@/lib/types';
import { useAuth } from '@/context/AuthContext';


export function MainNav() {
  const pathname = usePathname();
  const { role } = useAuth();

  const allNavItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['superAdmin', 'admin', 'user'] },
    { href: '/measurement', label: 'Measurement', icon: Ruler, roles: ['superAdmin', 'user'] },
    { href: '/materials', label: 'Inventory', icon: Package, roles: ['superAdmin','admin', 'user'] },
    { href: '/job-orders', label: 'Job Orders', icon: Briefcase, roles: ['superAdmin', 'admin'] },
    { href: '/work-order', label: 'Work Orders', icon: FileCheck, roles: ['superAdmin', 'admin', 'user'] },
    { href: '/onboarding', label: 'Onboarding', icon: PackagePlus, roles: ['superAdmin', 'user'] },
    { href: '/stock-register', label: 'Stock Register', icon: BookCopy, roles: ['superAdmin', 'user'] },
    // { href: '/work-order-viewer', label: 'Work Order Viewer', icon: FileSearch, roles: ['leadership', 'admin', 'technical'] },
    // { href: '/settings', label: 'Settings', icon: Settings, roles: ['leadership', 'admin', 'technical'] },
  ];

  const navItems = allNavItems.filter(item => item.roles.includes(role));

  return (
    <nav className="p-2">
      <SidebarMenu>
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname.startsWith(item.href)}
              tooltip={item.label}
            >
              <Link href={item.href}>
                <item.icon className="size-4" />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </nav>
  );
}
