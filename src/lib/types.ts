import React from 'react';

export type Material = {
  id: string;
  name: string;
  type: string;
  unitQuantity: number;
  extraSheets: number;
  currentStock: number;
  maxStock: number;
  reorderThreshold: number;
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
  status: 'Pending' | 'Completed' | 'Discarded';
  createdAt: string;
  completedAt?: string;
  materialsUsed?: { materialId: string; sheetsUsed: number }[];
  sheetsUsed?: number; // legacy
  rimsUsed?: number; // legacy
};

export type PaperOnloading = {
  id: string;
  date: string;
  unitQuantity: number;
  extraSheets: number;
  supplier: string;
  paperType: string;
  isReverted?: boolean;
};

export type Measurement = {
  id: string;
  type: string;
  sheetsPerUnit: number;
};
