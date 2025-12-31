'use client';
import React from 'react';

export type APIMaterial = {
  _id: string;
  name: string;
  measurementId: {
    _id:string;
    name: string;
    sheetsPerUnit: number;
  } | null; // Can be null
  unitQuantity?: number;
  extraSheets?: number;
  totalSheets: number;
  lastUpdated?: string;
  __v?: number;
}

export type Material = {
  _id: string;
  name: string;
  type: string; // Will be 'N/A' if measurementId is null
  unitQuantity: number;
  extraSheets: number;
  currentStock: number;
  maxStock: number;
  reorderThreshold: number;
  lastUpdated: string;
};

export type QualityStatus = 'Good' | 'Low' | 'Very Low';
export type LiveStatus = 'Normal' | 'Near Low' | 'Low';

export type UserRole = 'chairman' | 'admin' | 'technician';

type UserRoleContextType = {
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAdmin: boolean;
  isChairman: boolean;
};

export const UserRoleContext = React.createContext<UserRoleContextType>({
  role: 'admin',
  setRole: () => {},
  isAdmin: true,
  isChairman: false,
});

export type PaperOnboarding = {
  id: string;
  date: string;
  supplier: string;
  papers: {
    paperType: string;
    unitQuantity: number;
    extraSheets: number;
  }[],
  isReverted?: boolean;
};

export type Measurement = {
  _id: string;
  name: string;
  sheetsPerUnit: number;
};

export type WorkOrderStatus = 'Pending' | 'Completed';
export type WorkOrderPriority = 'High' | 'Medium' | 'Low';

export type MaterialsUsed = {
  materialId: string;
  materialName: string;
  quantity: number;
};

export type JobItem = {
  name: string;
  quantity: number;
};

export type Job = {
  id: string;
  department: string;
  date: string;
  items: JobItem[];
}

export type WorkOrder = {
  id: string;
  jobId: string;
  items: JobItem[];
  description?: string;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  date: string;
  materialsUsed?: MaterialsUsed[];
};
