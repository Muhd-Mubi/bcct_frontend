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
  FileText,
  Settings,
  ClipboardList,
  PackagePlus,
  Warehouse,
  Ruler,
  Briefcase,
  FileCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useContext } from 'react';
import { UserRoleContext } from '@/lib/types';

export function MainNav() {
  const pathname = usePathname();
  const { role } = useContext(UserRoleContext);

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['chairman', 'admin', 'technician'] },
    { href: '/jobs', label: 'Jobs', icon: Briefcase, roles: ['admin', 'chairman'] },
    { href: '/work-order', label: 'Work Orders', icon: FileCheck, roles: ['admin', 'technician', 'chairman'] },
    { href: '/materials', label: 'Materials', icon: Package, roles: ['admin', 'chairman'] },
    { href: '/onboarding', label: 'Onboarding', icon: PackagePlus, roles: ['admin', 'technician'] },
    { href: '/warehouse-status', label: 'Inventory', icon: Warehouse, roles: ['admin', 'chairman', 'technician'] },
    { href: '/reports', label: 'Reports', icon: FileText, roles: ['admin', 'chairman'] },
    { href: '/measurement', label: 'Measurement', icon: Ruler, roles: ['admin'] },
    { href: '/settings', label: 'Settings', icon: Settings, roles: ['admin', 'chairman'] },
  ];
  
  const accessibleNavItems = navItems.filter(item => item.roles.includes(role));

  return (
    <nav className="p-2">
      <SidebarMenu>
        {accessibleNavItems.map((item) => (
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
