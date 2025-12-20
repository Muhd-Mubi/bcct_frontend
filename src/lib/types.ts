import React from 'react';

export type Material = {
  id: string;
  name: string;
  type: 'Paper' | 'Cardboard';
  supplier: string;
  currentStock: number;
  maxStock: number;
  unitWeight: number; // in kg
  unitHeight: number; // in cm
  reorderThreshold: number; // percentage
  lastUpdated: string;
};

export type QualityStatus = 'Good' | 'Low' | 'Very Low';
export type LiveStatus = 'Normal' | 'Near Low' | 'Low';

export type UserRole = 'staff' | 'manager' | 'admin' | 'technician';

type UserRoleContextType = {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAdmin: boolean;
  isManager: boolean;
};

export const UserRoleContext = React.createContext<UserRoleContextType>({
  role: 'staff',
  setRole: () => {},
  isAdmin: false,
  isManager: false,
});

export type Order = {
  id: string;
  name: string;
  details: string;
  clientName: string;
  status: 'Pending' | 'Completed';
  createdAt: string;
  completedAt?: string;
  sheetsUsed?: number;
  rimsUsed?: number;
};

export type PaperOnloading = {
  id: string;
  date: string;
  quantityRims: number;
  quantitySheets: number;
  supplier: string;
  paperType: string;
};
