'use client';

import React, { useContext } from 'react';
import { UserRoleContext } from '@/lib/types';
import LeadershipDashboard from '@/components/dashboard/leadership-dashboard';
import AdminDashboard from '@/components/dashboard/admin-dashboard';
import TechnicalDashboard from '@/components/dashboard/technical-dashboard';
import { useAuth } from '@/context/AuthContext';

export default function DashboardPage() {
  // const { role } = useContext(UserRoleContext);
  const { role} = useAuth();

  const renderDashboard = () => {
    switch (role) {
      case 'superAdmin':
        return <LeadershipDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'user':
        return <TechnicalDashboard />;
      default:
        return <p>Unknown role</p>;
    }
  };

  return <div className="flex flex-col gap-6">{renderDashboard()}</div>;
}
