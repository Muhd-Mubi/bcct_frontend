import React from 'react';

export type Material = {
  id: string;
  name: string;
  type: string;
  category: 'Paper' | 'Cardboard';
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

export type OrderStatus = 'Pending' | 'Completed' | 'Discarded';

export type MaterialsUsed = {
  materialId: string;
  materialName: string;
  sheetsUsed: number;
};

export type Order = {
  id: string;
  name: string;
  client: string;
  details?: string;
  status: OrderStatus;
  date: string;
  materialsUsed?: MaterialsUsed[];
};
