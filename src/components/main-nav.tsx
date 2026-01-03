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
  BookCopy,
  FileSearch,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useContext } from 'react';
import { UserRoleContext } from '@/lib/types';

export function MainNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/job-orders', label: 'Job Orders', icon: Briefcase },
    { href: '/work-order', label: 'Work Orders', icon: FileCheck },
    { href: '/materials', label: 'Inventory', icon: Package },
    { href: '/onboarding', label: 'Onboarding', icon: PackagePlus },
    { href: '/stock-register', label: 'Stock Register', icon: BookCopy },
    { href: '/measurement', label: 'Measurement', icon: Ruler },
    { href: '/work-order-viewer', label: 'Work Order Viewer', icon: FileSearch },
    { href: '/settings', label: 'Settings', icon: Settings },
  ];

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
