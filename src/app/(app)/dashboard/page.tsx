'use client';

import React, { useContext } from 'react';
import { UserRoleContext } from '@/lib/types';
import LeadershipDashboard from '@/components/dashboard/leadership-dashboard';
import AdminDashboard from '@/components/dashboard/admin-dashboard';
import TechnicalDashboard from '@/components/dashboard/technical-dashboard';

export default function DashboardPage() {
  const { role } = useContext(UserRoleContext);

  const renderDashboard = () => {
    switch (role) {
      case 'leadership':
        return <LeadershipDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'technical':
        return <TechnicalDashboard />;
      default:
        return <p>Unknown role</p>;
    }
  };

  return <div className="flex flex-col gap-6">{renderDashboard()}</div>;
}
